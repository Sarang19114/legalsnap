import { NextRequest, NextResponse } from "next/server";
import { getPromptForLawyerType, getAvailableLawyerTypes, hasSpecializedPrompt } from "@/config/prompts";

/**
 * API endpoint to get prompts for a lawyer type
 * This can be used by VAPI or other services to fetch prompts dynamically
 * 
 * GET /api/prompts?lawyerType=Criminal Lawyer
 * Returns: { agentPrompt: string, reportPrompt: string, lawyerType: string }
 * 
 * GET /api/prompts (no params)
 * Returns: { availableTypes: string[] }
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lawyerType = searchParams.get("lawyerType");

    // If no lawyerType specified, return list of available types
    if (!lawyerType) {
      const availableTypes = getAvailableLawyerTypes();
      return NextResponse.json({
        availableTypes,
        message: "Specify ?lawyerType=<type> to get prompts for a specific lawyer type"
      });
    }

    // Get prompt for specified lawyer type
    const promptConfig = getPromptForLawyerType(lawyerType);
    const hasSpecialized = hasSpecializedPrompt(lawyerType);

    return NextResponse.json({
      lawyerType,
      agentPrompt: promptConfig.agentPrompt,
      reportPrompt: promptConfig.reportPrompt,
      hasSpecializedPrompt: hasSpecialized,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error fetching prompts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch prompts",
        details: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

