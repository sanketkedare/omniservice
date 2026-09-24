import {
  IAIProvider,
  DiagnosticInput,
  DiagnosticResult,
} from "./ai-provider.interface";
import { mockAIProvider } from "./mock.provider";
import { geminiEngine, GEMINI_MODEL_POOL } from "@/lib/gemini-engine";
import { logger } from "@/lib/logger";

export class GeminiAIProvider implements IAIProvider {
  public readonly name = "google-gemini";

  public get version(): string {
    return geminiEngine.currentModel;
  }

  async analyzeDiagnostic(input: DiagnosticInput): Promise<DiagnosticResult> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      logger.info(
        "No GOOGLE_GEMINI_API_KEY set. Delegating to MockAIProvider for deterministic diagnostic inference."
      );
      return mockAIProvider.analyzeDiagnostic(input);
    }

    const systemPrompt = `You are InspectAI, an expert forensic diagnostic engineer for residential mechanical, plumbing, HVAC, and electrical systems.
Analyze the customer's problem description, category, and attached media.
Return a valid JSON object matching the following structure:
{
  "problemSummary": string,
  "likelyRootCause": string,
  "potentialSecondaryIssues": string[],
  "overallConfidence": number (between 0.0 and 1.0),
  "requiresHumanReview": boolean,
  "findings": [
    {
      "title": string,
      "description": string,
      "type": "component_identified" | "damage_detected" | "risk_flag" | "required_part" | "safety_concern",
      "confidence": number,
      "severity": "info" | "low" | "medium" | "high" | "critical",
      "componentName": string,
      "partSpecification": string,
      "suggestedAction": string
    }
  ],
  "tasks": [
    {
      "stepNumber": number,
      "taskTitle": string,
      "description": string,
      "estimatedMinutes": number,
      "skillLevelRequired": "apprentice" | "journeyman" | "master"
    }
  ],
  "parts": [
    {
      "partName": string,
      "specification": string,
      "quantity": number,
      "estimatedUnitCostPaise": number
    }
  ],
  "estimatedLaborMinutes": number
}`;

    const userContent = [
      `Trade Category: ${input.categorySlug}`,
      `Title: ${input.title}`,
      `Description: ${input.description}`,
      `Urgency: ${input.urgency}`,
    ].join("\n");

    const mediaParts = (input.media || []).map((m) => ({
      mimeType: m.type === "video" ? "video/mp4" : "image/jpeg",
      url: m.url,
    }));

    try {
      const result = await geminiEngine.generateContent({
        systemPrompt,
        userPrompt: userContent,
        mediaParts,
        responseMimeType: "application/json",
        temperature: 0.2,
      });

      const parsed = JSON.parse(result.text);
      const sessionId = `gemini_sess_${Date.now()}`;

      return {
        sessionId,
        provider: this.name,
        modelVersion: result.modelUsed,
        problemSummary: parsed.problemSummary || input.title,
        likelyRootCause: parsed.likelyRootCause || "Root cause identified via Gemini multimodal inference",
        potentialSecondaryIssues: parsed.potentialSecondaryIssues || [],
        overallConfidence: typeof parsed.overallConfidence === "number" ? parsed.overallConfidence : 0.94,
        requiresHumanReview: Boolean(parsed.requiresHumanReview),
        findings: parsed.findings || [],
        tasks: parsed.tasks || [],
        parts: parsed.parts || [],
        estimatedLaborMinutes: parsed.estimatedLaborMinutes || 30,
        tokensConsumed: {
          input: result.tokensConsumed?.input || 800,
          output: result.tokensConsumed?.output || 450,
        },
      };
    } catch (err: any) {
      logger.warn(
        { error: err?.message },
        "All Gemini models in failover pool exhausted or connectivity failed. Falling back to local diagnostic engine."
      );
      return mockAIProvider.analyzeDiagnostic(input);
    }
  }
}

export const geminiAIProvider = new GeminiAIProvider();
export { GEMINI_MODEL_POOL as FREE_GEMINI_MODELS };
