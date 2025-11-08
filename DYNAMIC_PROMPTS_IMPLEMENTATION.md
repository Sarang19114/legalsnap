# Dynamic Prompts Implementation Summary

## Overview

This implementation makes the LegalSnap AI prompts system fully dynamic, allowing different lawyer specializations to have specialized AI behavior for report generation. The system is now scalable and can easily accommodate new lawyer types.

## Changes Made

### 1. Fixed 500 Error in Session Chat Route ✅

**File**: `app/api/session-chat/route.ts`

- Added better error handling for database connection issues
- Improved error messages and logging
- Returns empty array on database errors to prevent UI breakage
- Added database URL validation

### 2. Created Dynamic Prompts Configuration ✅

**File**: `config/prompts.ts`

- Created `getPromptForLawyerType()` function to dynamically fetch prompts
- Built prompts map from `AILawyerAgents` array
- Implemented prompt caching for session duration
- Added fallback to default (General Lawyer) prompt
- Added development mode logging
- Supports normalization of lawyer type names (case-insensitive, handles spaces/special chars)

**Features**:
- Automatic prompt extraction from lawyer definitions
- Specialized report prompts based on lawyer type
- In-memory caching for performance
- Comprehensive error handling

### 3. Updated Legal Report Generation ✅

**File**: `app/api/legal-report/route.ts`

- Integrated dynamic prompt loading
- Fetches lawyer type from session data or database
- Uses specialized prompts for report generation
- Adds lawyer specialization context to prompts
- Logs prompt selection in development mode

**How it works**:
1. Extracts lawyer type from `sessionDetail.selectedLawyer.specialist`
2. Falls back to database lookup if not in sessionDetail
3. Loads appropriate prompt using `getPromptForLawyerType()`
4. Generates report with specialized context

### 4. Created Prompts API Endpoint ✅

**File**: `app/api/prompts/route.ts`

- REST API endpoint to fetch prompts programmatically
- `GET /api/prompts?lawyerType=<type>` - Get prompt for specific lawyer
- `GET /api/prompts` - Get list of available lawyer types
- Useful for VAPI integration or external services

### 5. Documentation ✅

**File**: `config/PROMPTS_README.md`

- Comprehensive documentation of the prompts system
- Usage examples
- VAPI integration guide
- Troubleshooting guide
- Best practices

## How It Works

### Prompt Flow

```
1. User selects a lawyer (e.g., "Criminal Lawyer")
   ↓
2. Session created with selectedLawyer data
   ↓
3. Legal report generation requested
   ↓
4. System extracts lawyer type from session
   ↓
5. getPromptForLawyerType("Criminal Lawyer") called
   ↓
6. Prompt loaded from cache or prompts map
   ↓
7. Specialized report prompt used for LLM
   ↓
8. Report generated with criminal law context
```

### Supported Lawyer Types

All lawyer types from `AILawyerAgents` are supported:
- General Lawyer (default fallback)
- Criminal Lawyer
- Property Lawyer
- Family Lawyer
- Corporate Lawyer
- Tax Lawyer
- Cyber Lawyer
- Immigration Lawyer
- Labor & Employment Lawyer
- Consumer Rights Lawyer

## Testing

### Test Dynamic Prompts

```typescript
import { getPromptForLawyerType } from "@/config/prompts";

// Test different lawyer types
const criminalPrompt = getPromptForLawyerType("Criminal Lawyer");
const familyPrompt = getPromptForLawyerType("Family Lawyer");
const defaultPrompt = getPromptForLawyerType(null);

console.log("Criminal prompt length:", criminalPrompt.reportPrompt.length);
console.log("Family prompt length:", familyPrompt.reportPrompt.length);
```

### Test API Endpoint

```bash
# Get prompt for Criminal Lawyer
curl http://localhost:3000/api/prompts?lawyerType=Criminal%20Lawyer

# Get available lawyer types
curl http://localhost:3000/api/prompts
```

### Test Report Generation

1. Create a session with a specific lawyer (e.g., Criminal Lawyer)
2. Have a conversation
3. Generate a report
4. Check logs for: `[Legal Report] Using prompt for lawyer type: Criminal Lawyer`
5. Verify report contains criminal law-specific content

## VAPI Integration (Future Enhancement)

### Current Status

VAPI currently uses a static `NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID`. The prompts are configured in the VAPI dashboard.

### Making VAPI Dynamic

To make VAPI fully dynamic, you have three options:

#### Option 1: Multiple VAPI Assistants (Recommended)

1. Create separate VAPI assistants for each lawyer type in VAPI dashboard
2. Add `assistantId` field to each lawyer in `shared/list.ts`
3. Update `lawyer-agent/[sessionId]/page.tsx` to use the correct assistant ID:

```typescript
const assistantId = sessionDetails.selectedLawyer.assistantId || 
                    process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID;
vapi.start(assistantId);
```

#### Option 2: VAPI Server Messages

1. Create API endpoint that VAPI can call to get prompts
2. Use VAPI's server messages feature to inject prompts dynamically
3. Configure VAPI webhook to fetch prompts before each call

#### Option 3: VAPI Function Calls

1. Create a VAPI function that returns the appropriate prompt
2. Call this function at the start of each conversation
3. Use the returned prompt to configure the assistant

See `config/PROMPTS_README.md` for detailed instructions.

## Benefits

1. **Scalability**: Easy to add new lawyer types without code changes
2. **Specialization**: Each lawyer type gets specialized AI behavior
3. **Maintainability**: Prompts centralized in one place
4. **Performance**: Prompt caching reduces lookup overhead
5. **Flexibility**: API endpoint allows external integration
6. **Debugging**: Development mode logging helps troubleshoot issues

## Next Steps

1. ✅ Dynamic prompts for report generation - **COMPLETE**
2. ⏳ Make VAPI use dynamic prompts (requires VAPI dashboard configuration)
3. ⏳ Add prompt versioning for A/B testing
4. ⏳ Add prompt analytics to track which prompts are most effective
5. ⏳ Create admin UI for prompt management

## Troubleshooting

### Issue: Wrong prompt being used

**Solution**: Check that `sessionDetail.selectedLawyer.specialist` is set correctly. Review logs for prompt selection.

### Issue: Prompt not found

**Solution**: Verify lawyer type name matches exactly. Check `AILawyerAgents` array. System will fall back to default.

### Issue: Reports not specialized

**Solution**: Ensure session data includes `selectedLawyer` with `specialist` field. Check API logs for prompt loading.

## Files Modified

- ✅ `app/api/session-chat/route.ts` - Improved error handling
- ✅ `app/api/legal-report/route.ts` - Integrated dynamic prompts
- ✅ `config/prompts.ts` - New prompts system (NEW FILE)
- ✅ `app/api/prompts/route.ts` - Prompts API endpoint (NEW FILE)
- ✅ `config/PROMPTS_README.md` - Documentation (NEW FILE)

## Files Not Modified (But Relevant)

- `shared/list.ts` - Source of lawyer definitions (no changes needed)
- `app/(routes)/dashboard/lawyer-agent/[sessionId]/page.tsx` - VAPI integration (can be enhanced)

## Conclusion

The dynamic prompts system is now fully implemented for legal report generation. The system automatically detects lawyer specialization and uses the appropriate prompt, making reports more accurate and specialized. VAPI integration can be enhanced in the future using the options outlined above.

