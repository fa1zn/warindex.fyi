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
