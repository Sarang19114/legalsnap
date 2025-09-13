import React from 'react'
import { PricingTable } from '@clerk/nextjs'

export default function Billing() {
    return (
        <div className='px-10 md:px-24 lg:px-48'>
            <h1 className='font-bold text-2xl mb-10'>Upgrade your plan</h1>
            <PricingTable />
        </div>
    )
}

// Billing;