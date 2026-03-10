"use client";

import dynamic from "next/dynamic";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountryMarket, countryMarkets } from "@/data/markets";
import { countryPredictions, Prediction } from "@/data/predictions";
import { getStockBrand } from "@/data/stockLogos";
import { conflictAlerts, ConflictAlert } from "@/data/conflicts";
import NewsTicker from "./NewsTicker";
import TopBar from "./TopBar";
import WatchlistModal from "./WatchlistModal";
import ConflictDetailModal from "./ConflictDetailModal";
import CountryDrawer from "./CountryDrawer";

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

// Intro Landing - Dark theme
function IntroLanding({ onEnter }: { onEnter: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[9999] cursor-pointer bg-[#0a0a0a]"
      onClick={onEnter}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="h-full flex flex-col items-center justify-center px-6">
        <motion.div
          className="text-center max-w-2xl"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <h1 className="text-[40px] sm:text-[56px] md:text-[72px] font-semibold text-white tracking-[-0.04em] leading-[1.05]">
            Geopolitics moves{" "}
            <span className="bg-gradient-to-r from-[#10b981] to-[#059669] bg-clip-text text-transparent">
              markets
            </span>
          </h1>
          <motion.p
            className="text-[17px] sm:text-[19px] md:text-[21px] text-gray-400 mt-4 sm:mt-5 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Track conflicts. Predict outcomes. Trade the signal.
          </motion.p>
          <motion.p
            className="text-[13px] sm:text-[14px] text-gray-500 mt-8 sm:mt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Tap anywhere to explore
          </motion.p>
        </motion.div>
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
    const cardWidth = 300;
    const cardHeight = 180;
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

  const riskColors = {
    low: 'bg-emerald-500',
    medium: 'bg-amber-500',
    high: 'bg-orange-500',
    critical: 'bg-red-500'
  };

  return (
    <motion.div
      className="fixed z-[1000] pointer-events-none"
      style={{ left: adjustedPos.x, top: adjustedPos.y }}
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      transition={{ type: 'spring', damping: 25, stiffness: 400 }}
    >
      <div
        className="bg-[#1a1a1a]/95 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10"
        style={{
          width: 320,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.05)'
        }}
      >
        {/* Header */}
        <div className="p-5 pb-4">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-white font-semibold text-lg tracking-tight">{country.name}</span>
                <div className={`w-2 h-2 rounded-full ${riskColors[country.riskLevel]}`} />
              </div>
              <span className="text-gray-400 text-[13px]">{country.gdp} GDP</span>
            </div>
            <div className="text-right">
              <span className={`text-2xl font-bold tracking-tight ${avgChange >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {avgChange >= 0 ? '+' : ''}{avgChange.toFixed(1)}%
              </span>
              <div className="text-[11px] text-gray-500 mt-0.5">avg change</div>
            </div>
          </div>
        </div>

        {/* Stocks */}
        <div className="px-5 pb-4 space-y-2">
          {country.topStocks.slice(0, 3).map((stock, i) => {
            const live = getLivePrice(stock.ticker);
            const change = live?.changePercent ?? stock.changePercent;
            const isPositive = change >= 0;
            return (
              <motion.div
                key={i}
                className="flex items-center justify-between py-2 px-3 rounded-lg bg-white/5"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <span className="text-[10px] font-bold text-gray-400">{stock.ticker.slice(0, 3)}</span>
                  </div>
                  <span className="text-gray-200 text-[14px] font-medium truncate" style={{ maxWidth: 140 }}>{stock.name}</span>
                </div>
                <span className={`font-semibold text-[14px] ${isPositive ? 'text-emerald-400' : 'text-red-400'}`}>
                  {isPositive ? '+' : ''}{change.toFixed(1)}%
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-white/5 border-t border-white/10 flex items-center justify-between">
          <span className="text-[12px] text-gray-400">Click to explore</span>
          <motion.svg
            className="w-4 h-4 text-emerald-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </motion.svg>
        </div>
      </div>
    </motion.div>
  );
}

interface LivePrediction {
  id: string;
  question: string;
  probability: number;
  volume: number;
  url: string;
  platform: "polymarket" | "kalshi";
  change24h?: number;
}

// Detail Modal - Full screen on mobile, centered modal on desktop
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
  const [isMobileView, setIsMobileView] = useState(false);
  const [livePredictions, setLivePredictions] = useState<LivePrediction[]>([]);
  const [predictionsLoading, setPredictionsLoading] = useState(true);
  const getLivePrice = (ticker: string) => liveData?.stocks?.[ticker] || null;
  const staticPredictions = countryPredictions[country.code] || [];

  useEffect(() => {
    const checkMobile = () => setIsMobileView(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Fetch live prediction market data
  useEffect(() => {
    const fetchLivePredictions = async () => {
      try {
        const res = await fetch("/api/polymarket");
        const data = await res.json();
        if (data.markets) {
          // Filter markets relevant to this country
          const relevant = data.markets.filter((m: LivePrediction & { country?: string }) =>
            m.country === country.code ||
            m.question.toLowerCase().includes(country.name.toLowerCase())
          );
          setLivePredictions(relevant.length > 0 ? relevant : []);
        }
      } catch (error) {
        console.error("Failed to fetch live predictions:", error);
      } finally {
        setPredictionsLoading(false);
      }
    };

    fetchLivePredictions();
  }, [country.code, country.name]);

  // Use live predictions if available, otherwise fall back to static
  const predictions = livePredictions.length > 0
    ? livePredictions.map(p => ({
        question: p.question,
        probability: p.probability,
        platform: p.platform,
        url: p.url,
        change24h: p.change24h,
        volume: p.volume,
      }))
    : staticPredictions;

  // Mobile: smooth bottom sheet modal
  if (isMobileView) {
    return (
      <>
        {/* Backdrop with fade */}
        <motion.div
          className="fixed inset-0 z-[99999] bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        />

        {/* Bottom sheet with smooth slide */}
        <motion.div
          className="fixed inset-x-0 bottom-0 z-[100000] bg-white rounded-t-3xl"
          style={{ maxHeight: '85vh', boxShadow: '0 -10px 50px rgba(0,0,0,0.25)' }}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 350 }}
        >
          {/* Drag handle */}
          <div className="flex justify-center pt-3 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
          </div>

          {/* Header */}
          <div className="px-7 py-6 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <h2 className="text-gray-900 font-semibold text-xl tracking-tight">{country.name}</h2>
                <p className="text-gray-500 text-sm mt-1.5">{country.gdp} GDP</p>
              </motion.div>
              <motion.button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 active:bg-gray-200"
                whileTap={{ scale: 0.9 }}
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto overscroll-contain" style={{ maxHeight: 'calc(85vh - 100px)' }}>
            {/* Predictions Section */}
            {predictions.length > 0 && (
              <div className="px-7 py-7">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Bet on Outcomes
                  </h3>
                  {livePredictions.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 uppercase">Live</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {predictions.map((pred: any, i: number) => (
                    <motion.a
                      key={i}
                      href={pred.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl block"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 + i * 0.05 }}
                      whileTap={{ scale: 0.98, backgroundColor: 'rgb(243 244 246)' }}
                    >
                      <div className="flex-1 mr-6">
                        <p className="text-gray-900 text-[15px] font-medium leading-snug">{pred.question}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-emerald-500 rounded-full"
                              initial={{ width: 0 }}
                              animate={{ width: `${pred.probability}%` }}
                              transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }}
                            />
                          </div>
                          <span className="text-xs text-gray-400">{pred.platform}</span>
                          {pred.volume && pred.volume > 0 && (
                            <span className="text-xs text-gray-400">${(pred.volume / 1000).toFixed(0)}k vol</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{pred.probability}%</div>
                        {pred.change24h && pred.change24h !== 0 ? (
                          <span className={`text-xs font-semibold ${pred.change24h > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {pred.change24h > 0 ? '+' : ''}{pred.change24h.toFixed(1)}% 24h
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600">Bet →</span>
                        )}
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Stocks Section */}
            <div className="px-7 py-7 border-t border-gray-100">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
                Stocks to Watch
              </h3>
              <div className="space-y-4">
                {country.topStocks.map((stock, i) => {
                  const live = getLivePrice(stock.ticker);
                  const price = live?.price ?? stock.price;
                  const change = live?.changePercent ?? stock.changePercent;
                  const isExpanded = expandedStock === stock.ticker;
                  const isPositive = change >= 0;
                  const brand = getStockBrand(stock.ticker);

                  return (
                    <motion.div
                      key={i}
                      className="border border-gray-100 rounded-2xl overflow-hidden bg-white"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + i * 0.05 }}
                    >
                      <motion.div
                        className="flex items-center gap-4 p-5 cursor-pointer"
                        onClick={() => setExpandedStock(isExpanded ? null : stock.ticker)}
                        whileTap={{ backgroundColor: 'rgb(249 250 251)' }}
                      >
                        {/* Logo */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ backgroundColor: brand.logoUrl ? '#f3f4f6' : brand.primaryColor }}
                        >
                          {brand.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={brand.logoUrl}
                              alt={stock.name}
                              className="w-7 h-7 object-contain"
                              onError={(e) => {
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.style.backgroundColor = brand.primaryColor;
                                  e.currentTarget.style.display = 'none';
                                }
                              }}
                            />
                          ) : (
                            <span className="text-sm font-bold" style={{ color: brand.secondaryColor }}>
                              {stock.ticker.replace(/\..+/, '').slice(0, 3)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-gray-900 font-semibold text-[15px]">{stock.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{stock.ticker} · {stock.sector}</div>
                        </div>

                        <div className="text-right mr-2">
                          <div className="text-gray-900 font-semibold text-[15px]">${price.toFixed(2)}</div>
                          <div className={`text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isPositive ? '+' : ''}{change.toFixed(2)}%
                          </div>
                        </div>

                        <motion.svg
                          className="w-5 h-5 text-gray-300"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                          animate={{ rotate: isExpanded ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </motion.svg>
                      </motion.div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-4 bg-gray-50 border-t border-gray-100">
                              <div className="bg-white rounded-xl p-5 mb-4 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2.5">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Why This Stock</span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{stock.reason}</p>
                              </div>
                              <div className="bg-amber-50 rounded-xl p-5 mb-5 border border-amber-100">
                                <div className="flex items-center gap-2 mb-2.5">
                                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">Conflict Exposure</span>
                                </div>
                                <p className="text-sm text-amber-800 leading-relaxed">{stock.conflictExposure}</p>
                              </div>
                              <motion.a
                                href={`https://robinhood.com/stocks/${stock.ticker.split('.')[0]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-4 rounded-xl text-sm font-semibold"
                                whileTap={{ scale: 0.98 }}
                              >
                                Trade on Robinhood
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                              </motion.a>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom safe area padding */}
            <div className="h-12" />
          </div>
        </motion.div>
      </>
    );
  }

  // Desktop: centered modal
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-black/50 z-[999]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />
      <motion.div
        className="fixed left-1/2 top-[50%] z-[1000] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
      >
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] w-[480px] flex flex-col">
          {/* Header */}
          <div className="px-10 pt-8 pb-7 border-b border-gray-100">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-gray-900 font-semibold text-2xl tracking-tight">{country.name}</h2>
                <p className="text-gray-500 text-sm mt-1.5">{country.gdp} GDP</p>
              </div>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto pb-8">
            {/* Predictions Section */}
            {predictions.length > 0 && (
              <div className="px-10 py-8">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Bet on Outcomes
                  </h3>
                  {livePredictions.length > 0 && (
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <div className="absolute inset-0 w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                      </div>
                      <span className="text-[10px] font-semibold text-emerald-600 uppercase">Live</span>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  {predictions.map((pred: any, i: number) => (
                    <a
                      key={i}
                      href={pred.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-6 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group"
                    >
                      <div className="flex-1 mr-6">
                        <p className="text-gray-900 text-[15px] font-medium leading-snug">{pred.question}</p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${pred.probability}%` }} />
                          </div>
                          <span className="text-xs text-gray-400">{pred.platform}</span>
                          {pred.volume && pred.volume > 0 && (
                            <span className="text-xs text-gray-400">${(pred.volume / 1000).toFixed(0)}k vol</span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-gray-900">{pred.probability}%</div>
                        {pred.change24h && pred.change24h !== 0 ? (
                          <span className={`text-xs font-semibold ${pred.change24h > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                            {pred.change24h > 0 ? '+' : ''}{pred.change24h.toFixed(1)}% 24h
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-emerald-600 group-hover:underline">Bet →</span>
                        )}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Stocks Section */}
            <div className="border-t border-gray-100 px-10 py-8">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-5">
                Stocks to Watch
              </h3>
              <div className="space-y-4">
                {country.topStocks.map((stock, i) => {
                  const live = getLivePrice(stock.ticker);
                  const price = live?.price ?? stock.price;
                  const change = live?.changePercent ?? stock.changePercent;
                  const isExpanded = expandedStock === stock.ticker;
                  const isPositive = change >= 0;
                  const brand = getStockBrand(stock.ticker);

                  return (
                    <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden">
                      <div
                        className="flex items-center gap-5 p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                        onClick={() => setExpandedStock(isExpanded ? null : stock.ticker)}
                      >
                        {/* Logo */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                          style={{ backgroundColor: brand.logoUrl ? '#f3f4f6' : brand.primaryColor }}
                        >
                          {brand.logoUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={brand.logoUrl}
                              alt={stock.name}
                              className="w-7 h-7 object-contain"
                              onError={(e) => {
                                const parent = e.currentTarget.parentElement;
                                if (parent) {
                                  parent.style.backgroundColor = brand.primaryColor;
                                  e.currentTarget.style.display = 'none';
                                }
                              }}
                            />
                          ) : (
                            <span className="text-sm font-bold" style={{ color: brand.secondaryColor }}>
                              {stock.ticker.replace(/\..+/, '').slice(0, 3)}
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="text-gray-900 font-semibold text-[15px]">{stock.name}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{stock.ticker} · {stock.sector}</div>
                        </div>

                        <div className="text-right mr-2">
                          <div className="text-gray-900 font-semibold text-[15px]">${price.toFixed(2)}</div>
                          <div className={`text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                            {isPositive ? '+' : ''}{change.toFixed(2)}%
                          </div>
                        </div>

                        <svg
                          className={`w-5 h-5 text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="px-6 pb-6 pt-4 bg-gray-50 border-t border-gray-100">
                              <div className="bg-white rounded-xl p-5 mb-4 border border-gray-100">
                                <div className="flex items-center gap-2 mb-2.5">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                                    Why This Stock
                                  </span>
                                </div>
                                <p className="text-sm text-gray-700 leading-relaxed">{stock.reason}</p>
                              </div>

                              <div className="bg-amber-50 rounded-xl p-5 mb-5 border border-amber-100">
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                                  <span className="text-xs font-semibold text-amber-700 uppercase tracking-wide">
                                    Conflict Exposure
                                  </span>
                                </div>
                                <p className="text-sm text-amber-800 leading-relaxed">{stock.conflictExposure}</p>
                              </div>

                              <a
                                href={`https://robinhood.com/stocks/${stock.ticker.split('.')[0]}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 w-full bg-gray-900 hover:bg-gray-800 text-white py-4 rounded-xl text-sm font-semibold transition-colors"
                              >
                                Trade on Robinhood
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
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
  const [showIntro, setShowIntro] = useState(true);
  const [hoveredCountry, setHoveredCountry] = useState<CountryMarket | null>(null);
  const [hoverPosition, setHoverPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<CountryMarket | null>(null);
  const [liveData, setLiveData] = useState<LiveData | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // New modal states
  const [showWatchlist, setShowWatchlist] = useState(false);
  const [showAlerts, setShowAlerts] = useState(false);
  const [selectedConflict, setSelectedConflict] = useState<ConflictAlert | null>(null);

  // Get active critical conflicts for the alert indicator
  const criticalConflicts = conflictAlerts.filter(
    (c) => c.isActive && (c.severity === "critical" || c.severity === "high")
  );

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
    // Disable hover cards on mobile (tap only)
    if (!selectedCountry && !isMobile) {
      setHoveredCountry(country);
      setHoverPosition(pos);
    }
  }, [selectedCountry, isMobile]);

  const handleClick = useCallback((country: CountryMarket) => {
    setSelectedCountry(country);
    setHoveredCountry(null);
  }, []);

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

      {/* Country Drawer */}
      <CountryDrawer
        country={selectedCountry}
        isOpen={!!selectedCountry}
        onClose={() => setSelectedCountry(null)}
        liveData={liveData}
      />

      {/* Live News Ticker */}
      {!showIntro && !selectedCountry && <NewsTicker />}

      {/* Top Bar */}
      {!showIntro && (
        <TopBar onCountrySelect={handleClick} />
      )}

      {/* Floating Alerts Button */}
      {!showIntro && !selectedCountry && (
        <div className="fixed bottom-24 right-6 z-[900]">
          <motion.button
            onClick={() => setShowAlerts(true)}
            className="flex items-center gap-2 px-4 py-3 bg-white rounded-2xl shadow-xl shadow-black/10 border border-black/5 hover:bg-gray-50 transition-colors"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <div className="relative">
              <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              {criticalConflicts.length > 0 && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
              )}
            </div>
            <span className="text-gray-900 text-sm font-semibold">
              {criticalConflicts.length} Active
            </span>
          </motion.button>
        </div>
      )}

      {/* Alerts Panel - Fixed position, below nav bar (z-[1001]) */}
      <AnimatePresence>
        {showAlerts && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/50 z-[900]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAlerts(false)}
            />
            <motion.div
              className="fixed top-0 right-0 h-screen w-[380px] bg-white z-[950] flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              style={{ boxShadow: "-10px 0 40px rgba(0,0,0,0.15)" }}
            >
              {/* Header - Fixed at top */}
              <div className="flex-shrink-0 px-6 pt-6 pb-5 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-gray-900 font-semibold text-xl tracking-tight">Active Conflicts</h2>
                    <p className="text-gray-500 text-sm mt-1">{conflictAlerts.filter(c => c.isActive).length} ongoing situations</p>
                  </div>
                  <button
                    onClick={() => setShowAlerts(false)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors flex-shrink-0"
                  >
                    <svg className="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Conflicts List - Scrollable */}
              <div className="flex-1 overflow-y-auto p-4">
                <div className="space-y-3">
                  {conflictAlerts.filter(c => c.isActive).map((conflict, i) => {
                    const severityColors = {
                      low: { bg: "bg-emerald-50", border: "border-emerald-200", dot: "bg-emerald-500" },
                      medium: { bg: "bg-amber-50", border: "border-amber-200", dot: "bg-amber-500" },
                      high: { bg: "bg-orange-50", border: "border-orange-200", dot: "bg-orange-500" },
                      critical: { bg: "bg-red-50", border: "border-red-200", dot: "bg-red-500" },
                    };
                    const colors = severityColors[conflict.severity];

                    return (
                      <motion.button
                        key={conflict.id}
                        onClick={() => {
                          setSelectedConflict(conflict);
                          setShowAlerts(false);
                        }}
                        className={`w-full text-left p-5 rounded-2xl ${colors.bg} border ${colors.border} hover:shadow-md transition-all`}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                      >
                        <div className="flex items-start gap-3">
                          <div className="relative mt-1">
                            <div className={`w-3 h-3 rounded-full ${colors.dot}`} />
                            {conflict.severity === "critical" && (
                              <div className={`absolute inset-0 w-3 h-3 rounded-full ${colors.dot} animate-ping`} />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-gray-900 font-semibold text-[15px] leading-snug mb-1">
                              {conflict.title}
                            </h3>
                            <p className="text-gray-600 text-sm line-clamp-2">{conflict.description}</p>
                            <div className="flex items-center gap-3 mt-3">
                              <span className="text-gray-400 text-xs">{conflict.date}</span>
                              <div className="flex items-center gap-1">
                                {conflict.affectedCountries.slice(0, 3).map((code) => {
                                  const country = countryMarkets.find(c => c.code === code);
                                  return country ? (
                                    <span key={code} className="text-sm">{country.flag}</span>
                                  ) : null;
                                })}
                                {conflict.affectedCountries.length > 3 && (
                                  <span className="text-xs text-gray-400">+{conflict.affectedCountries.length - 3}</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <svg className="w-5 h-5 text-gray-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Watchlist Modal */}
      <WatchlistModal
        isOpen={showWatchlist}
        onClose={() => setShowWatchlist(false)}
        onCountrySelect={handleClick}
      />

      {/* Conflict Detail Modal */}
      <ConflictDetailModal
        isOpen={!!selectedConflict}
        onClose={() => setSelectedConflict(null)}
        conflict={selectedConflict}
        onCountrySelect={handleClick}
      />
    </div>
  );
}
