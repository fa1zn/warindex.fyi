"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { WarScenario, SimulationResult } from "@/types/scenarios";
import { interpolateImpact } from "@/lib/simulation";

interface EscalationSliderProps {
  scenario: WarScenario;
  onImpactChange: (result: SimulationResult) => void;
  onClose: () => void;
}

export default function EscalationSlider({ scenario, onImpactChange, onClose }: EscalationSliderProps) {
  const [escalationLevel, setEscalationLevel] = useState(1);

  const result = useMemo(() => interpolateImpact(scenario, escalationLevel), [scenario, escalationLevel]);
  useEffect(() => { onImpactChange(result); }, [result, onImpactChange]);

  const currentStage = scenario.stages.find(s => s.level === Math.round(escalationLevel));
  const formatImpact = (val: number) => val >= 1 ? `$${val.toFixed(1)}T` : `$${(val * 1000).toFixed(0)}B`;

  return (
    <motion.div
      className="fixed bottom-0 left-0 right-0 z-[900]"
      initial={{ y: 200 }}
      animate={{ y: 0 }}
      exit={{ y: 200 }}
      transition={{ type: "spring", damping: 30, stiffness: 300 }}
    >
      <div className="bg-[#0a0a0a] border-t border-neutral-800">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-medium">{scenario.name}</h3>
              <p className="text-sm text-neutral-500">Stage {Math.round(escalationLevel)}: {currentStage?.name}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-neutral-500">Impact</div>
                <div className="text-red-500 font-semibold">-{formatImpact(result.totalMarketImpact)}</div>
              </div>
              <button
                onClick={onClose}
                className="px-3 py-1.5 text-sm text-neutral-400 hover:text-white transition-colors"
              >
                Exit
              </button>
            </div>
          </div>

          <div className="relative mb-4">
            <div className="h-1.5 bg-gradient-to-r from-green-600 via-amber-500 to-red-600 rounded-full" />
            <input
              type="range"
              min={1}
              max={5}
              step={0.1}
              value={escalationLevel}
              onChange={(e) => setEscalationLevel(parseFloat(e.target.value))}
              className="absolute inset-0 w-full opacity-0 cursor-pointer"
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full shadow-lg pointer-events-none"
              style={{ left: `${((escalationLevel - 1) / 4) * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-neutral-900 rounded-lg p-3">
              <div className="text-xs text-green-500 mb-1">Gainers</div>
              {result.topGainers.slice(0, 2).map(s => (
                <div key={s.ticker} className="flex justify-between text-sm">
                  <span className="text-neutral-400">{s.ticker}</span>
                  <span className="text-green-500">+{s.change.toFixed(0)}%</span>
                </div>
              ))}
            </div>
            <div className="bg-neutral-900 rounded-lg p-3">
              <div className="text-xs text-red-500 mb-1">Losers</div>
              {result.topLosers.slice(0, 2).map(s => (
                <div key={s.ticker} className="flex justify-between text-sm">
                  <span className="text-neutral-400">{s.ticker}</span>
                  <span className="text-red-500">{s.change.toFixed(0)}%</span>
                </div>
              ))}
            </div>
            <div className="bg-neutral-900 rounded-lg p-3">
              <div className="text-xs text-neutral-500 mb-1">Sectors</div>
              {result.affectedSectors.slice(0, 2).map(s => (
                <div key={s.sector} className="flex justify-between text-sm">
                  <span className="text-neutral-400">{s.sector}</span>
                  <span className={s.change >= 0 ? "text-green-500" : "text-red-500"}>
                    {s.change >= 0 ? "+" : ""}{s.change.toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
