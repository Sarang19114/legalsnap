import { NextRequest, NextResponse } from "next/server";
import jsPDF from "jspdf";

export async function POST(req: NextRequest) {
  try {
    const report = await req.json();

    if (!report || !report.sessionId) {
      return NextResponse.json({ error: "Invalid report data" }, { status: 400 });
    }

    // Create new PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    let yPosition = margin;

    // Helper function to add text with word wrapping
    const addText = (text: string, fontSize: number, isBold: boolean = false, color: [number, number, number] = [0, 0, 0]) => {
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setTextColor(color[0], color[1], color[2]);
      
      const maxWidth = pageWidth - (margin * 2);
      const lines = doc.splitTextToSize(text, maxWidth);
      
      // Check if we need a new page
      if (yPosition + (lines.length * fontSize * 0.4) > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      doc.text(lines, margin, yPosition);
      yPosition += lines.length * fontSize * 0.4 + 5;
    };

    // Title
    addText("LEGAL CONSULTATION REPORT", 18, true, [0, 51, 102]);
    yPosition += 5;

    // Meeting Title
    if (report.meetingTitle) {
      addText(report.meetingTitle, 14, true);
      yPosition += 3;
    }

    // Session ID
    addText(`Session ID: ${report.sessionId}`, 10, false, [100, 100, 100]);
    yPosition += 8;

    // Participants
    if (report.participants) {
      addText("Participants", 12, true);
      addText(`Client: ${report.participants.client || "Anonymous"}`, 10);
      addText(`Lawyer: ${report.participants.lawyer || report.agent || "AI Legal Assistant"}`, 10);
      yPosition += 5;
    }

    // Timestamp
    if (report.timestamp) {
      const date = new Date(report.timestamp);
      addText(`Date: ${date.toLocaleDateString()} ${date.toLocaleTimeString()}`, 10, false, [100, 100, 100]);
      yPosition += 5;
    }

    // Duration
    if (report.duration) {
      addText(`Duration: ${report.duration}`, 10, false, [100, 100, 100]);
      yPosition += 8;
    }

    // Legal Issue
    if (report.legalIssue) {
      addText("Legal Issue", 12, true);
      addText(report.legalIssue, 10);
      yPosition += 5;
    }

    // Summary
    if (report.summary) {
      addText("Summary", 12, true);
      addText(report.summary, 10);
      yPosition += 5;
    }

    // Key Discussion Points
    if (report.keyDiscussionPoints && report.keyDiscussionPoints.length > 0) {
      addText("Key Discussion Points", 12, true);
      report.keyDiscussionPoints.forEach((point: string) => {
        addText(`• ${point}`, 10);
      });
      yPosition += 5;
    }

    // Important Points
    if (report.importantPoints && report.importantPoints.length > 0) {
      addText("Important Points to Note", 12, true, [153, 0, 0]);
      report.importantPoints.forEach((point: string) => {
        addText(`• ${point}`, 10);
      });
      yPosition += 5;
    }

    // Client Concerns
    if (report.clientConcerns && report.clientConcerns.length > 0) {
      addText("Client Concerns", 12, true);
      report.clientConcerns.forEach((concern: string) => {
        addText(`• ${concern}`, 10);
      });
      yPosition += 5;
    }

    // Advice Provided
    if (report.adviceProvided && report.adviceProvided.length > 0) {
      addText("Legal Advice Provided", 12, true);
      report.adviceProvided.forEach((advice: string) => {
        addText(`• ${advice}`, 10);
      });
      yPosition += 5;
    }

    // Decisions
    if (report.decisions && report.decisions.length > 0) {
      addText("Decisions Made", 12, true);
      report.decisions.forEach((decision: string) => {
        addText(`• ${decision}`, 10);
      });
      yPosition += 5;
    }

    // Legal Topics
    if (report.legalTopics && report.legalTopics.length > 0) {
      addText("Legal Topics Discussed", 12, true);
      report.legalTopics.forEach((topic: string) => {
        addText(`• ${topic}`, 10);
      });
      yPosition += 5;
    }

    // Case References
    if (report.caseReferences && report.caseReferences.length > 0) {
      addText("Case References", 12, true);
      report.caseReferences.forEach((ref: string) => {
        addText(`• ${ref}`, 10);
      });
      yPosition += 5;
    }

    // Laws Discussed
    if (report.lawsDiscussed && report.lawsDiscussed.length > 0) {
      addText("Laws Discussed", 12, true);
      report.lawsDiscussed.forEach((law: string) => {
        addText(`• ${law}`, 10);
      });
      yPosition += 5;
    }

    // Documents Mentioned
    if (report.documentsMentioned && report.documentsMentioned.length > 0) {
      addText("Documents Mentioned", 12, true);
      report.documentsMentioned.forEach((doc: string) => {
        addText(`• ${doc}`, 10);
      });
      yPosition += 5;
    }

    // Documents Needed
    if (report.documentsNeeded && report.documentsNeeded.length > 0) {
      addText("Documents Required", 12, true, [153, 0, 0]);
      report.documentsNeeded.forEach((doc: string) => {
        addText(`• ${doc}`, 10);
      });
      yPosition += 5;
    }

    // Risks Identified
    if (report.risksIdentified && report.risksIdentified.length > 0) {
      addText("Legal Risks Identified", 12, true, [153, 0, 0]);
      report.risksIdentified.forEach((risk: string) => {
        addText(`• ${risk}`, 10);
      });
      yPosition += 5;
    }

    // Recommendations
    if (report.recommendations && report.recommendations.length > 0) {
      addText("Recommendations", 12, true);
      report.recommendations.forEach((rec: string) => {
        addText(`• ${rec}`, 10);
      });
      yPosition += 5;
    }

    // Next Steps
    if (report.nextSteps && report.nextSteps.length > 0) {
      addText("Next Steps", 12, true);
      report.nextSteps.forEach((step: string) => {
        addText(`• ${step}`, 10);
      });
      yPosition += 5;
    }

    // Action Items
    if (report.actionItems && report.actionItems.length > 0) {
      addText("Action Items", 12, true, [0, 102, 51]);
      report.actionItems.forEach((item: any) => {
        const taskText = item.task || "";
        const assignedTo = item.assignedTo ? ` (Assigned to: ${item.assignedTo})` : "";
        const priority = item.priority ? ` [Priority: ${item.priority}]` : "";
        const dueDate = item.dueDate ? ` (Due: ${item.dueDate})` : "";
        addText(`• ${taskText}${priority}${assignedTo}${dueDate}`, 10);
      });
      yPosition += 5;
    }

    // Case Details
    if (report.caseType || report.jurisdiction || report.urgency) {
      addText("Case Details", 12, true);
      if (report.caseType) addText(`Case Type: ${report.caseType}`, 10);
      if (report.jurisdiction) addText(`Jurisdiction: ${report.jurisdiction}`, 10);
      if (report.urgency) addText(`Urgency: ${report.urgency}`, 10);
    }

    // Footer
    // @ts-ignore - jsPDF internal API
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Page ${i} of ${totalPages} - Generated by LegalSnap`,
        pageWidth / 2,
        pageHeight - 10,
        { align: "center" }
      );
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="legal-report-${report.sessionId}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}

