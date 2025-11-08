import { db } from "@/config/db";
import { openai } from "@/config/OpenAiModel";
import { SessionChatTable } from "@/config/schema";
import { eq } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { getPromptForLawyerType } from "@/config/prompts";

// Default report template to use as fallback
const DEFAULT_REPORT = {
  sessionId: "",
  meetingTitle: "Legal Consultation Session",
  participants: {
    client: "Anonymous",
    lawyer: "AI Legal Assistant"
  },
  timestamp: new Date().toISOString(),
  duration: "N/A",
  agent: "AI Legal Assistant",
  user: "Anonymous",
  legalIssue: "General legal consultation",
  summary: "The user consulted about a legal matter. Detailed information was not available.",
  keyDiscussionPoints: [],
  importantPoints: [],
  decisions: [],
  legalTopics: [],
  caseReferences: [],
  caseType: "General",
  jurisdiction: "India",
  urgency: "Medium",
  lawsDiscussed: [],
  documentsMentioned: [],
  documentsNeeded: [],
  recommendations: [],
  nextSteps: [],
  actionItems: [],
  risksIdentified: [],
  clientConcerns: [],
  adviceProvided: []
};

export async function POST(req: NextRequest) {
  const { sessionId, sessionDetail, messages } = await req.json();

  try {
    // Validate input data
    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Try to get lawyer type from sessionDetail, or fetch from database
    let lawyerType: string | null = null;
    
    if (sessionDetail?.selectedLawyer?.specialist) {
      lawyerType = sessionDetail.selectedLawyer.specialist;
    } else {
      // Fetch session from database to get selectedLawyer
      try {
        const sessionData = await db.select()
          .from(SessionChatTable)
          .where(eq(SessionChatTable.sessionId, sessionId))
          .limit(1);
        
        if (sessionData.length > 0 && sessionData[0].selectedLawyer) {
          const selectedLawyer = sessionData[0].selectedLawyer as any;
          lawyerType = selectedLawyer?.specialist || null;
        }
      } catch (dbError) {
        console.error("Error fetching session for lawyer type:", dbError);
        // Continue with null lawyerType, will use default prompt
      }
    }
    
    // Get dynamic prompt based on lawyer specialization
    const promptConfig = getPromptForLawyerType(lawyerType);
    const reportPrompt = promptConfig.reportPrompt;
    
    // Log prompt selection in development mode
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Legal Report] Using prompt for lawyer type: ${lawyerType || 'default'}`);
      console.log(`[Legal Report] Prompt config loaded:`, {
        hasAgentPrompt: !!promptConfig.agentPrompt,
        hasReportPrompt: !!promptConfig.reportPrompt,
        reportPromptLength: promptConfig.reportPrompt.length
      });
    }

    // Create a default report with the session ID
    const defaultReport = {
      ...DEFAULT_REPORT,
      sessionId: sessionId
    };

    // Even if no messages or session details, we'll still try to use the LLM
    // but prepare minimal context to work with
    const minimalMessages = !messages || !Array.isArray(messages) || messages.length === 0 ? 
      [{ role: "user", content: "I need legal advice" }] : messages;

    // Format conversation transcript for better analysis
    const conversationText = minimalMessages.map((msg: any, index: number) => {
      const role = msg.role === "assistant" ? "Lawyer" : "Client";
      const content = msg.text || msg.content || "";
      return `[Message ${index + 1}] ${role}: ${content}`;
    }).join("\n\n");

    // Count total messages for better context
    const totalMessages = minimalMessages.length;
    const clientMessages = minimalMessages.filter((msg: any) => msg.role === "user").length;
    const lawyerMessages = minimalMessages.filter((msg: any) => msg.role === "assistant").length;

    // Extract duration from sessionDetail if available
    const duration = sessionDetail?.duration || `Approximately ${Math.ceil(totalMessages * 1.5)} minutes`;
    
    // Get lawyer name for report
    const lawyerName = sessionDetail?.selectedLawyer?.specialist || "AI Legal Assistant";

    const userInput = `
=== CONSULTATION DETAILS ===
Session ID: ${sessionId}
Lawyer Type: ${lawyerName}
Duration: ${duration}
Total Messages: ${totalMessages} (Client: ${clientMessages}, Lawyer: ${lawyerMessages})

=== COMPLETE CONVERSATION TRANSCRIPT ===
${conversationText}

=== TASK ===
Analyze the ENTIRE conversation above and generate a comprehensive legal consultation report. Extract all relevant information including discussion points, decisions, advice, concerns, risks, documents, and next steps. Be thorough and detailed.
`;

    // Add more context to help the LLM generate a better report
    const enhancedPrompt = `${reportPrompt}

CRITICAL INSTRUCTIONS:
- You MUST analyze the ENTIRE conversation transcript provided
- Extract information from ALL messages, not just the first few
- The conversation may be long - read through everything before generating the report
- Be thorough and comprehensive in your analysis
- Generate a detailed, professional legal consultation report
- Focus on ${lawyerName} specialization context
- Output ONLY valid JSON with no markdown formatting
`;

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: enhancedPrompt },
        { role: "user", content: userInput }
      ],
      temperature: 0.3, // Lower temperature for more consistent, factual output
      max_tokens: 4000, // Allow longer responses for detailed reports
    });

    const rawResp = completion.choices[0].message || "";
    //@ts-ignore
    const respContent = rawResp.content?.trim() || "";
    
    // Log the raw response for debugging
    console.log("Raw LLM response:", respContent);
    
    // Remove any markdown formatting and extract JSON
    const jsonRegex = /```(?:json)?([\s\S]*?)```|([\s\S]*)/;
    const match = respContent.match(jsonRegex);
    const extractedJson = (match?.[1] || match?.[2] || "").trim();
    
    let JSONResp;
    try {
      JSONResp = JSON.parse(extractedJson);
      
      // Ensure all required fields exist by merging with default report
      // but prioritize the LLM-generated fields
      JSONResp = {
        ...defaultReport,
        ...JSONResp,
        sessionId: sessionId, // Always use the provided sessionId
        timestamp: JSONResp.timestamp || defaultReport.timestamp,
        duration: JSONResp.duration || duration || defaultReport.duration,
        participants: JSONResp.participants || defaultReport.participants,
        keyDiscussionPoints: JSONResp.keyDiscussionPoints || [],
        importantPoints: JSONResp.importantPoints || [],
        decisions: JSONResp.decisions || [],
        legalTopics: JSONResp.legalTopics || [],
        caseReferences: JSONResp.caseReferences || [],
        nextSteps: JSONResp.nextSteps || [],
        actionItems: JSONResp.actionItems || [],
        risksIdentified: JSONResp.risksIdentified || [],
        clientConcerns: JSONResp.clientConcerns || [],
        adviceProvided: JSONResp.adviceProvided || [],
        documentsMentioned: JSONResp.documentsMentioned || [],
        documentsNeeded: JSONResp.documentsNeeded || [],
        // Add a flag to indicate this was generated by the LLM
        generatedByLLM: true,
        messageCount: totalMessages
      };
    } catch (parseError) {
      console.error("Failed to parse model response:", parseError);
      console.error("Attempted to parse:", extractedJson);
      
      // Make another attempt with a more lenient approach
      try {
        // Try to extract anything that looks like JSON
        const jsonMatch = respContent.match(/{[\s\S]*}/);
        if (jsonMatch) {
          JSONResp = JSON.parse(jsonMatch[0]);
          JSONResp = {
            ...defaultReport,
            ...JSONResp,
            sessionId: sessionId,
            generatedByLLM: true,
            partialParse: true
          };
        } else {
          // Use default report if all parsing fails, but try to extract some info from raw response
          const fallbackReport = {
            ...defaultReport,
            sessionId: sessionId,
            summary: `Legal consultation completed. ${respContent.substring(0, 200)}`,
            parseError: "Failed to fully parse LLM response",
            rawResponse: respContent.substring(0, 500) // Include part of the raw response for debugging
          };
          JSONResp = fallbackReport;
        }
      } catch (secondError) {
        // Use default report if all parsing fails
        const fallbackReport = {
          ...defaultReport,
          sessionId: sessionId,
          summary: "Legal consultation completed. Full report generation encountered an error.",
          parseError: "Failed to generate report from conversation",
          rawResponse: respContent.substring(0, 500) // Include part of the raw response for debugging
        };
        JSONResp = fallbackReport;
      }
    }

    // Update the database with the report
    await db.update(SessionChatTable).set({
      report: JSONResp,
      conversation: messages,
      updatedAt: new Date()
    }).where(eq(SessionChatTable.sessionId, sessionId));

    return NextResponse.json(JSONResp);
  } catch (e) {
    console.error("Error generating legal report:", e);
    
    // Create a more informative fallback report with the error
    const fallbackReport = {
      ...DEFAULT_REPORT,
      sessionId: sessionId || "",
      error: "Failed to generate report due to server error",
      errorDetails: e instanceof Error ? e.message : String(e),
      generatedByLLM: false,
      fallbackUsed: true
    };
    
    // Try to update the database with the fallback report
    try {
      if (sessionId) {
        await db.update(SessionChatTable).set({
          report: fallbackReport,
          conversation: Array.isArray(messages) ? messages : [],
          updatedAt: new Date()
        }).where(eq(SessionChatTable.sessionId, sessionId));
      }
    } catch (dbError) {
      console.error("Failed to update database with fallback report:", dbError);
      // Don't throw here, just log the error to prevent deployment failures
    }
    
    // Return the fallback report with an error flag for the frontend to handle
    return NextResponse.json({
      ...fallbackReport,
      error: "Could not generate legal report. Please try again later."
    }, { status: 200 }); // Return 200 status to prevent deployment issues
  }
}
