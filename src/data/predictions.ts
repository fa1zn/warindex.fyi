export interface Prediction {
  question: string;
  probability: number;
  platform: "polymarket" | "kalshi";
  url: string;
}

// Map country codes to relevant predictions
export const countryPredictions: Record<string, Prediction[]> = {
  TWN: [
    {
      question: "China blockades Taiwan in 2025?",
      probability: 8,
      platform: "polymarket",
      url: "https://polymarket.com/event/china-taiwan"
    },
    {
      question: "US sends troops to Taiwan?",
      probability: 4,
      platform: "kalshi",
      url: "https://kalshi.com/markets/taiwan"
    }
  ],
  CHN: [
    {
      question: "China blockades Taiwan in 2025?",
      probability: 8,
      platform: "polymarket",
      url: "https://polymarket.com/event/china-taiwan"
    },
    {
      question: "US-China trade war escalates?",
      probability: 45,
      platform: "kalshi",
      url: "https://kalshi.com/markets/trade-war"
    }
  ],
  RUS: [
    {
      question: "Russia-Ukraine ceasefire in 2025?",
      probability: 32,
      platform: "polymarket",
      url: "https://polymarket.com/event/ukraine-ceasefire"
    },
    {
      question: "New Western sanctions on Russia?",
      probability: 67,
      platform: "kalshi",
      url: "https://kalshi.com/markets/russia-sanctions"
    }
  ],
  UKR: [
    {
      question: "Russia-Ukraine ceasefire in 2025?",
      probability: 32,
      platform: "polymarket",
      url: "https://polymarket.com/event/ukraine-ceasefire"
    },
    {
      question: "Ukraine joins NATO by 2027?",
      probability: 12,
      platform: "polymarket",
      url: "https://polymarket.com/event/ukraine-nato"
    }
  ],
  IRN: [
    {
      question: "Israel strikes Iran in 2025?",
      probability: 28,
      platform: "polymarket",
      url: "https://polymarket.com/event/israel-iran"
    },
    {
      question: "Iran nuclear deal revival?",
      probability: 15,
      platform: "kalshi",
      url: "https://kalshi.com/markets/iran-deal"
    }
  ],
  ISR: [
    {
      question: "Israel strikes Iran in 2025?",
      probability: 28,
      platform: "polymarket",
      url: "https://polymarket.com/event/israel-iran"
    },
    {
      question: "Gaza ceasefire by mid-2025?",
      probability: 41,
      platform: "polymarket",
      url: "https://polymarket.com/event/gaza-ceasefire"
    }
  ],
  KOR: [
    {
      question: "North Korea tests ICBM in 2025?",
      probability: 72,
      platform: "kalshi",
      url: "https://kalshi.com/markets/nk-icbm"
    },
    {
      question: "Korean peninsula conflict?",
      probability: 3,
      platform: "polymarket",
      url: "https://polymarket.com/event/korea-war"
    }
  ],
  PRK: [
    {
      question: "North Korea tests ICBM in 2025?",
      probability: 72,
      platform: "kalshi",
      url: "https://kalshi.com/markets/nk-icbm"
    },
    {
      question: "New UN sanctions on North Korea?",
      probability: 45,
      platform: "kalshi",
      url: "https://kalshi.com/markets/nk-sanctions"
    }
  ],
  USA: [
    {
      question: "US enters new military conflict?",
      probability: 18,
      platform: "polymarket",
      url: "https://polymarket.com/event/us-war"
    },
    {
      question: "US defense budget increase?",
      probability: 78,
      platform: "kalshi",
      url: "https://kalshi.com/markets/defense-budget"
    }
  ],
  SAU: [
    {
      question: "Saudi-Iran normalization holds?",
      probability: 65,
      platform: "polymarket",
      url: "https://polymarket.com/event/saudi-iran"
    },
    {
      question: "Oil price above $90 in 2025?",
      probability: 38,
      platform: "kalshi",
      url: "https://kalshi.com/markets/oil-price"
    }
  ],
  DEU: [
    {
      question: "Germany increases defense to 3% GDP?",
      probability: 42,
      platform: "kalshi",
      url: "https://kalshi.com/markets/germany-defense"
    }
  ],
  GBR: [
    {
      question: "UK sends more weapons to Ukraine?",
      probability: 85,
      platform: "polymarket",
      url: "https://polymarket.com/event/uk-ukraine"
    }
  ],
  FRA: [
    {
      question: "France deploys troops to Eastern Europe?",
      probability: 22,
      platform: "polymarket",
      url: "https://polymarket.com/event/france-nato"
    }
  ],
  POL: [
    {
      question: "Poland military spending hits 4% GDP?",
      probability: 88,
      platform: "kalshi",
      url: "https://kalshi.com/markets/poland-defense"
    }
  ],
  TUR: [
    {
      question: "Turkey blocks Sweden NATO entry?",
      probability: 5,
      platform: "polymarket",
      url: "https://polymarket.com/event/sweden-nato"
    }
  ],
  IND: [
    {
      question: "India-China border clash in 2025?",
      probability: 15,
      platform: "polymarket",
      url: "https://polymarket.com/event/india-china"
    }
  ],
  PAK: [
    {
      question: "India-Pakistan tensions escalate?",
      probability: 12,
      platform: "kalshi",
      url: "https://kalshi.com/markets/india-pakistan"
    }
  ],
  JPN: [
    {
      question: "Japan amends pacifist constitution?",
      probability: 25,
      platform: "kalshi",
      url: "https://kalshi.com/markets/japan-constitution"
    }
  ],
  AUS: [
    {
      question: "AUKUS submarine delivery on schedule?",
      probability: 35,
      platform: "polymarket",
      url: "https://polymarket.com/event/aukus"
    }
  ],
  BRA: [
    {
      question: "Brazil mediates Ukraine peace?",
      probability: 8,
      platform: "polymarket",
      url: "https://polymarket.com/event/brazil-ukraine"
    }
  ],
  NOR: [
    {
      question: "Oil price above $90 in 2025?",
      probability: 38,
      platform: "kalshi",
      url: "https://kalshi.com/markets/oil-price"
    }
  ]
};
