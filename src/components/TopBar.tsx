"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CountryMarket, countryMarkets } from "@/data/markets";
import { getStockBrand } from "@/data/stockLogos";

interface TopBarProps {
  onCountrySelect: (country: CountryMarket) => void;
}

interface PoliticianTrade {
  politician: string;
  party: "D" | "R";
  ticker: string;
  company: string;
  type: "buy" | "sell";
  amount: string;
  date: string;
}

type DropdownType = "watchlist" | "politicians" | "hedgefunds" | null;

export default function TopBar({ onCountrySelect }: TopBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownType>(null);
  const [politicianTrades, setPoliticianTrades] = useState<PoliticianTrade[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [selectedPolitician, setSelectedPolitician] = useState<string | null>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load watchlist
  useEffect(() => {
    const saved = localStorage.getItem("warindex-watchlist");
    if (saved) setWatchlist(JSON.parse(saved));
  }, []);

  // Fetch politician trades
  useEffect(() => {
    fetch("/api/politicians")
      .then(res => res.json())
      .then(data => {
        if (data.trades) setPoliticianTrades(data.trades);
      })
      .catch(console.error);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
        setSelectedPolitician(null);
      }
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // All stocks
  const allStocks = useMemo(() => {
    return countryMarkets.flatMap(country =>
      country.topStocks.map(stock => ({ ...stock, country }))
    );
  }, []);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { countries: [], stocks: [] };
    const q = searchQuery.toLowerCase();
    return {
      countries: countryMarkets.filter(c =>
        c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q)
      ).slice(0, 4),
      stocks: allStocks.filter(s =>
        s.ticker.toLowerCase().includes(q) ||
        s.name.toLowerCase().includes(q)
      ).slice(0, 6),
    };
  }, [searchQuery, allStocks]);

  // Watchlist stocks
  const watchlistStocks = useMemo(() => {
    return allStocks.filter(s => watchlist.includes(s.ticker));
  }, [watchlist, allStocks]);

  // Group trades by politician
  const politicianGroups = useMemo(() => {
    const groups: Record<string, PoliticianTrade[]> = {};
    politicianTrades.forEach(trade => {
      if (!groups[trade.politician]) groups[trade.politician] = [];
      groups[trade.politician].push(trade);
    });
    return groups;
  }, [politicianTrades]);

  const toggleWatchlist = (ticker: string) => {
    const updated = watchlist.includes(ticker)
      ? watchlist.filter(t => t !== ticker)
      : [...watchlist, ticker];
    setWatchlist(updated);
    localStorage.setItem("warindex-watchlist", JSON.stringify(updated));
  };

  const hasResults = searchResults.countries.length > 0 || searchResults.stocks.length > 0;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[1001]">
      <div className="flex items-center gap-3">
        {/* Search Pill */}
        <div ref={searchRef} className="relative">
          <div
            className="flex items-center gap-3 bg-white/95 backdrop-blur-xl rounded-full px-4 py-2.5 shadow-lg shadow-black/5 border border-black/5 cursor-text"
            onClick={() => document.getElementById('search-input')?.focus()}
          >
            <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              id="search-input"
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search"
              className="w-48 bg-transparent text-gray-900 text-sm placeholder-gray-400 focus:outline-none"
            />
            <div className="flex items-center gap-0.5 text-gray-300">
              <kbd className="text-[10px] px-1.5 py-0.5 bg-gray-100 rounded font-medium text-gray-400">⌘K</kbd>
            </div>
          </div>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchFocused && searchQuery && hasResults && (
              <motion.div
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-black/5 min-w-[320px]"
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.15 }}
              >
                {searchResults.countries.length > 0 && (
                  <div className="p-2">
                    <div className="text-[11px] font-medium text-gray-400 px-2 py-1.5">Countries</div>
                    {searchResults.countries.map(country => (
                      <button
                        key={country.code}
                        onClick={() => {
                          onCountrySelect(country);
                          setSearchQuery("");
                          setSearchFocused(false);
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-gray-900 text-sm font-medium">{country.name}</span>
                        <span className="text-gray-400 text-xs ml-auto">{country.code}</span>
                      </button>
                    ))}
                  </div>
                )}
                {searchResults.stocks.length > 0 && (
                  <div className="p-2 border-t border-gray-100">
                    <div className="text-[11px] font-medium text-gray-400 px-2 py-1.5">Stocks</div>
                    {searchResults.stocks.map(stock => {
                      const brand = getStockBrand(stock.ticker);
                      return (
                        <button
                          key={stock.ticker}
                          onClick={() => {
                            onCountrySelect(stock.country);
                            setSearchQuery("");
                            setSearchFocused(false);
                          }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors"
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center overflow-hidden"
                            style={{ backgroundColor: brand.logoUrl ? '#f3f4f6' : brand.primaryColor }}
                          >
                            {brand.logoUrl ? (
                              <img
                                src={brand.logoUrl}
                                alt={stock.name}
                                className="w-5 h-5 object-contain"
                                onError={(e) => {
                                  const parent = e.currentTarget.parentElement;
                                  if (parent) {
                                    parent.style.backgroundColor = brand.primaryColor;
                                    e.currentTarget.style.display = 'none';
                                    parent.innerHTML = `<span class="text-[10px] font-bold" style="color: ${brand.secondaryColor}">${stock.ticker.slice(0, 3)}</span>`;
                                  }
                                }}
                              />
                            ) : (
                              <span className="text-[10px] font-bold" style={{ color: brand.secondaryColor }}>
                                {stock.ticker.slice(0, 3)}
                              </span>
                            )}
                          </div>
                          <div className="text-left flex-1">
                            <div className="text-gray-900 text-sm font-medium">{stock.name}</div>
                            <div className="text-gray-400 text-xs">{stock.ticker}</div>
                          </div>
                          <span className={`text-sm font-semibold ${stock.changePercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                            {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(1)}%
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Dropdown Pills */}
        <div ref={dropdownRef} className="flex items-center gap-2">
          {/* Watchlist Pill */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "watchlist" ? null : "watchlist")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-black/5 border ${
                activeDropdown === "watchlist"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white/95 backdrop-blur-xl text-gray-600 border-black/5 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4" fill={watchlist.length > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              Watchlist
              {watchlist.length > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeDropdown === "watchlist" ? "bg-white/20" : "bg-emerald-100 text-emerald-600"}`}>
                  {watchlist.length}
                </span>
              )}
            </button>

            <AnimatePresence>
              {activeDropdown === "watchlist" && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-80 bg-white rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-black/5"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-gray-900 font-semibold">Watchlist</h3>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {watchlistStocks.length > 0 ? (
                      <div className="p-2">
                        {watchlistStocks.map(stock => {
                          const brand = getStockBrand(stock.ticker);
                          return (
                            <div
                              key={stock.ticker}
                              className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50"
                            >
                              <div
                                className="w-9 h-9 rounded-lg flex items-center justify-center overflow-hidden"
                                style={{ backgroundColor: brand.logoUrl ? '#f3f4f6' : brand.primaryColor }}
                              >
                                {brand.logoUrl ? (
                                  <img
                                    src={brand.logoUrl}
                                    alt={stock.name}
                                    className="w-5 h-5 object-contain"
                                    onError={(e) => {
                                      const parent = e.currentTarget.parentElement;
                                      if (parent) {
                                        parent.style.backgroundColor = brand.primaryColor;
                                        e.currentTarget.style.display = 'none';
                                        parent.innerHTML = `<span class="text-[10px] font-bold" style="color: ${brand.secondaryColor}">${stock.ticker.slice(0, 3)}</span>`;
                                      }
                                    }}
                                  />
                                ) : (
                                  <span className="text-[10px] font-bold" style={{ color: brand.secondaryColor }}>
                                    {stock.ticker.slice(0, 3)}
                                  </span>
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="text-gray-900 text-sm font-medium">{stock.name}</div>
                                <div className="text-gray-400 text-xs">{stock.ticker}</div>
                              </div>
                              <button onClick={() => toggleWatchlist(stock.ticker)} className="p-1.5 hover:bg-gray-100 rounded-lg">
                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                  <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                </svg>
                              </button>
                              <span className={`text-sm font-semibold ${stock.changePercent >= 0 ? "text-emerald-500" : "text-red-500"}`}>
                                {stock.changePercent >= 0 ? "+" : ""}{stock.changePercent.toFixed(1)}%
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-8 text-center">
                        <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                          <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </div>
                        <p className="text-gray-900 font-medium text-sm">No stocks yet</p>
                        <p className="text-gray-400 text-xs mt-1">Click any country to add stocks</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Politicians Pill */}
          <div className="relative">
            <button
              onClick={() => {
                setActiveDropdown(activeDropdown === "politicians" ? null : "politicians");
                setSelectedPolitician(null);
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-black/5 border ${
                activeDropdown === "politicians"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white/95 backdrop-blur-xl text-gray-600 border-black/5 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Politicians
            </button>

            <AnimatePresence>
              {activeDropdown === "politicians" && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-96 bg-white rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-black/5"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="text-gray-900 font-semibold">Congressional Trades</h3>
                    <span className="text-[10px] text-gray-500 bg-gray-100 px-2 py-1 rounded-full">Public Data</span>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {selectedPolitician ? (
                      <div>
                        <button
                          onClick={() => setSelectedPolitician(null)}
                          className="w-full flex items-center gap-2 px-4 py-3 border-b border-gray-100 text-gray-500 hover:text-gray-900"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                          </svg>
                          <span className="text-sm">All politicians</span>
                        </button>
                        <div className="p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${
                              politicianGroups[selectedPolitician]?.[0]?.party === "D"
                                ? "bg-blue-100 text-blue-600"
                                : "bg-red-100 text-red-600"
                            }`}>
                              {politicianGroups[selectedPolitician]?.[0]?.party}
                            </div>
                            <div>
                              <div className="text-gray-900 font-semibold">{selectedPolitician}</div>
                              <div className="text-gray-400 text-xs">{politicianGroups[selectedPolitician]?.length} recent trades</div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            {politicianGroups[selectedPolitician]?.map((trade, i) => (
                              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-gray-900 font-semibold">{trade.ticker}</span>
                                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                                      trade.type === "buy" ? "bg-emerald-100 text-emerald-600" : "bg-red-100 text-red-600"
                                    }`}>
                                      {trade.type.toUpperCase()}
                                    </span>
                                  </div>
                                  <div className="text-gray-400 text-xs mt-0.5">{trade.company}</div>
                                </div>
                                <div className="text-right">
                                  <div className="text-gray-900 text-sm font-medium">{trade.amount}</div>
                                  <div className="text-gray-400 text-xs">{trade.date}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-2">
                        {Object.entries(politicianGroups).map(([name, trades]) => (
                          <button
                            key={name}
                            onClick={() => setSelectedPolitician(name)}
                            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors"
                          >
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                              trades[0]?.party === "D" ? "bg-blue-100 text-blue-600" : "bg-red-100 text-red-600"
                            }`}>
                              {trades[0]?.party}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="text-gray-900 text-sm font-medium">{name}</div>
                              <div className="text-gray-400 text-xs">{trades.length} trades</div>
                            </div>
                            <div className="flex items-center gap-1">
                              {trades.slice(0, 2).map((t, i) => (
                                <span key={i} className="text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                                  {t.ticker}
                                </span>
                              ))}
                            </div>
                            <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                            </svg>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Smart Money Pill */}
          <div className="relative">
            <button
              onClick={() => setActiveDropdown(activeDropdown === "hedgefunds" ? null : "hedgefunds")}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm font-medium transition-all shadow-lg shadow-black/5 border ${
                activeDropdown === "hedgefunds"
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white/95 backdrop-blur-xl text-gray-600 border-black/5 hover:text-gray-900"
              }`}
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              Smart Money
            </button>

            <AnimatePresence>
              {activeDropdown === "hedgefunds" && (
                <motion.div
                  className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl overflow-hidden shadow-xl shadow-black/10 border border-black/5"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="text-gray-900 font-semibold">Institutional Data</h3>
                    <p className="text-gray-400 text-xs mt-0.5">What hedge funds watch</p>
                  </div>
                  <div className="p-2">
                    <a href="https://whalewisdom.com/stock/lmt" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 text-xs font-bold">13F</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 text-sm font-medium">13F Filings</div>
                        <div className="text-gray-400 text-xs">Hedge fund holdings</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <a href="https://unusualwhales.com/flow" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 text-xs font-bold">OPT</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 text-sm font-medium">Options Flow</div>
                        <div className="text-gray-400 text-xs">Unusual activity</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <a href="https://fintel.io/ss/us/lmt" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center">
                        <span className="text-red-600 text-xs font-bold">SI</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 text-sm font-medium">Short Interest</div>
                        <div className="text-gray-400 text-xs">Bearish bets</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                    <a href="https://www.quiverquant.com/insiders/" target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                        <span className="text-amber-600 text-xs font-bold">INS</span>
                      </div>
                      <div className="flex-1">
                        <div className="text-gray-900 text-sm font-medium">Insider Trades</div>
                        <div className="text-gray-400 text-xs">CEO buys & sells</div>
                      </div>
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
