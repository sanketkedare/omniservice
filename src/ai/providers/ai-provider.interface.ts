/**
 * ForgeLocal — AI Provider Abstraction Interface
 * Decouples InspectAI diagnostic inference from specific model vendors (Gemini, OpenAI, Anthropic, or Mock).
 */

export interface DiagnosticMediaItem {
  url: string;
  type: "image" | "video" | "audio";
  storageKey?: string;
  timestampSeconds?: number;
}

export interface DiagnosticInput {
  requestId: string;
  categorySlug: string;
  title: string;
  description: string;
  urgency: "routine" | "urgent" | "emergency";
  media: DiagnosticMediaItem[];
  propertyContext?: {
    propertyType?: string;
    yearBuilt?: number;
    knownAppliances?: string[];
  };
}

export interface DetectedFinding {
  title: string;
  description: string;
  type: "component_identified" | "damage_detected" | "risk_flag" | "measurement" | "required_part" | "safety_concern";
  confidence: number; // 0.0 - 1.0
  severity: "info" | "low" | "medium" | "high" | "critical";
  suggestedAction?: string;
  componentName?: string;
  partSpecification?: string;
  boundingBox?: { x: number; y: number; width: number; height: number };
}

export interface SOWTaskItem {
  stepNumber: number;
  taskTitle: string;
  description: string;
  estimatedMinutes: number;
  skillLevelRequired: "apprentice" | "journeyman" | "master";
  safetyPrecautions?: string[];
  toolingRequired?: string[];
}

export interface SOWPartItem {
  partName: string;
  specification: string;
  quantity: number;
  estimatedUnitCostPaise: number;
  oemPreferred?: boolean;
}

export interface DiagnosticResult {
  sessionId: string;
  provider: string;
  modelVersion: string;
  problemSummary: string;
  likelyRootCause: string;
  potentialSecondaryIssues: string[];
  overallConfidence: number; // 0.0 - 1.0
  requiresHumanReview: boolean;
  humanReviewReason?: string;
  findings: DetectedFinding[];
  tasks: SOWTaskItem[];
  parts: SOWPartItem[];
  estimatedLaborMinutes: number;
  tokensConsumed?: {
    input: number;
    output: number;
  };
}

export interface IAIProvider {
  name: string;
  version: string;
  analyzeDiagnostic(input: DiagnosticInput): Promise<DiagnosticResult>;
}
