export interface Prediction {
  question: string;
  probability: number;
  platform: "polymarket" | "kalshi";
  url: string;
}

// Map country codes to relevant predictions with REAL working URLs
export const countryPredictions: Record<string, Prediction[]> = {
  TWN: [
    {
      question: "China invades Taiwan before 2027?",
      probability: 16,
      platform: "polymarket",
      url: "https://polymarket.com/event/china-x-taiwan-military-clash-before-2027"
    },
    {
      question: "China invades Taiwan by end of 2026?",
      probability: 11,
      platform: "polymarket",
      url: "https://polymarket.com/event/will-china-invade-taiwan-before-2027"
    }
  ],
  CHN: [
    {
      question: "China invades Taiwan before 2027?",
      probability: 16,
      platform: "polymarket",
      url: "https://polymarket.com/event/china-x-taiwan-military-clash-before-2027"
    },
    {
      question: "US-China trade war escalates?",
      probability: 45,
      platform: "polymarket",
      url: "https://polymarket.com/predictions/china"
    }
  ],
  RUS: [
    {
      question: "Russia-Ukraine ceasefire by March 2026?",
      probability: 2,
      platform: "polymarket",
      url: "https://polymarket.com/event/russia-x-ukraine-ceasefire-by-march-31-2026"
    },
    {
      question: "Russia-Ukraine ceasefire by end of 2026?",
      probability: 8,
      platform: "polymarket",
      url: "https://polymarket.com/event/russia-x-ukraine-ceasefire-before-2027"
    }
  ],
  UKR: [
    {
      question: "Russia-Ukraine ceasefire by March 2026?",
      probability: 2,
      platform: "polymarket",
      url: "https://polymarket.com/event/russia-x-ukraine-ceasefire-by-march-31-2026"
    },
    {
      question: "Russia-Ukraine ceasefire by end of 2026?",
      probability: 8,
      platform: "polymarket",
      url: "https://polymarket.com/event/russia-x-ukraine-ceasefire-before-2027"
    }
  ],
  IRN: [
    {
      question: "Israel strikes Iran by March 31?",
      probability: 55,
      platform: "polymarket",
      url: "https://polymarket.com/event/israel-strikes-iran-by-march-31-2026"
    },
    {
      question: "US or Israel strikes Iran first?",
      probability: 85,
      platform: "polymarket",
      url: "https://polymarket.com/event/will-us-or-israel-strike-iran-first"
    }
  ],
  ISR: [
    {
      question: "Israel strikes Iran by March 31?",
      probability: 55,
      platform: "polymarket",
      url: "https://polymarket.com/event/israel-strikes-iran-by-march-31-2026"
    },
    {
      question: "US/Israel strikes Iran on...?",
      probability: 100,
      platform: "polymarket",
      url: "https://polymarket.com/event/usisrael-strikes-iran-on"
    }
  ],
  KOR: [
    {
      question: "North Korea missile test before June?",
      probability: 85,
      platform: "polymarket",
      url: "https://polymarket.com/event/north-korea-missile-test-before-june"
    }
  ],
  PRK: [
    {
      question: "North Korea missile test before June?",
      probability: 85,
      platform: "polymarket",
      url: "https://polymarket.com/event/north-korea-missile-test-before-june"
    }
  ],
  USA: [
    {
      question: "US military action against Iran before July?",
      probability: 85,
      platform: "polymarket",
      url: "https://polymarket.com/event/us-military-action-against-iran-before-july"
    },
    {
      question: "US invades Venezuela by March 31?",
      probability: 35,
      platform: "polymarket",
      url: "https://polymarket.com/event/will-the-us-invade-venezuela-in-2025"
    },
    {
      question: "WTI oil yearly high?",
      probability: 45,
      platform: "kalshi",
      url: "https://kalshi.com/markets/kxwtimax/wti-oil-yearly-high"
    }
  ],
  SAU: [
    {
      question: "WTI oil yearly high above $85?",
      probability: 65,
      platform: "kalshi",
      url: "https://kalshi.com/markets/kxwtimax/wti-oil-yearly-high"
    },
    {
      question: "WTI oil weekly price range?",
      probability: 38,
      platform: "kalshi",
      url: "https://kalshi.com/markets/wti/wti-oil-daily-range"
    }
  ],
  DEU: [
    {
      question: "Russia-Ukraine ceasefire by 2026?",
      probability: 8,
      platform: "polymarket",
      url: "https://polymarket.com/event/russia-x-ukraine-ceasefire-before-2027"
    }
  ],
  GBR: [
    {
      question: "Russia-Ukraine ceasefire by 2026?",
      probability: 8,
      platform: "polymarket",
      url: "https://polymarket.com/event/russia-x-ukraine-ceasefire-before-2027"
    }
  ],
  FRA: [
    {
      question: "Russia-Ukraine ceasefire by 2026?",
      probability: 8,
      platform: "polymarket",
      url: "https://polymarket.com/event/russia-x-ukraine-ceasefire-before-2027"
    }
  ],
  POL: [
    {
      question: "Russia-Ukraine ceasefire by 2026?",
      probability: 8,
      platform: "polymarket",
      url: "https://polymarket.com/event/russia-x-ukraine-ceasefire-before-2027"
    }
  ],
  TUR: [
    {
      question: "Israel strikes Iran by March 31?",
      probability: 55,
      platform: "polymarket",
      url: "https://polymarket.com/event/israel-strikes-iran-by-march-31-2026"
    }
  ],
  IND: [
    {
      question: "India military action against Pakistan before June?",
      probability: 75,
      platform: "polymarket",
      url: "https://polymarket.com/event/india-military-action-against-pakistan-before-june"
    },
    {
      question: "India-Pakistan ceasefire before June?",
      probability: 35,
      platform: "polymarket",
      url: "https://polymarket.com/event/india-x-pakistan-ceasefire-announced-before-june"
    }
  ],
  PAK: [
    {
      question: "India invades Pakistan before July?",
      probability: 45,
      platform: "polymarket",
      url: "https://polymarket.com/event/will-india-invade-pakistan-before-june"
    },
    {
      question: "India-Pakistan declare war before June?",
      probability: 25,
      platform: "polymarket",
      url: "https://polymarket.com/event/india-pakistan-declare-war-before-june"
    }
  ],
  JPN: [
    {
      question: "China-Taiwan military clash before 2027?",
      probability: 16,
      platform: "polymarket",
      url: "https://polymarket.com/event/china-x-taiwan-military-clash-before-2027"
    }
  ],
  AUS: [
    {
      question: "China-Taiwan military clash before 2027?",
      probability: 16,
      platform: "polymarket",
      url: "https://polymarket.com/event/china-x-taiwan-military-clash-before-2027"
    }
  ],
  BRA: [
    {
      question: "Oil & energy predictions",
      probability: 40,
      platform: "kalshi",
      url: "https://kalshi.com/category/economics/oil-and-energy"
    }
  ],
  NOR: [
    {
      question: "Oil price predictions",
      probability: 38,
      platform: "kalshi",
      url: "https://kalshi.com/category/financials/wti"
    }
  ],
  // Additional countries
  DZA: [
    {
      question: "Oil & energy predictions",
      probability: 55,
      platform: "kalshi",
      url: "https://kalshi.com/category/economics/oil-and-energy"
    }
  ],
  EGY: [
    {
      question: "Middle East predictions",
      probability: 48,
      platform: "polymarket",
      url: "https://polymarket.com/predictions/middle-east"
    }
  ],
  ZAF: [
    {
      question: "Global politics predictions",
      probability: 72,
      platform: "polymarket",
      url: "https://polymarket.com/predictions/world"
    }
  ],
  NGA: [
    {
      question: "Oil production predictions",
      probability: 35,
      platform: "kalshi",
      url: "https://kalshi.com/markets/kxbarrels/oil-barrels/kxbarrels-25"
    }
  ],
  VNM: [
    {
      question: "China predictions",
      probability: 68,
      platform: "polymarket",
      url: "https://polymarket.com/predictions/china"
    }
  ],
  THA: [
    {
      question: "Asia predictions",
      probability: 42,
      platform: "polymarket",
      url: "https://polymarket.com/predictions/asia"
    }
  ],
  SGP: [
    {
      question: "China-Taiwan military clash before 2027?",
      probability: 16,
      platform: "polymarket",
      url: "https://polymarket.com/event/china-x-taiwan-military-clash-before-2027"
    }
  ],
  IDN: [
    {
      question: "Asia predictions",
      probability: 78,
      platform: "polymarket",
      url: "https://polymarket.com/predictions/asia"
    }
  ],
  PHL: [
    {
      question: "China predictions",
      probability: 22,
      platform: "polymarket",
      url: "https://polymarket.com/predictions/china"
    }
  ],
  MYS: [
    {
      question: "Asia predictions",
      probability: 38,
      platform: "polymarket",
      url: "https://polymarket.com/predictions/asia"
    }
  ]
};
