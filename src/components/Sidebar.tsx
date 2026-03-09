"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountryMarket, countryMarkets } from "@/data/markets";

interface SidebarProps {
  onCountrySelect: (country: CountryMarket) => void;
  onStockSelect?: (ticker: string, country: CountryMarket) => void;
}

interface PoliticianTrade {
  politician: string;
  party: "D" | "R";
  ticker: string;
  company: string;
  type: "buy" | "sell";
  amount: string;
  date: string;
  disclosure: string;
}

type TabType = "search" | "countries" | "stocks" | "politicians" | "watchlist";

export default function Sidebar({ onCountrySelect, onStockSelect }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [politicianTrades, setPoliticianTrades] = useState<PoliticianTrade[]>([]);
  const [tradesLoading, setTradesLoading] = useState(false);
  const [watchlist, setWatchlist] = useState<string[]>([]);

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("warindex-watchlist");
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  // Save watchlist to localStorage
  const toggleWatchlist = (ticker: string) => {
    const updated = watchlist.includes(ticker)
      ? watchlist.filter(t => t !== ticker)
      : [...watchlist, ticker];
    setWatchlist(updated);
    localStorage.setItem("warindex-watchlist", JSON.stringify(updated));
  };

  // Fetch politician trades
  useEffect(() => {
    if (activeTab === "politicians" && politicianTrades.length === 0) {
      fetchPoliticianTrades();
    }
  }, [activeTab]);

  const fetchPoliticianTrades = async () => {
    setTradesLoading(true);
    try {
      const res = await fetch("/api/politicians");
      const data = await res.json();
      if (data.trades) setPoliticianTrades(data.trades);
    } catch (e) {
      console.error("Failed to fetch politician trades");
    } finally {
      setTradesLoading(false);
    }
  };

  // All stocks from all countries
  const allStocks = useMemo(() => {
    return countryMarkets.flatMap(country =>
      country.topStocks.map(stock => ({
        ...stock,
        country,
      }))
    );
  }, []);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { countries: [], stocks: [] };
    const q = searchQuery.toLowerCase();
    return {
      countries: countryMarkets.filter(c =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      ),
      stocks: allStocks.filter(s =>
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q) ||
        s.sector.toLowerCase().includes(q)
      ),
    };
  }, [searchQuery, allStocks]);

  // Get watchlist stocks
  const watchlistStocks = useMemo(() => {
    return allStocks.filter(s => watchlist.includes(s.ticker));
  }, [watchlist, allStocks]);

  const tabs: { id: TabType; label: string; icon: JSX.Element }[] = [
    {
      id: "search",
      label: "Search",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      id: "countries",
      label: "Countries",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      id: "stocks",
      label: "Stocks",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
    },
    {
      id: "politicians",
      label: "Politicians",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      id: "watchlist",
      label: "Watchlist",
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
  ];

  const riskColors = {
    low: "bg-emerald-500",
    medium: "bg-amber-500",
    high: "bg-orange-500",
    critical: "bg-red-500",
  };

  return (
    <>
      {/* Toggle Button */}
      <motion.button
        className="fixed top-4 left-4 z-[1001] w-12 h-12 bg-[#1a1a1a]/90 backdrop-blur-xl rounded-xl flex items-center justify-center border border-white/10 hover:border-white/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-[999] bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed top-0 left-0 bottom-0 z-[1000] w-[340px] bg-[#111111] border-r border-white/10 flex flex-col"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10">
              <h2 className="text-white font-semibold text-lg">War Index</h2>
              <p className="text-gray-500 text-sm mt-1">Track conflicts & markets</p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 min-w-[60px] flex flex-col items-center gap-1 py-3 px-2 transition-colors ${
                    activeTab === tab.id
                      ? "text-emerald-400 border-b-2 border-emerald-400"
                      : "text-gray-500 hover:text-gray-300"
                  }`}
                >
                  {tab.icon}
                  <span className="text-[10px] font-medium">{tab.label}</span>
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              {/* Search Tab */}
              {activeTab === "search" && (
                <div className="p-4">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      placeholder="Search countries, stocks..."
                      className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500/50"
                    />
                  </div>

                  {searchQuery && (
                    <div className="mt-4 space-y-4">
                      {searchResults.countries.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Countries</h4>
                          <div className="space-y-1">
                            {searchResults.countries.slice(0, 5).map(country => (
                              <button
                                key={country.code}
                                onClick={() => {
                                  onCountrySelect(country);
                                  setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <span className="text-xl">{country.flag}</span>
                                <div className="flex-1 text-left">
                                  <div className="text-white text-sm font-medium">{country.name}</div>
                                  <div className="text-gray-500 text-xs">{country.gdp}</div>
                                </div>
                                <div className={`w-2 h-2 rounded-full ${riskColors[country.riskLevel]}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.stocks.length > 0 && (
                        <div>
                          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Stocks</h4>
                          <div className="space-y-1">
                            {searchResults.stocks.slice(0, 8).map(stock => (
                              <button
                                key={stock.ticker}
                                onClick={() => {
                                  onCountrySelect(stock.country);
                                  setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                              >
                                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                                  <span className="text-[10px] font-bold text-gray-400">{stock.ticker.slice(0, 3)}</span>
                                </div>
                                <div className="flex-1 text-left">
                                  <div className="text-white text-sm font-medium">{stock.name}</div>
                                  <div className="text-gray-500 text-xs">{stock.ticker} · {stock.country.name}</div>
                                </div>
                                <span className={`text-sm font-semibold ${stock.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                                  {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(1)}%
                                </span>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                      {searchResults.countries.length === 0 && searchResults.stocks.length === 0 && (
                        <div className="text-center py-8 text-gray-500">
                          No results found
                        </div>
                      )}
                    </div>
                  )}

                  {!searchQuery && (
                    <div className="mt-6 text-center text-gray-500 text-sm">
                      Search for countries, stocks, or sectors
                    </div>
                  )}
                </div>
              )}

              {/* Countries Tab */}
              {activeTab === "countries" && (
                <div className="p-4 space-y-1">
                  {countryMarkets.map(country => (
                    <button
                      key={country.code}
                      onClick={() => {
                        onCountrySelect(country);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <span className="text-xl">{country.flag}</span>
                      <div className="flex-1 text-left">
                        <div className="text-white text-sm font-medium">{country.name}</div>
                        <div className="text-gray-500 text-xs">{country.gdp}</div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${riskColors[country.riskLevel]}`} />
                    </button>
                  ))}
                </div>
              )}

              {/* Stocks Tab */}
              {activeTab === "stocks" && (
                <div className="p-4 space-y-1">
                  {allStocks.slice(0, 30).map(stock => (
                    <button
                      key={stock.ticker}
                      onClick={() => {
                        onCountrySelect(stock.country);
                        setIsOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                        <span className="text-[10px] font-bold text-gray-400">{stock.ticker.slice(0, 3)}</span>
                      </div>
                      <div className="flex-1 text-left">
                        <div className="text-white text-sm font-medium">{stock.name}</div>
                        <div className="text-gray-500 text-xs">{stock.ticker} · {stock.sector}</div>
                      </div>
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          toggleWatchlist(stock.ticker);
                        }}
                        className="opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <svg
                          className={`w-5 h-5 ${watchlist.includes(stock.ticker) ? "text-red-400 fill-current" : "text-gray-500"}`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                      <span className={`text-sm font-semibold ${stock.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(1)}%
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* Politicians Tab */}
              {activeTab === "politicians" && (
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Recent Trades</h4>
                    <button
                      onClick={fetchPoliticianTrades}
                      className="text-xs text-emerald-400 hover:text-emerald-300"
                    >
                      Refresh
                    </button>
                  </div>

                  {tradesLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="w-6 h-6 border-2 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin" />
                    </div>
                  ) : politicianTrades.length > 0 ? (
                    <div className="space-y-2">
                      {politicianTrades.map((trade, i) => (
                        <div
                          key={i}
                          className="p-3 rounded-lg bg-white/5 border border-white/5"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                                trade.party === "D" ? "bg-blue-500/20 text-blue-400" : "bg-red-500/20 text-red-400"
                              }`}>
                                {trade.party}
                              </span>
                              <span className="text-white text-sm font-medium">{trade.politician}</span>
                            </div>
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded ${
                              trade.type === "buy" ? "bg-emerald-500/20 text-emerald-400" : "bg-red-500/20 text-red-400"
                            }`}>
                              {trade.type.toUpperCase()}
                            </span>
                          </div>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-white text-sm">{trade.ticker}</div>
                              <div className="text-gray-500 text-xs">{trade.company}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-white text-sm">{trade.amount}</div>
                              <div className="text-gray-500 text-xs">{trade.date}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500 text-sm">
                      No politician trades available
                    </div>
                  )}

                  <div className="mt-4 p-3 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <div className="flex items-start gap-2">
                      <svg className="w-4 h-4 text-amber-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-amber-200/80 text-xs">
                        Congressional trading data from public disclosures. Updated periodically.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Watchlist Tab */}
              {activeTab === "watchlist" && (
                <div className="p-4">
                  {watchlistStocks.length > 0 ? (
                    <div className="space-y-1">
                      {watchlistStocks.map(stock => (
                        <div
                          key={stock.ticker}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white/5"
                        >
                          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-gray-400">{stock.ticker.slice(0, 3)}</span>
                          </div>
                          <div className="flex-1">
                            <div className="text-white text-sm font-medium">{stock.name}</div>
                            <div className="text-gray-500 text-xs">{stock.ticker}</div>
                          </div>
                          <button
                            onClick={() => toggleWatchlist(stock.ticker)}
                            className="p-1"
                          >
                            <svg className="w-5 h-5 text-red-400 fill-current" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                          </button>
                          <span className={`text-sm font-semibold ${stock.changePercent >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(1)}%
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <svg className="w-12 h-12 text-gray-600 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <p className="text-gray-500 text-sm">No stocks in watchlist</p>
                      <p className="text-gray-600 text-xs mt-1">Click the heart icon on any stock to add it</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
