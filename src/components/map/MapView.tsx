"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import { CountryMarket, countryMarkets } from "@/data/markets";
import MapMarker from "./MapMarker";
// Using Leaflet CSS from CDN in layout.tsx

interface MapViewProps {
  onViewIndex: (country: CountryMarket) => void;
  isIntro?: boolean;
}

// Map controller for zoom controls
function MapController() {
  const map = useMap();

  useEffect(() => {
    // Disable scroll zoom by default for cleaner UX
    map.scrollWheelZoom.disable();
  }, [map]);

  return null;
}

// Custom zoom controls component
function ZoomControls() {
  const map = useMap();

  return (
    <div className="absolute right-6 top-1/2 -translate-y-1/2 z-[1000] flex flex-col gap-1">
      <button
        onClick={() => map.zoomIn()}
        className="w-12 h-12 bg-white rounded-t-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-12 h-12 bg-white rounded-b-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 border-t-0"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>
    </div>
  );
}

// Fullscreen toggle
function FullscreenControl() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  return (
    <button
      onClick={toggleFullscreen}
      className="absolute right-6 top-6 z-[1000] w-12 h-12 bg-white rounded-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200"
    >
      <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {isFullscreen ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
        )}
      </svg>
    </button>
  );
}

export default function MapView({ onViewIndex, isIntro }: MapViewProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#e8e4df] flex items-center justify-center">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <div className={`w-full h-full transition-opacity duration-700 ${isIntro ? "opacity-50" : "opacity-100"}`}>
      <MapContainer
        center={[30, 0]}
        zoom={2.5}
        minZoom={2}
        maxZoom={8}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
        style={{ background: "#e8e4df" }}
      >
        {/* Default OpenStreetMap tiles */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController />
        <ZoomControls />
        <FullscreenControl />

        {/* Country markers */}
        {countryMarkets.map((country) => (
          <MapMarker
            key={country.code}
            country={country}
            onViewIndex={() => onViewIndex(country)}
          />
        ))}
      </MapContainer>
    </div>
  );
}
