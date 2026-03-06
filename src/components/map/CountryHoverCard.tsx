"use client";

import { useEffect, useState } from "react";
import { CountryMarket } from "@/data/markets";

interface CountryHoverCardProps {
  country: CountryMarket;
  position: { x: number; y: number };
  onViewIndex: () => void;
  onClose: () => void;
}

export default function CountryHoverCard({
  country,
  position,
  onViewIndex,
  onClose,
}: CountryHoverCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [adjustedPosition, setAdjustedPosition] = useState(position);

  // Delay showing the card slightly for smoother UX
  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Adjust position to stay within viewport
  useEffect(() => {
    const cardWidth = 260;
    const cardHeight = 180;
    const padding = 20;

    let x = position.x - cardWidth / 2;
    let y = position.y - cardHeight - 20; // Position above marker

    // Keep within horizontal bounds
    if (x < padding) x = padding;
    if (x + cardWidth > window.innerWidth - padding) {
      x = window.innerWidth - cardWidth - padding;
    }

    // If too close to top, show below marker instead
    if (y < padding) {
      y = position.y + 30;
    }

    setAdjustedPosition({ x, y });
  }, [position]);

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low":
        return "badge-success";
      case "medium":
        return "badge-info";
      case "high":
        return "badge-warning";
      case "critical":
        return "badge-danger";
      default:
        return "badge-info";
    }
  };

  const getMarketIcon = (status: string) => {
    if (status === "rising") return { icon: "↑", color: "text-emerald-400" };
    if (status === "falling") return { icon: "↓", color: "text-red-400" };
    return { icon: "→", color: "text-amber-400" };
  };

  const marketStatus = getMarketIcon(country.marketStatus);

  return (
    <div
      className={`fixed z-[60] pointer-events-auto ${
        isVisible ? "animate-hover-card-enter" : "opacity-0"
      }`}
      style={{
        left: adjustedPosition.x,
        top: adjustedPosition.y,
      }}
      onMouseLeave={onClose}
    >
      <div className="glass rounded-2xl p-4 w-[260px] shadow-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">{country.flag}</span>
          <div className="flex-1 min-w-0">
            <h3 className="text-white font-medium text-sm truncate">{country.name}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={`badge ${getRiskBadge(country.riskLevel)} text-[10px] py-0.5 px-2`}>
                {country.riskLevel}
              </span>
              <span className={`text-xs font-medium ${marketStatus.color}`}>
                {marketStatus.icon} {country.marketStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center gap-4 mb-4 py-2 border-t border-b border-white/[0.06]">
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">GDP</span>
            <p className="text-white text-sm font-medium">{country.gdp}</p>
          </div>
          <div className="w-px h-8 bg-white/[0.06]" />
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">Growth</span>
            <p className={`text-sm font-medium ${country.gdpGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {country.gdpGrowth >= 0 ? "+" : ""}{country.gdpGrowth}%
            </p>
          </div>
          <div className="w-px h-8 bg-white/[0.06]" />
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">Stocks</span>
            <p className="text-white text-sm font-medium">{country.topStocks.length}</p>
          </div>
        </div>

        {/* View Index Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onViewIndex();
          }}
          className="w-full glass-button rounded-xl py-2.5 px-4 flex items-center justify-center gap-2 group"
        >
          <span className="text-white/90 text-sm font-medium">View Index</span>
          <svg
            className="w-4 h-4 text-white/60 group-hover:translate-x-0.5 transition-transform"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
      </div>
    </div>
  );
}
