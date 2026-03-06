"use client";

import { useEffect, useState, useRef } from "react";
import { MapContainer, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { CountryMarket, countryMarkets } from "@/data/markets";
import "leaflet/dist/leaflet.css";

interface ChoroplethMapProps {
  onCountryClick: (country: CountryMarket) => void;
  onCountryHover: (country: CountryMarket | null, position: { x: number; y: number } | null) => void;
  selectedCountry: CountryMarket | null;
}

// Risk level to color mapping
function getRiskColor(risk: string): string {
  switch (risk) {
    case "critical": return "#dc2626"; // red-600
    case "high": return "#ea580c"; // orange-600
    case "medium": return "#ca8a04"; // yellow-600
    case "low": return "#16a34a"; // green-600
    default: return "#6b7280";
  }
}

function getRiskBgColor(risk: string): string {
  switch (risk) {
    case "critical": return "#fef2f2"; // red-50
    case "high": return "#fff7ed"; // orange-50
    case "medium": return "#fefce8"; // yellow-50
    case "low": return "#f0fdf4"; // green-50
    default: return "#f9fafb";
  }
}

// Custom zoom controls
function ZoomControls() {
  const map = useMap();

  return (
    <div className="absolute right-4 top-1/2 -translate-y-1/2 z-[1000] flex flex-col">
      <button
        onClick={() => map.zoomIn()}
        className="w-10 h-10 bg-white rounded-t-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="w-10 h-10 bg-white rounded-b-xl shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors border border-gray-200 border-t-0 text-gray-600"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
        </svg>
      </button>
    </div>
  );
}

// Interactive country markers - levels.fyi style
function CountryMarkers({
  onCountryClick,
  onCountryHover,
  selectedCountry
}: {
  onCountryClick: (country: CountryMarket) => void;
  onCountryHover: (country: CountryMarket | null, position: { x: number; y: number } | null) => void;
  selectedCountry: CountryMarket | null;
}) {
  const map = useMap();
  const markersRef = useRef<L.Marker[]>([]);
  const [hoveredCode, setHoveredCode] = useState<string | null>(null);

  // Clear hover when clicking on map (not on markers)
  useMapEvents({
    click: () => {
      onCountryHover(null, null);
      setHoveredCode(null);
    }
  });

  useEffect(() => {
    // Clear existing markers
    markersRef.current.forEach(m => m.remove());
    markersRef.current = [];

    countryMarkets.forEach(country => {
      const isSelected = selectedCountry?.code === country.code;
      const isHovered = hoveredCode === country.code;
      const riskColor = getRiskColor(country.riskLevel);

      // Calculate total war profit indicator
      const totalChange = country.topStocks.reduce((sum, s) => sum + s.changePercent, 0);
      const avgChange = totalChange / country.topStocks.length;
      const changeDisplay = avgChange >= 0 ? `+${avgChange.toFixed(1)}%` : `${avgChange.toFixed(1)}%`;
      const changeColor = avgChange >= 0 ? '#16a34a' : '#dc2626';

      const icon = L.divIcon({
        html: `
          <div
            class="country-marker-pill"
            style="
              display: flex;
              align-items: center;
              gap: 8px;
              background: ${isHovered || isSelected ? riskColor : 'white'};
              color: ${isHovered || isSelected ? 'white' : '#1f2937'};
              padding: 8px 14px;
              border-radius: 24px;
              font-size: 13px;
              font-weight: 600;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              box-shadow: 0 2px 12px rgba(0,0,0,0.15), 0 1px 3px rgba(0,0,0,0.1);
              cursor: pointer;
              transition: all 0.15s ease;
              white-space: nowrap;
              border: 2px solid ${isHovered || isSelected ? riskColor : 'white'};
              transform: ${isHovered || isSelected ? 'scale(1.08)' : 'scale(1)'};
            "
          >
            <span style="font-size: 18px; line-height: 1;">${country.flag}</span>
            <span style="color: ${isHovered || isSelected ? 'white' : changeColor}; font-weight: 700;">${changeDisplay}</span>
          </div>
        `,
        className: 'custom-marker',
        iconSize: [120, 40],
        iconAnchor: [60, 20],
      });

      const marker = L.marker([country.lat, country.lng], { icon });

      marker.on('mouseover', (e) => {
        setHoveredCode(country.code);
        const containerPoint = map.latLngToContainerPoint(e.latlng);
        onCountryHover(country, { x: containerPoint.x, y: containerPoint.y });
      });

      marker.on('mouseout', () => {
        // Don't clear immediately - let hover card handle it
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        setHoveredCode(null);
        onCountryHover(null, null);
        onCountryClick(country);
      });

      marker.addTo(map);
      markersRef.current.push(marker);
    });

    return () => {
      markersRef.current.forEach(m => m.remove());
      markersRef.current = [];
    };
  }, [map, onCountryClick, onCountryHover, selectedCountry, hoveredCode]);

  return null;
}

export default function ChoroplethMap({
  onCountryClick,
  onCountryHover,
  selectedCountry
}: ChoroplethMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-full bg-[#f8f9fa] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
          <span className="text-gray-500 text-sm">Loading map...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[25, 20]}
        zoom={2.5}
        minZoom={2}
        maxZoom={8}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
        scrollWheelZoom={true}
        style={{ background: "#f8f9fa" }}
      >
        {/* Clean, minimal map tiles - CartoDB Voyager */}
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Interactive country markers */}
        <CountryMarkers
          onCountryClick={onCountryClick}
          onCountryHover={onCountryHover}
          selectedCountry={selectedCountry}
        />

        <ZoomControls />
      </MapContainer>
    </div>
  );
}
