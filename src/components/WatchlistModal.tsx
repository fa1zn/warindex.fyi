"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Modal, ModalHeader, ModalBody, ModalSection, BottomSheet } from "./ui/Modal";
import { CountryMarket, countryMarkets, Stock } from "@/data/markets";
import { getStockBrand } from "@/data/stockLogos";

interface WatchlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCountrySelect?: (country: CountryMarket) => void;
}

interface WatchedItem {
  type: "country" | "stock";
  id: string; // country code or ticker
  addedAt: string;
}

export default function WatchlistModal({
  isOpen,
  onClose,
  onCountrySelect,
}: WatchlistModalProps) {
  const [watchlist, setWatchlist] = useState<WatchedItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load watchlist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("warindex-watchlist-full");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch {
        // Fall back to legacy format
        const legacyStocks = localStorage.getItem("warindex-watchlist");
        if (legacyStocks) {
          const tickers = JSON.parse(legacyStocks) as string[];
          setWatchlist(
            tickers.map((t) => ({ type: "stock", id: t, addedAt: new Date().toISOString() }))
          );
        }
      }
    }
  }, [isOpen]);

  // Get all stocks from all countries
  const allStocks = useMemo(() => {
    return countryMarkets.flatMap((country) =>
      country.topStocks.map((stock) => ({ ...stock, country }))
    );
  }, []);

  // Resolve watchlist items
  const watchedCountries = useMemo(() => {
    return watchlist
      .filter((w) => w.type === "country")
      .map((w) => countryMarkets.find((c) => c.code === w.id))
      .filter(Boolean) as CountryMarket[];
  }, [watchlist]);

  const watchedStocks = useMemo(() => {
    return watchlist
      .filter((w) => w.type === "stock")
      .map((w) => allStocks.find((s) => s.ticker === w.id))
      .filter(Boolean) as (Stock & { country: CountryMarket })[];
  }, [watchlist, allStocks]);

  const removeFromWatchlist = (type: "country" | "stock", id: string) => {
    const updated = watchlist.filter((w) => !(w.type === type && w.id === id));
    setWatchlist(updated);
    localStorage.setItem("warindex-watchlist-full", JSON.stringify(updated));

    // Also update legacy format for compatibility
    const stockTickers = updated.filter((w) => w.type === "stock").map((w) => w.id);
    localStorage.setItem("warindex-watchlist", JSON.stringify(stockTickers));
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "bg-emerald-100 text-emerald-700";
      case "medium":
        return "bg-amber-100 text-amber-700";
      case "high":
        return "bg-orange-100 text-orange-700";
      case "critical":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const content = (
    <>
      <ModalHeader
        title="Watchlist"
        subtitle={`${watchedCountries.length + watchedStocks.length} items`}
        onClose={onClose}
      />
      <ModalBody>
        {watchedCountries.length === 0 && watchedStocks.length === 0 ? (
          <div className="px-8 py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                />
              </svg>
            </div>
            <p className="text-gray-900 font-semibold text-lg">No items yet</p>
            <p className="text-gray-500 text-sm mt-2 max-w-[240px] mx-auto">
              Click countries or stocks on the map to add them to your watchlist
            </p>
          </div>
        ) : (
          <>
            {/* Countries Section */}
            {watchedCountries.length > 0 && (
              <ModalSection label="Countries" className="border-b border-gray-100">
                <div className="space-y-2">
                  {watchedCountries.map((country, i) => {
                    const avgChange =
                      country.topStocks.reduce((sum, s) => sum + s.changePercent, 0) /
                      country.topStocks.length;
                    const isPositive = avgChange >= 0;

                    return (
                      <motion.div
                        key={country.code}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                          onCountrySelect?.(country);
                          onClose();
                        }}
                      >
                        {/* Flag */}
                        <span className="text-3xl">{country.flag}</span>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-gray-900 font-semibold text-[15px]">
                              {country.name}
                            </span>
                            <span
                              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${getRiskBadgeColor(
                                country.riskLevel
                              )}`}
                            >
                              {country.riskLevel}
                            </span>
                          </div>
                          <div className="text-gray-500 text-xs mt-0.5">{country.gdp} GDP</div>
                        </div>

                        {/* Market Change */}
                        <div className="text-right">
                          <span
                            className={`text-lg font-bold ${
                              isPositive ? "text-emerald-600" : "text-red-500"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {avgChange.toFixed(1)}%
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWatchlist("country", country.code);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M6 18L18 6M6 6l12 12"
                            />
                          </svg>
                        </button>

                        {/* Chevron */}
                        <svg
                          className="w-5 h-5 text-gray-300 group-hover:text-gray-400 transition-colors"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </motion.div>
                    );
                  })}
                </div>
              </ModalSection>
            )}

            {/* Stocks Section */}
            {watchedStocks.length > 0 && (
              <ModalSection label="Stocks">
                <div className="space-y-2">
                  {watchedStocks.map((stock, i) => {
                    const isPositive = stock.changePercent >= 0;
                    const brand = getStockBrand(stock.ticker);

                    return (
                      <motion.div
                        key={stock.ticker}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors cursor-pointer group"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        onClick={() => {
                          onCountrySelect?.(stock.country);
                          onClose();
                        }}
                      >
                        {/* Logo */}
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden"
                          style={{
                            backgroundColor: brand.logoUrl ? "#f3f4f6" : brand.primaryColor,
                          }}
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
                                  e.currentTarget.style.display = "none";
                                }
                              }}
                            />
                          ) : (
                            <span
                              className="text-sm font-bold"
                              style={{ color: brand.secondaryColor }}
                            >
                              {stock.ticker.replace(/\..+/, "").slice(0, 3)}
                            </span>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <div className="text-gray-900 font-semibold text-[15px]">
                            {stock.name}
                          </div>
                          <div className="text-gray-500 text-xs mt-0.5">
                            {stock.ticker} · {stock.sector}
                          </div>
                        </div>

                        {/* Price & Change */}
                        <div className="text-right">
                          <div className="text-gray-900 font-semibold text-[15px]">
                            ${stock.price.toFixed(2)}
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              isPositive ? "text-emerald-600" : "text-red-500"
                            }`}
                          >
                            {isPositive ? "+" : ""}
                            {stock.changePercent.toFixed(2)}%
                          </span>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromWatchlist("stock", stock.ticker);
                          }}
                          className="opacity-0 group-hover:opacity-100 p-2 rounded-lg hover:bg-red-50 transition-all"
                        >
                          <svg
                            className="w-4 h-4 text-red-500"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                          </svg>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </ModalSection>
            )}
          </>
        )}
      </ModalBody>
    </>
  );

  if (isMobile) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose}>
        {content}
      </BottomSheet>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} width="md">
      {content}
    </Modal>
  );
}
