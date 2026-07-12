import { createOpenRouter } from "@openrouter/ai-sdk-provider";

// This configures the OpenRouter provider to use the preferred model
// Defaulting to Claude 3.5 Sonnet or a fast Gemini model depending on needs

export const openrouter = createOpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

// Use a fast, capable model by default
export const defaultModel = openrouter("anthropic/claude-3.5-sonnet");
