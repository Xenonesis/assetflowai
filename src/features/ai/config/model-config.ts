import { groq } from "@ai-sdk/groq";

// This configures the Groq provider to use the preferred model.
// Defaulting to Llama 3.3 70B Versatile for high-speed, accurate tool calling.
export const defaultModel = groq("llama-3.3-70b-versatile");
