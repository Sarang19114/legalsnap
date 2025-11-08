"use client"
import React, { useState , useEffect } from "react";
import Image from "next/image";
import AddNewSessionDialog from "./AddNewSessionDialog";
import axios from "axios";
import HistoryTable from "./HistoryTable";
import { lawyerAgent } from "./LawyerAgentCard"
import { useSearchParams } from "next/navigation";
import { TextShimmer } from "@/components/ui/text-shimmer";


export type SessionDetails = {
    id: number;
    notes: string;
    sessionId: string;
    report: any;
    selectedLawyer: lawyerAgent;
    createdAt: string;
}

function HistoryList() {
    const searchParams = useSearchParams();
    const autoOpenSessionId = searchParams.get('autoOpen');
    const [HistoryList, setHistoryList] = useState<SessionDetails[]>([]);
    const [showLoadingOverlay, setShowLoadingOverlay] = useState(!!autoOpenSessionId);
    
    useEffect(() => {
        GetHistoryList();
      }, []);
      
      useEffect(() => {
        // Show loading overlay for at least 3 seconds when autoOpen is present
        if (autoOpenSessionId) {
            setShowLoadingOverlay(true);
            const timer = setTimeout(() => {
                setShowLoadingOverlay(false);
            }, 3000);
            return () => clearTimeout(timer);
        }
      }, [autoOpenSessionId]);
      
      const GetHistoryList = async () => {
        try {
            const result = await axios.get("/api/session-chat?sessionId=all")
            console.log(result.data)
            setHistoryList(result.data)
        } catch (error) {
            console.error('Failed to fetch history list:', error)
            // Set empty array as fallback to prevent UI issues
            setHistoryList([])
        }
      }
    return (
        <div className="mt-10 relative">
            {/* Loading Overlay */}
            {showLoadingOverlay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-2xl flex flex-col items-center gap-4">
                        <TextShimmer 
                            duration={1.5}
                            className="text-2xl font-bold [--base-color:theme(colors.indigo.600)] [--base-gradient-color:theme(colors.indigo.300)] dark:[--base-color:theme(colors.indigo.700)] dark:[--base-gradient-color:theme(colors.indigo.400)]"
                        >
                            ✨ Generating Your Legal Report...
                        </TextShimmer>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Please wait while we analyze your consultation</p>
                    </div>
                </div>
            )}
            
            {
                HistoryList.length == 0 ?
                    <div className='flex items-center justify-center flex-col p-7 border border-dashed rounded-2xl'>
                        <Image src={'/AI.png'} alt="AiGavel" width={150} height={150} />
                        <h2 className="font-bold text-xl mt-5">No Recent Consultations</h2>
                        <p>Oops! It looks like you haven't consulted any Lawyer yet.</p>
                        <AddNewSessionDialog />
                    </div>
                    :
                    <div>
                        <HistoryTable HistoryList={HistoryList} autoOpenSessionId={autoOpenSessionId} />
                    </div>
            }
        </div>
    )
}

export default HistoryList