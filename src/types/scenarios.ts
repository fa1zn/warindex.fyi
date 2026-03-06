// War scenario simulation types

export interface ScenarioStage {
  level: number; // 1-5 escalation
  name: string;
  description: string;
  probability: number; // 0-100
  impacts: CountryImpact[];
}

export interface CountryImpact {
  countryCode: string;
  gdpImpact: number; // percentage change (e.g., -5 = -5%)
  stockSectorImpacts: Record<string, number>; // sector -> percentage change
  riskLevelChange: "low" | "medium" | "high" | "critical";
  description: string;
}

export interface StockImpact {
  ticker: string;
  baselineChange: number; // expected change at level 1
  scenarioMultiplier: number; // multiplied by escalation level
  reason: string;
}

export interface WarScenario {
  id: string;
  name: string;
  description: string;
  icon: string; // emoji
  triggerEvent: string;
  probability: number; // from prediction markets (0-100)
  affectedCountries: string[]; // country codes
  primaryCountries: string[]; // main combatants
  stages: ScenarioStage[];
  stockImpacts: StockImpact[];
  timeHorizon: "immediate" | "30days" | "90days" | "1year";
  categories: string[]; // e.g., "military", "economic", "cyber"
}

// War game types
export interface GameDecision {
  id: string;
  prompt: string;
  context: string;
  options: DecisionOption[];
  timeLimit?: number; // seconds
}

export interface DecisionOption {
  id: string;
  label: string;
  description: string;
  icon: string;
  consequences: GameConsequence[];
}

export interface GameConsequence {
  type: "escalation" | "market" | "alliance" | "humanitarian" | "economic";
  value: number;
  description: string;
  affectedCountries?: string[];
}

export interface GameState {
  scenarioId: string;
  currentStage: number;
  escalationLevel: number; // 0-100
  marketImpact: number; // cumulative market impact in trillions
  decisionsHistory: Array<{
    decisionId: string;
    optionId: string;
    timestamp: number;
  }>;
  countryStates: Record<string, {
    riskLevel: "low" | "medium" | "high" | "critical";
    gdpChange: number;
    alliance: "neutral" | "allied" | "hostile";
  }>;
  startedAt: number;
  isComplete: boolean;
}

// Simulation result types
export interface SimulationResult {
  scenarioId: string;
  escalationLevel: number;
  totalMarketImpact: number; // in trillions
  countryImpacts: Record<string, {
    gdpChange: number;
    riskLevel: string;
    stockChanges: Record<string, number>;
  }>;
  topGainers: Array<{ ticker: string; change: number; reason: string }>;
  topLosers: Array<{ ticker: string; change: number; reason: string }>;
  affectedSectors: Array<{ sector: string; change: number }>;
}
