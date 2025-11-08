"use client";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SessionDetails } from "./HistoryList";
import moment from "moment";
import axios from "axios";

type Props = {
  record: SessionDetails;
  autoOpen?: boolean;
};

type LegalReport = {
  sessionId: string;
  meetingTitle?: string;
  participants?: {
    client: string;
    lawyer: string;
  };
  agent: string;
  user: string;
  timestamp: string;
  duration?: string;
  legalIssue: string;
  summary: string;
  keyDiscussionPoints?: string[];
  importantPoints?: string[];
  clientConcerns?: string[];
  adviceProvided?: string[];
  decisions?: string[];
  legalTopics?: string[];
  caseReferences?: string[];
  caseType: string;
  jurisdiction: string;
  urgency: "Low" | "Medium" | "High";
  lawsDiscussed: string[];
  documentsMentioned: string[];
  documentsNeeded?: string[];
  risksIdentified?: string[];
  recommendations: string[];
  nextSteps?: string[];
  actionItems?: Array<{
    task: string;
    assignedTo?: string;
    priority?: string;
    dueDate?: string;
  }>;
  fallbackUsed?: boolean;
  generatedByLLM?: boolean;
  error?: string;
};

function ViewLegalReportDialog({ record, autoOpen = false }: Props) {
  const [open, setOpen] = useState(autoOpen);
  const [report, setReport] = useState<LegalReport | null>(
    //@ts-ignore
    record.report || null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-open dialog if autoOpen prop is true
  useEffect(() => {
    if (autoOpen) {
      setOpen(true);
    }
  }, [autoOpen]);

  const exportReport = async (format: 'json' | 'pdf' = 'json') => {
    if (!report) return;
    
    if (format === 'pdf') {
      try {
        const response = await axios.post('/api/generate-pdf', report, {
          responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `legal-report-${report.sessionId}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to generate PDF:', error);
        alert('Failed to generate PDF. Please try again.');
      }
    } else {
      const reportData = {
        sessionId: report.sessionId,
        meetingTitle: report.meetingTitle,
        participants: report.participants,
        agent: report.agent,
        user: report.user,
        timestamp: report.timestamp,
        duration: report.duration,
        legalIssue: report.legalIssue,
        summary: report.summary,
        keyDiscussionPoints: report.keyDiscussionPoints,
        decisions: report.decisions,
        legalTopics: report.legalTopics,
        caseReferences: report.caseReferences,
        caseType: report.caseType,
        jurisdiction: report.jurisdiction,
        urgency: report.urgency,
        lawsDiscussed: report.lawsDiscussed,
        documentsMentioned: report.documentsMentioned,
        recommendations: report.recommendations,
        nextSteps: report.nextSteps,
        actionItems: report.actionItems,
        exportedOn: new Date().toISOString()
      };

      const dataStr = JSON.stringify(reportData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `legal-report-${report.sessionId}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post("/api/legal-report", {
        sessionId: record.sessionId,
        sessionDetail: record,
        //@ts-ignore
        messages: record.conversation || [],
      });

      if (res.data && res.data.error) {
        // Still set the report data even if there's an error
        // This allows us to display the fallback report
        setReport(res.data);
        setError(typeof res.data.error === 'string' ? res.data.error : 'Failed to generate report');
      } else {
        setReport(res.data);
        setError(null);
      }
    } catch (err) {
      console.error("Failed to fetch report", err);
      // Create a basic fallback report when API call fails completely
      setReport({
        sessionId: record.sessionId,
        agent: "AI Legal Assistant",
        user: "Anonymous",
        timestamp: new Date().toISOString(),
        legalIssue: "General legal consultation",
        summary: "The report could not be generated at this time.",
        caseType: record.selectedLawyer?.specialist || "General",
        jurisdiction: "India",
        urgency: "Medium",
        lawsDiscussed: [],
        documentsMentioned: [],
        recommendations: ["Please try again later or contact support."],
        fallbackUsed: true
      });
      setError("Failed to generate the legal report. Please try again later.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open && !report) {
      fetchReport();
    }
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm">
          View Legal Report
        </Button>
      </DialogTrigger>
      <DialogContent className="!w-[85vw] !max-w-[85vw] md:px-10 px-4 py-8 bg-white shadow-2xl rounded-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle asChild>
            <div className="flex justify-between items-center">
              <h2 className="text-center text-2xl font-bold text-indigo-700">
                AI Lawyer Report
              </h2>
              {report && (
                <div className="flex gap-2">
                  <Button 
                    onClick={() => exportReport('pdf')}
                    variant="outline"
                    size="sm"
                  >
                    Download PDF
                  </Button>
                  <Button 
                    onClick={() => exportReport('json')}
                    variant="outline"
                    size="sm"
                  >
                    Download JSON
                  </Button>
                </div>
              )}
            </div>
          </DialogTitle>
          <DialogDescription asChild>
            {loading ? (
              <p className="text-center mt-10 text-gray-500">
                Generating report...
              </p>
            ) : !report ? (
              <p className="text-center text-red-500 mt-10">
                No report available
              </p>
            ) : (
              <div>
                {error && (
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
                    <p className="text-yellow-700">
                      <strong>Note:</strong> {error}
                    </p>
                    <p className="text-yellow-700 text-sm">
                      Showing available information below.
                    </p>
                  </div>
                )}
                {report.fallbackUsed && !error && (
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                    <p className="text-blue-700">
                      <strong>Note:</strong> This is a general report as we couldn't generate a specific one based on your conversation.
                    </p>
                  </div>
                )}
              <div className="max-h-[75vh] overflow-y-auto space-y-6 text-gray-800 text-sm px-2">
                {/* Session Info */}
                <section className="border-b pb-3">
                  <h3 className="text-lg font-semibold text-indigo-600 mb-1">
                    Session Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <span className="font-bold">Lawyer:</span>{" "}
                      {record.selectedLawyer?.specialist || "General Lawyer"}
                    </div>
                    <div>
                      <span className="font-bold">Client:</span>{" "}
                      {report.user || "Anonymous"}
                    </div>
                    <div>
                      <span className="font-bold">Consulted On:</span>{" "}
                      {moment(new Date(record.createdAt)).format(
                        "MMMM Do YYYY, h:mm A"
                      )}
                    </div>
                    <div>
                      <span className="font-bold">Agent:</span> {report.agent || "N/A"}
                    </div>
                  </div>
                </section>

                {/* Legal Issue */}
                <section>
                  <h3 className="text-indigo-600 font-semibold">Legal Issue</h3>
                  <p className="italic">{report.legalIssue || "Not specified"}</p>
                </section>

                {/* Summary */}
                <section>
                  <h3 className="text-indigo-600 font-semibold">
                    Case Summary
                  </h3>
                  <p>{report.summary || "No summary available"}</p>
                </section>

                {/* Key Discussion Points */}
                {report.keyDiscussionPoints && report.keyDiscussionPoints.length > 0 && (
                  <section>
                    <h3 className="text-indigo-600 font-semibold">
                      Key Discussion Points
                    </h3>
                    <ul className="list-disc list-inside">
                      {report.keyDiscussionPoints.map((point, i) => (
                        <li key={i}>{point}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Important Points */}
                {report.importantPoints && report.importantPoints.length > 0 && (
                  <section className="bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
                    <h3 className="text-red-700 font-semibold">
                      ⚠️ Important Points to Note
                    </h3>
                    <ul className="list-disc list-inside">
                      {report.importantPoints.map((point, i) => (
                        <li key={i} className="text-red-900">{point}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Client Concerns */}
                {report.clientConcerns && report.clientConcerns.length > 0 && (
                  <section>
                    <h3 className="text-indigo-600 font-semibold">
                      Client Concerns Raised
                    </h3>
                    <ul className="list-disc list-inside">
                      {report.clientConcerns.map((concern, i) => (
                        <li key={i}>{concern}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Advice Provided */}
                {report.adviceProvided && report.adviceProvided.length > 0 && (
                  <section>
                    <h3 className="text-indigo-600 font-semibold">
                      Legal Advice Provided
                    </h3>
                    <ul className="list-disc list-inside">
                      {report.adviceProvided.map((advice, i) => (
                        <li key={i}>{advice}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Decisions */}
                {report.decisions && report.decisions.length > 0 && (
                  <section>
                    <h3 className="text-indigo-600 font-semibold">
                      Decisions Made
                    </h3>
                    <ul className="list-disc list-inside">
                      {report.decisions.map((decision, i) => (
                        <li key={i}>{decision}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Legal Topics */}
                {report.legalTopics && report.legalTopics.length > 0 && (
                  <section>
                    <h3 className="text-indigo-600 font-semibold">
                      Legal Topics Discussed
                    </h3>
                    <ul className="list-disc list-inside">
                      {report.legalTopics.map((topic, i) => (
                        <li key={i}>{topic}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Case References */}
                {report.caseReferences && report.caseReferences.length > 0 && (
                  <section>
                    <h3 className="text-indigo-600 font-semibold">
                      Case References
                    </h3>
                    <ul className="list-disc list-inside">
                      {report.caseReferences.map((ref, i) => (
                        <li key={i}>{ref}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Case Type and Jurisdiction */}
                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-indigo-600 font-semibold">Case Type</h3>
                    <p>{report.caseType || "Not specified"}</p>
                  </div>
                  <div>
                    <h3 className="text-indigo-600 font-semibold">
                      Jurisdiction
                    </h3>
                    <p>{report.jurisdiction || "Not specified"}</p>
                  </div>
                </section>

                {/* Urgency */}
                <section>
                  <h3 className="text-indigo-600 font-semibold">Urgency</h3>
                  <p>{report.urgency || "Not specified"}</p>
                </section>

                {/* Laws Discussed */}
                <section>
                  <h3 className="text-indigo-600 font-semibold">
                    Laws Discussed
                  </h3>
                  <ul className="list-disc list-inside">
                    {report.lawsDiscussed && report.lawsDiscussed.length > 0 ? (
                      report.lawsDiscussed.map((law, i) => (
                        <li key={i}>{law}</li>
                      ))
                    ) : (
                      <li>None</li>
                    )}
                  </ul>
                </section>

                {/* Documents Mentioned */}
                <section>
                  <h3 className="text-indigo-600 font-semibold">
                    Documents Mentioned
                  </h3>
                  <ul className="list-disc list-inside">
                    {report.documentsMentioned && report.documentsMentioned.length > 0 ? (
                      report.documentsMentioned.map((doc, i) => (
                        <li key={i}>{doc}</li>
                      ))
                    ) : (
                      <li>None</li>
                    )}
                  </ul>
                </section>

                {/* Documents Needed */}
                {report.documentsNeeded && report.documentsNeeded.length > 0 && (
                  <section className="bg-yellow-50 p-4 rounded-lg border-l-4 border-yellow-500">
                    <h3 className="text-yellow-800 font-semibold">
                      📄 Documents Required
                    </h3>
                    <ul className="list-disc list-inside">
                      {report.documentsNeeded.map((doc, i) => (
                        <li key={i} className="text-yellow-900">{doc}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Risks Identified */}
                {report.risksIdentified && report.risksIdentified.length > 0 && (
                  <section className="bg-orange-50 p-4 rounded-lg border-l-4 border-orange-500">
                    <h3 className="text-orange-800 font-semibold">
                      ⚡ Legal Risks Identified
                    </h3>
                    <ul className="list-disc list-inside">
                      {report.risksIdentified.map((risk, i) => (
                        <li key={i} className="text-orange-900">{risk}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Recommendations */}
                <section>
                  <h3 className="text-indigo-600 font-semibold">
                    Recommendations
                  </h3>
                  <ul className="list-disc list-inside">
                    {report.recommendations && report.recommendations.length > 0 ? (
                      report.recommendations.map((rec, i) => (
                        <li key={i}>{rec}</li>
                      ))
                    ) : (
                      <li>None</li>
                    )}
                  </ul>
                </section>

                {/* Next Steps */}
                {report.nextSteps && report.nextSteps.length > 0 && (
                  <section className="bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    <h3 className="text-green-800 font-semibold">
                      ✓ Next Steps
                    </h3>
                    <ul className="list-decimal list-inside">
                      {report.nextSteps.map((step, i) => (
                        <li key={i} className="text-green-900">{step}</li>
                      ))}
                    </ul>
                  </section>
                )}

                {/* Action Items */}
                {report.actionItems && report.actionItems.length > 0 && (
                  <section className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <h3 className="text-blue-800 font-semibold">
                      📋 Action Items
                    </h3>
                    <ul className="list-disc list-inside space-y-2">
                      {report.actionItems.map((item, i) => (
                        <li key={i} className="text-blue-900">
                          <strong>{item.task}</strong>
                          {item.priority && (
                            <span className={`ml-2 px-2 py-1 text-xs rounded ${
                              item.priority === 'High' ? 'bg-red-200 text-red-800' :
                              item.priority === 'Medium' ? 'bg-yellow-200 text-yellow-800' :
                              'bg-green-200 text-green-800'
                            }`}>
                              {item.priority} Priority
                            </span>
                          )}
                          {item.assignedTo && (
                            <span className="text-gray-700"> - Assigned to: {item.assignedTo}</span>
                          )}
                          {item.dueDate && (
                            <span className="text-gray-700"> - Due: {item.dueDate}</span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
              </div>
            </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default ViewLegalReportDialog;