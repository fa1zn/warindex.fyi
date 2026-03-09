import { Signal } from "@/components/mobile/SignalCard";

export const signals: Signal[] = [
  {
    country: {
      code: "TWN",
      name: "Taiwan",
      flag: "🇹🇼",
      riskLevel: "high",
    },
    long: {
      ticker: "LMT",
      name: "Lockheed Martin",
      upside: "+25-40%",
      thesis: "Taiwan defense packages = $19B backlog. Every China headline pumps this.",
    },
    short: {
      ticker: "TSM",
      name: "TSMC",
      downside: "-30-50%",
      thesis: "90% of advanced chips. Blockade = instant supply chain collapse.",
    },
    prediction: {
      platform: "polymarket",
      question: "China blockades Taiwan in 2025?",
      odds: 8,
      edge: "Market underpricing tail risk. Defense stocks hedge for free.",
      url: "https://polymarket.com/event/china-x-taiwan-military-clash-before-2027",
    },
    catalyst: "PLA exercises, US carrier movements, or TSMC earnings mentioning 'geopolitical risk'",
    timestamp: "2025-03-07",
  },
  {
    country: {
      code: "RUS",
      name: "Russia",
      flag: "🇷🇺",
      riskLevel: "critical",
    },
    long: {
      ticker: "EQNR.OL",
      name: "Equinor",
      upside: "+15-25%",
      thesis: "Norway fills the gas gap. Every Russian pipeline attack = Equinor pump.",
    },
    short: {
      ticker: "GAZP",
      name: "Gazprom",
      downside: "-20-40%",
      thesis: "80% revenue collapse. No path back to Europe. Ever.",
    },
    prediction: {
      platform: "polymarket",
      question: "Russia-Ukraine ceasefire in 2025?",
      odds: 32,
      edge: "Ceasefire = sanctions stay. No upside for Russian assets either way.",
      url: "https://polymarket.com/event/russia-x-ukraine-ceasefire-before-2027",
    },
    catalyst: "Trump peace talks, Zelensky statements, or major territorial shifts",
    timestamp: "2025-03-07",
  },
  {
    country: {
      code: "ISR",
      name: "Israel",
      flag: "🇮🇱",
      riskLevel: "high",
    },
    long: {
      ticker: "ESLT",
      name: "Elbit Systems",
      upside: "+25-35%",
      thesis: "Iron Dome demand global. Combat-proven = premium pricing.",
    },
    short: {
      ticker: "TEVA",
      name: "Teva Pharma",
      downside: "-10-20%",
      thesis: "Regional instability + supply chain risk. Generic margins already thin.",
    },
    prediction: {
      platform: "polymarket",
      question: "Israel strikes Iran nuclear sites in 2025?",
      odds: 28,
      edge: "Oil above $100 if this hits. Energy longs print.",
      url: "https://polymarket.com/event/israel-strikes-iran-by-june-30-2026",
    },
    catalyst: "IAEA report, Israeli cabinet leaks, or Iranian enrichment announcements",
    timestamp: "2025-03-07",
  },
  {
    country: {
      code: "UKR",
      name: "Ukraine",
      flag: "🇺🇦",
      riskLevel: "critical",
    },
    long: {
      ticker: "RHM",
      name: "Rheinmetall",
      upside: "+30-45%",
      thesis: "€100B German defense fund. Ammo shortage = infinite orders.",
    },
    short: {
      ticker: "BAS",
      name: "BASF",
      downside: "-10-15%",
      thesis: "German energy costs 3x pre-war. Industrial base relocating permanently.",
    },
    prediction: {
      platform: "kalshi",
      question: "Ukraine joins NATO by 2027?",
      odds: 12,
      edge: "Low odds but defense stocks win regardless of outcome.",
      url: "https://kalshi.com/browse/politics/world",
    },
    catalyst: "NATO summit, Biden/Trump Ukraine policy, or major battlefield shifts",
    timestamp: "2025-03-07",
  },
  {
    country: {
      code: "IRN",
      name: "Iran",
      flag: "🇮🇷",
      riskLevel: "critical",
    },
    long: {
      ticker: "CVX",
      name: "Chevron",
      upside: "+20-30%",
      thesis: "Strait of Hormuz disruption = oil to $120+. CVX prints.",
    },
    short: {
      ticker: "DAL",
      name: "Delta Airlines",
      downside: "-15-25%",
      thesis: "Oil spike = jet fuel costs explode. Airlines get crushed.",
    },
    prediction: {
      platform: "kalshi",
      question: "Iran nuclear deal revival by 2026?",
      odds: 15,
      edge: "No deal = sanctions stay. Oil stays elevated.",
      url: "https://kalshi.com/browse/politics/world",
    },
    catalyst: "IAEA inspections, Israeli intelligence leaks, or US election rhetoric",
    timestamp: "2025-03-07",
  },
  {
    country: {
      code: "KOR",
      name: "South Korea",
      flag: "🇰🇷",
      riskLevel: "medium",
    },
    long: {
      ticker: "000660.KS",
      name: "SK Hynix",
      upside: "+22-35%",
      thesis: "HBM monopoly for AI chips. Nvidia needs them. No alternative.",
    },
    short: {
      ticker: "SSNLF",
      name: "Samsung",
      downside: "-10-15%",
      thesis: "Losing HBM race to SK Hynix. Memory commoditizing.",
    },
    prediction: {
      platform: "kalshi",
      question: "North Korea tests ICBM in 2025?",
      odds: 72,
      edge: "Priced in. Defense stocks don't move on NK anymore.",
      url: "https://kalshi.com/browse/politics/world",
    },
    catalyst: "Kim Jong Un statements, satellite launches, or US-SK military exercises",
    timestamp: "2025-03-07",
  },
  {
    country: {
      code: "CHN",
      name: "China",
      flag: "🇨🇳",
      riskLevel: "medium",
    },
    long: {
      ticker: "PLTR",
      name: "Palantir",
      upside: "+25-40%",
      thesis: "AI defense contracts. Every China tension = DoD budget pump.",
    },
    short: {
      ticker: "BABA",
      name: "Alibaba",
      downside: "-15-25%",
      thesis: "Delisting risk. VIE structure = you own nothing. CCP can rug anytime.",
    },
    prediction: {
      platform: "kalshi",
      question: "US-China trade war escalates in 2025?",
      odds: 45,
      edge: "Tariffs = nearshoring. Long US defense, short China ADRs.",
      url: "https://kalshi.com/browse/economics/trade",
    },
    catalyst: "Trump tariff announcements, Xi Jinping speeches, or tech export bans",
    timestamp: "2025-03-07",
  },
  {
    country: {
      code: "SAU",
      name: "Saudi Arabia",
      flag: "🇸🇦",
      riskLevel: "medium",
    },
    long: {
      ticker: "2222.SR",
      name: "Saudi Aramco",
      upside: "+15-25%",
      thesis: "OPEC+ controls supply. They want $90+ oil. They'll get it.",
    },
    short: {
      ticker: "TSLA",
      name: "Tesla",
      downside: "-10-20%",
      thesis: "High oil = EV demand up, but TSLA margins crushed by competition.",
    },
    prediction: {
      platform: "kalshi",
      question: "Oil price above $90 in 2025?",
      odds: 38,
      edge: "Underpriced. Any Middle East escalation = instant spike.",
      url: "https://kalshi.com/markets/kxwtimax/wti-oil-yearly-high",
    },
    catalyst: "OPEC+ meetings, Houthi attacks, or Iran-Saudi tensions",
    timestamp: "2025-03-07",
  },
  {
    country: {
      code: "POL",
      name: "Poland",
      flag: "🇵🇱",
      riskLevel: "high",
    },
    long: {
      ticker: "BA",
      name: "Boeing",
      upside: "+15-25%",
      thesis: "F-35 orders. Poland spending 4% GDP on defense. Boeing backlog grows.",
    },
    short: {
      ticker: "EADSY",
      name: "Airbus",
      downside: "-5-10%",
      thesis: "Supply chain issues. Boeing taking defense market share.",
    },
    prediction: {
      platform: "kalshi",
      question: "Poland military spending hits 5% GDP?",
      odds: 45,
      edge: "Frontline NATO state. They're not stopping at 4%.",
      url: "https://kalshi.com/browse/politics/world",
    },
    catalyst: "NATO summits, Russian threats, or Belarus border incidents",
    timestamp: "2025-03-07",
  },
  {
    country: {
      code: "TUR",
      name: "Turkey",
      flag: "🇹🇷",
      riskLevel: "medium",
    },
    long: {
      ticker: "ASELS.IS",
      name: "Aselsan",
      upside: "+30-45%",
      thesis: "Bayraktar drones proved in Ukraine. Order book exploding.",
    },
    short: {
      ticker: "TUR",
      name: "Turkey ETF",
      downside: "-15-25%",
      thesis: "Lira collapse continues. 50%+ inflation. Erdogan won't pivot.",
    },
    prediction: {
      platform: "polymarket",
      question: "Turkey blocks Sweden NATO entry?",
      odds: 5,
      edge: "Already resolved. But Turkey leverage play = defense export deals.",
      url: "https://polymarket.com/predictions/world",
    },
    catalyst: "Erdogan statements, Kurdish tensions, or NATO negotiations",
    timestamp: "2025-03-07",
  },
];

// Get signals sorted by risk
export function getSignalsByRisk(): Signal[] {
  const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...signals].sort(
    (a, b) => riskOrder[a.country.riskLevel] - riskOrder[b.country.riskLevel]
  );
}

// Get signals by filter
export function getSignalsByFilter(filter: string): Signal[] {
  const sorted = getSignalsByRisk();
  if (filter === "all") return sorted;
  if (filter === "critical") return sorted.filter((s) => s.country.riskLevel === "critical");
  if (filter === "high") return sorted.filter((s) => s.country.riskLevel === "high");
  return sorted;
}
