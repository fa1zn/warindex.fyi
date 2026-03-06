"use client";

import { useState, useEffect } from "react";

interface IntroScreenProps {
  onEnter: () => void;
}

export default function IntroScreen({ onEnter }: IntroScreenProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onEnter, 600);
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center transition-all duration-500 ease-out ${
        isExiting ? "opacity-0 scale-105" : "opacity-100 scale-100"
      }`}
      style={{
        background: "radial-gradient(ellipse at center, rgba(10,10,20,0.85) 0%, rgba(5,5,8,0.95) 100%)",
      }}
    >
      {/* Top brand */}
      <div
        className={`absolute top-8 transition-all duration-700 delay-100 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <span className="text-white/30 text-[11px] tracking-[0.3em] uppercase font-light">
          War Index
        </span>
      </div>

      {/* Center content */}
      <div className="flex flex-col items-center text-center px-6 max-w-2xl">
        {/* Hero text */}
        <h1
          className={`text-[clamp(2.5rem,7vw,4.5rem)] font-semibold text-white leading-[1.1] tracking-[-0.03em] transition-all duration-700 delay-200 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          The Cost of Conflict
        </h1>

        {/* Subtext */}
        <p
          className={`mt-5 text-[clamp(0.9rem,2vw,1.1rem)] text-white/40 font-light leading-relaxed transition-all duration-700 delay-400 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          Every conflict reshapes markets. Every tension moves capital.
        </p>

        {/* Enter button */}
        <button
          onClick={handleEnter}
          className={`group mt-12 flex items-center justify-center w-12 h-12 rounded-full border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/30 hover:scale-110 active:scale-95 transition-all duration-200 ${
            isVisible ? "opacity-100 translate-y-0 delay-500" : "opacity-0 translate-y-6"
          }`}
          style={{ transitionDelay: isVisible ? "500ms" : "0ms" }}
        >
          <svg
            className="w-4 h-4 text-white/50 group-hover:text-white group-hover:translate-x-0.5 transition-all duration-150"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </button>
      </div>

      {/* Touch hint on right */}
      <div
        className={`absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 transition-all duration-700 delay-700 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <svg
          className="w-6 h-6 text-white/20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zM12 2.25V4.5m5.834.166l-1.591 1.591M20.25 10.5H18M7.757 14.743l-1.59 1.59M6 10.5H3.75m4.007-4.243l-1.59-1.59"
          />
        </svg>
        <span className="text-white/20 text-[9px] tracking-wider uppercase">
          Click to start
        </span>
      </div>
    </div>
  );
}
