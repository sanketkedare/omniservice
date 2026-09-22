import {
  IAIProvider,
  DiagnosticInput,
  DiagnosticResult,
  DetectedFinding,
  SOWTaskItem,
  SOWPartItem,
} from "./ai-provider.interface";

export class MockAIProvider implements IAIProvider {
  public readonly name = "mock-inspect-ai";
  public readonly version = "1.0.0-deterministic";

  async analyzeDiagnostic(input: DiagnosticInput): Promise<DiagnosticResult> {
    const { categorySlug, title, description, urgency } = input;
    const cat = categorySlug.toLowerCase();
    const sessionId = `diag_sess_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    // Tailored trade diagnostic knowledge
    if (cat.includes("plumb")) {
      return {
        sessionId,
        provider: this.name,
        modelVersion: this.version,
        problemSummary: "Hydraulic pressure failure at P-trap compression slip joint causing continuous drainage seepage under kitchen sink.",
        likelyRootCause: "Degraded ethylene propylene diene monomer (EPDM) washer ring combined with stripped threaded PVC coupling.",
        potentialSecondaryIssues: [
          "Cabinet baseboard swelling due to moisture absorption",
          "Secondary slow drain flow indicating grease accumulation further down horizontal run",
        ],
        overallConfidence: 0.94,
        requiresHumanReview: false,
        findings: [
          {
            title: "P-Trap Joint Gasket Extrusion",
            description: "Visual evidence demonstrates water bead formation along circumference of 32mm slip nut joint at 1.2 Hz drip cadence.",
            type: "damage_detected",
            confidence: 0.96,
            severity: "medium",
            componentName: "32mm PVC P-Trap Coupling",
            partSpecification: "32mm EPDM Beveled Slip Nut Washer",
            suggestedAction: "Disassemble trap, clean threads, replace slip washer, re-torque with PTFE tape.",
          },
          {
            title: "Corrosion on Chrome Tailpiece",
            description: "Surface oxidation observed on vertical brass tailpiece pipe.",
            type: "risk_flag",
            confidence: 0.88,
            severity: "low",
            suggestedAction: "Apply rust inhibitor and inspect wall thickness.",
          },
        ],
        tasks: [
          {
            stepNumber: 1,
            taskTitle: "Isolate Drainage & Catch Basin Setup",
            description: "Place spill basin beneath trap and isolate water supply to avoid accidental drainage during repair.",
            estimatedMinutes: 5,
            skillLevelRequired: "apprentice",
            safetyPrecautions: ["Wear nitrile gloves", "Ensure workspace ventilation"],
          },
          {
            stepNumber: 2,
            taskTitle: "Disassemble & Inspect P-Trap Assembly",
            description: "Loosen slip nuts by hand or with strap wrench. Inspect internal baffle for clogs and examine threads for cross-threading.",
            estimatedMinutes: 10,
            skillLevelRequired: "journeyman",
            toolingRequired: ["Strap wrench", "Drain bucket", "Flashlight"],
          },
          {
            stepNumber: 3,
            taskTitle: "Fit New Washer & Apply PTFE Seal",
            description: "Install new 32mm beveled washer with bevel facing downstream. Apply 3 wraps of PTFE tape to male threads.",
            estimatedMinutes: 10,
            skillLevelRequired: "journeyman",
          },
          {
            stepNumber: 4,
            taskTitle: "Full Hydraulic Static & Dynamic Flow Testing",
            description: "Fill sink to 80% capacity with stopper engaged. Release stopper to create max head pressure. Check all joints with dry paper towel.",
            estimatedMinutes: 10,
            skillLevelRequired: "journeyman",
          },
        ],
        parts: [
          {
            partName: "32mm Beveled Slip Joint Washer",
            specification: "EPDM High-Elasticity Rubber",
            quantity: 2,
            estimatedUnitCostPaise: 4000, // ₹40
            oemPreferred: true,
          },
          {
            partName: "PTFE High Density Thread Seal Tape",
            specification: "12mm x 0.1mm x 10m Yellow Heavy Duty",
            quantity: 1,
            estimatedUnitCostPaise: 6000, // ₹60
          },
        ],
        estimatedLaborMinutes: 35,
        tokensConsumed: { input: 1240, output: 680 },
      };
    }

    if (cat.includes("hvac") || cat.includes("cool")) {
      return {
        sessionId,
        provider: this.name,
        modelVersion: this.version,
        problemSummary: "Compressor starting locked rotor current surge causing 16A miniature circuit breaker (MCB) trip within 3-5 minutes of cooling demand.",
        likelyRootCause: "Weakened dual-run motor capacitor exhibiting out-of-tolerance capacitance drop below 40µF threshold.",
        potentialSecondaryIssues: [
          "Outdoor condensing coil fin clogging elevating compressor head temperature",
          "Terminal spade connector oxidation causing thermal resistance",
        ],
        overallConfidence: 0.91,
        requiresHumanReview: false,
        findings: [
          {
            title: "Capacitor Bulging / Value Drift",
            description: "Audible motor stutter at compressor startup followed by instantaneous circuit interrupt.",
            type: "damage_detected",
            confidence: 0.93,
            severity: "high",
            componentName: "Dual Run Motor Capacitor",
            partSpecification: "45µF + 5µF 450VAC Round Aluminum Can",
            suggestedAction: "Discharge capacitor, measure with microfarad meter, replace with OEM certified unit.",
          },
          {
            title: "Condenser Fin Debris Restriction",
            description: "Airflow impedance on rear heat exchange coil surface.",
            type: "risk_flag",
            confidence: 0.89,
            severity: "medium",
            suggestedAction: "Chemical foam coil jet cleaning recommended.",
          },
        ],
        tasks: [
          {
            stepNumber: 1,
            taskTitle: "Electrical Lockout & Capacitor Safe Discharge",
            description: "Disconnect 16A double-pole isolator switch. Safely discharge high-voltage capacitor using 20kΩ 5W bleeder resistor.",
            estimatedMinutes: 8,
            skillLevelRequired: "journeyman",
            safetyPrecautions: ["Verify 0V with calibrated digital multimeter", "Wear insulated safety boots"],
          },
          {
            stepNumber: 2,
            taskTitle: "Capacitance Metric & Winding Insulation Test",
            description: "Measure microfarad value between C-HERM and C-FAN terminals. Test compressor hermetic winding resistance to ground.",
            estimatedMinutes: 12,
            skillLevelRequired: "master",
            toolingRequired: ["Fluke 116 HVAC Multimeter", "Megohmmeter"],
          },
          {
            stepNumber: 3,
            taskTitle: "OEM Dual Run Capacitor Replacement",
            description: "Install 45µF+5µF 450VAC capacitor. Crimp high-temperature flag terminals and secure mounting bracket.",
            estimatedMinutes: 15,
            skillLevelRequired: "journeyman",
          },
          {
            stepNumber: 4,
            taskTitle: "Startup Amp Draw & Refrigerant Cycle Verification",
            description: "Measure Run Load Amps (RLA) and Starting Locked Rotor Amps (LRA) with clamp meter. Verify 12°C delta T across indoor coil.",
            estimatedMinutes: 15,
            skillLevelRequired: "master",
          },
        ],
        parts: [
          {
            partName: "45µF + 5µF Dual Run Motor Capacitor",
            specification: "450VAC 50/60Hz Round Can 10,000 AFC Protected",
            quantity: 1,
            estimatedUnitCostPaise: 45000, // ₹450
            oemPreferred: true,
          },
          {
            partName: "Insulated Heavy Duty Flag Terminals",
            specification: "6.3mm Female Spade High-Temp Silver Plated",
            quantity: 3,
            estimatedUnitCostPaise: 5000, // ₹50
          },
        ],
        estimatedLaborMinutes: 50,
        tokensConsumed: { input: 1480, output: 750 },
      };
    }

    if (cat.includes("electr")) {
      return {
        sessionId,
        provider: this.name,
        modelVersion: this.version,
        problemSummary: "Intermittent ground fault and thermal trip on distribution board sub-circuit.",
        likelyRootCause: "Loose neutral busbar terminal contact combined with degraded modular switch contact resistance.",
        potentialSecondaryIssues: ["Phase-neutral wire insulation thermal discoloration"],
        overallConfidence: 0.90,
        requiresHumanReview: false,
        findings: [
          {
            title: "Terminal Arcing & Carbonization",
            description: "Signs of contact oxidation and micro-arcing at switch terminal screw connection.",
            type: "safety_concern",
            confidence: 0.92,
            severity: "high",
            componentName: "16A Modular Switch & Socket",
            suggestedAction: "Replace modular switch assembly, strip back heat-damaged conductor by 20mm.",
          },
        ],
        tasks: [
          {
            stepNumber: 1,
            taskTitle: "Sub-Panel De-energization & Voltage Verification",
            description: "Trip main RCCB, verify dead line with non-contact voltage tester and multimeter.",
            estimatedMinutes: 5,
            skillLevelRequired: "journeyman",
          },
          {
            stepNumber: 2,
            taskTitle: "Modular Plate Disassembly & Conductor Inspection",
            description: "Remove front decorative fascia, unscrew chassis, inspect conductor gauge and insulation.",
            estimatedMinutes: 10,
            skillLevelRequired: "journeyman",
          },
          {
            stepNumber: 3,
            taskTitle: "Install Brand New Modular Switch & Re-terminate",
            description: "Terminate copper cores with calibrated torque screwdriver. Tighten terminal to 1.2 N·m.",
            estimatedMinutes: 15,
            skillLevelRequired: "journeyman",
          },
        ],
        parts: [
          {
            partName: "16A Modular Switch Mechanism",
            specification: "Silver Alloy Contacts 240V AC ISI Marked",
            quantity: 1,
            estimatedUnitCostPaise: 18000, // ₹180
            oemPreferred: true,
          },
        ],
        estimatedLaborMinutes: 30,
        tokensConsumed: { input: 1100, output: 520 },
      };
    }

    // Generic fallback for custom/other categories
    return {
      sessionId,
      provider: this.name,
      modelVersion: this.version,
      problemSummary: `Standard diagnostic assessment for ${title || "reported household issue"}.`,
      likelyRootCause: "Mechanical wear or component misalignment identified from customer symptom intake.",
      potentialSecondaryIssues: ["Check adjacent connections and fasteners during physical inspection"],
      overallConfidence: 0.86,
      requiresHumanReview: false,
      findings: [
        {
          title: "Component Inspection Required",
          description: description || "Physical on-site inspection of operating tolerances recommended.",
          type: "component_identified",
          confidence: 0.88,
          severity: "low",
          suggestedAction: "Disassemble protective cover, clean assembly, check for loose fasteners.",
        },
      ],
      tasks: [
        {
          stepNumber: 1,
          taskTitle: "Initial Safety & Diagnostic Assessment",
          description: "Perform visual, mechanical, and electrical isolation check on equipment.",
          estimatedMinutes: 10,
          skillLevelRequired: "journeyman",
        },
        {
          stepNumber: 2,
          taskTitle: "Component Servicing & Alignment",
          description: "Adjust tolerances, replace worn consumable fasteners, lubricate moving assemblies.",
          estimatedMinutes: 20,
          skillLevelRequired: "journeyman",
        },
      ],
      parts: [
        {
          partName: "Standard Consumable Seal & Hardware Kit",
          specification: "Universal Mounting & Gasket Hardware",
          quantity: 1,
          estimatedUnitCostPaise: 15000, // ₹150
        },
      ],
      estimatedLaborMinutes: 30,
      tokensConsumed: { input: 950, output: 400 },
    };
  }
}

export const mockAIProvider = new MockAIProvider();
