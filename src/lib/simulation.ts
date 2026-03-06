import { WarScenario, SimulationResult, CountryImpact } from "@/types/scenarios";
import { countryMarkets } from "@/data/markets";

/**
 * Calculate the impact of a scenario at a given escalation level
 */
export function calculateScenarioImpact(
  scenario: WarScenario,
  escalationLevel: number // 1-5
): SimulationResult {
  // Find the stage that matches the escalation level
  const stage = scenario.stages.find(s => s.level === escalationLevel);
  if (!stage) {
    return {
      scenarioId: scenario.id,
      escalationLevel,
      totalMarketImpact: 0,
      countryImpacts: {},
      topGainers: [],
      topLosers: [],
      affectedSectors: []
    };
  }

  // Calculate country impacts
  const countryImpacts: SimulationResult['countryImpacts'] = {};

  for (const impact of stage.impacts) {
    const country = countryMarkets.find(c => c.code === impact.countryCode);
    if (!country) continue;

    const stockChanges: Record<string, number> = {};

    // Calculate stock changes based on sector impacts
    for (const stock of country.topStocks) {
      const sectorImpact = impact.stockSectorImpacts[stock.sector] || 0;
      stockChanges[stock.ticker] = sectorImpact;
    }

    // Also apply scenario-specific stock impacts
    for (const stockImpact of scenario.stockImpacts) {
      const stock = country.topStocks.find(s => s.ticker === stockImpact.ticker);
      if (stock) {
        const totalChange = stockImpact.baselineChange + (stockImpact.scenarioMultiplier * (escalationLevel - 1));
        stockChanges[stockImpact.ticker] = totalChange;
      }
    }

    countryImpacts[impact.countryCode] = {
      gdpChange: impact.gdpImpact,
      riskLevel: impact.riskLevelChange,
      stockChanges
    };
  }

  // Calculate total market impact (rough estimate in trillions)
  let totalMarketImpact = 0;
  for (const [code, impact] of Object.entries(countryImpacts)) {
    const country = countryMarkets.find(c => c.code === code);
    if (country) {
      // Parse GDP string like "$25.5T" or "$500B"
      const gdpStr = country.gdp.replace('$', '');
      let gdpInTrillions = 0;
      if (gdpStr.endsWith('T')) {
        gdpInTrillions = parseFloat(gdpStr.replace('T', ''));
      } else if (gdpStr.endsWith('B')) {
        gdpInTrillions = parseFloat(gdpStr.replace('B', '')) / 1000;
      }
      totalMarketImpact += (gdpInTrillions * Math.abs(impact.gdpChange)) / 100;
    }
  }

  // Calculate top gainers and losers
  const allStockChanges: Array<{ ticker: string; change: number; reason: string }> = [];

  for (const stockImpact of scenario.stockImpacts) {
    const change = stockImpact.baselineChange + (stockImpact.scenarioMultiplier * (escalationLevel - 1));
    allStockChanges.push({
      ticker: stockImpact.ticker,
      change,
      reason: stockImpact.reason
    });
  }

  const topGainers = allStockChanges
    .filter(s => s.change > 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 5);

  const topLosers = allStockChanges
    .filter(s => s.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 5);

  // Calculate sector impacts
  const sectorChanges: Record<string, number[]> = {};
  for (const impact of stage.impacts) {
    for (const [sector, change] of Object.entries(impact.stockSectorImpacts)) {
      if (!sectorChanges[sector]) {
        sectorChanges[sector] = [];
      }
      sectorChanges[sector].push(change);
    }
  }

  const affectedSectors = Object.entries(sectorChanges)
    .map(([sector, changes]) => ({
      sector,
      change: changes.reduce((a, b) => a + b, 0) / changes.length
    }))
    .sort((a, b) => Math.abs(b.change) - Math.abs(a.change));

  return {
    scenarioId: scenario.id,
    escalationLevel,
    totalMarketImpact,
    countryImpacts,
    topGainers,
    topLosers,
    affectedSectors
  };
}

/**
 * Get cascading effects for a scenario
 */
