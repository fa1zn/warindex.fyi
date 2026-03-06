"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { MapContainer, GeoJSON, useMap } from "react-leaflet";
import L from "leaflet";
import { CountryMarket, countryMarkets } from "@/data/markets";
import "leaflet/dist/leaflet.css";

interface WarHeatmapProps {
  onCountryHover: (country: CountryMarket | null, position: { x: number; y: number } | null) => void;
  onCountryClick?: (country: CountryMarket) => void;
}

// Country code mappings
const countryNameMap: Record<string, string> = {
  "United States of America": "USA", "United States": "USA", "USA": "USA",
  "Russia": "RUS", "Russian Federation": "RUS",
  "China": "CHN", "People's Republic of China": "CHN",
  "Germany": "DEU", "Federal Republic of Germany": "DEU",
  "Saudi Arabia": "SAU", "Kingdom of Saudi Arabia": "SAU",
  "Ukraine": "UKR",
  "United Kingdom": "GBR", "Great Britain": "GBR", "UK": "GBR",
  "Israel": "ISR", "State of Israel": "ISR",
  "Taiwan": "TWN", "Republic of China": "TWN",
  "Iran": "IRN", "Islamic Republic of Iran": "IRN",
  "Japan": "JPN",
  "South Korea": "KOR", "Korea": "KOR", "Republic of Korea": "KOR", "Korea, Republic of": "KOR",
  "India": "IND", "Republic of India": "IND",
  "Poland": "POL", "Republic of Poland": "POL",
  "Turkey": "TUR", "Türkiye": "TUR", "Republic of Turkey": "TUR",
  "France": "FRA", "French Republic": "FRA",
  "Australia": "AUS", "Commonwealth of Australia": "AUS",
  "Norway": "NOR", "Kingdom of Norway": "NOR",
  "Brazil": "BRA", "Federative Republic of Brazil": "BRA",
  "United Arab Emirates": "ARE", "Qatar": "QAT", "Egypt": "EGY", "Iraq": "IRQ",
  "Syria": "SYR", "Syrian Arab Republic": "SYR", "Jordan": "JOR", "Lebanon": "LBN",
  "Finland": "FIN", "Sweden": "SWE", "Greece": "GRC", "Romania": "ROU",
  "Czech Republic": "CZE", "Czechia": "CZE", "Netherlands": "NLD",
  "Vietnam": "VNM", "Viet Nam": "VNM", "Philippines": "PHL", "Indonesia": "IDN",
  "Thailand": "THA", "Singapore": "SGP", "Pakistan": "PAK",
  "South Africa": "ZAF", "Nigeria": "NGA", "Mexico": "MEX", "Argentina": "ARG", "Chile": "CHL",
  "Spain": "ESP", "Italy": "ITA", "Switzerland": "CHE", "Belgium": "BEL", "Austria": "AUT",
  "Denmark": "DNK", "Portugal": "PRT", "Hungary": "HUN", "Bulgaria": "BGR", "Ireland": "IRL",
  "Kazakhstan": "KAZ", "Azerbaijan": "AZE", "Georgia": "GEO", "Armenia": "ARM", "Uzbekistan": "UZB",
  "Kuwait": "KWT", "Bahrain": "BHR", "Oman": "OMN", "Yemen": "YEM",
  "Morocco": "MAR", "Kenya": "KEN", "Ethiopia": "ETH", "Algeria": "DZA", "Tunisia": "TUN", "Ghana": "GHA",
  "Colombia": "COL", "Peru": "PER", "Venezuela": "VEN", "Ecuador": "ECU",
  "Malaysia": "MYS", "Bangladesh": "BGD", "Sri Lanka": "LKA", "Myanmar": "MMR", "Burma": "MMR",
  "North Korea": "PRK", "Dem. Rep. Korea": "PRK", "Democratic People's Republic of Korea": "PRK",
  "Canada": "CAN", "New Zealand": "NZL",
};

