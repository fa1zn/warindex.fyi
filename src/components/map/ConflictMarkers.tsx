"use client";

import { useEffect, useState } from "react";
import { useMap, CircleMarker, Popup } from "react-leaflet";

interface ConflictEvent {
  id: string;
  date: string;
  country: string;
  countryCode: string;
  location: string;
  lat: number;
  lng: number;
  eventType: "battle" | "explosion" | "violence" | "protest" | "strategic";
  fatalities: number;
  description: string;
  source: string;
  severity: "low" | "medium" | "high" | "critical";
}

const severityColors = {
  critical: "#ef4444",
  high: "#f97316",
  medium: "#eab308",
  low: "#22c55e",
};

const severityRadius = {
  critical: 8,
  high: 6,
  medium: 5,
  low: 4,
};

const eventTypeIcons = {
  battle: "⚔️",
  explosion: "💥",
  violence: "⚠️",
  protest: "📢",
  strategic: "🎯",
};

export default function ConflictMarkers() {
  const [events, setEvents] = useState<ConflictEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const map = useMap();

  useEffect(() => {
    const fetchConflicts = async () => {
      try {
        const res = await fetch("/api/conflicts");
        const data = await res.json();
        if (data.events) {
          setEvents(data.events);
        }
      } catch (error) {
        console.error("Failed to fetch conflicts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchConflicts();
    // Refresh every 10 minutes
    const interval = setInterval(fetchConflicts, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || events.length === 0) return null;

  return (
    <>
      {events.map((event) => (
        <CircleMarker
          key={event.id}
          center={[event.lat, event.lng]}
          radius={severityRadius[event.severity]}
          pathOptions={{
            color: severityColors[event.severity],
            fillColor: severityColors[event.severity],
            fillOpacity: 0.6,
            weight: 2,
          }}
          eventHandlers={{
            mouseover: (e) => {
              e.target.openPopup();
            },
            mouseout: (e) => {
              e.target.closePopup();
            },
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{eventTypeIcons[event.eventType]}</span>
                <span className="font-semibold text-gray-900">{event.location}</span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{event.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{event.date}</span>
                <span className="px-2 py-0.5 rounded bg-gray-100">{event.source}</span>
              </div>
              {event.fatalities > 0 && (
                <div className="mt-2 text-xs text-red-600 font-medium">
                  {event.fatalities} casualties reported
                </div>
              )}
            </div>
          </Popup>
        </CircleMarker>
      ))}
    </>
  );
}
