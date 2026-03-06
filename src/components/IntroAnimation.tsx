"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface IntroAnimationProps {
  onComplete: () => void;
}

export default function IntroAnimation({ onComplete }: IntroAnimationProps) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    // Phase 1: Show text
    const t1 = setTimeout(() => setPhase(1), 200);
    // Phase 2: Start fading
    const t2 = setTimeout(() => setPhase(2), 2200);
    // Phase 3: Complete
    const t3 = setTimeout(() => onComplete(), 3000);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center cursor-pointer"
      style={{
        backdropFilter: phase >= 2 ? "blur(0px)" : "blur(40px)",
        WebkitBackdropFilter: phase >= 2 ? "blur(0px)" : "blur(40px)",
        background: phase >= 2 ? "transparent" : "rgba(255, 255, 255, 0.85)",
      }}
      initial={{ opacity: 1 }}
      animate={{ opacity: phase >= 2 ? 0 : 1 }}
      transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      onClick={onComplete}
    >
      {/* Content */}
      <motion.div
        className="text-center px-8 max-w-2xl"
        initial={{ opacity: 0, y: 30, scale: 0.98 }}
        animate={{
          opacity: phase >= 1 && phase < 2 ? 1 : 0,
          y: phase >= 1 ? 0 : 30,
          scale: phase >= 1 ? 1 : 0.98,
        }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-gray-900 mb-4">
          Cost of Conflict
        </h1>
        <p className="text-lg md:text-xl text-gray-500 font-normal max-w-xl mx-auto mb-8">
          Track how geopolitical events impact global markets. Simulate war scenarios. Make informed trades.
        </p>

        {/* Value props */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          <span className="px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600">78 Countries</span>
          <span className="px-4 py-2 bg-green-100 rounded-full text-sm text-green-700">Live Market Data</span>
          <span className="px-4 py-2 bg-purple-100 rounded-full text-sm text-purple-700">Polymarket + Kalshi</span>
        </div>

        {/* Click hint */}
        <motion.div
          className="flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase >= 1 ? 1 : 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <motion.div
            className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </motion.div>
          <span className="text-sm text-gray-500 font-medium">Click to explore the map</span>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