function getCountryData(name: string): CountryMarket | undefined {
  const code = countryNameMap[name];
  if (code) return countryMarkets.find(c => c.code === code);
  return undefined;
}

function getHeatColor(country: CountryMarket): string {
  const avg = country.topStocks.reduce((sum, s) => sum + s.changePercent, 0) / country.topStocks.length;
  if (avg >= 3) return '#22c55e';
  if (avg >= 1) return '#4ade80';
  if (avg >= 0) return '#86efac';
  if (avg >= -2) return '#fca5a5';
  if (avg >= -5) return '#ef4444';
  return '#dc2626';
}

function MapController() {
  const map = useMap();
  useEffect(() => {
    map.scrollWheelZoom.enable();
    map.setMaxBounds([[-60, -180], [85, 180]]);
  }, [map]);
  return null;
}

function ChoroplethLayer({
  geoData,
  onCountryHover,
  onCountryClick,
}: {
  geoData: any;
  onCountryHover: WarHeatmapProps['onCountryHover'];
  onCountryClick?: WarHeatmapProps['onCountryClick'];
}) {
  const map = useMap();
  const geoJsonRef = useRef<L.GeoJSON | null>(null);
  const [hoveredName, setHoveredName] = useState<string | null>(null);

  const style = useCallback((feature: any) => {
    const name = feature?.properties?.ADMIN || feature?.properties?.name;
    const country = getCountryData(name);
    const isHovered = hoveredName === name;

    if (country) {
      return {
        fillColor: getHeatColor(country),
        weight: isHovered ? 1.5 : 0.5,
        opacity: 1,
        color: isHovered ? '#fff' : 'rgba(255,255,255,0.3)',
        fillOpacity: isHovered ? 1 : 0.85,
      };
    }

    return {
      fillColor: '#374151',
      weight: 0.5,
      opacity: 1,
      color: 'rgba(255,255,255,0.1)',
      fillOpacity: 1,
    };
  }, [hoveredName]);

  const onEachFeature = useCallback((feature: any, layer: L.Layer) => {
    const name = feature?.properties?.ADMIN || feature?.properties?.name;
    const country = getCountryData(name);

    if (country) {
      layer.on({
        mouseover: (e: L.LeafletMouseEvent) => {
          setHoveredName(name);
          const point = map.latLngToContainerPoint(e.latlng);
          onCountryHover(country, { x: point.x, y: point.y });
          const target = e.target;
          target.setStyle({ weight: 1.5, color: '#fff', fillOpacity: 1 });
          target.bringToFront();
        },
        mousemove: (e: L.LeafletMouseEvent) => {
          const point = map.latLngToContainerPoint(e.latlng);
          onCountryHover(country, { x: point.x, y: point.y });
        },
        mouseout: (e: L.LeafletMouseEvent) => {
          setHoveredName(null);
          onCountryHover(null, null);
          if (geoJsonRef.current) geoJsonRef.current.resetStyle(e.target);
        },
        click: () => {
          if (onCountryClick) onCountryClick(country);
        },
      });
    }
  }, [map, onCountryHover, onCountryClick]);

  return (
    <GeoJSON
      ref={geoJsonRef}
      data={geoData}
      style={style}
      onEachFeature={onEachFeature}
    />
  );
}

export default function WarHeatmap({ onCountryHover, onCountryClick }: WarHeatmapProps) {
  const [geoData, setGeoData] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load map data:', err));
  }, []);

  if (!mounted || !geoData) {
    return (
      <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-neutral-500 text-sm">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <MapContainer
        center={[25, 10]}
        zoom={2.3}
        minZoom={2}
        maxZoom={6}
        className="w-full h-full"
        zoomControl={false}
        attributionControl={false}
        style={{ background: "#1a1a1a" }}
        maxBounds={[[-60, -180], [85, 180]]}
        maxBoundsViscosity={1.0}
      >
        <ChoroplethLayer
          geoData={geoData}
          onCountryHover={onCountryHover}
          onCountryClick={onCountryClick}
        />
        <MapController />
      </MapContainer>
    </div>
  );
}
