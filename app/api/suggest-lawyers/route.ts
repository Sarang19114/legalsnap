import { openai } from "@/config/OpenAiModel";
import { AILawyerAgents } from "@/shared/list";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const {notes} = await req.json();

  try {
    // If notes are empty or undefined, return a fallback selection of lawyers
    if (!notes || notes.trim() === "") {
      // Return a subset of the available lawyers as fallback
      const fallbackLawyers = AILawyerAgents.slice(0, 3);
      return NextResponse.json(fallbackLawyers);
    }

    const completion = await openai.chat.completions.create({
      model: "google/gemini-2.5-flash",
      max_tokens: 2048,
      temperature: 0.3,
      messages: [
        {role:'system' , content:`You are a legal assistant helping to match client needs with appropriate lawyers. Here is the list of available lawyers: ${JSON.stringify(AILawyerAgents)}. 

CRITICAL INSTRUCTIONS:
- Respond ONLY with a valid JSON array
- Do NOT include markdown code blocks
- Do NOT include any explanations
- Each lawyer object must have ALL fields: id, specialist, description, image, agentPrompt, voiceId, subscriptionRequired
- If agentPrompt is long, you MUST properly escape all quotes and newlines
- Ensure the JSON is valid and complete`},
        { role: "user", content: `User Notes/Issue: ${notes}. Based on these notes, suggest 2-3 lawyers from the provided list that best match. Return ONLY the JSON array of lawyer objects with ALL their original fields intact.` }
      ],
    });

    const rawResp = completion.choices[0].message;
    //@ts-ignore
    let Resp = rawResp.content.trim();
    
    // Remove markdown code blocks if present
    Resp = Resp.replace(/```json\s*/g, '').replace(/```\s*/g, '');
    
    // Remove any leading/trailing whitespace
    Resp = Resp.trim();

    // Debug: log the cleaned response
    console.log('Cleaned model response:', Resp.substring(0, 200) + '...');
    
    let JSONResp;
    try {
      JSONResp = JSON.parse(Resp);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Failed to parse:', Resp.substring(0, 500));
      // Fallback to returning a subset of the available lawyers
      return NextResponse.json(AILawyerAgents.slice(0, 3));
    }

    // Validate and sanitize the response to match lawyerAgent structure
    let validLawyers = [];
    if (Array.isArray(JSONResp)) {
      validLawyers = JSONResp.slice(0, 3).map((item, idx) => {
        // Find a matching lawyer from the original list by ID or specialist name
        const matchingLawyer = AILawyerAgents.find(lawyer => 
          lawyer.id === item.id || 
          lawyer.specialist.toLowerCase() === item.specialist?.toLowerCase()
        );
        
        // Always prefer the original lawyer data to avoid truncated prompts
        if (matchingLawyer) {
          return matchingLawyer;
        }
        
        // If no match found, use the original lawyer data with same index as fallback
        return AILawyerAgents[idx] || AILawyerAgents[0];
      });
    } else {
      // Fallback to returning a subset of the available lawyers
      validLawyers = AILawyerAgents.slice(0, 3);
    }
    
    return NextResponse.json(validLawyers);
  } catch (e) {
    console.error('API error:', e);
    // Return a fallback response instead of the error
    return NextResponse.json(AILawyerAgents.slice(0, 3));
  }
}