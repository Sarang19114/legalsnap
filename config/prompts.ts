import { AILawyerAgents } from "@/shared/list";

/**
 * Map of lawyer specialization types to their prompts
 * This allows dynamic prompt loading based on lawyer type
 */
export interface LawyerPromptConfig {
  agentPrompt: string; // For VAPI voice assistant
  reportPrompt: string; // For legal report generation
}

/**
 * Default prompt for legal report generation
 */
const DEFAULT_REPORT_PROMPT = `
You are an AI Legal Voice Agent assisting clients with legal issues under Indian law.

You just had a voice/text conversation with a user about a legal concern. Your task is to generate a **comprehensive legal consultation report** based on the conversation transcript. 

Analyze the entire conversation carefully and extract ALL relevant information to create a detailed legal report.

### OUTPUT FORMAT (MUST BE VALID JSON):

{
  "sessionId": "string",
  "meetingTitle": "string (descriptive title based on main legal issue)",
  "participants": {
    "client": "string (extract if mentioned, else 'Client')",
    "lawyer": "string (the AI lawyer specialist name)"
  },
  "timestamp": "ISO Date string",
  "duration": "string (e.g., '15 minutes')",
  "legalIssue": "string (brief 1-2 sentence description of the main legal issue)",
  "summary": "string (comprehensive 3-5 paragraph summary covering: what was discussed, key concerns raised, advice provided, and outcome)",
  "keyDiscussionPoints": [
    "Important topic 1 discussed in detail",
    "Important topic 2 with context",
    "Important topic 3 with relevant details"
  ],
  "importantPoints": [
    "Critical point 1 that needs attention",
    "Critical point 2 that was emphasized",
    "Critical point 3 with legal significance"
  ],
  "decisions": [
    "Decision 1 made during consultation",
    "Decision 2 agreed upon"
  ],
  "legalTopics": [
    "Legal area 1 (e.g., Contract Law)",
    "Legal area 2 (e.g., Property Rights)"
  ],
  "caseReferences": [
    "Relevant case law 1 with citation",
    "Relevant case law 2 with citation"
  ],
  "caseType": "string (e.g., Civil/Criminal/Family/Property)",
  "jurisdiction": "string (city/state if mentioned, else 'India')",
  "urgency": "Low | Medium | High",
  "lawsDiscussed": [
    "Act/Section 1 with brief context",
    "Act/Section 2 with relevance"
  ],
  "documentsMentioned": [
    "Document 1 discussed or required",
    "Document 2 needed"
  ],
  "documentsNeeded": [
    "Document 1 client needs to collect",
    "Document 2 client needs to prepare"
  ],
  "recommendations": [
    "Detailed recommendation 1 with reasoning",
    "Detailed recommendation 2 with next steps"
  ],
  "nextSteps": [
    "Immediate action 1 with timeline",
    "Follow-up action 2 with details",
    "Long-term action 3 if applicable"
  ],
  "actionItems": [
    {
      "task": "Specific task description",
      "assignedTo": "Client | Lawyer | Both",
      "priority": "High | Medium | Low",
      "dueDate": "timeframe or date if mentioned"
    }
  ],
  "risksIdentified": [
    "Risk 1 discussed",
    "Risk 2 to be aware of"
  ],
  "clientConcerns": [
    "Concern 1 raised by client",
    "Concern 2 expressed"
  ],
  "adviceProvided": [
    "Advice point 1 given",
    "Advice point 2 provided"
  ]
}

### DETAILED EXTRACTION GUIDELINES:

1. **Meeting Title**: Create a professional, descriptive title (e.g., "Divorce Proceedings and Child Custody Consultation", "Property Dispute Resolution Discussion")

2. **Legal Issue**: Concisely state the core legal problem in 1-2 sentences

3. **Summary**: Write a comprehensive summary (200-300 words) that includes:
   - What brought the client to the consultation
   - Main concerns and questions raised
   - Key advice and explanations provided
   - Any resolutions or decisions reached
   - Overall outcome and path forward

4. **Key Discussion Points**: List 5-10 main topics that were discussed in detail during the conversation

5. **Important Points**: Highlight 3-7 critical points that need special attention or were emphasized

6. **Decisions**: Extract any decisions made (e.g., "Client will file complaint", "Will hire property lawyer")

7. **Legal Topics**: Identify broader legal areas (e.g., "Contract Law", "Family Law", "Criminal Law")

8. **Case References**: Include relevant Indian case law, sections, or precedents mentioned

9. **Laws Discussed**: List specific Indian acts and sections:
   - IPC (Indian Penal Code)
   - CrPC (Code of Criminal Procedure)
   - Indian Contract Act, 1872
   - Hindu Marriage Act, 1955
   - Transfer of Property Act, 1882
   - Consumer Protection Act, 2019
   - IT Act, 2000
   - Etc.

10. **Documents**: Separate into:
    - Documents mentioned in discussion
    - Documents client needs to collect/prepare

11. **Recommendations**: Provide detailed, actionable legal recommendations

12. **Next Steps**: Clear sequential steps the client should take

13. **Action Items**: Specific tasks with assignee, priority, and timeline

14. **Risks**: Identify legal risks or potential issues discussed

15. **Client Concerns**: Specific worries or questions the client raised

16. **Advice Provided**: Key legal advice given during consultation

### IMPORTANT:
- Extract information from the ENTIRE conversation, not just the beginning
- Be thorough and detailed - this is an official legal consultation record
- Use professional legal language
- Infer information intelligently from context
- If information is not explicitly stated, make reasonable inferences
- Output ONLY valid JSON - no markdown, no code blocks, no explanations
- Ensure all arrays have at least 2-3 items by extracting carefully from the conversation
`;

