"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { Modal, ModalHeader, ModalBody, ModalSection, BottomSheet } from "./ui/Modal";
import { CountryMarket, countryMarkets } from "@/data/markets";
import { countryPredictions, Prediction } from "@/data/predictions";
import { getStockBrand } from "@/data/stockLogos";
import { ConflictAlert } from "@/data/conflicts";

interface ConflictDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: ConflictAlert | null;
  onCountrySelect?: (country: CountryMarket) => void;
}

export default function ConflictDetailModal({
  isOpen,
  onClose,
  conflict,
  onCountrySelect,
}: ConflictDetailModalProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Get affected countries data
  const affectedCountriesData = useMemo(() => {
    if (!conflict) return [];
    return conflict.affectedCountries
      .map((code) => countryMarkets.find((c) => c.code === code))
      .filter(Boolean) as CountryMarket[];
  }, [conflict]);

  // Get all affected stocks
  const affectedStocks = useMemo(() => {
    return affectedCountriesData.flatMap((country) =>
      country.topStocks.map((stock) => ({ ...stock, country }))
    );
  }, [affectedCountriesData]);

  // Get relevant predictions
  const relevantPredictions = useMemo(() => {
    if (!conflict) return [];
    const predictions: (Prediction & { countryCode: string })[] = [];
    conflict.affectedCountries.forEach((code) => {
      const countryPreds = countryPredictions[code] || [];
      countryPreds.forEach((p) => predictions.push({ ...p, countryCode: code }));
    });
    return predictions.slice(0, 4);
  }, [conflict]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "low":
        return { bg: "bg-emerald-100", text: "text-emerald-700", dot: "bg-emerald-500" };
      case "medium":
        return { bg: "bg-amber-100", text: "text-amber-700", dot: "bg-amber-500" };
      case "high":
        return { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" };
      case "critical":
        return { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" };
      default:
        return { bg: "bg-gray-100", text: "text-gray-700", dot: "bg-gray-500" };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "military":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "economic":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        );
      case "political":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case "humanitarian":
        return (
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (!conflict) return null;

  const severityColors = getSeverityColor(conflict.severity);

  const content = (
    <>
      <ModalHeader
        title={conflict.title}
        subtitle={conflict.date}
        badge={
          <span
            className={`text-[10px] font-semibold px-2 py-1 rounded-full uppercase ${severityColors.bg} ${severityColors.text}`}
          >
            {conflict.severity}
          </span>
        }
        onClose={onClose}
      />
      <ModalBody>
        {/* Alert Status */}
        <div className="px-8 py-6 border-b border-gray-100">
          <div className="flex items-start gap-4 p-5 bg-gray-50 rounded-2xl">
            <div className={`w-10 h-10 rounded-xl ${severityColors.bg} flex items-center justify-center shrink-0`}>
              {getCategoryIcon(conflict.category)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                  {conflict.category}
                </span>
                {conflict.isActive && (
                  <div className="flex items-center gap-1.5">
                    <div className="relative">
                      <div className={`w-1.5 h-1.5 rounded-full ${severityColors.dot}`} />
                      <div className={`absolute inset-0 w-1.5 h-1.5 rounded-full ${severityColors.dot} animate-ping`} />
                    </div>
                    <span className="text-[10px] font-semibold text-gray-500">ACTIVE</span>
                  </div>
                )}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">{conflict.description}</p>
              {conflict.source && (
                <p className="text-gray-400 text-xs mt-2">Source: {conflict.source}</p>
              )}
            </div>
          </div>
        </div>

        {/* Affected Countries */}
        {affectedCountriesData.length > 0 && (
          <ModalSection label="Affected Countries" className="border-b border-gray-100">
            <div className="flex flex-wrap gap-2">
              {affectedCountriesData.map((country) => (
                <button
                  key={country.code}
                  onClick={() => {
                    onCountrySelect?.(country);
                    onClose();
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <span className="text-xl">{country.flag}</span>
                  <span className="text-gray-900 text-sm font-medium">{country.name}</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              ))}
            </div>
          </ModalSection>
        )}

        {/* Prediction Markets */}
        {relevantPredictions.length > 0 && (
          <ModalSection label="Related Predictions" className="border-b border-gray-100">
            <div className="space-y-3">
              {relevantPredictions.map((pred, i) => (
                <motion.a
                  key={i}
                  href={pred.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-colors block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <div className="flex-1 mr-6">
                    <p className="text-gray-900 text-[14px] font-medium leading-snug">
                      {pred.question}
                    </p>
                    <div className="flex items-center gap-3 mt-2.5">
                      <div className="h-1.5 w-20 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${pred.probability}%` }}
                        />
                      </div>
                      <span className="text-[11px] text-gray-400 capitalize">{pred.platform}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-gray-900">{pred.probability}%</div>
                    <span className="text-xs font-semibold text-emerald-600">Bet →</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </ModalSection>
        )}

        {/* Affected Stocks */}
        {affectedStocks.length > 0 && (
          <ModalSection label="Stocks to Watch">
            <div className="space-y-2">
              {affectedStocks.slice(0, 6).map((stock, i) => {
                const isPositive = stock.changePercent >= 0;
                const brand = getStockBrand(stock.ticker);

                return (
                  <motion.div
                    key={`${stock.country.code}-${stock.ticker}`}
                    className="flex items-center gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    onClick={() => {
                      onCountrySelect?.(stock.country);
                      onClose();
                    }}
                  >
                    {/* Logo */}
                    <div
                      className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 overflow-hidden"
                      style={{
                        backgroundColor: brand.logoUrl ? "#f3f4f6" : brand.primaryColor,
                      }}
                    >
                      {brand.logoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={brand.logoUrl}
                          alt={stock.name}
                          className="w-6 h-6 object-contain"
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
                          className="text-xs font-bold"
                          style={{ color: brand.secondaryColor }}
                        >
                          {stock.ticker.replace(/\..+/, "").slice(0, 3)}
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-gray-900 font-medium text-[14px]">{stock.name}</div>
                      <div className="text-gray-400 text-xs mt-0.5">
                        {stock.ticker} · {stock.country.flag}
                      </div>
                    </div>

                    {/* Price & Change */}
                    <div className="text-right">
                      <div className="text-gray-900 font-medium text-[14px]">
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

                    {/* Chevron */}
                    <svg
                      className="w-4 h-4 text-gray-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </motion.div>
                );
              })}
            </div>
          </ModalSection>
        )}

        {/* Bottom padding */}
        <div className="h-6" />
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
    <Modal isOpen={isOpen} onClose={onClose} width="lg">
      {content}
    </Modal>
  );
}
