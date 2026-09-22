/**
 * OmniService AI — Multi-Model Dynamic Gemini Failover & Rotation Engine
 *
 * Automatically rotates and fails over across available Google Generative AI models.
 * If a model returns 404 (model retired), 429 (rate/quota limit), 503 (high demand spike),
 * or empty response, the engine instantaneously switches to the next model in the pool
 * without interrupting the customer or failing the diagnostic inference.
 */

import { logger } from "@/lib/logger";

export const GEMINI_MODEL_POOL = [
  "gemini-3.5-flash",
  "gemini-3.1-flash-lite",
  "gemini-3-flash-preview",
  "gemma-4-31b-it",
  "gemini-flash-latest",
  "gemini-2.5-flash",
] as const;

export type GeminiModelName = (typeof GEMINI_MODEL_POOL)[number];

export interface GeminiGenerateOptions {
  systemPrompt?: string;
  userPrompt: string;
  responseMimeType?: "text/plain" | "application/json";
  temperature?: number;
  maxOutputTokens?: number;
  history?: Array<{ role: "user" | "model" | "assistant"; parts: Array<{ text: string }> }>;
}

export interface GeminiGenerateResult {
  text: string;
  modelUsed: string;
  tokensConsumed?: {
    input?: number;
    output?: number;
  };
}

class GeminiMultiModelEngine {
  private activeModelIndex = 0;

  public get currentModel(): string {
    return GEMINI_MODEL_POOL[this.activeModelIndex] ?? GEMINI_MODEL_POOL[0];
  }

  /**
   * Execute content generation with seamless multi-model failover
   */
  async generateContent(options: GeminiGenerateOptions): Promise<GeminiGenerateResult> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }

    const {
      systemPrompt,
      userPrompt,
      responseMimeType = "text/plain",
      temperature = 0.3,
      maxOutputTokens,
      history = [],
    } = options;

    const contents: any[] = [];

    // Format chat history if provided
    for (const h of history) {
      contents.push({
        role: h.role === "assistant" ? "model" : h.role,
        parts: h.parts,
      });
    }

    // Append latest prompt
    contents.push({
      role: "user",
      parts: [
        {
          text: systemPrompt
            ? `${systemPrompt}\n\nCustomer Request / Diagnostic Inquiry:\n${userPrompt}`
            : userPrompt,
        },
      ],
    });

    // Try models in rotation starting from the current active model
    const totalModels = GEMINI_MODEL_POOL.length;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < totalModels; attempt++) {
      const modelIndex = (this.activeModelIndex + attempt) % totalModels;
      const model = (GEMINI_MODEL_POOL[modelIndex] || GEMINI_MODEL_POOL[0]) as string;

      try {
        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

        const payload: any = {
          contents,
          generationConfig: {
            temperature,
            ...(responseMimeType === "application/json" ? { responseMimeType: "application/json" } : {}),
            ...(maxOutputTokens ? { maxOutputTokens } : {}),
          },
        };

        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errBody = await response.text().catch(() => "");
          logger.warn(
            { model, status: response.status, err: errBody.slice(0, 160) },
            `Gemini model '${model}' returned HTTP ${response.status}. Automatically shifting to next model in pool.`
          );
          continue; // Shift to next model
        }

        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText || typeof rawText !== "string") {
          logger.warn(
            { model },
            `Gemini model '${model}' returned empty text candidate. Shifting to next model.`
          );
          continue;
        }

        // Successfully generated! Update active model index for subsequent calls
        this.activeModelIndex = modelIndex;

        return {
          text: rawText.trim(),
          modelUsed: model,
          tokensConsumed: {
            input: data?.usageMetadata?.promptTokenCount,
            output: data?.usageMetadata?.candidatesTokenCount,
          },
        };
      } catch (err: any) {
        lastError = err;
        logger.warn(
          { model, error: err?.message },
          `Dynamic failover: Error invoking Gemini model '${model}'. Switching to next model in pool.`
        );
      }
    }

    throw new Error(
      `All Gemini models in pool were exhausted or unreachable. Last error: ${lastError?.message || "Unknown error"}`
    );
  }
}

export const geminiEngine = new GeminiMultiModelEngine();
