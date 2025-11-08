import React, { Suspense } from "react";
import HistoryList from "./_components/HistoryList";
import LawyerAgentList from "./_components/LawyerAgentList";
import AddNewSessionDialog from "./_components/AddNewSessionDialog";

function Dashboard() {
    return (<div>
        <div className='flex justify-between'>
            <h2 className='font-bold text-2xl'>My Dashboard</h2>
            <AddNewSessionDialog />
        </div>
        <Suspense fallback={<div className="flex justify-center items-center min-h-[200px]">Loading history...</div>}>
            <HistoryList />
        </Suspense>
        <LawyerAgentList />
    </div>)
}

export default Dashboard