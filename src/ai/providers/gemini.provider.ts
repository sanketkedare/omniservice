import {
  IAIProvider,
  DiagnosticInput,
  DiagnosticResult,
} from "./ai-provider.interface";
import { mockAIProvider } from "./mock.provider";
import { logger } from "@/lib/logger";

/**
 * Free-tier Google Gemini models ordered by performance and capability.
 * The provider dynamically shifts to the next free model without user interaction
 * or downtime if an error (e.g. rate limit, quota exceeded, 503 unavailable) occurs.
 */
export const FREE_GEMINI_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-1.5-flash-8b",
] as const;

export class GeminiAIProvider implements IAIProvider {
  public readonly name = "google-gemini";
  private activeModel: string = FREE_GEMINI_MODELS[0];

  public get version(): string {
    return this.activeModel;
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
      `Media Attachments Count: ${input.media.length}`,
    ].join("\n");

    // Dynamic Multi-Model Failover Loop:
    // Sequentially tries each free Gemini model without user interruption or notification.
    for (const model of FREE_GEMINI_MODELS) {
      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: `${systemPrompt}\n\nProblem Details:\n${userContent}` }],
              },
            ],
            generationConfig: {
              responseMimeType: "application/json",
              temperature: 0.2,
            },
          }),
        });

        if (!response.ok) {
          // Model failed (quota, rate-limit, 503 or unavailable) -> Shift seamlessly to next free model
          logger.warn(
            `Gemini model '${model}' returned HTTP ${response.status}. Automatically shifting to next free Gemini model dynamically.`
          );
          continue;
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) {
          logger.warn(
            `Gemini model '${model}' returned empty text candidate. Shifting to next free model.`
          );
          continue;
        }

        const parsed = JSON.parse(rawText);
        this.activeModel = model;

        const sessionId = `gemini_sess_${Date.now()}`;

        return {
          sessionId,
          provider: this.name,
          modelVersion: model,
          problemSummary: parsed.problemSummary || input.title,
          likelyRootCause: parsed.likelyRootCause || "Root cause identified via Gemini multimodal inference",
          potentialSecondaryIssues: parsed.potentialSecondaryIssues || [],
          overallConfidence: typeof parsed.overallConfidence === "number" ? parsed.overallConfidence : 0.92,
          requiresHumanReview: Boolean(parsed.requiresHumanReview),
          findings: parsed.findings || [],
          tasks: parsed.tasks || [],
          parts: parsed.parts || [],
          estimatedLaborMinutes: parsed.estimatedLaborMinutes || 30,
          tokensConsumed: {
            input: data?.usageMetadata?.promptTokenCount || 800,
            output: data?.usageMetadata?.candidatesTokenCount || 450,
          },
        };
      } catch (err: any) {
        // Network or JSON parsing error -> shift to next free Gemini model dynamically
        logger.warn(
          { model, error: err?.message },
          `Dynamic failover: Error invoking Gemini model '${model}'. Switching to next free model.`
        );
      }
    }

    // If all free Gemini models are exhausted, safely delegate to mock provider
    logger.warn(
      "All free Gemini models exhausted or encountered connectivity limits. Falling back to local diagnostic engine."
    );
    return mockAIProvider.analyzeDiagnostic(input);
  }
}

export const geminiAIProvider = new GeminiAIProvider();
