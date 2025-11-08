import React from "react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { SessionDetails } from "./HistoryList";
import moment from "moment";
import ViewLegalReportDialog from "./ViewLegalReportDialog";

type Props = {
    HistoryList: SessionDetails[];
    autoOpenSessionId?: string | null;
}

function HistoryTable({ HistoryList, autoOpenSessionId }: Props) {
    return (
        <div>
            <Table>
                <TableCaption>Previous consultation reports</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>AI Lawyer</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {HistoryList.map((record: SessionDetails, index: number) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">
                                {record.selectedLawyer.specialist}
                            </TableCell>
                            <TableCell>{record.notes}</TableCell>
                            <TableCell>{moment(new Date(record.createdAt)).fromNow()}</TableCell>
                            <TableCell className="text-right">
                                <Button variant={"link"} size={"sm"}>
                                    <ViewLegalReportDialog 
                                        record={record} 
                                        autoOpen={autoOpenSessionId === record.sessionId}
                                    />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>

            </Table>
        </div>
    )
}

export default HistoryTable;