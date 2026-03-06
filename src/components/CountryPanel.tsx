"use client";

import { useState } from "react";
import { CountryMarket, Stock } from "@/data/markets";

interface CountryPanelProps {
  country: CountryMarket | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CountryPanel({
  country,
  isOpen,
  onClose,
}: CountryPanelProps) {
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [activeTab, setActiveTab] = useState<"stocks" | "impact">("stocks");

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

  const getStatusIndicator = (status: string) => {
    switch (status) {
      case "rising":
        return { icon: "trending-up", color: "text-emerald-400", bg: "bg-emerald-500/10" };
      case "falling":
        return { icon: "trending-down", color: "text-red-400", bg: "bg-red-500/10" };
      default:
        return { icon: "minus", color: "text-amber-400", bg: "bg-amber-500/10" };
    }
  };

  if (!country) return null;

  const status = getStatusIndicator(country.marketStatus);

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed right-0 top-0 h-full w-[440px] glass z-50 transform transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] overflow-hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="relative p-6 pb-4">
            {/* Close button */}
            <button
              onClick={() => {
                setSelectedStock(null);
                onClose();
              }}
              className="absolute top-4 right-4 glass-button w-8 h-8 rounded-xl flex items-center justify-center text-white/40 hover:text-white/80 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Country Header */}
            <div className="flex items-center gap-4">
              <span className="text-5xl">{country.flag}</span>
              <div>
                <h2 className="text-white text-xl font-medium tracking-tight">{country.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-white/30 text-xs font-mono">{country.code}</span>
                  <span className="text-white/10">·</span>
                  <span className={`badge ${getRiskBadge(country.riskLevel)}`}>
                    {country.riskLevel}
                  </span>
                </div>
              </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              <MetricCard label="GDP" value={country.gdp} />
              <MetricCard
                label="Growth"
                value={`${country.gdpGrowth >= 0 ? "+" : ""}${country.gdpGrowth}%`}
                valueColor={country.gdpGrowth >= 0 ? "text-emerald-400" : "text-red-400"}
              />
              <div className="glass-card rounded-xl p-3">
                <span className="text-white/30 text-[10px] uppercase tracking-wider font-medium">Status</span>
                <div className={`flex items-center gap-1.5 mt-1.5 ${status.color}`}>
                  <StatusIcon type={status.icon} />
                  <span className="text-sm font-medium capitalize">{country.marketStatus}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="px-6">
            <div className="glass-card rounded-xl p-1 flex gap-1">
              <TabButton
                active={activeTab === "stocks"}
                onClick={() => setActiveTab("stocks")}
                label="Companies"
                count={country.topStocks.length}
              />
              <TabButton
                active={activeTab === "impact"}
                onClick={() => setActiveTab("impact")}
                label="War Impact"
              />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 pt-4">
            {activeTab === "stocks" ? (
              <div className="space-y-3">
                {country.topStocks.map((stock, index) => (
                  <StockCard
                    key={stock.ticker}
                    stock={stock}
                    isExpanded={selectedStock?.ticker === stock.ticker}
                    onClick={() => setSelectedStock(selectedStock?.ticker === stock.ticker ? null : stock)}
                    delay={index * 50}
                  />
                ))}
              </div>
            ) : (
              <div className="space-y-4 animate-fade-in">
                {/* Economic Summary */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                      </svg>
                    </div>
                    <span className="text-white/50 text-xs uppercase tracking-wider font-medium">Economic Overview</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{country.economicSummary}</p>
                </div>

                {/* Conflict Impact */}
                <div className="glass-card rounded-2xl p-4 border-red-500/10">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <span className="text-white/50 text-xs uppercase tracking-wider font-medium">Conflict Impact</span>
                  </div>
                  <p className="text-white/70 text-sm leading-relaxed">{country.conflictImpact}</p>
                </div>

                {/* Sector Breakdown */}
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                      </svg>
                    </div>
                    <span className="text-white/50 text-xs uppercase tracking-wider font-medium">Key Sectors</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[...new Set(country.topStocks.map(s => s.sector))].map(sector => (
                      <span key={sector} className="badge badge-info">{sector}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.04]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/30 text-[10px] uppercase tracking-wider font-medium">
                  Live market data
                </span>
              </div>
              <span className="text-white/20 text-[10px] font-mono">
                {country.currency}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function MetricCard({ label, value, valueColor = "text-white" }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="glass-card rounded-xl p-3">
      <span className="text-white/30 text-[10px] uppercase tracking-wider font-medium">{label}</span>
      <p className={`text-lg font-light mt-1 ${valueColor}`}>{value}</p>
    </div>
  );
}

function TabButton({ active, onClick, label, count }: { active: boolean; onClick: () => void; label: string; count?: number }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 py-2 px-3 rounded-lg text-xs font-medium transition-all duration-200 flex items-center justify-center gap-2 ${
        active
          ? "bg-white/[0.08] text-white"
          : "text-white/40 hover:text-white/60 hover:bg-white/[0.03]"
      }`}
    >
      {label}
      {count !== undefined && (
        <span className={`px-1.5 py-0.5 rounded text-[10px] ${active ? "bg-white/10" : "bg-white/5"}`}>
          {count}
        </span>
      )}
    </button>
  );
}

function StockCard({ stock, isExpanded, onClick, delay }: { stock: Stock; isExpanded: boolean; onClick: () => void; delay: number }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left glass-card rounded-2xl p-4 transition-all duration-300 ${
        isExpanded ? "ring-1 ring-white/10" : ""
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            stock.change >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
          }`}>
            <span className={`text-sm font-mono font-medium ${
              stock.change >= 0 ? "text-emerald-400" : "text-red-400"
            }`}>
              {stock.ticker.slice(0, 3)}
            </span>
          </div>
          <div>
            <span className="text-white/90 text-sm font-medium block">{stock.name}</span>
            <span className="text-white/30 text-xs">{stock.sector}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-white font-mono text-sm block">${stock.price.toFixed(2)}</span>
          <span className={`text-xs font-mono ${stock.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-4 animate-fade-in">
          {/* Why Moving */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className={`w-2 h-2 rounded-full ${stock.change >= 0 ? "bg-emerald-500" : "bg-red-500"}`} />
              <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">
                Why {stock.change >= 0 ? "Rising" : "Falling"}
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">{stock.reason}</p>
          </div>

          {/* Conflict Exposure */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">
                War Exposure
              </span>
            </div>
            <p className="text-amber-400/70 text-sm leading-relaxed">{stock.conflictExposure}</p>
          </div>

          {/* Movement Strength Indicator */}
          <div className="flex items-center gap-3 pt-2">
            <div className="flex items-center gap-0.5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 h-2.5 rounded-sm transition-colors ${
                    i < Math.min(10, Math.abs(stock.changePercent))
                      ? stock.change >= 0
                        ? "bg-emerald-500"
                        : "bg-red-500"
                      : "bg-white/[0.06]"
                  }`}
                />
              ))}
            </div>
            <span className="text-white/20 text-[10px] font-mono">
              Volatility Index
            </span>
          </div>
        </div>
      )}
    </button>
  );
}

function StatusIcon({ type }: { type: string }) {
  const iconClass = "w-4 h-4";

  switch (type) {
    case "trending-up":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
        </svg>
      );
    case "trending-down":
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" />
        </svg>
      );
    default:
      return (
        <svg className={iconClass} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      );
  }
}
