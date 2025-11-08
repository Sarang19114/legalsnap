import { NextRequest, NextResponse } from "next/server";
import { db } from "@/config/db";
import { SessionChatTable } from "@/config/schema";

export async function GET(req: NextRequest) {
    try {
        // Test database connection
        const result = await db.select().from(SessionChatTable).limit(1);
        return NextResponse.json({ 
            status: "Database connection successful", 
            sampleData: result,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error("Database test error:", error);
        return NextResponse.json({ 
            error: "Database connection failed", 
            details: error instanceof Error ? error.message : String(error),
            timestamp: new Date().toISOString()
        }, { status: 500 });
    }
}


