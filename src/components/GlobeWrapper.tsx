"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import MobileFallback from "./MobileFallback";
import { CountryMarket, countryMarkets } from "@/data/markets";
import { countryPredictions, Prediction } from "@/data/predictions";

const WarHeatmap = dynamic(() => import("./map/WarHeatmap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full bg-[#0a0a0a]" />
  ),
});

interface LiveData {
  oilPrice: { value: number; change: number; changePercent: number };
  stocks: Record<string, { price: number; change: number; changePercent: number }>;
  timestamp: string;
}

// Intro Landing
function IntroLanding({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] bg-[#0a0a0a] flex items-center justify-center cursor-pointer"
      onClick={onEnter}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center">
        <motion.h1
          className="text-6xl md:text-7xl font-semibold text-white mb-6 tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          War moves markets.
        </motion.h1>
        <motion.p
          className="text-sm text-neutral-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          Click anywhere to begin
        </motion.p>
      </div>
    </motion.div>
  );
}


// Hover Card
function HoverCard({
  country,
  position,
  liveData
}: {
  country: CountryMarket;
  position: { x: number; y: number };
  liveData: LiveData | null;
}) {
  const [adjustedPos, setAdjustedPos] = useState(position);

  useEffect(() => {
    const cardWidth = 260;
    const cardHeight = 160;
    let x = position.x + 16;
    let y = position.y - cardHeight / 2;
    if (x + cardWidth > window.innerWidth - 16) x = position.x - cardWidth - 16;
    if (y < 16) y = 16;
    if (y + cardHeight > window.innerHeight - 16) y = window.innerHeight - cardHeight - 16;
    setAdjustedPos({ x, y });
  }, [position]);

  const getLivePrice = (ticker: string) => liveData?.stocks?.[ticker] || null;
  const changes = country.topStocks.map(s => {
    const live = getLivePrice(s.ticker);
    return live ? live.changePercent : s.changePercent;
  });
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;

  return (
    <motion.div
      className="fixed z-[1000] pointer-events-none"
      style={{ left: adjustedPos.x, top: adjustedPos.y }}
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <div className="bg-[#141414] border border-neutral-800 rounded-xl overflow-hidden" style={{ width: 260 }}>
        <div className="p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white font-medium">{country.name}</span>
            <span className={`text-lg font-semibold ${avgChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%
            </span>
          </div>
          <div className="space-y-2">
            {country.topStocks.slice(0, 3).map((stock, i) => {
              const live = getLivePrice(stock.ticker);
              const change = live?.changePercent ?? stock.changePercent;
              return (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-400 truncate" style={{ maxWidth: 140 }}>{stock.name}</span>
                  <span className={change >= 0 ? 'text-green-500' : 'text-red-500'}>
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="px-5 py-3 bg-neutral-900/50 border-t border-neutral-800 text-xs text-neutral-500">
          Click to view details
        </div>
      </div>
    </motion.div>
  );
}

// Detail Modal - stocks + predictions
function DetailModal({
  country,
  liveData,
  onClose
}: {
  country: CountryMarket;
  liveData: LiveData | null;
  onClose: () => void;
}) {
  const [expandedStock, setExpandedStock] = useState<string | null>(null);
  const getLivePrice = (ticker: string) => liveData?.stocks?.[ticker] || null;
  const changes = country.topStocks.map(s => {
    const live = getLivePrice(s.ticker);
    return live ? live.changePercent : s.changePercent;
  });
  const avgChange = changes.reduce((a, b) => a + b, 0) / changes.length;
  const predictions = countryPredictions[country.code] || [];

  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/70 z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed left-1/2 top-[8%] z-[1000] -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.15 }}
      >
        <div className="bg-[#111] border border-neutral-800 rounded-2xl overflow-hidden max-h-[84vh] w-[460px] flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-neutral-800">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-white font-semibold text-xl mb-1">{country.name}</h2>
                <p className="text-sm text-neutral-500">{country.gdp} GDP</p>
              </div>
              <button onClick={onClose} className="text-neutral-500 hover:text-white p-1 -mt-1 -mr-1">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Key stat */}
            <div className="bg-neutral-900/50 rounded-xl p-5">
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Conflict Impact</div>
              <div className={`text-4xl font-semibold mb-2 ${avgChange >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%
              </div>
              <p className="text-sm text-neutral-500 leading-relaxed">
                {avgChange >= 0
                  ? "Tends to benefit from geopolitical tensions"
                  : "Negatively impacted by current conflicts"
                }
              </p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* Predictions */}
            {predictions.length > 0 && (
              <div className="p-5 border-b border-neutral-800">
                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
                  Prediction Markets
                </div>
                <div className="space-y-3">
                  {predictions.map((pred, i) => (
                    <a
                      key={i}
                      href={pred.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block bg-neutral-900/50 hover:bg-neutral-800/50 rounded-xl p-4 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-white text-sm leading-relaxed flex-1">{pred.question}</p>
                        <div className="text-right shrink-0">
                          <div className="text-xl font-semibold text-white">{pred.probability}%</div>
                          <div className="text-xs text-neutral-500 capitalize">{pred.platform}</div>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <div className="h-1.5 flex-1 bg-neutral-800 rounded-full overflow-hidden mr-4">
                          <div
                            className="h-full bg-blue-500 rounded-full"
                            style={{ width: `${pred.probability}%` }}
                          />
                        </div>
                        <span className="text-xs text-blue-400 font-medium">Bet</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Stocks */}
            <div className="p-5">
              <div className="text-xs text-neutral-500 uppercase tracking-wider mb-4">
                Affected Stocks ({country.topStocks.length})
              </div>
              <div className="space-y-3">
                {country.topStocks.map((stock, i) => {
                  const live = getLivePrice(stock.ticker);
                  const change = live?.changePercent ?? stock.changePercent;
                  const isExpanded = expandedStock === stock.ticker;

                  return (
                    <div key={i} className="bg-neutral-900/50 rounded-xl overflow-hidden">
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer hover:bg-neutral-800/50 transition-colors"
                        onClick={() => setExpandedStock(isExpanded ? null : stock.ticker)}
                      >
                        <div className="flex-1 min-w-0 mr-4">
                          <div className="text-white font-medium mb-0.5">{stock.name}</div>
                          <div className="text-xs text-neutral-500">{stock.ticker} · {stock.sector}</div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`font-semibold ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                          </span>
                          <svg className={`w-4 h-4 text-neutral-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="overflow-hidden"
                          >
                            <div className="px-4 pb-4 space-y-4">
                              {/* Why */}
                              <div>
                                <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">
                                  Why {change >= 0 ? 'up' : 'down'}
                                </div>
                                <p className="text-sm text-neutral-300 leading-relaxed">{stock.reason}</p>
                              </div>

                              {/* Conflict exposure */}
                              <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
                                <div className="text-xs text-amber-500 uppercase tracking-wider mb-2">Conflict Exposure</div>
                                <p className="text-sm text-amber-200/80 leading-relaxed">{stock.conflictExposure}</p>
                              </div>

                              {/* Trade button */}
                              <a
                                href={`https://robinhood.com/stocks/${stock.ticker.split('.')[0]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block w-full bg-green-600 hover:bg-green-500 text-white text-center py-3.5 rounded-xl font-medium transition-colors"
                              >
                                Trade {stock.ticker.split('.')[0]}
                              </a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}

export default function GlobeWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<CountryMarket | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryMarket | null>(null);
  const [liveData, setLiveData] = useState<LiveData | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const fetchLiveData = async () => {
      try {
        const res = await fetch('/api/marketdata');
        const data = await res.json();
        setLiveData(data);
      } catch (e) {
        console.error('Failed to fetch live data');
      }
    };
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleHover = useCallback((country: CountryMarket | null, pos: { x: number; y: number } | null) => {
    if (!selectedCountry) {
      setHoveredCountry(country);
      setHoverPosition(pos);
    }
  }, [selectedCountry]);

  const handleClick = useCallback((country: CountryMarket) => {
    setSelectedCountry(country);
    setHoveredCountry(null);
  }, []);

  if (isMobile) return <MobileFallback />;

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Intro */}
      <AnimatePresence>
        {showIntro && <IntroLanding onEnter={() => setShowIntro(false)} />}
      </AnimatePresence>

      {/* Map */}
      <div className="absolute inset-0">
        <WarHeatmap
          onCountryHover={handleHover}
          onCountryClick={handleClick}
        />
      </div>

      {/* Hover Card */}
      <AnimatePresence>
        {hoveredCountry && hoverPosition && !selectedCountry && !showIntro && (
          <HoverCard country={hoveredCountry} position={hoverPosition} liveData={liveData} />
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedCountry && (
          <DetailModal country={selectedCountry} liveData={liveData} onClose={() => setSelectedCountry(null)} />
        )}
      </AnimatePresence>

      {/* Minimal legend - bottom left */}
      {!showIntro && (
        <div className="fixed left-4 bottom-4 z-[600] flex items-center gap-4 text-xs text-neutral-600">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
            <span>Gains</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-500" />
            <span>Losses</span>
          </div>
        </div>
      )}

      {/* Brand - bottom right */}
      {!showIntro && (
        <div className="fixed right-4 bottom-4 z-[600] text-xs text-neutral-600">
          geopolitics.fyi
        </div>
      )}
    </div>
  );
}
