import { NextResponse } from "next/server";

export interface PredictionMarket {
  id: string;
  question: string;
  probability: number;
  volume: number;
  url: string;
  platform: "polymarket" | "kalshi";
  category: string;
  country?: string;
  change24h?: number;
}

// Polymarket CLOB API endpoints
const POLYMARKET_API = "https://clob.polymarket.com";
const GAMMA_API = "https://gamma-api.polymarket.com";

// Geopolitical market slugs/keywords we care about
const GEO_KEYWORDS = [
  "china", "taiwan", "russia", "ukraine", "israel", "iran", "war",
  "military", "invasion", "ceasefire", "nato", "north korea", "nuclear",
  "conflict", "strike", "attack", "troops", "sanctions"
];

async function fetchPolymarketMarkets(): Promise<PredictionMarket[]> {
  try {
    // Fetch active markets from Polymarket's public API
    const res = await fetch(`${GAMMA_API}/markets?closed=false&limit=100`, {
      next: { revalidate: 60 }, // 1 min cache
      headers: {
        "Accept": "application/json",
      }
    });

    if (!res.ok) {
      console.error("Polymarket API error:", res.status);
      return [];
    }

    const markets = await res.json();

    // Filter for geopolitical markets
    const geoMarkets = markets.filter((m: any) => {
      const text = `${m.question} ${m.description || ""}`.toLowerCase();
      return GEO_KEYWORDS.some(kw => text.includes(kw));
    });

    return geoMarkets.map((m: any) => ({
      id: m.id || m.conditionId,
      question: m.question,
      probability: Math.round((m.outcomePrices?.[0] || m.bestAsk || 0.5) * 100),
      volume: m.volume || m.liquidityNum || 0,
      url: `https://polymarket.com/event/${m.slug || m.id}`,
      platform: "polymarket" as const,
      category: categorizeMarket(m.question),
      country: mapToCountry(m.question),
      change24h: m.change24h || 0,
    }));
  } catch (error) {
    console.error("Polymarket fetch error:", error);
    return [];
  }
}

// Fetch specific markets by slug
async function fetchSpecificMarkets(): Promise<PredictionMarket[]> {
  const slugs = [
    "china-x-taiwan-military-clash-before-2027",
    "will-china-invade-taiwan-before-2027",
    "russia-x-ukraine-ceasefire-by-march-31-2026",
    "russia-x-ukraine-ceasefire-before-2027",
    "israel-strikes-iran-by-june-30-2026",
  ];

  const markets: PredictionMarket[] = [];

  for (const slug of slugs) {
    try {
      const res = await fetch(`${GAMMA_API}/markets/${slug}`, {
        next: { revalidate: 60 },
      });

      if (res.ok) {
        const m = await res.json();
        markets.push({
          id: m.id || slug,
          question: m.question,
          probability: Math.round((m.outcomePrices?.[0] || 0.5) * 100),
          volume: m.volume || 0,
          url: `https://polymarket.com/event/${slug}`,
          platform: "polymarket",
          category: categorizeMarket(m.question),
          country: mapToCountry(m.question),
          change24h: m.change24h || 0,
        });
      }
    } catch (e) {
      // Skip failed fetches
    }
  }

  return markets;
}

// Kalshi API (public endpoints)
async function fetchKalshiMarkets(): Promise<PredictionMarket[]> {
  try {
    // Kalshi public API
    const res = await fetch("https://api.elections.kalshi.com/v1/markets?status=open&limit=50", {
      next: { revalidate: 60 },
    });

    if (!res.ok) return [];

    const data = await res.json();
    const markets = data.markets || [];

    // Filter for geopolitical
    const geoMarkets = markets.filter((m: any) => {
      const text = `${m.title} ${m.subtitle || ""}`.toLowerCase();
      return GEO_KEYWORDS.some(kw => text.includes(kw)) ||
        text.includes("oil") || text.includes("wti") || text.includes("energy");
    });

    return geoMarkets.map((m: any) => ({
      id: m.ticker,
      question: m.title,
      probability: Math.round((m.last_price || m.yes_ask || 0.5) * 100),
      volume: m.volume || 0,
      url: `https://kalshi.com/markets/${m.ticker_name || m.ticker}`,
      platform: "kalshi" as const,
      category: categorizeMarket(m.title),
      country: mapToCountry(m.title),
    }));
  } catch (error) {
    console.error("Kalshi fetch error:", error);
    return [];
  }
}

function categorizeMarket(question: string): string {
  const lower = question.toLowerCase();
  if (lower.includes("china") || lower.includes("taiwan")) return "China-Taiwan";
  if (lower.includes("russia") || lower.includes("ukraine")) return "Russia-Ukraine";
  if (lower.includes("israel") || lower.includes("iran")) return "Middle East";
  if (lower.includes("korea")) return "Korean Peninsula";
  if (lower.includes("oil") || lower.includes("energy")) return "Energy";
  if (lower.includes("nato")) return "NATO";
  return "Global";
}

function mapToCountry(question: string): string | undefined {
  const lower = question.toLowerCase();
  if (lower.includes("taiwan")) return "TWN";
  if (lower.includes("china")) return "CHN";
  if (lower.includes("russia")) return "RUS";
  if (lower.includes("ukraine")) return "UKR";
  if (lower.includes("israel")) return "ISR";
  if (lower.includes("iran")) return "IRN";
  if (lower.includes("korea")) return lower.includes("north") ? "PRK" : "KOR";
  return undefined;
}

export async function GET() {
  try {
    // Fetch from multiple sources in parallel
    const [polymarkets, specificMarkets, kalshiMarkets] = await Promise.all([
      fetchPolymarketMarkets(),
      fetchSpecificMarkets(),
      fetchKalshiMarkets(),
    ]);

    // Combine and dedupe
    const allMarkets = [...specificMarkets, ...polymarkets, ...kalshiMarkets];

    // Dedupe by question similarity
    const seen = new Set<string>();
    const unique = allMarkets.filter(m => {
      const key = m.question.toLowerCase().slice(0, 40);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    // Sort by volume
    unique.sort((a, b) => (b.volume || 0) - (a.volume || 0));

    return NextResponse.json({
      markets: unique.slice(0, 25),
      lastUpdated: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Prediction markets API error:", error);
    return NextResponse.json({ markets: [], error: "Failed to fetch markets" }, { status: 500 });
  }
}
