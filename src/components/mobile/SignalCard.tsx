"use client";

import { motion } from "framer-motion";
import { getStockBrand } from "@/data/stockLogos";

// Signal data structure
export interface Signal {
  country: {
    code: string;
    name: string;
    flag: string;
    riskLevel: "low" | "medium" | "high" | "critical";
  };
  long: {
    ticker: string;
    name: string;
    upside: string;
    thesis: string;
  };
  short: {
    ticker: string;
    name: string;
    downside: string;
    thesis: string;
  };
  prediction: {
    platform: "polymarket" | "kalshi";
    question: string;
    odds: number;
    edge: string;
    url: string;
  };
  catalyst: string;
  timestamp: string;
}

const riskStyles = {
  low: { bg: "bg-emerald-500", text: "text-emerald-500", label: "LOW" },
  medium: { bg: "bg-amber-500", text: "text-amber-500", label: "MED" },
  high: { bg: "bg-orange-500", text: "text-orange-500", label: "HIGH" },
  critical: { bg: "bg-red-500", text: "text-red-500", label: "CRIT" },
};

export default function SignalCard({ signal, index = 0 }: { signal: Signal; index?: number }) {
  const risk = riskStyles[signal.country.riskLevel];
  const longBrand = getStockBrand(signal.long.ticker);
  const shortBrand = getStockBrand(signal.short.ticker);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="bg-white border border-gray-200 rounded-2xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2.5">
          <span className="text-xl">{signal.country.flag}</span>
          <span className="font-semibold text-gray-900">{signal.country.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${risk.bg}`} />
          <span className={`text-xs font-bold ${risk.text}`}>{risk.label}</span>
        </div>
      </div>

      {/* THE LONG */}
      <div className="px-4 py-3 border-b border-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-emerald-500 rounded-full" />
          <span className="text-[10px] font-bold text-gray-400 tracking-widest">THE LONG</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: longBrand.primaryColor }}
            >
              <span className="text-[11px] font-bold" style={{ color: longBrand.secondaryColor }}>
                {signal.long.ticker.slice(0, 3)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-[15px]">{signal.long.ticker}</span>
                <span className="text-emerald-600 font-bold text-sm">{signal.long.upside}</span>
              </div>
              <p className="text-xs text-gray-500 leading-snug mt-0.5">{signal.long.thesis}</p>
            </div>
          </div>
        </div>
      </div>

      {/* THE SHORT */}
      <div className="px-4 py-3 border-b border-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-red-500 rounded-full" />
          <span className="text-[10px] font-bold text-gray-400 tracking-widest">THE SHORT</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: shortBrand.primaryColor }}
            >
              <span className="text-[11px] font-bold" style={{ color: shortBrand.secondaryColor }}>
                {signal.short.ticker.slice(0, 3)}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-900 text-[15px]">{signal.short.ticker}</span>
                <span className="text-red-600 font-bold text-sm">{signal.short.downside}</span>
              </div>
              <p className="text-xs text-gray-500 leading-snug mt-0.5">{signal.short.thesis}</p>
            </div>
          </div>
        </div>
      </div>

      {/* THE PREDICTION */}
      <div className="px-4 py-3 border-b border-gray-50">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-1 h-4 bg-blue-500 rounded-full" />
          <span className="text-[10px] font-bold text-gray-400 tracking-widest">THE PREDICTION</span>
          <span className="text-[10px] text-gray-300 uppercase ml-auto">{signal.prediction.platform}</span>
        </div>
        <p className="text-sm text-gray-900 font-medium leading-snug">{signal.prediction.question}</p>
        <div className="flex items-center gap-3 mt-2">
          <div className="flex-1">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${signal.prediction.odds}%` }}
                transition={{ duration: 0.6, delay: index * 0.05 + 0.2 }}
              />
            </div>
          </div>
          <span className="text-xl font-bold text-gray-900">{signal.prediction.odds}%</span>
        </div>
        <p className="text-xs text-blue-600 font-medium mt-2">{signal.prediction.edge}</p>
      </div>

      {/* THE CATALYST */}
      <div className="px-4 py-3 bg-gray-50">
        <div className="flex items-center gap-2 mb-1.5">
          <div className="w-1 h-4 bg-amber-500 rounded-full" />
          <span className="text-[10px] font-bold text-gray-400 tracking-widest">THE CATALYST</span>
        </div>
        <p className="text-sm text-gray-700">{signal.catalyst}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex border-t border-gray-200">
        <a
          href={`https://robinhood.com/stocks/${signal.long.ticker}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 text-center text-sm font-semibold text-emerald-600 active:bg-emerald-50 transition-colors border-r border-gray-200"
        >
          Trade Long
        </a>
        <a
          href={`https://robinhood.com/stocks/${signal.short.ticker}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 text-center text-sm font-semibold text-red-600 active:bg-red-50 transition-colors border-r border-gray-200"
        >
          Trade Short
        </a>
        <a
          href={signal.prediction.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 py-3.5 text-center text-sm font-semibold text-blue-600 active:bg-blue-50 transition-colors"
        >
          Bet
        </a>
      </div>
    </motion.div>
  );
}
