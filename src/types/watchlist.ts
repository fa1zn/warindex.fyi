// Watchlist and stock list types

export interface WatchlistItem {
  ticker: string;
  addedAt: string;
  alertThreshold?: number;
  notes?: string;
}

export interface CuratedList {
  id: string;
  name: string;
  description: string;
  icon: string;
  tickers: string[];
  rationale: string;
  riskLevel: "low" | "medium" | "high";
  category: "defense" | "energy" | "tech" | "diversified";
}

export interface AIRecommendation {
  ticker: string;
  name: string;
  reason: string;
  catalyst: string;
  timeframe: "this_week" | "this_month" | "this_quarter";
  confidence: "high" | "medium" | "low";
}
