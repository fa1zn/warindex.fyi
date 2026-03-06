"use client";

import { useState } from "react";
import { countryMarkets, CountryMarket } from "@/data/markets";

interface Region {
  id: string;
  name: string;
  description: string;
  countries: string[];
  icon: string;
  color: string;
}

const regions: Region[] = [
  {
    id: "americas",
    name: "Americas",
    description: "Defense & Energy Leaders",
    countries: ["USA"],
    icon: "globe-americas",
    color: "from-blue-500/20 to-blue-600/10",
  },
  {
    id: "europe",
    name: "Europe",
    description: "Rearmament & Industry",
    countries: ["DEU", "GBR", "UKR"],
    icon: "globe-europe",
    color: "from-emerald-500/20 to-emerald-600/10",
  },
  {
    id: "gulf",
    name: "Gulf & MENA",
    description: "Oil & Petrochemicals",
    countries: ["SAU", "IRN", "ISR"],
    icon: "sun",
    color: "from-amber-500/20 to-amber-600/10",
  },
  {
    id: "asia",
    name: "Asia Pacific",
    description: "Semiconductors & Trade",
    countries: ["CHN", "TWN"],
    icon: "chip",
    color: "from-rose-500/20 to-rose-600/10",
  },
  {
    id: "russia",
    name: "Russia & CIS",
    description: "Sanctions & Resources",
    countries: ["RUS"],
    icon: "snowflake",
    color: "from-cyan-500/20 to-cyan-600/10",
  },
];

interface RegionSelectorProps {
  onSelectCountry: (country: CountryMarket) => void;
  isVisible: boolean;
}

export default function RegionSelector({ onSelectCountry, isVisible }: RegionSelectorProps) {
  const [expandedRegion, setExpandedRegion] = useState<string | null>(null);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  const getCountriesForRegion = (regionId: string): CountryMarket[] => {
    const region = regions.find((r) => r.id === regionId);
    if (!region) return [];
    return countryMarkets.filter((c) => region.countries.includes(c.code));
  };

  const getIndustryIcon = (country: CountryMarket) => {
    const sectors = country.topStocks.map((s) => s.sector);
    if (sectors.includes("Defense")) return "shield";
    if (sectors.includes("Energy") || sectors.includes("Oil & Gas")) return "flame";
    if (sectors.includes("Semiconductors") || sectors.includes("Technology")) return "cpu";
    if (sectors.includes("Finance")) return "building";
    return "chart";
  };

  if (!isVisible) return null;

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 animate-slide-in-left">
      {regions.map((region, index) => (
        <div
          key={region.id}
          className="relative"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          {/* Region Button */}
          <button
            onClick={() => setExpandedRegion(expandedRegion === region.id ? null : region.id)}
            className={`
              glass-card rounded-2xl p-4 w-14 h-14 flex items-center justify-center
              transition-all duration-300 cursor-pointer group
              ${expandedRegion === region.id ? "w-52 justify-start gap-3" : ""}
            `}
          >
            <div className={`
              w-6 h-6 rounded-lg bg-gradient-to-br ${region.color}
              flex items-center justify-center flex-shrink-0
            `}>
              <RegionIcon type={region.icon} />
            </div>

            {expandedRegion === region.id && (
              <div className="flex flex-col items-start animate-fade-in">
                <span className="text-white/90 text-sm font-medium">{region.name}</span>
                <span className="text-white/40 text-[10px]">{region.description}</span>
              </div>
            )}
          </button>

          {/* Expanded Country List */}
          {expandedRegion === region.id && (
            <div className="absolute left-full ml-3 top-0 glass rounded-2xl p-2 min-w-[280px] animate-scale-in">
              <div className="space-y-1">
                {getCountriesForRegion(region.id).map((country) => (
                  <button
                    key={country.code}
                    onClick={() => {
                      onSelectCountry(country);
                      setExpandedRegion(null);
                    }}
                    onMouseEnter={() => setHoveredCountry(country.code)}
                    onMouseLeave={() => setHoveredCountry(null)}
                    className={`
                      w-full p-3 rounded-xl flex items-center gap-3 transition-all duration-200
                      ${hoveredCountry === country.code
                        ? "bg-white/[0.06]"
                        : "bg-transparent hover:bg-white/[0.03]"}
                    `}
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <div className="flex-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="text-white/90 text-sm font-medium">{country.name}</span>
                        <span className={`badge ${
                          country.riskLevel === "critical" ? "badge-danger" :
                          country.riskLevel === "high" ? "badge-warning" :
                          country.riskLevel === "medium" ? "badge-info" : "badge-success"
                        }`}>
                          {country.riskLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-white/40 text-xs">{country.gdp}</span>
                        <span className={`text-xs ${country.gdpGrowth >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                          {country.gdpGrowth >= 0 ? "+" : ""}{country.gdpGrowth}%
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <IndustryIcon type={getIndustryIcon(country)} />
                      <span className="text-white/30 text-xs">{country.topStocks.length}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Stats Footer */}
              <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between px-2">
                <span className="text-white/30 text-[10px] uppercase tracking-wider">
                  {getCountriesForRegion(region.id).reduce((acc, c) => acc + c.topStocks.length, 0)} companies tracked
                </span>
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
                  <span className="text-white/30 text-[10px]">Live</span>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Collapse hint */}
      {expandedRegion && (
        <button
          onClick={() => setExpandedRegion(null)}
          className="mt-2 glass-button rounded-full px-3 py-1.5 text-white/40 text-[10px] tracking-wide hover:text-white/60 transition-colors"
        >
          Press ESC to close
        </button>
      )}
    </div>
  );
}

function RegionIcon({ type }: { type: string }) {
  const iconClass = "w-3.5 h-3.5 text-white/70";

  switch (type) {
    case "globe-americas":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 003 12c0-1.605.42-3.113 1.157-4.418" />
        </svg>
      );
    case "globe-europe":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0v-9m0 0l6-3m-6 3l-6-3" />
        </svg>
      );
    case "sun":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
        </svg>
      );
    case "chip":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
        </svg>
      );
    case "snowflake":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18m0-18l-3 3m3-3l3 3m-3 15l-3-3m3 3l3-3M3 12h18M3 12l3-3M3 12l3 3m15-3l-3-3m3 3l-3 3" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3" />
        </svg>
      );
  }
}

function IndustryIcon({ type }: { type: string }) {
  const iconClass = "w-4 h-4 text-white/30";

  switch (type) {
    case "shield":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
        </svg>
      );
    case "flame":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
        </svg>
      );
    case "cpu":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21" />
        </svg>
      );
    case "building":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
        </svg>
      );
  }
}
