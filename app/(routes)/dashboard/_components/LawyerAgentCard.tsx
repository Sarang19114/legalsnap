"use client"
import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@clerk/nextjs";
import { LoaderIcon } from "lucide-react";
import { IconArrowRight } from "@tabler/icons-react";
import axios from "axios"; 

export type lawyerAgent = {
    id: number;
    specialist: string;
    description: string;
    image: string;
    agentPrompt: string;
    subscriptionRequired: boolean;
  };

type props = {
    lawyerAgent: lawyerAgent
}

function LawyerAgentCard({ lawyerAgent }: props) {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const { has } = useAuth();
    //@ts-ignore
    const paidUser = has && has({
        plan: "pro"
    })

    const onStartConsultation = async () => {
        setIsLoading(true);
        try {
            const result = await axios.post("/api/session-chat", {
                notes: "new query", 
                selectedLawyer: lawyerAgent
            });
            setIsLoading(false);
            if (result.data?.sessionId) {
                router.push(`/dashboard/lawyer-agent?sessionId=${result.data.sessionId}`);
            }
        } catch (error) {
            setIsLoading(false);
            console.log(error);
        }
    }
    return (
        <div className="flex flex-col justify-between items-center w-[260px] h-[410px] bg-white border border-gray-200 rounded-2xl shadow-md p-4 transition-all duration-200 hover:shadow-lg hover:scale-[1.03]">
            <Badge className='absolute right-0 m-2'>
                {lawyerAgent.subscriptionRequired ? "Premium" : "free"}
            </Badge>
            <Image
                src={lawyerAgent.image}
                alt={lawyerAgent.specialist}
                width={200}
                height={230} // increased from 200
                className="w-full h-[230px] object-contain rounded-xl mb-1"
            />
            <div className="flex flex-col items-center w-full">
                <h2 className="font-semibold mt-0 text-[14px] text-center leading-tight text-gray-700">
                    {lawyerAgent.specialist}
                </h2>
                <p className="text-gray-700 text-center mt-0.5 mb-1 break-words w-full text-xs line-clamp-2">
                    {lawyerAgent.description}
                </p>
            </div>
            <Button className="w-full mt-0.5 h-9 text-sm" onClick={onStartConsultation} disabled={!paidUser && lawyerAgent.subscriptionRequired}>
                Start Consultation{" "}
                {isLoading ? <LoaderIcon className="animate-spin ml-1" /> : <IconArrowRight className="ml-1" />}
            </Button>
        </div>
    );
}




export default LawyerAgentCard