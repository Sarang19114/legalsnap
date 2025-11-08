import React, { Suspense } from "react";
// import Image from "next/image";
import HistoryList from "@/app/(routes)/dashboard/_components/HistoryList";


function History() {
    return (
        <div>
            <Suspense fallback={<div className="flex justify-center items-center min-h-[400px]">Loading...</div>}>
                <HistoryList />
            </Suspense>
        </div>
    )
}

export default History;