export function getCascadingEffects(
  scenario: WarScenario,
  escalationLevel: number
): CountryImpact[] {
  const stage = scenario.stages.find(s => s.level === escalationLevel);
  if (!stage) return [];

  // Secondary effects on countries not directly in the scenario
  const cascadingEffects: CountryImpact[] = [];

  // Energy-dependent countries are affected by energy disruptions
  const energySectorImpact = stage.impacts.reduce((max, impact) => {
    const energyImpact = impact.stockSectorImpacts['Energy'] || 0;
    return Math.abs(energyImpact) > Math.abs(max) ? energyImpact : max;
  }, 0);

  if (Math.abs(energySectorImpact) > 10) {
    // Add cascading effects to energy-dependent countries
    const energyDependents = ['DEU', 'JPN', 'IND', 'CHN'];
    for (const code of energyDependents) {
      if (!scenario.affectedCountries.includes(code)) {
        cascadingEffects.push({
          countryCode: code,
          gdpImpact: energySectorImpact * -0.1, // 10% of the energy impact
          stockSectorImpacts: { 'Energy': energySectorImpact * 0.3 },
          riskLevelChange: 'medium',
          description: 'Energy supply chain disruption'
        });
      }
    }
  }

  // Semiconductor-dependent countries affected by Taiwan scenarios
  if (scenario.id === 'china-taiwan' && escalationLevel >= 2) {
    const chipDependents = ['USA', 'JPN', 'KOR', 'DEU'];
    for (const code of chipDependents) {
      if (!stage.impacts.find(i => i.countryCode === code)) {
        cascadingEffects.push({
          countryCode: code,
          gdpImpact: -escalationLevel * 0.5,
          stockSectorImpacts: { 'Technology': -escalationLevel * 5, 'Semiconductors': -escalationLevel * 8 },
          riskLevelChange: 'medium',
          description: 'Semiconductor supply disruption'
        });
      }
    }
  }

  return cascadingEffects;
}

/**
 * Interpolate impact for smooth slider transitions
 */
export function interpolateImpact(
  scenario: WarScenario,
  escalationLevel: number // 1-5 with decimals
): SimulationResult {
  const lowerLevel = Math.floor(escalationLevel);
  const upperLevel = Math.ceil(escalationLevel);
  const fraction = escalationLevel - lowerLevel;

  if (lowerLevel === upperLevel || fraction === 0) {
    return calculateScenarioImpact(scenario, lowerLevel);
  }

  const lowerResult = calculateScenarioImpact(scenario, lowerLevel);
  const upperResult = calculateScenarioImpact(scenario, upperLevel);

  // Interpolate numeric values
  const interpolatedResult: SimulationResult = {
    scenarioId: scenario.id,
    escalationLevel,
    totalMarketImpact: lowerResult.totalMarketImpact + (upperResult.totalMarketImpact - lowerResult.totalMarketImpact) * fraction,
    countryImpacts: {},
    topGainers: fraction < 0.5 ? lowerResult.topGainers : upperResult.topGainers,
    topLosers: fraction < 0.5 ? lowerResult.topLosers : upperResult.topLosers,
    affectedSectors: fraction < 0.5 ? lowerResult.affectedSectors : upperResult.affectedSectors
  };

  // Interpolate country impacts
  const allCountries = new Set([
    ...Object.keys(lowerResult.countryImpacts),
    ...Object.keys(upperResult.countryImpacts)
  ]);

  for (const code of allCountries) {
    const lower = lowerResult.countryImpacts[code];
    const upper = upperResult.countryImpacts[code];

    if (lower && upper) {
      interpolatedResult.countryImpacts[code] = {
        gdpChange: lower.gdpChange + (upper.gdpChange - lower.gdpChange) * fraction,
        riskLevel: fraction < 0.5 ? lower.riskLevel : upper.riskLevel,
        stockChanges: {}
      };

      // Interpolate stock changes
      const allStocks = new Set([
        ...Object.keys(lower.stockChanges),
        ...Object.keys(upper.stockChanges)
      ]);

      for (const ticker of allStocks) {
        const lowerChange = lower.stockChanges[ticker] || 0;
        const upperChange = upper.stockChanges[ticker] || 0;
        interpolatedResult.countryImpacts[code].stockChanges[ticker] =
          lowerChange + (upperChange - lowerChange) * fraction;
      }
    } else if (lower) {
      interpolatedResult.countryImpacts[code] = {
        ...lower,
        gdpChange: lower.gdpChange * (1 - fraction),
        stockChanges: Object.fromEntries(
          Object.entries(lower.stockChanges).map(([k, v]) => [k, v * (1 - fraction)])
        )
      };
    } else if (upper) {
      interpolatedResult.countryImpacts[code] = {
        ...upper,
        gdpChange: upper.gdpChange * fraction,
        stockChanges: Object.fromEntries(
          Object.entries(upper.stockChanges).map(([k, v]) => [k, v * fraction])
        )
      };
    }
  }

  return interpolatedResult;
}

/**
 * Get color for a country based on scenario impact
 */
export function getScenarioHeatColor(
  countryCode: string,
  result: SimulationResult
): string | null {
  const impact = result.countryImpacts[countryCode];
  if (!impact) return null;

  const gdpChange = impact.gdpChange;

  // Color scale from green (positive) to red (negative)
  if (gdpChange >= 2) return '#166534'; // dark green
  if (gdpChange >= 1) return '#22c55e'; // green
  if (gdpChange >= 0) return '#86efac'; // light green
  if (gdpChange >= -2) return '#fecaca'; // light red
  if (gdpChange >= -5) return '#f87171'; // red
  if (gdpChange >= -10) return '#dc2626'; // dark red
  return '#7f1d1d'; // very dark red for severe impacts
}
