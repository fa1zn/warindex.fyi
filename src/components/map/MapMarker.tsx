"use client";

import { useRef, useState } from "react";
import { Marker, Tooltip, useMap } from "react-leaflet";
import L from "leaflet";
import { CountryMarket } from "@/data/markets";

interface MapMarkerProps {
  country: CountryMarket;
  onViewIndex: () => void;
}

export default function MapMarker({ country, onViewIndex }: MapMarkerProps) {
  const [isHovered, setIsHovered] = useState(false);
  const markerRef = useRef<L.Marker>(null);
  const map = useMap();

  // Get marker color based on risk level
  const getMarkerColors = () => {
    if (isHovered) {
      return { bg: "#000", text: "#fff", border: "#000" };
    }
    switch (country.riskLevel) {
      case "critical":
        return { bg: "#fff", text: "#dc2626", border: "#fecaca" };
      case "high":
        return { bg: "#fff", text: "#ea580c", border: "#fed7aa" };
      case "medium":
        return { bg: "#fff", text: "#d97706", border: "#fde68a" };
      default:
        return { bg: "#fff", text: "#111", border: "#e5e7eb" };
    }
  };

  const colors = getMarkerColors();

  // Create custom icon
  const createIcon = () => {
    const html = `
      <div class="airbnb-marker ${isHovered ? 'hovered' : ''}">
        <div class="marker-pill" style="
          background: ${colors.bg};
          color: ${colors.text};
          border: 2px solid ${colors.border};
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 24px;
          font-weight: 600;
          font-size: 14px;
          white-space: nowrap;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
          transform: ${isHovered ? 'scale(1.08)' : 'scale(1)'};
          transition: all 0.15s ease;
        ">
          <span style="font-size: 16px; line-height: 1;">${country.flag}</span>
          <span style="font-family: system-ui, sans-serif;">${country.topStocks.length}</span>
        </div>
        ${isHovered ? '<div style="width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid black;margin-top:-2px;margin-left:auto;margin-right:auto;"></div>' : ''}
      </div>
    `;

    return L.divIcon({
      html,
      className: "custom-marker",
      iconSize: [80, 40],
      iconAnchor: [40, 20],
    });
  };

  // Handle marker click - zoom and open popup
  const handleClick = () => {
    map.flyTo([country.lat, country.lng], 5, {
      duration: 0.8,
    });
    // Delay slightly then trigger view index
    setTimeout(() => {
      onViewIndex();
    }, 800);
  };

  return (
    <Marker
      ref={markerRef}
      position={[country.lat, country.lng]}
      icon={createIcon()}
      eventHandlers={{
        mouseover: () => setIsHovered(true),
        mouseout: () => setIsHovered(false),
        click: handleClick,
      }}
    >
      {/* Levels-style hover tooltip */}
      <Tooltip
        direction="top"
        offset={[0, -25]}
        opacity={1}
        permanent={false}
        className="levels-tooltip"
      >
        <div className="p-4 min-w-[260px] max-w-[300px]">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl">{country.flag}</span>
            <div>
              <h3 className="text-gray-900 font-semibold text-base">{country.name}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <RiskBadge risk={country.riskLevel} />
                <MarketStatus status={country.marketStatus} />
              </div>
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm leading-relaxed mb-4">
            {country.economicSummary}
          </p>

          {/* Quick stats */}
          <div className="flex items-center gap-4 py-2 border-t border-gray-100 mb-3">
            <div>
              <span className="text-gray-400 text-xs block">GDP</span>
              <span className="text-gray-900 font-medium text-sm">{country.gdp}</span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="text-gray-400 text-xs block">Growth</span>
              <span className={`font-medium text-sm ${country.gdpGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {country.gdpGrowth >= 0 ? '+' : ''}{country.gdpGrowth}%
              </span>
            </div>
            <div className="w-px h-8 bg-gray-200" />
            <div>
              <span className="text-gray-400 text-xs block">Companies</span>
              <span className="text-gray-900 font-medium text-sm">{country.topStocks.length}</span>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center">
            <span className="text-gray-400 text-xs">Click to view full index</span>
          </div>
        </div>
      </Tooltip>
    </Marker>
  );
}

function RiskBadge({ risk }: { risk: string }) {
  const styles: Record<string, string> = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-amber-100 text-amber-700",
    low: "bg-green-100 text-green-700",
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium uppercase tracking-wide ${styles[risk] || styles.low}`}>
      {risk}
    </span>
  );
}

function MarketStatus({ status }: { status: string }) {
  const getIcon = () => {
    if (status === "rising") return { icon: "↑", color: "text-green-600" };
    if (status === "falling") return { icon: "↓", color: "text-red-600" };
    return { icon: "→", color: "text-amber-600" };
  };

  const { icon, color } = getIcon();

  return (
    <span className={`text-xs font-medium ${color}`}>
      {icon} {status}
    </span>
  );
}
