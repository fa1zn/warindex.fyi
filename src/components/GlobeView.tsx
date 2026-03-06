"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { conflicts, Conflict } from "@/data/conflicts";
import { companies, Company } from "@/data/companies";
import { getAllCityPaths } from "@/data/cities";
import { countryMarkets, CountryMarket } from "@/data/markets";
import CountryHoverCard from "./map/CountryHoverCard";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type GlobeInstance = any;

interface GlobeViewProps {
  onCountrySelect: (country: CountryMarket | null) => void;
  onViewIndex?: (country: CountryMarket) => void;
  isActive?: boolean;
  isIntro?: boolean;
}

interface ArcData {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string;
}

interface HoveredMarker {
  country: CountryMarket;
  position: { x: number; y: number };
}

// Static data - computed once outside component
const cityPaths = getAllCityPaths();
const conflictRings = conflicts.map((c) => ({
  lat: c.lat,
  lng: c.lng,
  maxR: c.intensity * 0.5,
  propagationSpeed: 1.2,
  repeatPeriod: 2000,
}));

// Country markers for GDP visualization
const countryMarkers = countryMarkets.map((c) => ({
  lat: c.lat,
  lng: c.lng,
  size: 0.8,
  color: c.gdpGrowth >= 0 ? "#10b981" : "#ef4444",
  country: c,
}));

