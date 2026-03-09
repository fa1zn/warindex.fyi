"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { CountryMarket, countryMarkets } from "@/data/markets";
import { countryPredictions } from "@/data/predictions";
import { getStockBrand } from "@/data/stockLogos";

// Risk level config
const riskConfig = {
  low: { label: "Low Risk", color: "bg-emerald-500", textColor: "text-emerald-600", bgColor: "bg-emerald-50" },
  medium: { label: "Moderate", color: "bg-amber-500", textColor: "text-amber-600", bgColor: "bg-amber-50" },
  high: { label: "Elevated", color: "bg-orange-500", textColor: "text-orange-600", bgColor: "bg-orange-50" },
  critical: { label: "Critical", color: "bg-red-500", textColor: "text-red-600", bgColor: "bg-red-50" },
};

// Sort countries by risk level for feed priority
function sortByRisk(countries: CountryMarket[]): CountryMarket[] {
  const riskOrder = { critical: 0, high: 1, medium: 2, low: 3 };
  return [...countries].sort((a, b) => riskOrder[a.riskLevel] - riskOrder[b.riskLevel]);
}

// Header component
function FeedHeader() {
  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">War Index</h1>
            <p className="text-xs text-gray-500 mt-0.5">Live geopolitical market signals</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-gray-500">Live</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Individual country card
function CountryCard({
  country,
  index,
  onExpand
}: {
  country: CountryMarket;
  index: number;
  onExpand: (country: CountryMarket) => void;
}) {
  const predictions = countryPredictions[country.code] || [];
  const topPrediction = predictions[0];
  const topStocks = country.topStocks.slice(0, 2);
  const risk = riskConfig[country.riskLevel];

  // Calculate average market movement
  const avgChange = country.topStocks.reduce((sum, s) => sum + s.changePercent, 0) / country.topStocks.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="mx-4 mb-3"
    >
      <motion.div
        className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
        whileTap={{ scale: 0.98 }}
        onClick={() => onExpand(country)}
      >
        {/* Card Header */}
        <div className="p-4 pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{country.flag}</div>
              <div>
                <h3 className="font-semibold text-gray-900 text-[15px]">{country.name}</h3>
                <p className="text-xs text-gray-500">{country.gdp} GDP</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className={`px-2 py-1 rounded-full ${risk.bgColor}`}>
                <span className={`text-[10px] font-semibold ${risk.textColor} uppercase tracking-wide`}>
                  {risk.label}
                </span>
              </div>
              <div className={`px-2 py-1 rounded-lg ${avgChange >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
                <span className={`text-xs font-semibold ${avgChange >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Prediction Market Bar */}
        {topPrediction && (
          <div className="px-4 pb-3">
            <div className="bg-gray-50 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500 font-medium">Top Prediction</span>
                <span className="text-[10px] text-gray-400 uppercase">{topPrediction.platform}</span>
              </div>
              <p className="text-[13px] text-gray-800 font-medium leading-snug mb-2">
                {topPrediction.question}
              </p>
              <div className="flex items-center gap-3">
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${topPrediction.probability}%` }}
                    transition={{ duration: 0.8, delay: index * 0.05 + 0.3 }}
                  />
                </div>
                <span className="text-lg font-bold text-gray-900">{topPrediction.probability}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Stocks to Watch */}
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-gray-500 font-medium">Stocks to Watch</span>
            <span className="text-[10px] text-emerald-600 font-semibold">Potential Upside</span>
          </div>
          <div className="space-y-2">
            {topStocks.map((stock, i) => {
              const brand = getStockBrand(stock.ticker);
              return (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-9 h-9 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: brand.primaryColor }}
                    >
                      <span
                        className="text-[10px] font-bold"
                        style={{ color: brand.secondaryColor }}
                      >
                        {stock.ticker.replace(/\..+/, '').slice(0, 3)}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{stock.name}</p>
                      <p className="text-[11px] text-gray-400">{stock.sector}</p>
                    </div>
                  </div>
                  {stock.potentialUpside && (
                    <div className="bg-emerald-50 px-2.5 py-1 rounded-lg">
                      <span className="text-sm font-semibold text-emerald-600">
                        {stock.potentialUpside}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Tap hint */}
        <div className="border-t border-gray-50 px-4 py-2.5 bg-gray-50/50">
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-[11px] text-gray-400">Tap for full analysis</span>
            <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Expanded detail view (bottom sheet style)
function CountryDetailSheet({
  country,
  onClose
}: {
  country: CountryMarket;
  onClose: () => void;
}) {
  const predictions = countryPredictions[country.code] || [];
  const risk = riskConfig[country.riskLevel];

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 bg-black/50 z-[100]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Sheet */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[101] bg-white rounded-t-3xl max-h-[90vh] overflow-hidden"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 30, stiffness: 300 }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="px-5 pb-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{country.flag}</span>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{country.name}</h2>
                <p className="text-sm text-gray-500">{country.gdp} GDP</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100"
            >
              <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Risk Badge */}
          <div className="mt-3 flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${risk.color}`} />
            <span className={`text-sm font-medium ${risk.textColor}`}>{risk.label}</span>
            <span className="text-sm text-gray-400">|</span>
            <span className="text-sm text-gray-500">{country.conflictImpact}</span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[calc(90vh-140px)] pb-8">
          {/* Predictions */}
          {predictions.length > 0 && (
            <div className="px-5 py-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Bet on Outcomes
              </h3>
              <div className="space-y-3">
                {predictions.map((pred, i) => (
                  <a
                    key={i}
                    href={pred.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gray-50 rounded-xl p-4 active:bg-gray-100 transition-colors"
                  >
                    <p className="text-[15px] text-gray-900 font-medium leading-snug mb-3">
                      {pred.question}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full"
                            style={{ width: `${pred.probability}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-400 uppercase">{pred.platform}</span>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <span className="text-2xl font-bold text-gray-900">{pred.probability}%</span>
                        <span className="text-xs font-semibold text-emerald-600">Bet</span>
                      </div>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Stocks */}
          <div className="px-5 py-4 border-t border-gray-100">
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Stocks to Watch
            </h3>
            <div className="space-y-2">
              {country.topStocks.map((stock, i) => {
                const brand = getStockBrand(stock.ticker);
                return (
                  <div key={i} className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center"
                          style={{ backgroundColor: brand.primaryColor }}
                        >
                          <span
                            className="text-xs font-bold"
                            style={{ color: brand.secondaryColor }}
                          >
                            {stock.ticker.replace(/\..+/, '').slice(0, 3)}
                          </span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{stock.name}</p>
                          <p className="text-xs text-gray-400">{stock.ticker} · {stock.sector}</p>
                        </div>
                      </div>
                      {stock.potentialUpside && (
                        <div className="bg-emerald-100 px-3 py-1.5 rounded-lg">
                          <span className="text-sm font-bold text-emerald-700">
                            {stock.potentialUpside}
                          </span>
                        </div>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 leading-relaxed mb-3">{stock.reason}</p>

                    <div className="bg-amber-50 rounded-lg p-3 mb-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                        <span className="text-[10px] font-semibold text-amber-700 uppercase">Conflict Exposure</span>
                      </div>
                      <p className="text-xs text-amber-800">{stock.conflictExposure}</p>
                    </div>

                    <a
                      href={`https://robinhood.com/stocks/${stock.ticker.split('.')[0]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 rounded-xl text-sm font-semibold active:bg-gray-800 transition-colors"
                    >
                      Trade on Robinhood
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

// Filter tabs
function FilterTabs({
  activeFilter,
  onFilterChange
}: {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}) {
  const filters = [
    { id: "all", label: "All" },
    { id: "critical", label: "Critical" },
    { id: "high", label: "High Risk" },
    { id: "defense", label: "Defense" },
    { id: "energy", label: "Energy" },
  ];

  return (
    <div className="px-4 py-3 overflow-x-auto scrollbar-hide">
      <div className="flex gap-2">
        {filters.map((filter) => (
          <motion.button
            key={filter.id}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              activeFilter === filter.id
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-600"
            }`}
            whileTap={{ scale: 0.95 }}
            onClick={() => onFilterChange(filter.id)}
          >
            {filter.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// Main feed component
export default function MobileCardFeed() {
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedCountry, setSelectedCountry] = useState<CountryMarket | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Filter and sort countries
  const filteredCountries = sortByRisk(countryMarkets).filter((country) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "critical") return country.riskLevel === "critical";
    if (activeFilter === "high") return country.riskLevel === "high";
    if (activeFilter === "defense") {
      return country.topStocks.some(s => s.sector === "Defense");
    }
    if (activeFilter === "energy") {
      return country.topStocks.some(s => s.sector === "Energy");
    }
    return true;
  });

  // Pull to refresh simulation
  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <FeedHeader />

      <FilterTabs activeFilter={activeFilter} onFilterChange={setActiveFilter} />

      {/* Pull to refresh indicator */}
      <AnimatePresence>
        {refreshing && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 50, opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex items-center justify-center"
          >
            <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Feed */}
      <div className="pt-2 pb-20">
        {filteredCountries.map((country, index) => (
          <CountryCard
            key={country.code}
            country={country}
            index={index}
            onExpand={setSelectedCountry}
          />
        ))}
      </div>

      {/* Quick Stats Footer */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-5 py-3 safe-area-inset-bottom">
        <div className="flex items-center justify-around">
          <div className="text-center">
            <p className="text-lg font-bold text-gray-900">{countryMarkets.length}</p>
            <p className="text-[10px] text-gray-400 uppercase">Countries</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <p className="text-lg font-bold text-red-500">
              {countryMarkets.filter(c => c.riskLevel === "critical" || c.riskLevel === "high").length}
            </p>
            <p className="text-[10px] text-gray-400 uppercase">High Risk</p>
          </div>
          <div className="w-px h-8 bg-gray-200" />
          <div className="text-center">
            <p className="text-lg font-bold text-emerald-500">
              {countryMarkets.reduce((sum, c) => sum + c.topStocks.length, 0)}
            </p>
            <p className="text-[10px] text-gray-400 uppercase">Stocks</p>
          </div>
        </div>
      </div>

      {/* Detail Sheet */}
      <AnimatePresence>
        {selectedCountry && (
          <CountryDetailSheet
            country={selectedCountry}
            onClose={() => setSelectedCountry(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
