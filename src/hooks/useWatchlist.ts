"use client";

import { useState, useEffect, useCallback } from "react";
import { WatchlistItem } from "@/types/watchlist";

const STORAGE_KEY = "warindex-watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        setWatchlist(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load watchlist:", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever watchlist changes
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
      } catch (e) {
        console.error("Failed to save watchlist:", e);
      }
    }
  }, [watchlist, isLoaded]);

  const addStock = useCallback((ticker: string, notes?: string) => {
    setWatchlist((prev) => {
      // Don't add if already exists
      if (prev.some((item) => item.ticker === ticker)) {
        return prev;
      }
      return [
        ...prev,
        {
          ticker,
          addedAt: new Date().toISOString(),
          notes,
        },
      ];
    });
  }, []);

  const removeStock = useCallback((ticker: string) => {
    setWatchlist((prev) => prev.filter((item) => item.ticker !== ticker));
  }, []);

  const isInWatchlist = useCallback(
    (ticker: string) => {
      return watchlist.some((item) => item.ticker === ticker);
    },
    [watchlist]
  );

  const setAlert = useCallback((ticker: string, threshold: number) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.ticker === ticker ? { ...item, alertThreshold: threshold } : item
      )
    );
  }, []);

  const updateNotes = useCallback((ticker: string, notes: string) => {
    setWatchlist((prev) =>
      prev.map((item) =>
        item.ticker === ticker ? { ...item, notes } : item
      )
    );
  }, []);

  const clearWatchlist = useCallback(() => {
    setWatchlist([]);
  }, []);

  return {
    watchlist,
    isLoaded,
    addStock,
    removeStock,
    isInWatchlist,
    setAlert,
    updateNotes,
    clearWatchlist,
  };
}
