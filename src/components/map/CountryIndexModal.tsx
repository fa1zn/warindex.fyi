"use client";

import { useState, useEffect } from "react";
import { CountryMarket, Stock } from "@/data/markets";
import { companies, Company } from "@/data/companies";
import { conflicts } from "@/data/conflicts";

interface CountryIndexModalProps {
  country: CountryMarket;
  isOpen: boolean;
  onClose: () => void;
}

export default function CountryIndexModal({
  country,
  isOpen,
  onClose,
}: CountryIndexModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const [expandedStock, setExpandedStock] = useState<string | null>(null);

  // Get companies headquartered in this country
  const countryCompanies = companies.filter((c) => c.country === country.name);

  // Get conflicts affecting this country
  const relatedConflicts = conflicts.filter((conflict) =>
    conflict.relatedCompanies.some((ticker) =>
      country.topStocks.some((stock) => stock.ticker === ticker)
    )
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case "low": return "badge-success";
      case "medium": return "badge-info";
      case "high": return "badge-warning";
      case "critical": return "badge-danger";
      default: return "badge-info";
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`modal-overlay ${isClosing ? "animate-modal-overlay-exit" : "animate-modal-overlay-enter"}`}
        onClick={handleClose}
      />

      {/* Modal */}
      <div
        className={`modal-content ${isClosing ? "animate-modal-content-exit" : "animate-modal-content-enter"}`}
      >
        <div className="glass rounded-3xl w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="p-6 pb-4 border-b border-white/[0.06]">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{country.flag}</span>
                <div>
                  <div className="flex items-center gap-3">
                    <h2 className="text-white text-2xl font-medium">{country.name}</h2>
                    <span className={`badge ${getRiskBadge(country.riskLevel)}`}>
                      {country.riskLevel} risk
                    </span>
                  </div>
                  <p className="text-white/40 text-sm mt-1">{country.code} · {country.currency}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="glass-button w-10 h-10 rounded-xl flex items-center justify-center text-white/40 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Key Metrics */}
            <div className="flex items-center gap-6 mt-6">
              <MetricPill label="GDP" value={country.gdp} />
              <MetricPill
                label="Growth"
                value={`${country.gdpGrowth >= 0 ? "+" : ""}${country.gdpGrowth}%`}
                valueColor={country.gdpGrowth >= 0 ? "text-emerald-400" : "text-red-400"}
              />
              <MetricPill label="Market" value={country.marketStatus} capitalize />
              <MetricPill label="Stocks" value={country.topStocks.length.toString()} />
              <MetricPill label="Conflicts" value={relatedConflicts.length.toString()} />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            <div className="p-6 space-y-6 animate-stagger">
              {/* Regional Map Placeholder */}
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/80 text-sm font-medium">Company Headquarters</h3>
                  <span className="text-white/30 text-xs">{countryCompanies.length} companies</span>
                </div>
                <div className="relative h-[200px] rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden">
                  {/* Map background pattern */}
                  <div className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `radial-gradient(circle at 2px 2px, rgba(255,255,255,0.1) 1px, transparent 0)`,
                      backgroundSize: '24px 24px'
                    }}
                  />

                  {/* Company pins */}
                  {countryCompanies.map((company, i) => (
                    <button
                      key={company.ticker}
                      onClick={() => setSelectedCompany(selectedCompany?.ticker === company.ticker ? null : company)}
                      className={`absolute map-pin flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                        selectedCompany?.ticker === company.ticker
                          ? "bg-[rgb(120,200,255)]/30 ring-2 ring-[rgb(120,200,255)] scale-110"
                          : "bg-white/10 hover:bg-white/20"
                      }`}
                      style={{
                        left: `${20 + (i * 25) % 60}%`,
                        top: `${30 + (i * 35) % 40}%`,
                      }}
                    >
                      <span className="text-white/90 text-xs font-mono font-medium">
                        {company.ticker.slice(0, 3)}
                      </span>
                    </button>
                  ))}

                  {/* Selected company tooltip */}
                  {selectedCompany && (
                    <div className="absolute bottom-4 left-4 right-4 glass rounded-xl p-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-white font-medium text-sm">{selectedCompany.name}</span>
                          <span className="text-white/40 text-xs ml-2 font-mono">{selectedCompany.ticker}</span>
                        </div>
                        <span className="badge badge-info text-[10px]">{selectedCompany.industry}</span>
                      </div>
                      <p className="text-white/50 text-xs mt-2 line-clamp-2">{selectedCompany.conflictExposure}</p>
                    </div>
                  )}

                  {countryCompanies.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p className="text-white/30 text-sm">No company headquarters in this country</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Stocks List */}
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white/80 text-sm font-medium">Market Index</h3>
                  <span className="text-white/30 text-xs">Click for details</span>
                </div>
                <div className="space-y-2">
                  {country.topStocks.map((stock) => (
                    <StockRow
                      key={stock.ticker}
                      stock={stock}
                      isExpanded={expandedStock === stock.ticker}
                      onClick={() => setExpandedStock(expandedStock === stock.ticker ? null : stock.ticker)}
                    />
                  ))}
                </div>
              </div>

              {/* Economic Summary & Conflict Impact */}
              <div className="grid grid-cols-2 gap-4">
                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-blue-500/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
                      </svg>
                    </div>
                    <h3 className="text-white/80 text-sm font-medium">Economic Summary</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{country.economicSummary}</p>
                </div>

                <div className="glass-card rounded-2xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                    </div>
                    <h3 className="text-white/80 text-sm font-medium">Conflict Impact</h3>
                  </div>
                  <p className="text-white/50 text-sm leading-relaxed">{country.conflictImpact}</p>
                </div>
              </div>

              {/* Market Predictions Placeholder */}
              <div className="glass-card rounded-2xl p-4 border border-dashed border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center">
                    <svg className="w-3.5 h-3.5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  </div>
                  <h3 className="text-white/80 text-sm font-medium">AI Market Predictions</h3>
                  <span className="badge badge-info text-[10px] ml-auto">Coming Soon</span>
                </div>
                <p className="text-white/30 text-sm">
                  Market predictions powered by real-time data analysis will be available here.
                  Integration with external financial APIs in development.
                </p>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-white/30 text-xs">Live market data</span>
            </div>
            <button
              onClick={handleClose}
              className="glass-button rounded-xl px-4 py-2 text-white/70 text-sm hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

