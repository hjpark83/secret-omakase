"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface Restaurant {
  id: number;
  name: string;
  category: string;
  catchTableRating: number;
  lunchPrice: string;
  dinnerPrice: string;
  lat: number;
  lng: number;
  recommendCount: number;
}

interface Props {
  restaurants: Restaurant[];
  onSelect: (id: number) => void;
}

// Custom red marker icon
function createIcon() {
  return L.divIcon({
    className: "",
    html: `<svg width="28" height="36" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0zm0 19a5 5 0 110-10 5 5 0 010 10z" fill="#EF4444"/>
      <circle cx="14" cy="14" r="4" fill="white"/>
    </svg>`,
    iconSize: [28, 36],
    iconAnchor: [14, 36],
    popupAnchor: [0, -36],
  });
}

export default function LeafletMap({ restaurants, onSelect }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [37.5236, 127.0286], // Seoul center
      zoom: 12,
      zoomControl: true,
      scrollWheelZoom: true,
    });

    // OpenStreetMap tiles (free, no API key)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update markers when restaurants change
  useEffect(() => {
    if (!markersRef.current || !mapInstanceRef.current) return;

    markersRef.current.clearLayers();

    const icon = createIcon();

    restaurants.forEach((r) => {
      if (!r.lat || !r.lng) return;

      const marker = L.marker([r.lat, r.lng], { icon }).addTo(markersRef.current!);

      marker.bindPopup(`
        <div style="font-family: 'Noto Sans KR', sans-serif; min-width: 180px;">
          <div style="font-weight: 700; font-size: 14px; margin-bottom: 4px;">${r.name}</div>
          <div style="font-size: 11px; color: #666; margin-bottom: 6px;">${r.category}</div>
          <div style="display: flex; gap: 8px; font-size: 12px; margin-bottom: 6px;">
            <span style="color: #EF4444; font-weight: 600;">★ ${r.catchTableRating.toFixed(1)}</span>
            ${r.recommendCount > 0 ? `<span style="color: #f97316; font-weight: 500;">추천 ${r.recommendCount}</span>` : ""}
          </div>
          <div style="display: flex; gap: 8px; font-size: 11px;">
            <span style="background: #EFF6FF; color: #1D4ED8; padding: 1px 6px; border-radius: 4px;">L ${r.lunchPrice}</span>
            <span style="background: #F3E8FF; color: #7C3AED; padding: 1px 6px; border-radius: 4px;">D ${r.dinnerPrice}</span>
          </div>
        </div>
      `, { closeButton: false });

      marker.on("click", () => onSelect(r.id));
    });

    // Fit bounds if restaurants exist
    if (restaurants.length > 0) {
      const validRestaurants = restaurants.filter((r) => r.lat && r.lng);
      if (validRestaurants.length > 0) {
        const bounds = L.latLngBounds(validRestaurants.map((r) => [r.lat, r.lng]));
        mapInstanceRef.current.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
      }
    }
  }, [restaurants, onSelect]);

  return (
    <div
      ref={mapRef}
      className="w-full h-[400px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 z-0"
    />
  );
}
