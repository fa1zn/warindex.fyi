import { WarScenario } from "@/types/scenarios";

export const warScenarios: WarScenario[] = [
  {
    id: "china-taiwan",
    name: "China-Taiwan Conflict",
    description: "Military action against Taiwan with potential US involvement",
    icon: "TWN",
    triggerEvent: "Chinese amphibious assault or naval blockade of Taiwan",
    probability: 18,
    affectedCountries: ["TWN", "CHN", "USA", "JPN", "KOR", "PHL", "SGP", "AUS"],
    primaryCountries: ["TWN", "CHN"],
    timeHorizon: "30days",
    categories: ["military", "economic", "cyber"],
    stages: [
      {
        level: 1,
        name: "Rising Tensions",
        description: "Military exercises, diplomatic recalls, cyber attacks",
        probability: 35,
        impacts: [
          { countryCode: "TWN", gdpImpact: -2, stockSectorImpacts: { "Semiconductors": -8, "Finance": -5 }, riskLevelChange: "high", description: "Markets pricing in conflict risk" },
          { countryCode: "CHN", gdpImpact: -1, stockSectorImpacts: { "Technology": -5, "Finance": -3 }, riskLevelChange: "medium", description: "Capital flight concerns" },
          { countryCode: "USA", gdpImpact: 0.2, stockSectorImpacts: { "Defense": 5, "Semiconductors": -3 }, riskLevelChange: "low", description: "Defense stocks rally" },
        ]
      },
      {
        level: 2,
        name: "Naval Blockade",
        description: "China imposes 'quarantine' on Taiwan shipping",
        probability: 20,
        impacts: [
          { countryCode: "TWN", gdpImpact: -8, stockSectorImpacts: { "Semiconductors": -25, "Finance": -15, "Industrial": -10 }, riskLevelChange: "critical", description: "Chip exports halted" },
          { countryCode: "CHN", gdpImpact: -3, stockSectorImpacts: { "Technology": -12, "Finance": -8 }, riskLevelChange: "high", description: "Sanctions incoming" },
          { countryCode: "JPN", gdpImpact: -2, stockSectorImpacts: { "Electronics": -10, "Defense": 8 }, riskLevelChange: "medium", description: "Supply chain disruption" },
          { countryCode: "KOR", gdpImpact: -1.5, stockSectorImpacts: { "Semiconductors": 5, "Defense": 6 }, riskLevelChange: "medium", description: "Samsung gains chip share" },
        ]
      },
      {
        level: 3,
        name: "Limited Strikes",
        description: "Missile strikes on military targets, airspace denial",
        probability: 12,
        impacts: [
          { countryCode: "TWN", gdpImpact: -15, stockSectorImpacts: { "Semiconductors": -50, "Finance": -30, "Industrial": -25 }, riskLevelChange: "critical", description: "TSMC fabs at risk" },
          { countryCode: "USA", gdpImpact: -2, stockSectorImpacts: { "Defense": 15, "Technology": -20 }, riskLevelChange: "medium", description: "Tech supply crisis" },
          { countryCode: "NLD", gdpImpact: -1, stockSectorImpacts: { "Semiconductors": -15 }, riskLevelChange: "low", description: "ASML cannot service Taiwan" },
        ]
      },
      {
        level: 4,
        name: "Full Invasion",
        description: "Amphibious assault with US/Japan intervention",
        probability: 5,
        impacts: [
          { countryCode: "TWN", gdpImpact: -40, stockSectorImpacts: { "Semiconductors": -80, "Finance": -60 }, riskLevelChange: "critical", description: "Economy devastated" },
          { countryCode: "CHN", gdpImpact: -15, stockSectorImpacts: { "Technology": -40, "Finance": -30 }, riskLevelChange: "critical", description: "Total sanctions regime" },
          { countryCode: "USA", gdpImpact: -5, stockSectorImpacts: { "Defense": 30, "Technology": -35 }, riskLevelChange: "high", description: "War footing" },
        ]
      },
      {
        level: 5,
        name: "Global Conflict",
        description: "Expanded war with multiple fronts",
        probability: 2,
        impacts: [
          { countryCode: "TWN", gdpImpact: -60, stockSectorImpacts: { "Semiconductors": -95 }, riskLevelChange: "critical", description: "Economic collapse" },
          { countryCode: "CHN", gdpImpact: -25, stockSectorImpacts: { "Technology": -60, "Finance": -50 }, riskLevelChange: "critical", description: "Global isolation" },
          { countryCode: "USA", gdpImpact: -8, stockSectorImpacts: { "Defense": 50, "Technology": -50 }, riskLevelChange: "high", description: "Wartime economy" },
        ]
      }
    ],
    stockImpacts: [
      { ticker: "TSM", baselineChange: -10, scenarioMultiplier: 15, reason: "World's most critical chip manufacturer at ground zero" },
      { ticker: "2317.TW", baselineChange: -8, scenarioMultiplier: 12, reason: "Foxconn production would halt entirely" },
      { ticker: "ASML.AS", baselineChange: -5, scenarioMultiplier: 8, reason: "Cannot service Taiwan, China sanctions" },
      { ticker: "005930.KS", baselineChange: 3, scenarioMultiplier: 4, reason: "Samsung gains chip market share" },
      { ticker: "LMT", baselineChange: 5, scenarioMultiplier: 6, reason: "Defense contracts surge" },
      { ticker: "RTX", baselineChange: 4, scenarioMultiplier: 5, reason: "Missile systems in demand" },
    ]
  },
  {
    id: "russia-nato",
    name: "Russia-NATO Escalation",
    description: "Ukraine war escalates to direct NATO involvement",
    icon: "RUS",
    triggerEvent: "Russian strike on NATO territory or nuclear threat",
    probability: 12,
    affectedCountries: ["RUS", "UKR", "POL", "DEU", "GBR", "FRA", "USA", "FIN", "SWE", "NOR", "ROU", "CZE"],
    primaryCountries: ["RUS", "UKR"],
    timeHorizon: "30days",
    categories: ["military", "economic", "energy"],
    stages: [
      {
        level: 1,
        name: "Border Incident",
        description: "Missile lands in NATO territory, possibly accidental",
        probability: 25,
        impacts: [
          { countryCode: "POL", gdpImpact: -1, stockSectorImpacts: { "Defense": 8, "Energy": 5 }, riskLevelChange: "high", description: "Article 5 discussions" },
          { countryCode: "DEU", gdpImpact: -0.5, stockSectorImpacts: { "Defense": 10, "Industrial": -3 }, riskLevelChange: "medium", description: "Accelerated rearmament" },
          { countryCode: "RUS", gdpImpact: -2, stockSectorImpacts: { "Energy": -10, "Finance": -8 }, riskLevelChange: "critical", description: "New sanctions wave" },
        ]
      },
      {
        level: 2,
        name: "Tactical Nuclear Threat",
        description: "Russia threatens tactical nuclear use in Ukraine",
        probability: 8,
        impacts: [
          { countryCode: "UKR", gdpImpact: -15, stockSectorImpacts: { "Energy": -40 }, riskLevelChange: "critical", description: "Evacuation concerns" },
          { countryCode: "NOR", gdpImpact: 3, stockSectorImpacts: { "Energy": 25 }, riskLevelChange: "low", description: "Gas prices spike" },
          { countryCode: "USA", gdpImpact: 0.5, stockSectorImpacts: { "Defense": 15 }, riskLevelChange: "low", description: "Defense mobilization" },
        ]
      },
      {
        level: 3,
        name: "NATO Direct Support",
        description: "NATO troops enter Ukraine or no-fly zone declared",
        probability: 4,
        impacts: [
          { countryCode: "RUS", gdpImpact: -10, stockSectorImpacts: { "Energy": -30, "Finance": -25 }, riskLevelChange: "critical", description: "Complete isolation" },
          { countryCode: "POL", gdpImpact: -3, stockSectorImpacts: { "Defense": 20, "Finance": -10 }, riskLevelChange: "high", description: "Frontline state" },
          { countryCode: "FIN", gdpImpact: -2, stockSectorImpacts: { "Defense": 15 }, riskLevelChange: "high", description: "Border fortification" },
        ]
      },
      {
        level: 4,
        name: "Direct Conflict",
        description: "NATO and Russian forces engage directly",
        probability: 2,
        impacts: [
          { countryCode: "RUS", gdpImpact: -25, stockSectorImpacts: { "Energy": -60, "Finance": -50 }, riskLevelChange: "critical", description: "War economy collapse" },
          { countryCode: "DEU", gdpImpact: -8, stockSectorImpacts: { "Defense": 30, "Industrial": -20 }, riskLevelChange: "high", description: "Energy rationing" },
          { countryCode: "GBR", gdpImpact: -5, stockSectorImpacts: { "Defense": 25 }, riskLevelChange: "medium", description: "War mobilization" },
        ]
      },
      {
        level: 5,
        name: "Nuclear Exchange",
        description: "Limited nuclear strikes occur",
        probability: 0.5,
        impacts: [
          { countryCode: "RUS", gdpImpact: -50, stockSectorImpacts: { "Energy": -90 }, riskLevelChange: "critical", description: "Economic devastation" },
          { countryCode: "UKR", gdpImpact: -70, stockSectorImpacts: {}, riskLevelChange: "critical", description: "Catastrophic damage" },
          { countryCode: "USA", gdpImpact: -15, stockSectorImpacts: { "Defense": 40 }, riskLevelChange: "critical", description: "Global crisis response" },
        ]
      }
    ],
    stockImpacts: [
      { ticker: "EQNR.OL", baselineChange: 8, scenarioMultiplier: 10, reason: "European gas prices spike on Russia fears" },
      { ticker: "RHM", baselineChange: 10, scenarioMultiplier: 8, reason: "German rearmament accelerates" },
      { ticker: "GAZP", baselineChange: -15, scenarioMultiplier: 12, reason: "Russia isolation deepens" },
      { ticker: "BA.L", baselineChange: 6, scenarioMultiplier: 7, reason: "UK defense spending surge" },
      { ticker: "SAAB-B.ST", baselineChange: 8, scenarioMultiplier: 6, reason: "Nordic defense demand" },
    ]
  },
  {
    id: "iran-israel",
    name: "Iran-Israel War",
    description: "Direct military conflict between Iran and Israel",
    icon: "ISR",
    triggerEvent: "Israeli strike on Iranian nuclear facilities or Iranian retaliation",
    probability: 22,
    affectedCountries: ["ISR", "IRN", "SAU", "ARE", "LBN", "JOR", "EGY", "IRQ", "USA"],
    primaryCountries: ["ISR", "IRN"],
    timeHorizon: "immediate",
    categories: ["military", "energy"],
    stages: [
      {
        level: 1,
        name: "Proxy Escalation",
        description: "Hezbollah attacks intensify, Iranian advisors killed",
        probability: 45,
        impacts: [
          { countryCode: "ISR", gdpImpact: -2, stockSectorImpacts: { "Defense": 12, "Technology": -5 }, riskLevelChange: "high", description: "War economy measures" },
          { countryCode: "LBN", gdpImpact: -10, stockSectorImpacts: { "Finance": -30 }, riskLevelChange: "critical", description: "Economic collapse accelerates" },
          { countryCode: "SAU", gdpImpact: 2, stockSectorImpacts: { "Energy": 8 }, riskLevelChange: "medium", description: "Oil risk premium rises" },
        ]
      },
      {
        level: 2,
        name: "Direct Strike Exchange",
        description: "Iran and Israel strike each other's territory",
        probability: 18,
        impacts: [
          { countryCode: "ISR", gdpImpact: -5, stockSectorImpacts: { "Defense": 20, "Technology": -15 }, riskLevelChange: "high", description: "Reservist mobilization" },
          { countryCode: "IRN", gdpImpact: -8, stockSectorImpacts: { "Petrochemicals": -20 }, riskLevelChange: "critical", description: "Infrastructure damage" },
          { countryCode: "ARE", gdpImpact: -1, stockSectorImpacts: { "Finance": -5 }, riskLevelChange: "medium", description: "Regional risk premium" },
        ]
      },
      {
        level: 3,
        name: "Oil Facility Attacks",
        description: "Attacks on Gulf oil infrastructure",
        probability: 10,
        impacts: [
          { countryCode: "SAU", gdpImpact: -5, stockSectorImpacts: { "Energy": -15 }, riskLevelChange: "high", description: "Aramco facilities targeted" },
          { countryCode: "QAT", gdpImpact: -3, stockSectorImpacts: { "Energy": 15 }, riskLevelChange: "medium", description: "LNG demand spikes" },
          { countryCode: "USA", gdpImpact: -1, stockSectorImpacts: { "Energy": 20 }, riskLevelChange: "low", description: "Oil at $150/barrel" },
        ]
      },
      {
        level: 4,
        name: "Regional War",
        description: "Multiple countries drawn in, Strait of Hormuz disrupted",
        probability: 5,
        impacts: [
          { countryCode: "IRN", gdpImpact: -20, stockSectorImpacts: { "Petrochemicals": -50 }, riskLevelChange: "critical", description: "Economy devastated" },
          { countryCode: "SAU", gdpImpact: -10, stockSectorImpacts: { "Energy": -25 }, riskLevelChange: "high", description: "Oil exports disrupted" },
          { countryCode: "IND", gdpImpact: -3, stockSectorImpacts: { "Energy": -15 }, riskLevelChange: "medium", description: "Oil import crisis" },
        ]
      },
      {
        level: 5,
        name: "US Involvement",
        description: "US military actively engaged against Iran",
        probability: 3,
        impacts: [
          { countryCode: "IRN", gdpImpact: -35, stockSectorImpacts: { "Petrochemicals": -80 }, riskLevelChange: "critical", description: "Regime survival mode" },
          { countryCode: "USA", gdpImpact: -3, stockSectorImpacts: { "Defense": 30, "Energy": 15 }, riskLevelChange: "medium", description: "War mobilization" },
          { countryCode: "CHN", gdpImpact: -2, stockSectorImpacts: { "Energy": -10 }, riskLevelChange: "medium", description: "Oil supply disruption" },
        ]
      }
    ],
    stockImpacts: [
      { ticker: "ESLT", baselineChange: 8, scenarioMultiplier: 8, reason: "Iron Dome and drone defense in demand" },
      { ticker: "2222.SR", baselineChange: 5, scenarioMultiplier: 10, reason: "Oil risk premium spikes globally" },
      { ticker: "CVX", baselineChange: 6, scenarioMultiplier: 8, reason: "US oil majors benefit from price spike" },
      { ticker: "CHKP", baselineChange: 4, scenarioMultiplier: 5, reason: "Cyber warfare drives security spending" },
    ]
  },
  {
    id: "north-korea",
    name: "North Korea Crisis",
    description: "Military confrontation on Korean Peninsula",
    icon: "PRK",
    triggerEvent: "Nuclear test, ICBM launch, or border incident",
    probability: 8,
    affectedCountries: ["KOR", "JPN", "USA", "CHN", "TWN"],
    primaryCountries: ["KOR"],
    timeHorizon: "immediate",
    categories: ["military", "nuclear"],
    stages: [
      {
        level: 1,
        name: "Provocations",
        description: "Missile tests, border incursions, artillery fire",
        probability: 40,
        impacts: [
          { countryCode: "KOR", gdpImpact: -1, stockSectorImpacts: { "Defense": 8, "Semiconductors": -3 }, riskLevelChange: "high", description: "Markets pricing risk" },
          { countryCode: "JPN", gdpImpact: -0.5, stockSectorImpacts: { "Defense": 10 }, riskLevelChange: "medium", description: "Missile defense spending" },
        ]
      },
      {
        level: 2,
        name: "Nuclear Test",
        description: "7th nuclear test with advanced warhead",
        probability: 20,
        impacts: [
          { countryCode: "KOR", gdpImpact: -3, stockSectorImpacts: { "Defense": 15, "Finance": -8 }, riskLevelChange: "high", description: "Capital flight begins" },
          { countryCode: "JPN", gdpImpact: -1, stockSectorImpacts: { "Defense": 20 }, riskLevelChange: "medium", description: "Record defense budget" },
        ]
      },
      {
        level: 3,
        name: "Limited Strikes",
        description: "US preemptive strike on nuclear facilities",
        probability: 5,
        impacts: [
          { countryCode: "KOR", gdpImpact: -10, stockSectorImpacts: { "Defense": 25, "Finance": -20 }, riskLevelChange: "critical", description: "War preparation" },
          { countryCode: "CHN", gdpImpact: -2, stockSectorImpacts: { "Technology": -8 }, riskLevelChange: "medium", description: "Regional instability" },
        ]
      },
      {
        level: 4,
        name: "Artillery Barrage",
        description: "North Korean retaliation on Seoul",
        probability: 2,
        impacts: [
          { countryCode: "KOR", gdpImpact: -25, stockSectorImpacts: { "Semiconductors": -40, "Finance": -35 }, riskLevelChange: "critical", description: "Economic devastation" },
          { countryCode: "USA", gdpImpact: -2, stockSectorImpacts: { "Defense": 30 }, riskLevelChange: "medium", description: "War mobilization" },
        ]
      },
      {
        level: 5,
        name: "Full War",
        description: "All-out conflict on peninsula",
        probability: 1,
        impacts: [
          { countryCode: "KOR", gdpImpact: -50, stockSectorImpacts: { "Semiconductors": -80 }, riskLevelChange: "critical", description: "Samsung/SK production halted" },
          { countryCode: "JPN", gdpImpact: -8, stockSectorImpacts: { "Defense": 35, "Electronics": -25 }, riskLevelChange: "high", description: "Supply chain collapse" },
        ]
      }
    ],
    stockImpacts: [
      { ticker: "005930.KS", baselineChange: -5, scenarioMultiplier: 12, reason: "Samsung factories near DMZ" },
      { ticker: "000660.KS", baselineChange: -4, scenarioMultiplier: 10, reason: "SK Hynix production at risk" },
      { ticker: "7011.T", baselineChange: 6, scenarioMultiplier: 6, reason: "Japan defense contractor" },
      { ticker: "LMT", baselineChange: 5, scenarioMultiplier: 7, reason: "THAAD and missile defense" },
    ]
  },
  {
    id: "middle-east-regional",
    name: "Middle East Regional War",
    description: "Multi-front conflict involving multiple Arab states",
    icon: "MENA",
    triggerEvent: "Expansion of Israel-Gaza conflict to multiple fronts",
    probability: 15,
    affectedCountries: ["ISR", "LBN", "SYR", "IRN", "JOR", "EGY", "SAU", "ARE", "QAT", "IRQ"],
    primaryCountries: ["ISR", "LBN", "IRN"],
    timeHorizon: "30days",
    categories: ["military", "energy", "humanitarian"],
    stages: [
      {
        level: 1,
        name: "Multi-Front Attacks",
        description: "Hezbollah, Houthis, and militias attack simultaneously",
        probability: 35,
        impacts: [
          { countryCode: "ISR", gdpImpact: -4, stockSectorImpacts: { "Defense": 15, "Technology": -10 }, riskLevelChange: "high", description: "Multi-front war" },
          { countryCode: "LBN", gdpImpact: -15, stockSectorImpacts: { "Finance": -40 }, riskLevelChange: "critical", description: "Country destroyed" },
          { countryCode: "EGY", gdpImpact: -3, stockSectorImpacts: { "Finance": -8 }, riskLevelChange: "high", description: "Suez traffic falls" },
        ]
      },
      {
        level: 2,
        name: "Red Sea Closure",
        description: "Houthis effectively close Red Sea to shipping",
        probability: 20,
        impacts: [
          { countryCode: "EGY", gdpImpact: -8, stockSectorImpacts: { "Finance": -20 }, riskLevelChange: "high", description: "Suez revenues collapse" },
          { countryCode: "SAU", gdpImpact: 1, stockSectorImpacts: { "Energy": 10 }, riskLevelChange: "medium", description: "Pipeline alternative gains" },
          { countryCode: "ARE", gdpImpact: -2, stockSectorImpacts: { "Finance": -5 }, riskLevelChange: "medium", description: "Trade disruption" },
        ]
      },
      {
        level: 3,
        name: "Syria Expansion",
        description: "Israel strikes Syrian regime, Iranian assets",
        probability: 12,
        impacts: [
          { countryCode: "SYR", gdpImpact: -20, stockSectorImpacts: {}, riskLevelChange: "critical", description: "Further destruction" },
          { countryCode: "IRN", gdpImpact: -5, stockSectorImpacts: { "Petrochemicals": -15 }, riskLevelChange: "critical", description: "Proxies destroyed" },
          { countryCode: "JOR", gdpImpact: -4, stockSectorImpacts: { "Finance": -10 }, riskLevelChange: "high", description: "Refugee crisis" },
        ]
      },
      {
        level: 4,
        name: "Gulf Involvement",
        description: "Gulf states directly involved militarily",
        probability: 5,
        impacts: [
          { countryCode: "SAU", gdpImpact: -8, stockSectorImpacts: { "Energy": -20 }, riskLevelChange: "high", description: "Oil facilities at risk" },
          { countryCode: "QAT", gdpImpact: -5, stockSectorImpacts: { "Energy": 20 }, riskLevelChange: "medium", description: "LNG demand spikes" },
          { countryCode: "IRQ", gdpImpact: -10, stockSectorImpacts: {}, riskLevelChange: "critical", description: "Battleground state" },
        ]
      },
      {
        level: 5,
        name: "Regional Collapse",
        description: "Multiple failed states, humanitarian catastrophe",
        probability: 2,
        impacts: [
          { countryCode: "LBN", gdpImpact: -50, stockSectorImpacts: {}, riskLevelChange: "critical", description: "State collapse" },
          { countryCode: "SYR", gdpImpact: -40, stockSectorImpacts: {}, riskLevelChange: "critical", description: "Further devastation" },
          { countryCode: "JOR", gdpImpact: -15, stockSectorImpacts: { "Finance": -30 }, riskLevelChange: "high", description: "Overwhelmed by refugees" },
        ]
      }
    ],
    stockImpacts: [
      { ticker: "2222.SR", baselineChange: 8, scenarioMultiplier: 12, reason: "Oil supply risk premium" },
      { ticker: "EQNR.OL", baselineChange: 6, scenarioMultiplier: 8, reason: "European energy security" },
      { ticker: "ESLT", baselineChange: 10, scenarioMultiplier: 8, reason: "Israeli defense surge" },
      { ticker: "QGTS.QA", baselineChange: 8, scenarioMultiplier: 6, reason: "LNG demand from energy crisis" },
    ]
  }
];

// Helper functions
export function getScenarioById(id: string): WarScenario | undefined {
  return warScenarios.find(s => s.id === id);
}

export function getScenariosByProbability(): WarScenario[] {
  return [...warScenarios].sort((a, b) => b.probability - a.probability);
}

export function getScenariosAffectingCountry(countryCode: string): WarScenario[] {
  return warScenarios.filter(s => s.affectedCountries.includes(countryCode));
}
