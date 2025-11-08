import OpenAI from "openai"

// Check if OPEN_ROUTER_API_KEY is provided
if (!process.env.OPEN_ROUTER_API_KEY) {
  console.error('❌ OPEN_ROUTER_API_KEY environment variable is not set!');
  console.error('Please create a .env.local file with your OpenRouter API key.');
  console.error('Get your API key from: https://openrouter.ai/');
}

export const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPEN_ROUTER_API_KEY,
})