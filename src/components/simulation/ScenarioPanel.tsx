"use client";

import { motion, AnimatePresence } from "framer-motion";
import { warScenarios } from "@/data/scenarios";
import { WarScenario } from "@/types/scenarios";

interface ScenarioPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeScenario: WarScenario | null;
  onSelectScenario: (scenario: WarScenario | null) => void;
}

export default function ScenarioPanel({
  isOpen,
  onClose,
  activeScenario,
  onSelectScenario
}: ScenarioPanelProps) {
  const sortedScenarios = [...warScenarios].sort((a, b) => b.probability - a.probability);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-[800]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-0 top-0 h-full z-[801]"
            initial={{ x: -340 }}
            animate={{ x: 0 }}
            exit={{ x: -340 }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
          >
            <div className="w-[340px] h-full bg-[#0a0a0a] border-r border-neutral-800 flex flex-col">
              <div className="p-4 border-b border-neutral-800">
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-medium">Conflict Scenarios</h2>
                  <button onClick={onClose} className="text-neutral-500 hover:text-white p-1">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
                  Select a scenario to simulate market impact
                </p>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-2">
                {sortedScenarios.map((scenario) => {
                  const isActive = activeScenario?.id === scenario.id;
                  return (
                    <button
                      key={scenario.id}
                      onClick={() => onSelectScenario(isActive ? null : scenario)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        isActive
                          ? "bg-white text-black border-white"
                          : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700 hover:bg-neutral-900"
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className={`font-medium ${isActive ? "text-black" : "text-white"}`}>
                          {scenario.name}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${
                          scenario.probability > 30 ? "bg-red-500/20 text-red-400" :
                          scenario.probability > 15 ? "bg-amber-500/20 text-amber-400" : "bg-green-500/20 text-green-400"
                        } ${isActive ? "bg-neutral-200 text-neutral-600" : ""}`}>
                          {scenario.probability}% likely
                        </span>
                      </div>
                      <p className={`text-sm leading-relaxed ${isActive ? "text-neutral-600" : "text-neutral-400"}`}>
                        {scenario.description}
                      </p>
                      <div className={`text-xs mt-3 ${isActive ? "text-neutral-500" : "text-neutral-500"}`}>
                        {scenario.affectedCountries.length} countries affected
                      </div>
                      {isActive && (
                        <div className="mt-3 pt-3 border-t border-neutral-300 text-xs text-green-600 font-medium">
                          Active — drag the slider below to simulate
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
