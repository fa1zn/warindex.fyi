"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SignalCard from "./SignalCard";
import { getSignalsByFilter, signals } from "@/data/signals";

// Header
function FeedHeader() {
  return (
    <div className="sticky top-0 z-50 bg-black text-white">
      <div className="px-5 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold tracking-tight">WAR INDEX</h1>
            <p className="text-[11px] text-gray-400 mt-0.5">Pure signal. No fluff.</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] text-gray-400">LIVE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Filter pills
function FilterPills({
  active,
  onChange,
}: {
  active: string;
  onChange: (filter: string) => void;
}) {
  const filters = [
    { id: "all", label: "All Signals" },
    { id: "critical", label: "Critical" },
    { id: "high", label: "High Risk" },
  ];

  return (
    <div className="sticky top-[60px] z-40 bg-gray-50 px-4 py-3 border-b border-gray-200">
      <div className="flex gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
              active === f.id
                ? "bg-black text-white"
                : "bg-white text-gray-600 border border-gray-200"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  );
}

// Stats bar
function StatsBar() {
  const criticalCount = signals.filter((s) => s.country.riskLevel === "critical").length;
  const highCount = signals.filter((s) => s.country.riskLevel === "high").length;

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-xs text-gray-600">
              <span className="font-bold text-gray-900">{criticalCount}</span> Critical
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-xs text-gray-600">
              <span className="font-bold text-gray-900">{highCount}</span> High
            </span>
          </div>
        </div>
        <span className="text-[10px] text-gray-400">Updated just now</span>
      </div>
    </div>
  );
}

// Main feed
export default function SignalFeed() {
  const [filter, setFilter] = useState("all");
  const filteredSignals = getSignalsByFilter(filter);

  return (
    <div className="min-h-screen bg-gray-50">
      <FeedHeader />
      <FilterPills active={filter} onChange={setFilter} />
      <StatsBar />

      {/* Signal Cards */}
      <div className="px-4 py-4 space-y-4 pb-24">
        <AnimatePresence mode="popLayout">
          {filteredSignals.map((signal, index) => (
            <SignalCard key={signal.country.code} signal={signal} index={index} />
          ))}
        </AnimatePresence>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 bg-black text-white px-5 py-4 safe-area-inset-bottom">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">{signals.length} Active Signals</p>
            <p className="text-[11px] text-gray-400">Tap any card to trade</p>
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            className="bg-white text-black px-5 py-2.5 rounded-full text-sm font-bold"
          >
            View Map
          </motion.button>
        </div>
      </div>
    </div>
  );
}
