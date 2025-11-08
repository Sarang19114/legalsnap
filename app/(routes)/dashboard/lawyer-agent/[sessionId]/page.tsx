"use client"
import axios from "axios";
import { useParams, useRouter } from 'next/navigation'
import React, { useEffect, useState, useRef } from "react";
import { Circle, PhoneCall, PhoneOff } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Vapi from "@vapi-ai/web";
import { lawyerAgent } from '../../_components/LawyerAgentCard';
import { TextShimmer } from "@/components/ui/text-shimmer";

export type SessionDetail = {
    id: number;
    notes: string;
    sessionId: string;
    report: JSON;
    selectedLawyer: lawyerAgent;
    createdOn: string;
  };

type messages ={
    role:string,
    text:string,
}

function LawyerVoiceAgent() {
    const { sessionId } = useParams();
    const router = useRouter();
    const [sessionDetails, setSessionDetails] = useState<SessionDetail | null>(null);
    const [callStarted, setCallStarted] = useState(false);
    const [vapi, setVapi] = useState<Vapi | null>(null);
    const [currentRoll , setCurrentRoll] = useState<string | null>();
    const [liveTranscript,setLiveTranscript] = useState<string>();
    const [messages,setMessages] = useState<messages[]>([]);
    const [callDuration, setCallDuration] = useState(0);
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const transcriptContainerRef = useRef<HTMLDivElement>(null);
    const callStartTimeRef = useRef<number | null>(null);
    const durationIntervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (process.env.NEXT_PUBLIC_VAPI_API_KEY) {
          const newVapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_API_KEY);
          setVapi(newVapi);
        }
      }, []);
    
    useEffect(() => {
        if (sessionId) {
          GetSessionDetails();
        }
    }, [sessionId]);

    // Prevent body scroll on this page
    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, []);

    // Auto-scroll transcript container to bottom when new messages arrive
    useEffect(() => {
        if (transcriptContainerRef.current) {
            transcriptContainerRef.current.scrollTop = transcriptContainerRef.current.scrollHeight;
        }
    }, [messages, liveTranscript]);

    // Update conversation in database when messages change
    useEffect(() => {
        const saveConversation = async () => {
            if (sessionId && messages.length > 0) {
                try {
                    await axios.post("/api/session-chat", {
                        sessionId: sessionId,
                        conversation: messages,
                        action: "update-conversation"
                    });
                } catch (error) {
                    console.error("Failed to save conversation:", error);
                }
            }
        };

        // Debounce the save to avoid too many API calls
        const timeoutId = setTimeout(() => {
            saveConversation();
        }, 2000);

        return () => clearTimeout(timeoutId);
    }, [messages, sessionId]);

    const GetSessionDetails = async () => {
        try {
          const result = await axios.get("/api/session-chat?sessionId=" + sessionId);
          console.log(result.data);
          setSessionDetails(result.data);
        } catch (error) {
          console.error("Failed to fetch session details:", error);
        }
    };

    const generateReport = async (duration?: number) => {
        if (!sessionId || messages.length === 0) {
            console.log("No messages to generate report from");
            setIsGeneratingReport(false);
            return;
        }

        setIsGeneratingReport(true);
        console.log("Starting report generation...");
        try {
            const durationMinutes = duration ? Math.floor(duration / 60) : 0;
            const durationText = durationMinutes > 0 
                ? `${durationMinutes} minute${durationMinutes > 1 ? 's' : ''}`
                : 'Less than 1 minute';

            console.log("Calling legal-report API...");
            await axios.post("/api/legal-report", {
                sessionId: sessionId,
                sessionDetail: {
                    ...sessionDetails,
                    duration: durationText
                },
                messages: messages
            });
            console.log("Report generated successfully");
            // Refresh session details to get updated report
            await GetSessionDetails();
            console.log("Session details refreshed");
        } catch (error) {
            console.error("Failed to generate report:", error);
        }
        // Keep isGeneratingReport true until redirect happens
        // Don't set it to false here
    };

    const formatDuration = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const StartCall = () => {
        if (!vapi || !process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID) return;
    
        vapi.on("call-start", () => {
          console.log("Call started");
          setCallStarted(true);
          callStartTimeRef.current = Date.now();
          setCallDuration(0);
          
          // Start duration timer
          durationIntervalRef.current = setInterval(() => {
            if (callStartTimeRef.current) {
              const elapsed = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
              setCallDuration(elapsed);
            }
          }, 1000);
        });
    
        vapi.on("call-end", async () => {
          console.log("Call ended");
          setCallStarted(false);
          
          // Calculate final duration from start time
          let finalDuration = 0;
          if (callStartTimeRef.current) {
            finalDuration = Math.floor((Date.now() - callStartTimeRef.current) / 1000);
          }
          
          // Stop duration timer
          if (durationIntervalRef.current) {
            clearInterval(durationIntervalRef.current);
            durationIntervalRef.current = null;
          }
          callStartTimeRef.current = null;

          // Save final conversation and generate report
          if (sessionId && messages.length > 0) {
            try {
                // Save conversation first
                await axios.post("/api/session-chat", {
                    sessionId: sessionId,
                    conversation: messages,
                    action: "update-conversation"
                });

                // Generate report automatically with duration
                await generateReport(finalDuration);
                
                // Wait a bit for report to be fully saved, then redirect with autoOpen parameter
                setTimeout(() => {
                  router.push(`/dashboard/history?autoOpen=${sessionId}`);
                }, 1500);
            } catch (error) {
                console.error("Failed to save conversation or generate report:", error);
                // Still redirect even if there's an error
                setTimeout(() => {
                  router.push(`/dashboard/history?autoOpen=${sessionId}`);
                }, 1500);
            }
          } else {
            // No messages, just redirect
            setTimeout(() => {
              router.push('/dashboard/history');
            }, 1000);
          }
        });
    
        vapi.on("message", (message) => {
          if (message.type === "transcript") {
            const {role,transcriptType , transcript} = message;
    
            console.log(`${message.role}: ${message.transcript}`);
            if(transcriptType == 'partial') {
            setLiveTranscript(transcript);
            setCurrentRoll(role);
            }
            else if(transcriptType == 'final'){
              //final transcript - merge with previous message if same role
              setMessages((prev:any) => {
                if (prev.length > 0 && prev[prev.length - 1].role === role) {
                  // Same role as last message - append to it
                  const updated = [...prev];
                  updated[updated.length - 1] = {
                    role: role,
                    text: updated[updated.length - 1].text + ' ' + transcript
                  };
                  return updated;
                } else {
                  // Different role or first message - add new entry
                  return [...prev, {role: role, text: transcript}];
                }
              });
              setLiveTranscript("");
              setCurrentRoll(null);
    
            }
          }
        });
    
        vapi.on('speech-start', () => {
          console.log('Assistant started speaking');
          setCurrentRoll('assistant');
        });
        vapi.on('speech-end', () => {
          console.log('Assistant stopped speaking');
          setCurrentRoll('user');
        });
    
        vapi.start(process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID);
    };


    return (
        <div className="h-[calc(100vh-180px)] border rounded-3xl bg-secondary flex flex-col overflow-hidden">
        <div className="flex justify-between items-center flex-shrink-0 p-4 border-b">
          <h2 className="p-1 px-2 border rounded-md flex gap-2 items-center">
            <Circle className= {`h-4 w-4 rounded-full ${callStarted?'bg-green-500':'bg-red-500'}`}/> {callStarted ? "Connected" : "Not connected"}
          </h2>
          <h2 className="font-bold text-xl text-gray-400">{formatDuration(callDuration)}</h2>
        </div>
  
        {sessionDetails && (
          <div className="flex items-center flex-col flex-1 min-h-0 p-4">
            <Image
              src={sessionDetails.selectedLawyer.image}
              alt={sessionDetails.selectedLawyer.specialist}
              width={70}
              height={70}
              className="h-[70px] w-[70px] object-cover rounded-full flex-shrink-0"
            />
            <h2 className="mt-1 text-base font-semibold flex-shrink-0">
              {sessionDetails.selectedLawyer.specialist}
            </h2>
            <p className="text-xs text-gray-400 flex-shrink-0 mb-3">AI Lawyer Voice Agent</p>
  
            {/* Fixed-height scrollable transcript container that grows to fill space */}
            <div 
              ref={transcriptContainerRef}
              className="w-full max-w-3xl flex-1 min-h-0 overflow-y-auto border rounded-lg p-3 bg-gray-50 dark:bg-gray-900"
              style={{ scrollBehavior: 'smooth' }}
            >
              {messages.length === 0 && !liveTranscript && (
                <p className="text-gray-400 text-center mt-10">Transcript will appear here...</p>
              )}
              {messages?.map((msg:messages,index)=>(
                <div key={index} className="mb-1.5">
                  <span className="font-semibold text-blue-600 dark:text-blue-400 capitalize text-sm">
                    {msg.role === 'assistant' ? sessionDetails.selectedLawyer.specialist : 'User'}:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 ml-2 text-sm">{msg.text}</span>
                </div>
              ))}
              {liveTranscript && liveTranscript.length > 0 && (
                <div className="mb-1.5 opacity-70">
                  <span className="font-semibold text-green-600 dark:text-green-400 capitalize text-sm">
                    {currentRoll === 'assistant' ? sessionDetails.selectedLawyer.specialist : 'User'}:
                  </span>
                  <span className="text-gray-700 dark:text-gray-300 ml-2 italic text-sm">{liveTranscript}</span>
                </div>
              )}
            </div>

            {isGeneratingReport && (
              <div className="mt-4 flex flex-col items-center gap-2 flex-shrink-0">
                <TextShimmer 
                  duration={1.5}
                  className="text-lg font-semibold [--base-color:theme(colors.indigo.600)] [--base-gradient-color:theme(colors.indigo.300)] dark:[--base-color:theme(colors.indigo.700)] dark:[--base-gradient-color:theme(colors.indigo.400)]"
                >
                  ✨ Generating Your Legal Report...
                </TextShimmer>
                <p className="text-xs text-gray-500">Please wait while we analyze your consultation</p>
              </div>
            )}
  
            <Button 
              className="mt-3 flex-shrink-0" 
              variant={callStarted ? 'destructive' : 'default'}
              onClick={async () => {
                if (!callStarted) {
                  // Start the call
                  StartCall();
                } else {
                  // End the call
                  vapi?.stop();
                  // Clear interval if still running
                  if (durationIntervalRef.current) {
                    clearInterval(durationIntervalRef.current);
                    durationIntervalRef.current = null;
                  }
                }
              }}
            >
              {callStarted ? (
                <>
                  <PhoneOff className="mr-2 h-4 w-4" />End Call
                </>
              ) : (
                <>
                  <PhoneCall className="mr-2 h-4 w-4" />Start Call
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    );
}

export default LawyerVoiceAgent