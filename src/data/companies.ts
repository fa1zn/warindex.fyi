export interface Company {
  name: string;
  ticker: string;
  lat: number;
  lng: number;
  country: string;
  industry: string;
  description: string;
  conflictExposure: string;
}

export const companies: Company[] = [
  {
    name: "Lockheed Martin",
    ticker: "LMT",
    lat: 38.9072,
    lng: -77.0369,
    country: "USA",
    industry: "Defense",
    description: "World's largest defense contractor, maker of F-35 fighters and missile systems.",
    conflictExposure: "Stock rises with global conflicts as governments increase defense spending.",
  },
  {
    name: "Raytheon Technologies",
    ticker: "RTX",
    lat: 42.3601,
    lng: -71.0589,
    country: "USA",
    industry: "Defense",
    description: "Major defense contractor producing missiles, radar systems, and aircraft engines.",
    conflictExposure: "Benefits from increased weapons demand during active conflicts.",
  },
  {
    name: "Saudi Aramco",
    ticker: "ARAMCO",
    lat: 26.2361,
    lng: 50.0393,
    country: "Saudi Arabia",
    industry: "Oil & Gas",
    description: "World's largest oil producer and most valuable company by market cap.",
    conflictExposure: "Oil prices spike during Middle East tensions, boosting revenues significantly.",
  },
  {
    name: "Gazprom",
    ticker: "GAZP",
    lat: 55.7558,
    lng: 37.6173,
    country: "Russia",
    industry: "Oil & Gas",
    description: "Russia's state-owned energy giant and world's largest natural gas company.",
    conflictExposure: "Sanctioned by West but profits from high energy prices due to supply constraints.",
  },
  {
    name: "TSMC",
    ticker: "TSM",
    lat: 24.7868,
    lng: 120.9965,
    country: "Taiwan",
    industry: "Semiconductors",
    description: "Manufactures 90% of world's advanced chips, critical to global tech supply chain.",
    conflictExposure: "Taiwan tensions create supply chain fears, affecting global chip availability.",
  },
  {
    name: "Halliburton",
    ticker: "HAL",
    lat: 29.7604,
    lng: -95.3698,
    country: "USA",
    industry: "Oil Services",
    description: "Oilfield services giant providing drilling and completion services worldwide.",
    conflictExposure: "Benefits from increased oil exploration when energy security becomes priority.",
  },
  {
    name: "BAE Systems",
    ticker: "BA.L",
    lat: 51.5074,
    lng: -0.1278,
    country: "UK",
    industry: "Defense",
    description: "Europe's largest defense contractor, producing combat vehicles and naval systems.",
    conflictExposure: "European rearmament drives demand as NATO strengthens eastern defenses.",
  },
  {
    name: "Chevron",
    ticker: "CVX",
    lat: 37.7749,
    lng: -122.4194,
    country: "USA",
    industry: "Oil & Gas",
    description: "Major integrated oil company with global exploration and refining operations.",
    conflictExposure: "Energy conflicts drive oil prices higher, increasing profit margins.",
  },
];
