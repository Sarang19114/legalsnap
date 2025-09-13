"use client"
import React, { useEffect, useState } from 'react'
import LawyerAgentCard, { lawyerAgent } from './LawyerAgentCard'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { ArrowRight, Loader2 } from 'lucide-react'
import axios from 'axios'
import SuggestedLawyerCard from './SuggestedLawyerCard'
import { useRouter } from 'next/navigation'
import { AILawyerAgents } from '@/shared/list'
import { useAuth } from '@clerk/nextjs'

function AddNewSessionDialog() {
    const [note, setNote] = useState<string>()
    const [loading, setLoading] = useState(false)
    const [suggestedLawyers, setSuggestedLawyers] = useState<lawyerAgent[]>([])
    const [selectedLawyer, setSelectedLawyer] = useState<lawyerAgent | null>(null)
    const router = useRouter()
    const [historyList, setHistoryList] = useState<any[]>([])
    const [dialogOpen, setDialogOpen] = useState(false)
    const {has} = useAuth();

    //@ts-ignore
    const paidUser = has && has ({
        plan:"pro"
    })

    useEffect(() => {
        GetHistoryList()
    }, [])

    const GetHistoryList = async () => {
        const result = await axios.get('/api/session-chat?sessionId=all')
        setHistoryList(result.data)
    }

    const onClickNext = async () => {
        setLoading(true)
        try {
            const result = await axios.post('/api/suggest-lawyers', { notes: note });
            if (Array.isArray(result.data) && result.data.length > 0) {
                setSuggestedLawyers(result.data);
                // Select the first lawyer by default
                setSelectedLawyer(result.data[0]);
            } else if (result.data && result.data.error) {
                console.error('Error from API:', result.data.error);
                // Fallback to using the first few lawyers from the list
                const fallbackLawyers = AILawyerAgents.slice(0, 3);
                setSuggestedLawyers(fallbackLawyers);
                setSelectedLawyer(fallbackLawyers[0]);
            } else {
                console.warn('No suggested lawyers found, using fallback');
                // Fallback to using the first few lawyers from the list
                const fallbackLawyers = AILawyerAgents.slice(0, 3);
                setSuggestedLawyers(fallbackLawyers);
                setSelectedLawyer(fallbackLawyers[0]);
            }
        } catch (error) {
            console.error('Failed to fetch suggested lawyers:', error);
            // Fallback to using the first few lawyers from the list
            const fallbackLawyers = AILawyerAgents.slice(0, 3);
            setSuggestedLawyers(fallbackLawyers);
            setSelectedLawyer(fallbackLawyers[0]);
        }
        setLoading(false)
    }

    const onStartConsultation = async () => {
        setLoading(true)
        const result = await axios.post('/api/session-chat', {
            notes: note,
            selectedLawyer: selectedLawyer
        })
        if (result.data?.sessionId) {
            router.push('/dashboard/lawyer-agent/' + result.data.sessionId)
        }
        setLoading(false)
    }

    // Reset state when dialog closes
    const handleDialogChange = (open: boolean) => {
        setDialogOpen(open);
        if (!open) {
            setNote("");
            setSuggestedLawyers([]);
            setSelectedLawyer(null);
            setLoading(false);
        }
    }

    return (
        <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
            <DialogTrigger>
                <Button className='mt-3 cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg' disabled={!paidUser || historyList.length >= 4}>+ Start a Consultation</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add Basic Details</DialogTitle>
                    <DialogDescription asChild>
                        {!suggestedLawyers.length ? <div>
                            <h2>Add your Legal Issue or any other details</h2>
                            <Textarea placeholder='Drop your Query' className='h-[200px] mt-2'
                                onChange={(e) => setNote(e.target.value)} />
                        </div> :
                            <div>
                                <h2>Select the lawyer</h2>
                                <div className='grid grid-cols-3 gap-5'>
                                    {suggestedLawyers.map((lawyer, index) => (
                                        <SuggestedLawyerCard lawyerAgent={lawyer} key={index} setSelectedLawyer={setSelectedLawyer}
                                            selectedLawyer={selectedLawyer} />
                                    ))}
                                </div>
                            </div>}
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                    <DialogClose> <Button variant={'outline'} className='cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-md'>Cancel</Button> </DialogClose>
                    {!suggestedLawyers.length ? <Button disabled={!note || loading} onClick={onClickNext} className='cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg'> Next {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />} </Button>
                        : <Button disabled={loading || !selectedLawyer} onClick={onStartConsultation} className='cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg'>Start Consultation {loading ? <Loader2 className='animate-spin' /> : <ArrowRight />}</Button>}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddNewSessionDialog