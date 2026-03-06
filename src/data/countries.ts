export interface CountryData {
  name: string;
  flag: string;
  gdp: string;
  companies: Array<{ name: string; ticker: string }>;
  conflictImpact: string;
}

export const countryData: Record<string, CountryData> = {
  USA: {
    name: "United States",
    flag: "🇺🇸",
    gdp: "$25.5 trillion",
    companies: [
      { name: "Lockheed Martin", ticker: "LMT" },
      { name: "Raytheon", ticker: "RTX" },
      { name: "Chevron", ticker: "CVX" },
    ],
    conflictImpact: "Defense stocks surge while energy independence shields economy from oil shocks.",
  },
  RUS: {
    name: "Russia",
    flag: "🇷🇺",
    gdp: "$1.8 trillion",
    companies: [
      { name: "Gazprom", ticker: "GAZP" },
      { name: "Rosneft", ticker: "ROSN" },
      { name: "Sberbank", ticker: "SBER" },
    ],
    conflictImpact: "Sanctions cripple economy but energy exports to Asia provide partial relief.",
  },
  SAU: {
    name: "Saudi Arabia",
    flag: "🇸🇦",
    gdp: "$1.1 trillion",
    companies: [
      { name: "Saudi Aramco", ticker: "ARAMCO" },
      { name: "SABIC", ticker: "SABIC" },
      { name: "STC", ticker: "STC" },
    ],
    conflictImpact: "Regional tensions boost oil revenues while diversification efforts accelerate.",
  },
  IRN: {
    name: "Iran",
    flag: "🇮🇷",
    gdp: "$388 billion",
    companies: [
      { name: "NIOC", ticker: "NIOC" },
      { name: "NIGC", ticker: "NIGC" },
      { name: "Mobarakeh Steel", ticker: "MSC" },
    ],
    conflictImpact: "Heavy sanctions devastate economy while proxy conflicts drain resources.",
  },
  CHN: {
    name: "China",
    flag: "🇨🇳",
    gdp: "$17.9 trillion",
    companies: [
      { name: "PetroChina", ticker: "PTR" },
      { name: "CNOOC", ticker: "CEO" },
      { name: "SMIC", ticker: "SMIC" },
    ],
    conflictImpact: "Taiwan tensions threaten tech supply chains while Russia ties bring cheap energy.",
  },
  TWN: {
    name: "Taiwan",
    flag: "🇹🇼",
    gdp: "$790 billion",
    companies: [
      { name: "TSMC", ticker: "TSM" },
      { name: "MediaTek", ticker: "MTK" },
      { name: "Hon Hai", ticker: "HNHPF" },
    ],
    conflictImpact: "Strait tensions threaten semiconductor industry that powers global technology.",
  },
  GBR: {
    name: "United Kingdom",
    flag: "🇬🇧",
    gdp: "$3.1 trillion",
    companies: [
      { name: "BAE Systems", ticker: "BA.L" },
      { name: "BP", ticker: "BP" },
      { name: "Shell", ticker: "SHEL" },
    ],
    conflictImpact: "Defense spending rises while energy transition accelerates due to security concerns.",
  },
  UKR: {
    name: "Ukraine",
    flag: "🇺🇦",
    gdp: "$160 billion",
    companies: [
      { name: "Naftogaz", ticker: "NFGZ" },
      { name: "Metinvest", ticker: "METIV" },
      { name: "Kernel", ticker: "KER" },
    ],
    conflictImpact: "War devastates economy while Western aid and future reconstruction promise recovery.",
  },
  DEU: {
    name: "Germany",
    flag: "🇩🇪",
    gdp: "$4.2 trillion",
    companies: [
      { name: "Rheinmetall", ticker: "RHM" },
      { name: "Siemens", ticker: "SIE" },
      { name: "BASF", ticker: "BAS" },
    ],
    conflictImpact: "Energy crisis forces industrial transformation while defense spending doubles.",
  },
  ISR: {
    name: "Israel",
    flag: "🇮🇱",
    gdp: "$525 billion",
    companies: [
      { name: "Elbit Systems", ticker: "ESLT" },
      { name: "Israel Aerospace", ticker: "IAI" },
      { name: "Teva", ticker: "TEVA" },
    ],
    conflictImpact: "Regional conflicts boost defense tech exports while domestic economy faces pressure.",
  },
};

// Map ISO3 country codes to our data keys
export const isoToKey: Record<string, string> = {
  USA: "USA",
  RUS: "RUS",
  SAU: "SAU",
  IRN: "IRN",
  CHN: "CHN",
  TWN: "TWN",
  GBR: "GBR",
  UKR: "UKR",
  DEU: "DEU",
  ISR: "ISR",
};
