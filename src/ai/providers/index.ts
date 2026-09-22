import { IAIProvider } from "./ai-provider.interface";
import { geminiAIProvider } from "./gemini.provider";
import { mockAIProvider } from "./mock.provider";

export * from "./ai-provider.interface";
export * from "./mock.provider";
export * from "./gemini.provider";

/**
 * Returns the configured AI provider based on environment variables
 */
export function getActiveAIProvider(): IAIProvider {
  const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();

  if (provider === "gemini" && process.env.GOOGLE_GEMINI_API_KEY) {
    return geminiAIProvider;
  }

  return mockAIProvider;
}
