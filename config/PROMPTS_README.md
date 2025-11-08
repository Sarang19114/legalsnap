# Dynamic Prompts System

This document explains how the dynamic prompts system works in LegalSnap.

## Overview

The prompts system allows the application to dynamically load AI prompts based on lawyer specialization types. This makes the system scalable and allows different lawyer types to have specialized AI behavior.

## Architecture

### Files

- `config/prompts.ts` - Main prompts configuration and utility functions
- `shared/list.ts` - Source of lawyer definitions with `agentPrompt` fields
- `app/api/prompts/route.ts` - API endpoint to fetch prompts programmatically
- `app/api/legal-report/route.ts` - Uses dynamic prompts for report generation

### How It Works

1. **Prompt Storage**: Prompts are stored in `AILawyerAgents` array in `shared/list.ts`
2. **Prompt Mapping**: The `prompts.ts` file builds a map of lawyer types to their prompts
3. **Dynamic Loading**: The `getPromptForLawyerType()` function retrieves prompts based on lawyer specialization
4. **Caching**: Prompts are cached during session to avoid repeated lookups
5. **Fallback**: If a specific prompt isn't found, the system falls back to the default (General Lawyer) prompt

## Usage

### Getting a Prompt

```typescript
import { getPromptForLawyerType } from "@/config/prompts";

// Get prompt for a specific lawyer type
const promptConfig = getPromptForLawyerType("Criminal Lawyer");
console.log(promptConfig.agentPrompt); // VAPI voice assistant prompt
console.log(promptConfig.reportPrompt); // Legal report generation prompt
```

### API Endpoint

You can also fetch prompts via API:

```bash
# Get prompt for a specific lawyer type
GET /api/prompts?lawyerType=Criminal Lawyer

# Get list of available lawyer types
GET /api/prompts
```

### Available Lawyer Types

- General Lawyer
- Criminal Lawyer
- Property Lawyer
- Family Lawyer
- Corporate Lawyer
- Tax Lawyer
- Cyber Lawyer
- Immigration Lawyer
- Labor & Employment Lawyer
- Consumer Rights Lawyer

## Integration with VAPI

### Current Setup

VAPI currently uses a static `NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID` that's configured in the VAPI dashboard. The prompts for VAPI assistants are configured directly in the VAPI dashboard.

### Making VAPI Dynamic

To make VAPI use dynamic prompts:

1. **Option 1: Multiple VAPI Assistants** (Recommended)
   - Create separate VAPI assistants for each lawyer type
   - Store the assistant IDs in the lawyer configuration
   - Update the frontend to use the correct assistant ID based on selected lawyer

2. **Option 2: VAPI Server Messages** (Advanced)
   - Use VAPI's server messages feature to inject prompts dynamically
   - Create an API endpoint that VAPI can call to get the prompt
   - Configure VAPI to fetch prompts from your API before each call

3. **Option 3: VAPI Function Calls** (Advanced)
   - Use VAPI's function calling feature
   - Create a function that returns the appropriate prompt
   - Call this function at the start of each conversation

### Example: Multiple VAPI Assistants

```typescript
// In shared/list.ts, add assistantId to each lawyer
{
  id: 2,
  specialist: "Criminal Lawyer",
  assistantId: "criminal-lawyer-assistant-id", // VAPI assistant ID
  agentPrompt: "...",
  // ...
}

// In lawyer-agent page, use the assistant ID from selected lawyer
const assistantId = sessionDetails.selectedLawyer.assistantId || 
                    process.env.NEXT_PUBLIC_VAPI_VOICE_ASSISTANT_ID;
vapi.start(assistantId);
```

## Legal Report Generation

The legal report generation automatically uses dynamic prompts:

1. When a report is requested, the system extracts the lawyer type from the session
2. It fetches the appropriate report prompt using `getPromptForLawyerType()`
3. The prompt is customized with the lawyer's specialization context
4. The LLM generates a report tailored to that specialization

## Adding New Lawyer Types

To add a new lawyer type:

1. Add the lawyer to `AILawyerAgents` in `shared/list.ts`
2. Include an `agentPrompt` field with the specialized prompt
3. The system will automatically:
   - Add it to the prompts map
   - Make it available via the API
   - Use it for report generation

## Development

### Debugging

In development mode, the system logs:
- Which prompt was loaded for each lawyer type
- Cache hits/misses
- Prompt configuration details

### Testing

Test with different lawyer types:

```typescript
import { getPromptForLawyerType, getAvailableLawyerTypes } from "@/config/prompts";

// Test all lawyer types
const types = getAvailableLawyerTypes();
types.forEach(type => {
  const prompt = getPromptForLawyerType(type);
  console.log(`${type}: ${prompt.reportPrompt.length} chars`);
});
```

## Best Practices

1. **Keep Prompts Focused**: Each prompt should be specific to the lawyer's specialization
2. **Use Consistent Format**: Follow the same prompt structure across all lawyer types
3. **Test Prompt Changes**: Always test prompt changes with the actual AI model
4. **Monitor Performance**: Watch for prompt-related errors in production logs
5. **Cache Management**: Clear cache when updating prompts: `clearPromptCache()`

## Troubleshooting

### Prompt Not Found

If you see "No prompt found" warnings:
- Check that the lawyer type name matches exactly (case-insensitive)
- Verify the lawyer is in `AILawyerAgents` array
- Check console logs for normalization issues

### Wrong Prompt Used

If the wrong prompt is being used:
- Verify the `selectedLawyer.specialist` field is set correctly
- Check that the session data includes the lawyer information
- Review the prompt selection logs in development mode

### Performance Issues

If prompt loading is slow:
- Prompts are cached automatically
- Cache persists for the session duration
- Consider preloading prompts for common lawyer types

