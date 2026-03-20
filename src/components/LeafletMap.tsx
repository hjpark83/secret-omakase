"use client";

import { useEffect, useRef, useCallback } from "react";
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
  selectedId?: number | null;
  onBoundsChange?: (bounds: { north: number; south: number; east: number; west: number }) => void;
  className?: string;
}

function createIcon(selected = false) {
  const color = selected ? "#F97316" : "#EF4444";
  const size = selected ? 36 : 28;
  const height = selected ? 46 : 36;
  return L.divIcon({
    className: "",
    html: `<svg width="${size}" height="${height}" viewBox="0 0 28 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 0C6.268 0 0 6.268 0 14c0 10.5 14 22 14 22s14-11.5 14-22C28 6.268 21.732 0 14 0zm0 19a5 5 0 110-10 5 5 0 010 10z" fill="${color}"/>
      <circle cx="14" cy="14" r="4" fill="white"/>
    </svg>`,
    iconSize: [size, height],
    iconAnchor: [size / 2, height],
    popupAnchor: [0, -height],
  });
}

export default function LeafletMap({ restaurants, onSelect, selectedId, onBoundsChange, className }: Props) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const markerMapRef = useRef<Map<number, L.Marker>>(new Map());

  const emitBounds = useCallback(() => {
    if (!mapInstanceRef.current || !onBoundsChange) return;
    const b = mapInstanceRef.current.getBounds();
    onBoundsChange({
      north: b.getNorth(),
      south: b.getSouth(),
      east: b.getEast(),
      west: b.getWest(),
    });
  }, [onBoundsChange]);

  // Init map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [37.5236, 127.0286],
      zoom: 12,
      zoomControl: false,
      scrollWheelZoom: true,
    });

    L.control.zoom({ position: "topright" }).addTo(map);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    map.on("moveend", () => emitBounds());
    map.on("zoomend", () => emitBounds());

    // Initial bounds emit
    setTimeout(() => emitBounds(), 300);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [emitBounds]);

  // Update markers when restaurants change
  useEffect(() => {
    if (!markersRef.current || !mapInstanceRef.current) return;

    markersRef.current.clearLayers();
    markerMapRef.current.clear();

    const defaultIcon = createIcon(false);

    restaurants.forEach((r) => {
      if (!r.lat || !r.lng) return;

      const isSelected = r.id === selectedId;
      const icon = isSelected ? createIcon(true) : defaultIcon;
      const marker = L.marker([r.lat, r.lng], { icon, zIndexOffset: isSelected ? 1000 : 0 }).addTo(markersRef.current!);

      marker.bindPopup(`
        <div style="font-family: 'Noto Sans KR', sans-serif; min-width: 200px; padding: 4px 0;">
          <div style="font-weight: 700; font-size: 15px; margin-bottom: 4px;">${r.name}</div>
          <div style="font-size: 11px; color: #888; margin-bottom: 8px;">${r.category}</div>
          <div style="display: flex; gap: 8px; font-size: 13px; margin-bottom: 8px; align-items: center;">
            <span style="color: #EF4444; font-weight: 700;">★ ${r.catchTableRating.toFixed(1)}</span>
            ${r.recommendCount > 0 ? `<span style="color: #f97316; font-weight: 500; font-size: 12px;">추천 ${r.recommendCount}</span>` : ""}
          </div>
          <div style="display: flex; gap: 8px; font-size: 12px;">
            <span style="background: #EFF6FF; color: #1D4ED8; padding: 2px 8px; border-radius: 6px; font-weight: 500;">L ${r.lunchPrice}</span>
            <span style="background: #F3E8FF; color: #7C3AED; padding: 2px 8px; border-radius: 6px; font-weight: 500;">D ${r.dinnerPrice}</span>
          </div>
        </div>
      `, { closeButton: false, maxWidth: 280 });

      marker.on("click", () => onSelect(r.id));
      markerMapRef.current.set(r.id, marker);
    });
  }, [restaurants, selectedId, onSelect]);

  // Pan to selected
  useEffect(() => {
    if (!selectedId || !mapInstanceRef.current) return;
    const marker = markerMapRef.current.get(selectedId);
    if (marker) {
      const latlng = marker.getLatLng();
      mapInstanceRef.current.panTo(latlng, { animate: true });
      marker.openPopup();
    }
  }, [selectedId]);

  return (
    <div
      ref={mapRef}
      className={className || "w-full h-[500px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 z-0"}
    />
  );
}