/**
 * Creates a specialized report prompt based on lawyer type
 */
function createSpecializedReportPrompt(agentPrompt: string): string {
  // Extract the specialization context from the agent prompt
  const specializationContext = agentPrompt.split('\n\n')[0]; // Usually the first paragraph describes the lawyer
  
  return `${DEFAULT_REPORT_PROMPT}

### Specialization Context:
${specializationContext}

### Additional Guidelines:
- Focus on the specialized legal areas mentioned in the lawyer's expertise
- Use terminology and legal references specific to this specialization
- Ensure the report reflects the specialized knowledge and approach of this lawyer type
- Highlight any specialized laws, acts, or procedures relevant to this field
`;
}

/**
 * Build prompts map from AILawyerAgents
 */
function buildPromptsMap(): Map<string, LawyerPromptConfig> {
  const promptsMap = new Map<string, LawyerPromptConfig>();
  
  AILawyerAgents.forEach((lawyer) => {
    const key = normalizeLawyerType(lawyer.specialist);
    promptsMap.set(key, {
      agentPrompt: lawyer.agentPrompt,
      reportPrompt: createSpecializedReportPrompt(lawyer.agentPrompt)
    });
  });
  
  return promptsMap;
}

/**
 * Normalize lawyer type to a consistent format for lookup
 */
function normalizeLawyerType(type: string): string {
  return type
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Build the prompts map at module load time
const PROMPTS_MAP = buildPromptsMap();

// Cache for prompts during sessions
const promptCache = new Map<string, LawyerPromptConfig>();

/**
 * Get prompt configuration for a lawyer type
 * @param lawyerType - The lawyer specialization (e.g., "Criminal Lawyer", "Family Lawyer")
 * @returns Prompt configuration object with agentPrompt and reportPrompt
 */
export function getPromptForLawyerType(lawyerType: string | undefined | null): LawyerPromptConfig {
  if (!lawyerType) {
    return getDefaultPrompt();
  }

  // Check cache first
  const cached = promptCache.get(lawyerType);
  if (cached) {
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Prompt Cache Hit] Using cached prompt for: ${lawyerType}`);
    }
    return cached;
  }

  // Normalize and lookup
  const normalized = normalizeLawyerType(lawyerType);
  const prompt = PROMPTS_MAP.get(normalized);

  if (prompt) {
    // Cache for session duration
    promptCache.set(lawyerType, prompt);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`[Prompt Loaded] Loaded prompt for: ${lawyerType} (normalized: ${normalized})`);
    }
    
    return prompt;
  }

  // Fallback to default
  if (process.env.NODE_ENV === 'development') {
    console.warn(`[Prompt Fallback] No prompt found for: ${lawyerType}, using default`);
  }
  
  return getDefaultPrompt();
}

/**
 * Get default prompt configuration
 */
export function getDefaultPrompt(): LawyerPromptConfig {
  const generalLawyer = AILawyerAgents.find(l => 
    normalizeLawyerType(l.specialist) === 'general-lawyer'
  );
  
  if (generalLawyer) {
    return {
      agentPrompt: generalLawyer.agentPrompt,
      reportPrompt: createSpecializedReportPrompt(generalLawyer.agentPrompt)
    };
  }
  
  // Ultimate fallback
  return {
    agentPrompt: 'You are a legal assistant helping with legal questions.',
    reportPrompt: DEFAULT_REPORT_PROMPT
  };
}

/**
 * Clear prompt cache (useful for testing or when prompts are updated)
 */
export function clearPromptCache(): void {
  promptCache.clear();
  if (process.env.NODE_ENV === 'development') {
    console.log('[Prompt Cache] Cache cleared');
  }
}

/**
 * Get all available lawyer types
 */
export function getAvailableLawyerTypes(): string[] {
  return AILawyerAgents.map(lawyer => lawyer.specialist);
}

/**
 * Check if a lawyer type has a specialized prompt
 */
export function hasSpecializedPrompt(lawyerType: string): boolean {
  const normalized = normalizeLawyerType(lawyerType);
  return PROMPTS_MAP.has(normalized);
}

