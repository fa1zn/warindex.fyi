"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface NewsItem {
  title: string;
  source: string;
  url: string;
  publishedAt: string;
  country?: string;
  sentiment?: "positive" | "negative" | "neutral";
  category: "conflict" | "markets" | "diplomacy" | "military";
}

const categoryColors = {
  conflict: "bg-red-500",
  markets: "bg-emerald-500",
  diplomacy: "bg-blue-500",
  military: "bg-orange-500",
};

const sentimentIcons = {
  positive: "↗",
  negative: "↘",
  neutral: "→",
};

export default function NewsTicker() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("/api/news");
        const data = await res.json();
        if (data.news && data.news.length > 0) {
          setNews(data.news);
        }
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
    const interval = setInterval(fetchNews, 5 * 60 * 1000); // Refresh every 5 min
    return () => clearInterval(interval);
  }, []);

  // Auto-rotate headlines
  useEffect(() => {
    if (news.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % news.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [news.length]);

  if (isLoading || news.length === 0) return null;

  const currentNews = news[currentIndex];

  return (
    <>
      {/* Ticker Bar */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 z-[999] bg-[#1a1a1a]/95 backdrop-blur-xl border-t border-white/10"
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.5, type: "spring", damping: 25 }}
      >
        <div className="flex items-center h-12 px-4">
          {/* Live indicator */}
          <div className="flex items-center gap-2 pr-4 border-r border-white/10">
            <div className="relative">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <div className="absolute inset-0 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            </div>
            <span className="text-[11px] font-semibold text-red-400 uppercase tracking-wider">Live</span>
          </div>

          {/* Scrolling headline */}
          <div className="flex-1 overflow-hidden mx-4">
            <AnimatePresence mode="wait">
              <motion.a
                key={currentIndex}
                href={currentNews.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 cursor-pointer group"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {/* Category badge */}
                <span className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${categoryColors[currentNews.category]} text-white`}>
                  {currentNews.category}
                </span>

                {/* Headline */}
                <span className="text-gray-100 text-sm font-medium truncate group-hover:text-emerald-400 transition-colors">
                  {currentNews.title}
                </span>

                {/* Source */}
                <span className="shrink-0 text-gray-500 text-xs">
                  {currentNews.source}
                </span>

                {/* Sentiment */}
                {currentNews.sentiment && (
                  <span className={`shrink-0 text-sm ${
                    currentNews.sentiment === "negative" ? "text-red-400" :
                    currentNews.sentiment === "positive" ? "text-emerald-400" : "text-gray-500"
                  }`}>
                    {sentimentIcons[currentNews.sentiment]}
                  </span>
                )}
              </motion.a>
            </AnimatePresence>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-1.5 pr-3 border-r border-white/10">
            {news.slice(0, 5).map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === currentIndex ? "bg-emerald-500" : "bg-gray-600 hover:bg-gray-500"
                }`}
              />
            ))}
          </div>

          {/* Expand button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-3 flex items-center gap-1.5 text-gray-400 hover:text-white transition-colors"
          >
            <span className="text-xs font-medium">{news.length} stories</span>
            <motion.svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              animate={{ rotate: isExpanded ? 180 : 0 }}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
            </motion.svg>
          </button>
        </div>
      </motion.div>

      {/* Expanded news panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="fixed bottom-12 left-0 right-0 z-[998] bg-[#1a1a1a]/98 backdrop-blur-xl border-t border-white/10 max-h-[50vh] overflow-y-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <div className="p-6">
              <h3 className="text-white font-semibold text-lg mb-4">Breaking News</h3>
              <div className="grid gap-3">
                {news.map((item, i) => (
                  <a
                    key={i}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                  >
                    <span className={`shrink-0 px-2 py-1 rounded text-[10px] font-semibold uppercase ${categoryColors[item.category]} text-white`}>
                      {item.category}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-100 text-sm font-medium group-hover:text-emerald-400 transition-colors leading-snug">
                        {item.title}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-gray-500 text-xs">{item.source}</span>
                        <span className="text-gray-600 text-xs">
                          {new Date(item.publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </span>
                        {item.country && (
                          <span className="text-gray-400 text-xs px-1.5 py-0.5 bg-white/10 rounded">
                            {item.country}
                          </span>
                        )}
                      </div>
                    </div>
                    <svg className="w-4 h-4 text-gray-500 group-hover:text-emerald-400 transition-colors shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