function MetricPill({
  label,
  value,
  valueColor = "text-white",
  capitalize = false
}: {
  label: string;
  value: string;
  valueColor?: string;
  capitalize?: boolean;
}) {
  return (
    <div className="glass-card rounded-xl px-4 py-2 flex items-center gap-3">
      <span className="text-white/40 text-[10px] uppercase tracking-wider">{label}</span>
      <span className={`text-sm font-medium ${valueColor} ${capitalize ? "capitalize" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function StockRow({
  stock,
  isExpanded,
  onClick
}: {
  stock: Stock;
  isExpanded: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left rounded-xl p-3 transition-all ${
        isExpanded
          ? "glass-card ring-1 ring-white/10"
          : "hover:bg-white/[0.03]"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            stock.change >= 0 ? "bg-emerald-500/10" : "bg-red-500/10"
          }`}>
            <span className={`text-xs font-mono font-medium ${
              stock.change >= 0 ? "text-emerald-400" : "text-red-400"
            }`}>
              {stock.change >= 0 ? "↑" : "↓"}
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-white/90 text-sm font-medium">{stock.name}</span>
              <span className="text-white/30 text-xs font-mono">{stock.ticker}</span>
            </div>
            <span className="text-white/40 text-xs">{stock.sector}</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-white font-mono text-sm">${stock.price.toFixed(2)}</span>
          <span className={`text-xs font-mono ml-2 ${
            stock.change >= 0 ? "text-emerald-400" : "text-red-400"
          }`}>
            {stock.change >= 0 ? "+" : ""}{stock.changePercent.toFixed(2)}%
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-white/[0.06] space-y-3 animate-fade-in">
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">Why {stock.change >= 0 ? "Rising" : "Falling"}</span>
            <p className="text-white/60 text-sm mt-1">{stock.reason}</p>
          </div>
          <div>
            <span className="text-white/40 text-[10px] uppercase tracking-wider">War Exposure</span>
            <p className="text-amber-400/70 text-sm mt-1">{stock.conflictExposure}</p>
          </div>
        </div>
      )}
    </button>
  );
}
