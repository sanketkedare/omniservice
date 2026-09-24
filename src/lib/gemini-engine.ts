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
  "gemini-2.0-flash",
  "gemini-1.5-flash",
  "gemini-1.5-pro",
  "gemini-2.0-flash-lite",
] as const;

export type GeminiModelName = (typeof GEMINI_MODEL_POOL)[number];

export interface GeminiMediaPart {
  mimeType: string;
  dataBase64?: string;
  url?: string;
}

export interface GeminiGenerateOptions {
  systemPrompt?: string;
  userPrompt: string;
  mediaParts?: GeminiMediaPart[];
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
   * Execute content generation with seamless multi-model failover and multimodal media ingestion
   */
  async generateContent(options: GeminiGenerateOptions): Promise<GeminiGenerateResult> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY is not configured");
    }

    const {
      systemPrompt,
      userPrompt,
      mediaParts = [],
      responseMimeType = "text/plain",
      temperature = 0.2,
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

    // Prepare multimodal user parts
    const userParts: any[] = [];

    // Attach media items as inlineData base64
    for (const media of mediaParts) {
      if (media.dataBase64) {
        userParts.push({
          inlineData: {
            mimeType: media.mimeType,
            data: media.dataBase64.replace(/^data:[^;]+;base64,/, ""),
          },
        });
      } else if (media.url && (media.url.startsWith("http://") || media.url.startsWith("https://"))) {
        try {
          const fetchRes = await fetch(media.url, { signal: AbortSignal.timeout(6000) });
          if (fetchRes.ok) {
            const buf = await fetchRes.arrayBuffer();
            const b64 = Buffer.from(buf).toString("base64");
            userParts.push({
              inlineData: {
                mimeType: media.mimeType || "image/jpeg",
                data: b64,
              },
            });
          }
        } catch {
          // If remote fetch fails, pass text reference
          userParts.push({
            text: `[Attached media reference: ${media.url}]`,
          });
        }
      }
    }

    // Append text prompt
    userParts.push({
      text: systemPrompt
        ? `${systemPrompt}\n\nCustomer Diagnostic Intake & Physical Media Verification:\n${userPrompt}`
        : userPrompt,
    });

    contents.push({
      role: "user",
      parts: userParts,
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
