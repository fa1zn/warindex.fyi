import { CuratedList, AIRecommendation } from "@/types/watchlist";

export const curatedLists: CuratedList[] = [
  {
    id: "defense-winners",
    name: "Defense Winners",
    description: "Companies benefiting from global rearmament",
    icon: "defense",
    tickers: ["LMT", "RTX", "RHM", "BA.L", "ESLT", "7011.T", "SAAB-B.ST"],
    rationale: "NATO 2% GDP commitment driving historic defense spending. European rearmament cycle just beginning. US defense budget at all-time highs with bipartisan support.",
    riskLevel: "medium",
    category: "defense"
  },
  {
    id: "energy-plays",
    name: "Energy Plays",
    description: "Oil & gas positioned for supply disruptions",
    icon: "energy",
    tickers: ["CVX", "EQNR.OL", "2222.SR", "PETR4.SA", "SHEL", "TTE.PA"],
    rationale: "OPEC+ production cuts maintaining prices. Russia sanctions creating supply uncertainty. Red Sea disruptions adding risk premium. LNG demand surge from Europe.",
    riskLevel: "high",
    category: "energy"
  },
  {
    id: "taiwan-risk",
    name: "Taiwan Risk",
    description: "Semiconductor exposure to Taiwan tensions",
    icon: "chip",
    tickers: ["TSM", "2317.TW", "005930.KS", "000660.KS", "ASML.AS"],
    rationale: "90% of advanced chips made in Taiwan. Any conflict would devastate global tech supply chains. Samsung and SK Hynix could gain market share in crisis.",
    riskLevel: "high",
    category: "tech"
  },
  {
    id: "sanctions-winners",
    name: "Sanctions Beneficiaries",
    description: "Companies gaining from Russia isolation",
    icon: "sanctions",
    tickers: ["EQNR.OL", "KOG.OL", "PKN.WA", "RELIANCE.NS", "WALMEX.MX"],
    rationale: "Norway gas replacing Russia. Polish energy hub growing. India refining cheap Russian crude. Mexico nearshoring boom from supply chain shifts.",
    riskLevel: "medium",
    category: "diversified"
  },
  {
    id: "supply-chain-hedges",
    name: "Supply Chain Hedges",
    description: "Diversified manufacturing reducing risk",
    icon: "factory",
    tickers: ["VIC.VN", "WALMEX.MX", "TCS.NS", "BHP.AX", "SQM"],
    rationale: "Vietnam and Mexico biggest winners of China+1 strategy. India IT services growing. Critical minerals from friendly nations gaining importance.",
    riskLevel: "low",
    category: "diversified"
  },
  {
    id: "middle-east-exposure",
    name: "Middle East Exposure",
    description: "Stocks affected by regional instability",
    icon: "globe",
    tickers: ["2222.SR", "ESLT", "QGTS.QA", "FAB.AE", "EMAAR.AE"],
    rationale: "Saudi Aramco benefits from oil risk premium. Israeli defense in demand. Qatar LNG critical for Europe. UAE as regional safe haven.",
    riskLevel: "high",
    category: "diversified"
  },
  {
    id: "cyber-warfare",
    name: "Cyber Warfare",
    description: "Cybersecurity benefiting from state threats",
    icon: "cyber",
    tickers: ["CHKP", "PLTR", "NOKIA.HE"],
    rationale: "State-sponsored attacks increasing. Critical infrastructure protection priority. Defense and intelligence contracts growing.",
    riskLevel: "medium",
    category: "tech"
  },
  {
    id: "food-security",
    name: "Food Security",
    description: "Agriculture benefiting from supply concerns",
    icon: "food",
    tickers: ["JOPH.AM", "VALE3.SA", "DANGCEM.LG", "BIMBOA.MX"],
    rationale: "Ukraine war disrupted grain exports. Fertilizer prices elevated. Food security becoming national priority. Africa infrastructure investment.",
    riskLevel: "medium",
    category: "diversified"
  }
];

// AI Recommendations - rotated weekly based on prediction market activity
export const aiRecommendations: AIRecommendation[] = [
  {
    ticker: "RHM",
    name: "Rheinmetall",
    reason: "German €100B defense fund contracts accelerating",
    catalyst: "New tank orders from Poland and NATO allies",
    timeframe: "this_month",
    confidence: "high"
  },
  {
    ticker: "EQNR.OL",
    name: "Equinor",
    reason: "European gas prices spiking on Middle East tensions",
    catalyst: "Red Sea shipping disruptions affecting LNG routes",
    timeframe: "this_week",
    confidence: "high"
  },
  {
    ticker: "TSM",
    name: "TSMC",
    reason: "AI chip demand exceeding all forecasts",
    catalyst: "Nvidia and Apple expanding orders",
    timeframe: "this_quarter",
    confidence: "medium"
  },
  {
    ticker: "ESLT",
    name: "Elbit Systems",
    reason: "Iron Dome demand from multiple countries",
    catalyst: "Regional conflict driving defense exports",
    timeframe: "this_month",
    confidence: "high"
  },
  {
    ticker: "VIC.VN",
    name: "Vingroup",
    reason: "Vietnam manufacturing boom from China+1",
    catalyst: "Apple and Samsung expanding production",
    timeframe: "this_quarter",
    confidence: "medium"
  },
  {
    ticker: "SQM",
    name: "SQM",
    reason: "Lithium demand for EV batteries growing",
    catalyst: "US IRA subsidies driving domestic EV production",
    timeframe: "this_month",
    confidence: "medium"
  }
];

// Helper functions
export function getListById(id: string): CuratedList | undefined {
  return curatedLists.find(l => l.id === id);
}

export function getListsByCategory(category: CuratedList['category']): CuratedList[] {
  return curatedLists.filter(l => l.category === category);
}

export function getRecommendationsByTimeframe(timeframe: AIRecommendation['timeframe']): AIRecommendation[] {
  return aiRecommendations.filter(r => r.timeframe === timeframe);
}
