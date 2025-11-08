import { db } from "@/config/db"
import { currentUser } from "@clerk/nextjs/server"
import { NextRequest, NextResponse } from "next/server"
import { SessionChatTable, usersTable } from "@/config/schema"
import { desc, eq } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
    try {
        console.log("Session-chat POST request started");
        
        // Parse request body
        let body;
        try {
            body = await req.json();
            console.log("Request body parsed successfully");
        } catch (parseError) {
            console.error("Error parsing request body:", parseError);
            return NextResponse.json({ 
                error: "Invalid request body",
                details: parseError instanceof Error ? parseError.message : String(parseError)
            }, { status: 400 });
        }
        
        const { notes, selectedLawyer, sessionId, conversation, action } = body;
        console.log("Extracted data:", { 
            hasNotes: !!notes, 
            hasSelectedLawyer: !!selectedLawyer, 
            sessionId, 
            hasConversation: !!conversation, 
            action 
        });
        
        // Get current user
        const user = await currentUser();
        console.log("User:", user ? "Authenticated" : "Not authenticated");
        console.log("User email:", user?.primaryEmailAddress?.emailAddress);
        
        // Check if user is authenticated
        if (!user?.primaryEmailAddress?.emailAddress) {
            console.log("User not authenticated, returning 401");
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
        }
        
        // Check database connection
        if (!process.env.DATABASE_URL) {
            console.error("DATABASE_URL is not configured");
            return NextResponse.json({ 
                error: "Database not configured",
                details: "DATABASE_URL environment variable is missing"
            }, { status: 500 });
        }
        
        // Ensure user exists in database (required for foreign key constraint)
        const userEmail = user.primaryEmailAddress.emailAddress;
        try {
            const existingUsers = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, userEmail))
                .limit(1);
            
            if (existingUsers.length === 0) {
                console.log("User not found in database, creating user:", userEmail);
                try {
                    // Create user if they don't exist
                    const userName = user.fullName || 
                                   (user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.firstName) || 
                                   "User";
                    
                    await db.insert(usersTable).values({
                        name: userName,
                        email: userEmail,
                        credits: 10
                    });
                    console.log("User created successfully:", userEmail);
                } catch (insertError: any) {
                    // If user creation fails due to unique constraint, user was created concurrently
                    if (insertError?.code === '23505') {
                        console.log("User was created concurrently, continuing...");
                        // Verify user now exists
                        const verifyUsers = await db
                            .select()
                            .from(usersTable)
                            .where(eq(usersTable.email, userEmail))
                            .limit(1);
                        if (verifyUsers.length === 0) {
                            throw new Error("User creation failed and user still does not exist");
                        }
                    } else {
                        // Re-throw other errors
                        throw insertError;
                    }
                }
            } else {
                console.log("User exists in database:", userEmail);
            }
        } catch (userError: any) {
            console.error("Error ensuring user exists:", userError);
            console.error("User error code:", userError?.code);
            console.error("User error message:", userError?.message);
            
            // Return error if we can't ensure user exists
            return NextResponse.json({ 
                error: "Failed to ensure user exists",
                details: userError instanceof Error ? userError.message : String(userError),
                errorCode: userError?.code
            }, { status: 500 });
        }
        
        // Handle conversation update
        if (action === "update-conversation" && sessionId) {
            console.log("Updating conversation for session:", sessionId);
            try {
                const result = await db.update(SessionChatTable)
                    .set({
                        conversation: conversation,
                        updatedAt: new Date()
                    })
                    .where(eq(SessionChatTable.sessionId, sessionId))
                    .returning();
                
                console.log("Conversation updated successfully");
                return NextResponse.json(result[0] || { success: true });
            } catch (dbError) {
                console.error("Error updating conversation:", dbError);
                return NextResponse.json({ 
                    error: "Failed to update conversation",
                    details: dbError instanceof Error ? dbError.message : String(dbError)
                }, { status: 500 });
            }
        }
        
        // Create new session
        console.log("Creating new session");
        const newSessionId = sessionId || uuidv4();
        console.log("Generated session ID:", newSessionId);
        
        try {
            // Prepare insert values
            // Note: Drizzle will handle Date object conversion to PostgreSQL timestamp
            const now = new Date();
            const insertValues: any = {
                sessionId: newSessionId,
                createdBy: user.primaryEmailAddress.emailAddress,
                notes: notes || null,
                selectedLawyer: selectedLawyer ? JSON.parse(JSON.stringify(selectedLawyer)) : null, // Ensure proper JSON serialization
                conversation: Array.isArray(conversation) ? conversation : [],
                createdAt: now,
                updatedAt: now
            };
            
            console.log("Inserting session with values:", {
                sessionId: insertValues.sessionId,
                createdBy: insertValues.createdBy,
                hasNotes: !!insertValues.notes,
                hasSelectedLawyer: !!insertValues.selectedLawyer,
                selectedLawyerType: typeof insertValues.selectedLawyer,
                conversationLength: Array.isArray(insertValues.conversation) ? insertValues.conversation.length : 0
            });
            
            // Verify user exists one more time before insert (race condition protection)
            const userCheck = await db
                .select()
                .from(usersTable)
                .where(eq(usersTable.email, user.primaryEmailAddress.emailAddress))
                .limit(1);
            
            if (userCheck.length === 0) {
                console.error("User does not exist in database, cannot create session");
                return NextResponse.json({ 
                    error: "User not found in database",
                    details: "Please ensure your user account is properly set up"
                }, { status: 500 });
            }
            
            const result = await db.insert(SessionChatTable).values(insertValues).returning();
            
            if (!result || result.length === 0) {
                console.error("Insert returned no results");
                return NextResponse.json({ 
                    error: "Failed to create session",
                    details: "Database insert returned no results"
                }, { status: 500 });
            }
            
            console.log("Session created successfully:", result[0]?.sessionId);
            return NextResponse.json(result[0]);
        } catch (dbError: any) {
            console.error("Error inserting session into database:", dbError);
            console.error("Error details:", dbError instanceof Error ? dbError.stack : "No stack trace");
            console.error("Error code:", dbError?.code);
            console.error("Error message:", dbError?.message);
            
            // Provide more specific error messages based on error type
            let errorMessage = "Failed to create session";
            let errorDetails = dbError instanceof Error ? dbError.message : String(dbError);
            
            // Handle specific database errors
            if (dbError?.code === '23503') { // Foreign key violation
                errorMessage = "User not found in database";
                errorDetails = "The user account does not exist. Please contact support.";
            } else if (dbError?.code === '23505') { // Unique violation
                errorMessage = "Session already exists";
                errorDetails = "A session with this ID already exists. Please try again.";
            } else if (dbError?.code === '23502') { // Not null violation
                errorMessage = "Required field is missing";
                errorDetails = "Some required fields are missing from the session data.";
            }
            
            return NextResponse.json({ 
                error: errorMessage,
                details: errorDetails,
                errorCode: dbError?.code
            }, { status: 500 });
        }
    }
    catch (error) {
        console.error("Unexpected error in POST handler:", error);
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
        return NextResponse.json({ 
            error: "Failed to create/update session",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        console.log("Session-chat GET request started");
        
        const {searchParams} = new URL(req.url)
        const sessionId = searchParams.get("sessionId")
        console.log("Session ID:", sessionId);
        
        const user = await currentUser()
        console.log("User:", user ? "Authenticated" : "Not authenticated");
        console.log("User email:", user?.primaryEmailAddress?.emailAddress);
        
        // Check if user is authenticated
        if (!user?.primaryEmailAddress?.emailAddress) {
            console.log("User not authenticated, returning 401");
            return NextResponse.json({ error: "User not authenticated" }, { status: 401 })
        }
        
        if (sessionId === 'all') {
            console.log("Fetching all sessions for user:", user.primaryEmailAddress.emailAddress);
            
            // Check database connection before querying
            if (!process.env.DATABASE_URL) {
                console.error("DATABASE_URL is not configured");
                return NextResponse.json({ 
                    error: "Database not configured",
                    details: "DATABASE_URL environment variable is missing"
                }, { status: 500 });
            }
            
            try {
                const result = await db.select().from(SessionChatTable)
                    .where(eq(SessionChatTable.createdBy, user.primaryEmailAddress.emailAddress))
                    .orderBy(desc(SessionChatTable.id));

                console.log("Query result:", result.length, "sessions found");
                return NextResponse.json(result || []);
            } catch (dbError) {
                console.error("Database query error:", dbError);
                // Return empty array instead of error to prevent UI breakage
                // The frontend already handles empty arrays gracefully
                return NextResponse.json([]);
            }
        }
        else if (sessionId) {
            console.log("Fetching specific session:", sessionId);
            const result = await db.select().from(SessionChatTable)
                .where(eq(SessionChatTable.sessionId, sessionId));

            if (result.length === 0) {
                console.log("Session not found:", sessionId);
                return NextResponse.json({ error: "Session not found" }, { status: 404 })
            }

            console.log("Session found:", result[0]);
            return NextResponse.json(result[0]);
        } else {
            console.log("No session ID provided");
            return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
        }
    } catch (error) {
        console.error("Error fetching session data:", error)
        console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace");
        return NextResponse.json({ 
            error: "Failed to fetch session data",
            details: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}