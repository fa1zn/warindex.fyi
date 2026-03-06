"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { curatedLists, aiRecommendations } from "@/data/stockLists";
import { useWatchlist } from "@/hooks/useWatchlist";
import { countryMarkets } from "@/data/markets";

interface StockListsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

function getStockInfo(ticker: string) {
  for (const country of countryMarkets) {
    const stock = country.topStocks.find(s => s.ticker === ticker);
    if (stock) return { stock, country };
  }
  return null;
}

export default function StockListsPanel({ isOpen, onClose }: StockListsPanelProps) {
  const [activeTab, setActiveTab] = useState<"curated" | "watchlist" | "ai">("curated");
  const [expandedList, setExpandedList] = useState<string | null>(null);
  const { watchlist, addStock, removeStock, isInWatchlist } = useWatchlist();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/40 z-[800]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-14 h-[calc(100%-56px)] z-[801]"
            initial={{ x: 360 }}
            animate={{ x: 0 }}
            exit={{ x: 360 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="w-[360px] h-full bg-[#0a0a0a] border-l border-neutral-800 flex flex-col">
              <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-white font-medium">Stocks</h2>
                  <button onClick={onClose} className="text-neutral-500 hover:text-white">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="flex gap-1 bg-neutral-900 rounded-lg p-1">
                  {[
                    { id: "curated", label: "Curated" },
                    { id: "watchlist", label: `Watchlist (${watchlist.length})` },
                    { id: "ai", label: "AI Picks" },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex-1 py-1.5 text-xs rounded-md transition-colors ${
                        activeTab === tab.id
                          ? "bg-neutral-800 text-white"
                          : "text-neutral-500 hover:text-neutral-300"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3">
                {activeTab === "curated" && (
                  <div className="space-y-2">
                    {curatedLists.map((list) => (
                      <div key={list.id} className="bg-neutral-900 rounded-lg overflow-hidden">
                        <button
                          onClick={() => setExpandedList(expandedList === list.id ? null : list.id)}
                          className="w-full p-3 text-left hover:bg-neutral-800 transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-white text-sm font-medium">{list.name}</span>
                            <svg className={`w-4 h-4 text-neutral-500 transition-transform ${expandedList === list.id ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                            </svg>
                          </div>
                          <p className="text-xs text-neutral-500 mt-1">{list.description}</p>
                        </button>
                        <AnimatePresence>
                          {expandedList === list.id && (
                            <motion.div
                              initial={{ height: 0 }}
                              animate={{ height: 'auto' }}
                              exit={{ height: 0 }}
                              className="overflow-hidden"
                            >
                              <div className="px-3 pb-3 space-y-1">
                                {list.tickers.map((ticker) => {
                                  const info = getStockInfo(ticker);
                                  return (
                                    <div key={ticker} className="flex items-center justify-between py-1.5 px-2 bg-neutral-800 rounded">
                                      <div className="flex items-center gap-2">
                                        <span className="text-white text-sm">{ticker}</span>
                                        {info && (
                                          <span className={`text-xs ${info.stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                            {info.stock.changePercent >= 0 ? '+' : ''}{info.stock.changePercent.toFixed(1)}%
                                          </span>
                                        )}
                                      </div>
                                      <div className="flex items-center gap-1">
                                        <a
                                          href={`https://robinhood.com/stocks/${ticker.split('.')[0]}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-xs px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded"
                                        >
                                          Trade
                                        </a>
                                        <button
                                          onClick={() => isInWatchlist(ticker) ? removeStock(ticker) : addStock(ticker)}
                                          className={`w-6 h-6 rounded flex items-center justify-center ${
                                            isInWatchlist(ticker) ? 'bg-red-500/20 text-red-400' : 'bg-neutral-700 text-neutral-400'
                                          }`}
                                        >
                                          {isInWatchlist(ticker) ? '−' : '+'}
                                        </button>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ))}
                  </div>
                )}

                {activeTab === "watchlist" && (
                  <div>
                    {watchlist.length === 0 ? (
                      <div className="text-center py-12 text-neutral-500 text-sm">
                        No stocks saved yet
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {watchlist.map((item) => {
                          const info = getStockInfo(item.ticker);
                          return (
                            <div key={item.ticker} className="flex items-center justify-between p-2 bg-neutral-900 rounded-lg">
                              <div>
                                <div className="text-white text-sm">{info?.stock.name || item.ticker}</div>
                                <div className="text-xs text-neutral-500">{item.ticker}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {info && (
                                  <span className={`text-sm font-medium ${info.stock.changePercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                    {info.stock.changePercent >= 0 ? '+' : ''}{info.stock.changePercent.toFixed(1)}%
                                  </span>
                                )}
                                <a
                                  href={`https://robinhood.com/stocks/${item.ticker.split('.')[0]}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs px-2 py-1 bg-green-600 hover:bg-green-500 text-white rounded"
                                >
                                  Trade
                                </a>
                                <button
                                  onClick={() => removeStock(item.ticker)}
                                  className="text-neutral-500 hover:text-red-400"
                                >
                                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "ai" && (
                  <div className="space-y-2">
                    <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 border border-purple-800/30 rounded-lg p-3 mb-3">
                      <div className="text-xs text-purple-400 font-medium mb-1">AI Recommendations</div>
                      <p className="text-xs text-neutral-400">Based on prediction market activity</p>
                    </div>
                    {aiRecommendations.map((rec) => {
                      const info = getStockInfo(rec.ticker);
                      return (
                        <div key={rec.ticker} className="bg-neutral-900 rounded-lg p-3">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <div className="text-white text-sm font-medium">{rec.name}</div>
                              <div className="text-xs text-neutral-500">{rec.ticker}</div>
                            </div>
                            <span className={`text-xs px-2 py-0.5 rounded ${
                              rec.confidence === 'high' ? 'bg-green-500/20 text-green-400' :
                              rec.confidence === 'medium' ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-700 text-neutral-400'
                            }`}>
                              {rec.confidence}
                            </span>
                          </div>
                          <p className="text-xs text-neutral-400 mb-2">{rec.reason}</p>
                          <div className="flex gap-2">
                            <a
                              href={`https://robinhood.com/stocks/${rec.ticker.split('.')[0]}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 text-center text-xs py-1.5 bg-green-600 hover:bg-green-500 text-white rounded"
                            >
                              Trade
                            </a>
                            <button
                              onClick={() => isInWatchlist(rec.ticker) ? removeStock(rec.ticker) : addStock(rec.ticker)}
                              className={`px-3 py-1.5 text-xs rounded ${
                                isInWatchlist(rec.ticker) ? 'bg-red-500/20 text-red-400' : 'bg-neutral-800 text-neutral-400'
                              }`}
                            >
                              {isInWatchlist(rec.ticker) ? 'Remove' : 'Save'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
