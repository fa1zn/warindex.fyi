"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountryMarket } from "@/data/markets";
import { countryPredictions } from "@/data/predictions";
import { getStockBrand } from "@/data/stockLogos";

interface CountryDrawerProps {
  country: CountryMarket | null;
  isOpen: boolean;
  onClose: () => void;
  liveData?: {
    stocks: Record<string, { price: number; change: number; changePercent: number }>;
  } | null;
}

export default function CountryDrawer({
  country,
  isOpen,
  onClose,
  liveData,
}: CountryDrawerProps) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [expandedStock, setExpandedStock] = useState<string | null>(null);

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("warindex-watchlist");
    if (saved) setWatchlist(JSON.parse(saved));
  }, [isOpen]);

  const toggleWatchlist = (ticker: string) => {
    const updated = watchlist.includes(ticker)
      ? watchlist.filter(t => t !== ticker)
      : [...watchlist, ticker];
    setWatchlist(updated);
    localStorage.setItem("warindex-watchlist", JSON.stringify(updated));
  };

  if (!country) return null;

  const predictions = countryPredictions[country.code] || [];
  const getLivePrice = (ticker: string) => liveData?.stocks?.[ticker] || null;

  const getRiskBadgeStyle = (level: string) => {
    switch (level) {
      case 'critical': return { bg: '#fef2f2', color: '#dc2626' };
      case 'high': return { bg: '#fff7ed', color: '#ea580c' };
      case 'medium': return { bg: '#fffbeb', color: '#d97706' };
      case 'low': return { bg: '#f0fdf4', color: '#16a34a' };
      default: return { bg: '#f5f5f5', color: '#666' };
    }
  };

  const riskStyle = getRiskBadgeStyle(country.riskLevel);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 z-[940] bg-black/40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            className="fixed left-1/2 top-1/2 w-[440px] max-h-[85vh] bg-white z-[950] overflow-hidden flex flex-col"
            initial={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
            animate={{ opacity: 1, scale: 1, x: '-50%', y: '-50%' }}
            exit={{ opacity: 0, scale: 0.95, x: '-50%', y: '-50%' }}
            transition={{
              duration: 0.2,
              ease: [0.4, 0, 0.2, 1]
            }}
            style={{
              borderRadius: '16px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            }}
          >
            {/* Header */}
            <div className="p-8 pb-6">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 hover:text-gray-700 transition-colors"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>

              {/* Title & Subtitle */}
              <div className="pr-12">
                <div className="flex items-center gap-3">
                  <h1 className="text-[28px] font-bold text-gray-900 tracking-tight">
                    {country.name}
                  </h1>
                  <span
                    className="px-2.5 py-1 rounded-md text-xs font-semibold uppercase"
                    style={{
                      backgroundColor: riskStyle.bg,
                      color: riskStyle.color,
                    }}
                  >
                    {country.riskLevel}
                  </span>
                </div>
                <p className="text-gray-500 text-[15px] mt-1.5">
                  {country.gdp} GDP
                </p>
              </div>

              {/* Analysis Dropdown */}
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="mt-4 w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">
                  Why it&apos;s affected
                </span>
                <svg
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${showAnalysis ? 'rotate-180' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <AnimatePresence>
                {showAnalysis && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-3 space-y-4">
                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-400 mb-1.5" style={{ letterSpacing: '0.1em' }}>
                          Conflict Impact
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {country.conflictImpact}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase text-gray-400 mb-1.5" style={{ letterSpacing: '0.1em' }}>
                          Economic Outlook
                        </p>
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {country.economicSummary}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Prediction Markets Section */}
              {predictions.length > 0 && (
                <div className="px-8 pb-8">
                  <h2
                    className="text-[11px] font-semibold uppercase text-gray-400 mb-4"
                    style={{ letterSpacing: '0.1em' }}
                  >
                    Bet on Outcomes
                  </h2>
                  <div className="space-y-4">
                    {predictions.map((pred, i) => (
                      <a
                        key={i}
                        href={pred.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors group"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <p className="text-[15px] font-medium text-gray-900 leading-snug">
                              {pred.question}
                            </p>
                            <div className="flex items-center gap-3 mt-3">
                              <div className="h-1.5 w-24 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                                  style={{ width: `${pred.probability}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-400">{pred.platform}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-2xl font-bold text-gray-900">
                              {pred.probability}%
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 group-hover:underline">
                              Bet →
                            </span>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              <div className="h-px bg-gray-100 mx-8" />

              {/* Stocks Section */}
              <div className="px-8 py-8">
                <h2
                  className="text-[11px] font-semibold uppercase text-gray-400 mb-4"
                  style={{ letterSpacing: '0.1em' }}
                >
                  Stocks to Watch
                </h2>
                <div className="space-y-1">
                  {country.topStocks.map((stock) => {
                    const live = getLivePrice(stock.ticker);
                    const price = live?.price ?? stock.price;
                    const change = live?.changePercent ?? stock.changePercent;
                    const isPositive = change >= 0;
                    const brand = getStockBrand(stock.ticker);
                    const isWatched = watchlist.includes(stock.ticker);
                    const isExpanded = expandedStock === stock.ticker;

                    return (
                      <div key={stock.ticker} className="-mx-2">
                        <button
                          onClick={() => setExpandedStock(isExpanded ? null : stock.ticker)}
                          className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group text-left"
                        >
                          {/* Logo */}
                          <div
                            className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                            style={{
                              backgroundColor: brand.logoUrl ? '#f5f5f5' : brand.primaryColor,
                            }}
                          >
                            {brand.logoUrl ? (
                              <img
                                src={brand.logoUrl}
                                alt={stock.name}
                                className="w-6 h-6 object-contain"
                                onError={(e) => {
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.style.backgroundColor = brand.primaryColor;
                                    e.currentTarget.style.display = 'none';
                                    parent.innerHTML = `<span style="color: ${brand.secondaryColor}; font-size: 12px; font-weight: 700;">${stock.ticker.slice(0, 3)}</span>`;
                                  }
                                }}
                              />
                            ) : (
                              <span
                                className="text-xs font-bold"
                                style={{ color: brand.secondaryColor }}
                              >
                                {stock.ticker.replace(/\..+/, '').slice(0, 3)}
                              </span>
                            )}
                          </div>

                          {/* Name & Sector */}
                          <div className="flex-1 min-w-0">
                            <p className="text-[15px] font-semibold text-gray-900 truncate">
                              {stock.name}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5">
                              {stock.ticker} · {stock.sector}
                            </p>
                          </div>

                          {/* Price & Change */}
                          <div className="text-right">
                            <p className="text-[15px] font-semibold text-gray-900">
                              ${price.toFixed(2)}
                            </p>
                            <p className={`text-xs font-semibold ${isPositive ? 'text-emerald-600' : 'text-red-500'}`}>
                              {isPositive ? '+' : ''}{change.toFixed(2)}%
                            </p>
                          </div>

                          {/* Watchlist Heart */}
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleWatchlist(stock.ticker);
                            }}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <svg
                              className={`w-5 h-5 ${isWatched ? 'text-red-500' : 'text-gray-300'}`}
                              fill={isWatched ? 'currentColor' : 'none'}
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                              />
                            </svg>
                          </div>

                          {/* Chevron */}
                          <svg
                            className={`w-5 h-5 text-gray-300 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>

                        {/* Expanded Stock Details */}
                        <AnimatePresence>
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="px-4 pb-4 space-y-4">
                                <div className="bg-gray-50 rounded-xl p-4 space-y-3">
                                  {/* Forecast */}
                                  {stock.potentialUpside && (
                                    <div className="flex items-center justify-between">
                                      <span className="text-xs text-gray-500">Potential Upside</span>
                                      <span className="text-sm font-semibold text-emerald-600">{stock.potentialUpside}</span>
                                    </div>
                                  )}

                                  {/* Reason */}
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase text-gray-400 mb-1" style={{ letterSpacing: '0.1em' }}>
                                      Why This Stock
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                      {stock.reason}
                                    </p>
                                  </div>

                                  {/* Conflict Exposure */}
                                  <div>
                                    <p className="text-[11px] font-semibold uppercase text-gray-400 mb-1" style={{ letterSpacing: '0.1em' }}>
                                      Conflict Exposure
                                    </p>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                      {stock.conflictExposure}
                                    </p>
                                  </div>
                                </div>

                                {/* Trade on Robinhood Button */}
                                <a
                                  href={`https://robinhood.com/stocks/${stock.ticker.split('.')[0]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center gap-2 w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold text-sm transition-colors"
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

              {/* Bottom padding */}
              <div className="h-8" />
            </div>

            {/* Footer */}
            <div className="px-8 py-4 border-t border-gray-100 bg-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    Live data
                  </span>
                </div>
                <span className="text-xs text-gray-300">
                  {country.currency}
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
