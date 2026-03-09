export interface Conflict {
  id: string;
  name: string;
  lat: number;
  lng: number;
  description: string;
  intensity: number; // 1-10
  relatedCompanies: string[]; // tickers of affected companies
}

export const conflicts: Conflict[] = [
  {
    id: "iran-us",
    name: "Iran-US Tensions",
    lat: 32.4279,
    lng: 53.688,
    description: "Ongoing geopolitical tensions affecting oil markets and defense spending.",
    intensity: 7,
    relatedCompanies: ["LMT", "RTX", "CVX", "XOM", "ARAMCO"],
  },
  {
    id: "ukraine-russia",
    name: "Ukraine-Russia War",
    lat: 48.3794,
    lng: 31.1656,
    description: "Full-scale conflict disrupting energy supplies and driving defense demand.",
    intensity: 10,
    relatedCompanies: ["LMT", "RTX", "BA.L", "GAZP", "CVX"],
  },
  {
    id: "taiwan-strait",
    name: "Taiwan Strait Tensions",
    lat: 24.0,
    lng: 121.0,
    description: "Strategic flashpoint threatening semiconductor supply chains globally.",
    intensity: 6,
    relatedCompanies: ["TSM", "LMT", "RTX", "BA.L"],
  },
  {
    id: "red-sea",
    name: "Red Sea Crisis",
    lat: 15.5,
    lng: 42.0,
    description: "Houthi attacks on shipping disrupting global trade routes and oil transport.",
    intensity: 8,
    relatedCompanies: ["CVX", "XOM", "ARAMCO", "HAL"],
  },
  {
    id: "sudan",
    name: "Sudan Civil War",
    lat: 15.5007,
    lng: 32.5599,
    description: "Humanitarian crisis affecting regional stability and resource extraction.",
    intensity: 7,
    relatedCompanies: ["CVX", "XOM"],
  },
];

// Extended conflict alert interface for modals
export interface ConflictAlert {
  id: string;
  title: string;
  description: string;
  severity: "low" | "medium" | "high" | "critical";
  date: string;
  source?: string;
  affectedCountries: string[]; // country codes
  category: "military" | "economic" | "political" | "humanitarian";
  isActive: boolean;
}

export const conflictAlerts: ConflictAlert[] = [
  {
    id: "ukr-rus-2024",
    title: "Russia-Ukraine War Escalation",
    description:
      "Ongoing military conflict with significant economic implications. Recent drone attacks on energy infrastructure have intensified, affecting global energy markets and European security posture.",
    severity: "critical",
    date: "Ongoing since Feb 2022",
    source: "ACLED, Reuters",
    affectedCountries: ["UKR", "RUS", "DEU", "POL", "USA"],
    category: "military",
    isActive: true,
  },
  {
    id: "isr-irn-2024",
    title: "Israel-Iran Tensions",
    description:
      "Escalating regional tensions following strikes on Iranian proxies. Risk of direct military confrontation affecting oil prices and regional stability.",
    severity: "high",
    date: "Escalated Mar 2024",
    source: "ISW, Bloomberg",
    affectedCountries: ["ISR", "IRN", "SAU", "USA"],
    category: "military",
    isActive: true,
  },
  {
    id: "twn-chn-2024",
    title: "Taiwan Strait Tensions",
    description:
      "Increased Chinese military activity around Taiwan following political developments. Semiconductor supply chain at risk if situation escalates.",
    severity: "high",
    date: "Elevated risk 2024",
    source: "CSIS, WSJ",
    affectedCountries: ["TWN", "CHN", "JPN", "USA", "KOR"],
    category: "military",
    isActive: true,
  },
  {
    id: "ind-pak-2024",
    title: "India-Pakistan Border Conflict",
    description:
      "Renewed tensions along the Line of Control following cross-border incidents. Both nations have nuclear capabilities, raising global concern.",
    severity: "high",
    date: "Escalated 2024",
    source: "Reuters, Al Jazeera",
    affectedCountries: ["IND", "PAK", "CHN"],
    category: "military",
    isActive: true,
  },
  {
    id: "red-sea-2024",
    title: "Red Sea Shipping Disruption",
    description:
      "Houthi attacks on commercial shipping have disrupted major trade routes, forcing rerouting around Africa and increasing shipping costs globally.",
    severity: "medium",
    date: "Since Nov 2023",
    source: "Lloyd's, Reuters",
    affectedCountries: ["SAU", "IRN", "USA", "GBR", "EGY"],
    category: "economic",
    isActive: true,
  },
  {
    id: "prk-missiles-2024",
    title: "North Korea Missile Tests",
    description:
      "Continued ballistic missile testing by DPRK raises regional security concerns and potential for new sanctions affecting Asian markets.",
    severity: "medium",
    date: "Ongoing",
    source: "KCNA, Yonhap",
    affectedCountries: ["PRK", "KOR", "JPN", "USA", "CHN"],
    category: "military",
    isActive: true,
  },
];

export const getConflictsByCountry = (countryCode: string): ConflictAlert[] => {
  return conflictAlerts.filter((c) => c.affectedCountries.includes(countryCode));
};

export const getActiveConflicts = (): ConflictAlert[] => {
  return conflictAlerts.filter((c) => c.isActive);
};

export const getCriticalConflicts = (): ConflictAlert[] => {
  return conflictAlerts.filter((c) => c.severity === "critical" || c.severity === "high");
};