export default function GlobeView({
  onCountrySelect,
  onViewIndex,
  isActive = true,
  isIntro = false
}: GlobeViewProps) {
  const globeEl = useRef<HTMLDivElement>(null);
  const globeInstance = useRef<GlobeInstance | null>(null);
  const [clickedConflict, setClickedConflict] = useState<Conflict | null>(null);
  const [clickedCompany, setClickedCompany] = useState<Company | null>(null);
  const [arcsData, setArcsData] = useState<ArcData[]>([]);
  const [hoveredMarker, setHoveredMarker] = useState<HoveredMarker | null>(null);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleConflictClick = useCallback((conflict: Conflict) => {
    setClickedConflict(conflict);
    setClickedCompany(null);
    setHoveredMarker(null);
    onCountrySelect(null);

    const relatedCompanies = companies.filter((comp) =>
      conflict.relatedCompanies.includes(comp.ticker)
    );

    const newArcs: ArcData[] = relatedCompanies.map((comp) => ({
      startLat: conflict.lat,
      startLng: conflict.lng,
      endLat: comp.lat,
      endLng: comp.lng,
      color: "rgba(120, 200, 255, 0.6)",
    }));

    setArcsData(newArcs);

    if (globeInstance.current) {
      globeInstance.current.pointOfView(
        { lat: conflict.lat, lng: conflict.lng, altitude: 1.5 },
        1000
      );
    }

    setTimeout(() => {
      setArcsData([]);
      setClickedConflict(null);
    }, 5000);
  }, [onCountrySelect]);

  const handleCountryClick = useCallback((marker: typeof countryMarkers[0]) => {
    setClickedConflict(null);
    setClickedCompany(null);
    setHoveredMarker(null);
    onCountrySelect(marker.country);

    if (globeInstance.current) {
      globeInstance.current.pointOfView(
        { lat: marker.lat, lng: marker.lng, altitude: 1.5 },
        1000
      );
    }
  }, [onCountrySelect]);

  const handleMarkerHover = useCallback((marker: typeof countryMarkers[0] | null, position?: { x: number; y: number }) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    if (marker && position) {
      // Small delay before showing hover card
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredMarker({ country: marker.country, position });
      }, 150);
    } else {
      // Small delay before hiding to allow mouse to move to card
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredMarker(null);
      }, 100);
    }
  }, []);

  const handleViewIndex = useCallback((country: CountryMarket) => {
    setHoveredMarker(null);
    if (onViewIndex) {
      onViewIndex(country);
    }
  }, [onViewIndex]);

  // Initialize globe
  useEffect(() => {
    if (!globeEl.current) return;

    let mounted = true;

    import("globe.gl").then((GlobeGL) => {
      if (!globeEl.current || !mounted || globeInstance.current) return;

      const Globe = GlobeGL.default;

      const globe = new Globe(globeEl.current, { animateIn: false })
        .globeImageUrl("//unpkg.com/three-globe/example/img/earth-night.jpg")
        .backgroundColor("rgba(0,0,0,0)")
        .showAtmosphere(true)
        .atmosphereColor("rgb(120, 200, 255)")
        .atmosphereAltitude(0.1)
        // City paths
        .pathsData(cityPaths)
        .pathPoints("coords")
        .pathPointLat((p: [number, number]) => p[0])
        .pathPointLng((p: [number, number]) => p[1])
        .pathColor("color")
        .pathStroke(1.2)
        .pathDashLength(0.3)
        .pathDashGap(0.1)
        .pathDashAnimateTime(4000)
        // Conflict rings
        .ringsData(conflictRings)
        .ringColor(() => "rgba(248, 113, 113, 0.5)")
        .ringMaxRadius("maxR")
        .ringPropagationSpeed("propagationSpeed")
        .ringRepeatPeriod("repeatPeriod")
        // Company points
        .pointsData(companies)
        .pointLat("lat")
        .pointLng("lng")
        .pointColor(() => "rgb(120, 200, 255)")
        .pointAltitude(0.01)
        .pointRadius(0.3)
        .onPointClick((point: object | null) => {
          if (point && isActive) {
            const company = point as Company;
            setClickedCompany(company);
            setClickedConflict(null);
            setHoveredMarker(null);
            onCountrySelect(null);
            if (globeInstance.current) {
              globeInstance.current.pointOfView(
                { lat: company.lat, lng: company.lng, altitude: 1.2 },
                1000
              );
            }
          }
        })
        // Country markers (GDP indicators)
        .htmlElementsData(countryMarkers)
        .htmlLat((d: object) => (d as typeof countryMarkers[0]).lat)
        .htmlLng((d: object) => (d as typeof countryMarkers[0]).lng)
        .htmlAltitude(0.02)
        .htmlElement((d: object) => {
          const marker = d as typeof countryMarkers[0];
          const el = document.createElement("div");
          el.className = "country-marker";
          el.dataset.countryCode = marker.country.code;
          el.style.cssText = `
            width: 24px;
            height: 24px;
            border-radius: 50%;
            background: ${marker.color}15;
            border: 2px solid ${marker.color}80;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(4px);
          `;

          // Inner dot
          const inner = document.createElement("div");
          inner.style.cssText = `
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: ${marker.color};
            box-shadow: 0 0 10px ${marker.color}60;
            transition: all 0.3s ease;
          `;
          el.appendChild(inner);

          // Hover effect with screen position tracking
          el.addEventListener("mouseenter", (e) => {
            el.style.transform = "scale(1.5)";
            el.style.borderColor = marker.color;
            el.style.background = `${marker.color}30`;
            inner.style.transform = "scale(1.2)";

            // Get screen position for hover card
            const rect = el.getBoundingClientRect();
            const position = {
              x: rect.left + rect.width / 2,
              y: rect.top
            };

            // Dispatch custom event to update React state
            window.dispatchEvent(new CustomEvent('marker-hover', {
              detail: { marker, position }
            }));
          });

          el.addEventListener("mouseleave", () => {
            el.style.transform = "scale(1)";
            el.style.borderColor = `${marker.color}80`;
            el.style.background = `${marker.color}15`;
            inner.style.transform = "scale(1)";

            // Dispatch custom event to clear hover
            window.dispatchEvent(new CustomEvent('marker-hover', {
              detail: { marker: null, position: null }
            }));
          });

          // Click handler
          el.addEventListener("click", (e) => {
            e.stopPropagation();
            if (isActive) {
              handleCountryClick(marker);
            }
          });

          return el;
        })
        // Arcs
        .arcsData([])
        .arcColor("color")
        .arcAltitude(0.12)
        .arcStroke(0.5)
        .arcDashLength(0.5)
        .arcDashGap(0.2)
        .arcDashAnimateTime(1200);

      const controls = globe.controls();
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.2;
      controls.enableZoom = !isIntro;
      controls.enableRotate = !isIntro;
      controls.enablePan = false;
      controls.minDistance = 120;
      controls.maxDistance = 400;
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;

      globe.pointOfView({ lat: 30, lng: 20, altitude: isIntro ? 2.5 : 2.0 });

      globeInstance.current = globe;

      const handleResize = () => {
        if (globeInstance.current) {
          globeInstance.current.width(window.innerWidth);
          globeInstance.current.height(window.innerHeight);
        }
      };
      window.addEventListener("resize", handleResize, { passive: true });
      handleResize();
    });

    return () => {
      mounted = false;
    };
  }, [isIntro, isActive, handleCountryClick, onCountrySelect]);

  // Listen for marker hover events from DOM
  useEffect(() => {
    const handleMarkerHoverEvent = (e: Event) => {
      const { marker, position } = (e as CustomEvent).detail;
      handleMarkerHover(marker, position);
    };

    window.addEventListener('marker-hover', handleMarkerHoverEvent);
    return () => window.removeEventListener('marker-hover', handleMarkerHoverEvent);
  }, [handleMarkerHover]);

  // Update controls when transitioning
  useEffect(() => {
    if (globeInstance.current && isActive && !isIntro) {
      globeInstance.current.controls().enableZoom = true;
      globeInstance.current.controls().enableRotate = true;
      globeInstance.current.pointOfView({ lat: 30, lng: 0, altitude: 2.0 }, 1000);
    }
  }, [isActive, isIntro]);

  // Update arcs
  useEffect(() => {
    if (globeInstance.current) {
      globeInstance.current.arcsData(arcsData);
    }
  }, [arcsData]);

  // Click detection for conflicts
  useEffect(() => {
    if (!isActive || isIntro) return;

    const handleClick = (e: MouseEvent) => {
      if (!globeInstance.current) return;
      const globe = globeInstance.current;

      for (const conflict of conflicts) {
        const coords = globe.getScreenCoords(conflict.lat, conflict.lng, 0);
        if (coords) {
          const dx = e.clientX - coords.x;
          const dy = e.clientY - coords.y;
          if (Math.sqrt(dx * dx + dy * dy) < 30) {
            handleConflictClick(conflict);
            return;
          }
        }
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [handleConflictClick, isActive, isIntro]);

  const handleClose = useCallback(() => {
    setClickedConflict(null);
    setClickedCompany(null);
    setArcsData([]);
    onCountrySelect(null);
    if (globeInstance.current) {
      globeInstance.current.pointOfView({ lat: 30, lng: 0, altitude: 2.0 }, 1000);
    }
  }, [onCountrySelect]);

  return (
    <div className="relative w-full h-full">
      <div ref={globeEl} className="w-full h-full" />

      {/* Country Hover Card */}
      {isActive && !isIntro && hoveredMarker && !clickedConflict && !clickedCompany && (
        <CountryHoverCard
          country={hoveredMarker.country}
          position={hoveredMarker.position}
          onViewIndex={() => handleViewIndex(hoveredMarker.country)}
          onClose={() => setHoveredMarker(null)}
        />
      )}

      {isActive && !isIntro && (
        <>
          {/* Conflict Info Card */}
          {clickedConflict && (
            <div className="fixed top-20 right-6 z-50 animate-scale-in">
              <div className="glass rounded-2xl p-5 w-[320px]">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                    <span className="badge badge-danger">Active Conflict</span>
                  </div>
                  <button
                    onClick={handleClose}
                    className="glass-button w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-white text-lg font-medium mb-3">{clickedConflict.name}</h3>

                {/* Intensity Meter */}
                <div className="glass-card rounded-xl p-3 mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">
                      Threat Level
                    </span>
                    <span className="text-red-400 text-xs font-mono">{clickedConflict.intensity}/10</span>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {[...Array(10)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 h-1.5 rounded-full transition-colors ${
                          i < clickedConflict.intensity ? "bg-red-500" : "bg-white/[0.06]"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {clickedConflict.description}
                </p>

                {/* Market Impact */}
                <div className="pt-4 border-t border-white/[0.06]">
                  <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">
                    Affected Companies
                  </span>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {clickedConflict.relatedCompanies.map((ticker) => (
                      <span key={ticker} className="badge badge-info font-mono">
                        {ticker}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Company Info Card */}
          {clickedCompany && !clickedConflict && (
            <div className="fixed top-20 right-6 z-50 animate-scale-in">
              <div className="glass rounded-2xl p-5 w-[320px]">
                {/* Header */}
                <div className="flex items-start justify-between mb-1">
                  <span className="badge badge-info">{clickedCompany.industry}</span>
                  <button
                    onClick={handleClose}
                    className="glass-button w-7 h-7 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* Title */}
                <h3 className="text-white text-lg font-medium mt-2">{clickedCompany.name}</h3>
                <p className="text-gradient-accent text-sm font-mono mb-4">{clickedCompany.ticker}</p>

                {/* Description */}
                <p className="text-white/50 text-sm leading-relaxed mb-4">
                  {clickedCompany.description}
                </p>

                {/* Conflict Exposure */}
                <div className="glass-card rounded-xl p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500" />
                    <span className="text-white/40 text-[10px] uppercase tracking-wider font-medium">
                      War Exposure
                    </span>
                  </div>
                  <p className="text-amber-400/70 text-sm leading-relaxed">
                    {clickedCompany.conflictExposure}
                  </p>
                </div>

                {/* Location Tag */}
                <div className="mt-4 flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                  </svg>
                  <span className="text-white/30 text-xs">{clickedCompany.country}</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
