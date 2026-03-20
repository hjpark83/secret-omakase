"use client";

import { useEffect, useRef, useCallback } from "react";

const KAKAO_APP_KEY = "22f9f866d1de69e8c0ad97b03da6e4c5";

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

/* Global SDK load state */
let sdkLoaded = false;
let sdkLoading = false;
const sdkCallbacks: (() => void)[] = [];

function loadKakaoSDK(): Promise<void> {
  return new Promise((resolve) => {
    if (sdkLoaded) { resolve(); return; }
    sdkCallbacks.push(resolve);
    if (sdkLoading) return;
    sdkLoading = true;

    const script = document.createElement("script");
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_APP_KEY}&autoload=false&libraries=services`;
    script.onload = () => {
      window.kakao.maps.load(() => {
        sdkLoaded = true;
        sdkCallbacks.forEach((cb) => cb());
        sdkCallbacks.length = 0;
      });
    };
    document.head.appendChild(script);
  });
}

export default function KakaoMap({ restaurants, onSelect, selectedId, onBoundsChange, className }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const overlaysRef = useRef<any[]>([]);
  const openOverlayRef = useRef<any>(null);

  const emitBounds = useCallback(() => {
    if (!mapRef.current || !onBoundsChange) return;
    const bounds = mapRef.current.getBounds();
    onBoundsChange({
      south: bounds.getSouthWest().getLat(),
      west: bounds.getSouthWest().getLng(),
      north: bounds.getNorthEast().getLat(),
      east: bounds.getNorthEast().getLng(),
    });
  }, [onBoundsChange]);

  // Init map
  useEffect(() => {
    if (!containerRef.current) return;
    let mounted = true;

    loadKakaoSDK().then(() => {
      if (!mounted || !containerRef.current || mapRef.current) return;
      const kakao = window.kakao;

      const map = new kakao.maps.Map(containerRef.current, {
        center: new kakao.maps.LatLng(37.5236, 127.0286),
        level: 7,
      });

      // Controls
      map.addControl(new kakao.maps.ZoomControl(), kakao.maps.ControlPosition.RIGHT);

      mapRef.current = map;

      kakao.maps.event.addListener(map, "idle", () => emitBounds());
      setTimeout(() => emitBounds(), 500);
    });

    return () => {
      mounted = false;
      mapRef.current = null;
    };
  }, [emitBounds]);

  // Update markers
  useEffect(() => {
    if (!mapRef.current) return;
    const kakao = window.kakao;
    if (!kakao) return;

    // Clear old markers & overlays
    markersRef.current.forEach((m) => m.setMap(null));
    overlaysRef.current.forEach((o) => o.setMap(null));
    markersRef.current = [];
    overlaysRef.current = [];
    openOverlayRef.current = null;

    restaurants.forEach((r) => {
      if (!r.lat || !r.lng) return;
      const isSelected = r.id === selectedId;
      const position = new kakao.maps.LatLng(r.lat, r.lng);

      // Marker
      const mw = isSelected ? 36 : 28;
      const mh = isSelected ? 46 : 36;
      const markerSize = new kakao.maps.Size(mw, mh);
      const markerImage = new kakao.maps.MarkerImage(
        `https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_red.png`,
        markerSize,
        { offset: new kakao.maps.Point(mw / 2, mh) }
      );

      const marker = new kakao.maps.Marker({
        position,
        image: markerImage,
        clickable: true,
        zIndex: isSelected ? 10 : 1,
      });
      marker.setMap(mapRef.current);
      markersRef.current.push(marker);

      // Custom overlay (popup)
      const overlayContent = document.createElement("div");
      overlayContent.innerHTML = `
        <div style="background:white;border-radius:12px;padding:14px 16px;box-shadow:0 4px 20px rgba(0,0,0,.15);min-width:220px;font-family:'Noto Sans KR',sans-serif;position:relative;">
          <div style="position:absolute;top:8px;right:10px;cursor:pointer;font-size:16px;color:#aaa;line-height:1;" class="kakao-overlay-close">×</div>
          <div style="font-weight:700;font-size:15px;margin-bottom:4px;padding-right:20px;">${r.name}</div>
          <div style="font-size:11px;color:#888;margin-bottom:8px;">${r.category}</div>
          <div style="display:flex;gap:8px;font-size:13px;margin-bottom:8px;align-items:center;">
            <span style="color:#EF4444;font-weight:700;">★ ${r.catchTableRating.toFixed(1)}</span>
            ${r.recommendCount > 0 ? `<span style="color:#f97316;font-weight:500;font-size:12px;">추천 ${r.recommendCount}</span>` : ""}
          </div>
          <div style="display:flex;gap:8px;font-size:12px;">
            <span style="background:#EFF6FF;color:#1D4ED8;padding:2px 8px;border-radius:6px;font-weight:500;">L ${r.lunchPrice}</span>
            <span style="background:#F3E8FF;color:#7C3AED;padding:2px 8px;border-radius:6px;font-weight:500;">D ${r.dinnerPrice}</span>
          </div>
          <div style="position:absolute;bottom:-8px;left:50%;transform:translateX(-50%);width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid white;"></div>
        </div>
      `;

      const overlay = new kakao.maps.CustomOverlay({
        content: overlayContent,
        position,
        yAnchor: 1.15,
        zIndex: 20,
      });
      overlaysRef.current.push(overlay);

      // Close button handler
      overlayContent.querySelector(".kakao-overlay-close")?.addEventListener("click", (e) => {
        e.stopPropagation();
        overlay.setMap(null);
        openOverlayRef.current = null;
      });

      // Click handler
      kakao.maps.event.addListener(marker, "click", () => {
        // Close previous overlay
        if (openOverlayRef.current) openOverlayRef.current.setMap(null);
        overlay.setMap(mapRef.current);
        openOverlayRef.current = overlay;
        onSelect(r.id);
      });

      // Auto-open if selected
      if (isSelected) {
        overlay.setMap(mapRef.current);
        openOverlayRef.current = overlay;
      }
    });
  }, [restaurants, selectedId, onSelect]);

  // Pan to selected
  useEffect(() => {
    if (!selectedId || !mapRef.current) return;
    const kakao = window.kakao;
    if (!kakao) return;
    const r = restaurants.find((r) => r.id === selectedId);
    if (r && r.lat && r.lng) {
      mapRef.current.panTo(new kakao.maps.LatLng(r.lat, r.lng));
    }
  }, [selectedId, restaurants]);

  return (
    <div
      ref={containerRef}
      className={className || "w-full h-[500px] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 z-0"}
    />
  );
}

/* TypeScript global declaration */
declare global {
  interface Window {
    kakao: any;
  }
}
