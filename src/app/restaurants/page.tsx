"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getRestaurants, type Restaurant } from "@/lib/restaurants";

/* ══════════════════════════════════════
   Kakao Map (dynamic import - SSR off)
   ══════════════════════════════════════ */
const KakaoMap = dynamic(() => import("@/components/KakaoMap"), { ssr: false, loading: () => (
  <div className="w-full h-full bg-gray-100 dark:bg-dark-bg flex items-center justify-center text-gray-400 text-sm">지도 로딩 중...</div>
)});


/* ══════════════════════════════════════
   Filters
   ══════════════════════════════════════ */
const categories = [
  { key: "전체", label: "전체" },
  { key: "오마카세", label: "오마카세" },
  { key: "파인다이닝", label: "파인다이닝" },
  { key: "양식", label: "양식" },
  { key: "한식", label: "한식" },
  { key: "중식", label: "중식" },
  { key: "일식", label: "일식" },
];

/* ══════════════════════════════════════
   Star Rating
   ══════════════════════════════════════ */
function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className={`flex items-center gap-0.5 ${size === "lg" ? "text-xl" : "text-sm"}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= Math.round(rating) ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}>★</span>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════
   Detail Modal
   ══════════════════════════════════════ */
function RestaurantModal({ restaurant, onClose }: { restaurant: Restaurant; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"info" | "media">("info");

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="relative h-44 bg-gradient-to-br from-orange-200 to-red-100 dark:from-dark-accent dark:to-dark-bg flex items-center justify-center shrink-0">
          <span className="text-6xl opacity-40">🍣</span>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {restaurant.groupDining && (
            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              10+ 단체 가능
            </div>
          )}
          {restaurant.recommendCount > 0 && (
            <div className="absolute bottom-4 left-4 bg-primary-500 text-white text-xs font-medium px-2.5 py-1 rounded-lg">
              추천 {restaurant.recommendCount}회
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">{restaurant.category}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{restaurant.area}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{restaurant.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{restaurant.address}</p>
              </div>
              <div className="text-center shrink-0">
                <div className="text-xs text-gray-400 mb-0.5">캐치테이블</div>
                <div className="text-2xl font-bold text-red-500">{restaurant.catchTableRating.toFixed(1)}</div>
                <StarRating rating={restaurant.catchTableRating} />
                <div className="text-[10px] text-gray-400 mt-0.5">리뷰 {restaurant.catchTableReviewCount}개</div>
              </div>
            </div>

            {restaurant.recommendCount > 0 && (
              <Link href={`/reviews?restaurant=${encodeURIComponent(restaurant.name)}`}
                className="inline-flex items-center gap-1.5 mt-3 text-sm text-primary-500 hover:text-primary-600 font-medium transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" /></svg>
                추천 리뷰 {restaurant.recommendCount}개 보기
              </Link>
            )}

            {/* Price */}
            <div className="grid grid-cols-2 gap-3 mt-4">
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-3 text-center">
                <div className="text-[10px] text-blue-500 dark:text-blue-400 font-medium uppercase tracking-wider">Lunch</div>
                <div className="text-lg font-bold text-blue-700 dark:text-blue-300 mt-0.5">{restaurant.lunchPrice}</div>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/20 rounded-xl p-3 text-center">
                <div className="text-[10px] text-purple-500 dark:text-purple-400 font-medium uppercase tracking-wider">Dinner</div>
                <div className="text-lg font-bold text-purple-700 dark:text-purple-300 mt-0.5">{restaurant.dinnerPrice}</div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              <a href={restaurant.catchTableUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                캐치테이블 예약
              </a>
              <a href={restaurant.mapUrl} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-accent rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                지도 보기
              </a>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6">
            <div className="flex gap-0">
              {([["info", "업장 정보"], ["media", "미디어"]] as const).map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key as "info" | "media")}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="px-6 py-5">
            {activeTab === "info" && (
              <div className="space-y-5">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{restaurant.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                    <span className="text-lg mt-0.5">📍</span>
                    <div><div className="text-xs text-gray-500 dark:text-gray-400">주소</div><div className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.address}</div></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                    <span className="text-lg mt-0.5">📞</span>
                    <div><div className="text-xs text-gray-500 dark:text-gray-400">전화번호</div><div className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.phone || "–"}</div></div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl sm:col-span-2">
                    <span className="text-lg mt-0.5">🕐</span>
                    <div><div className="text-xs text-gray-500 dark:text-gray-400">영업시간</div><div className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.hours || "–"}</div></div>
                  </div>
                </div>
                {restaurant.groupDining && (
                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      <span className="text-sm font-semibold text-green-800 dark:text-green-300">10인 이상 단체 예약 가능</span>
                    </div>
                    {restaurant.groupDiningNote && <p className="text-xs text-green-700 dark:text-green-400 ml-7">{restaurant.groupDiningNote}</p>}
                  </div>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {restaurant.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg px-3 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            )}
            {activeTab === "media" && (
              <div>
                {restaurant.youtubeId ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">관련 영상</h4>
                    <div className="aspect-video rounded-xl overflow-hidden bg-black">
                      <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${restaurant.youtubeId}`} title="YouTube video" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-400 dark:text-gray-500"><span className="text-4xl block mb-3">🎬</span><p className="text-sm">등록된 미디어가 없습니다</p></div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   Side List Item
   ══════════════════════════════════════ */
function ListItem({ restaurant, isSelected, onClick }: { restaurant: Restaurant; isSelected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 border-b border-gray-100 dark:border-gray-700/50 transition-colors hover:bg-gray-50 dark:hover:bg-dark-accent/50 ${isSelected ? "bg-orange-50 dark:bg-orange-900/10 border-l-4 border-l-orange-500" : ""}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{restaurant.name}</h3>
            {restaurant.groupDining && (
              <span className="shrink-0 text-[10px] font-medium text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded">단체</span>
            )}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 truncate">{restaurant.address}</p>
          <div className="flex items-center gap-3 text-xs">
            <span className="text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">L {restaurant.lunchPrice}</span>
            <span className="text-purple-600 dark:text-purple-400 font-medium bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded">D {restaurant.dinnerPrice}</span>
          </div>
        </div>
        <div className="shrink-0 text-right">
          <div className="flex items-center gap-1 mb-1">
            <span className="text-yellow-500 text-sm">★</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{restaurant.catchTableRating.toFixed(1)}</span>
          </div>
          <div className="text-[10px] text-gray-400">리뷰 {restaurant.catchTableReviewCount}</div>
          {restaurant.recommendCount > 0 && (
            <div className="text-[10px] text-orange-500 font-medium mt-1">추천 {restaurant.recommendCount}</div>
          )}
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mt-2">
        {restaurant.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-bg px-1.5 py-0.5 rounded">#{tag}</span>
        ))}
      </div>
    </button>
  );
}

/* ══════════════════════════════════════
   Main Page
   ══════════════════════════════════════ */
export default function RestaurantsPage() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("오마카세");
  const [groupOnly, setGroupOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "recommend" | "price">("rating");
  const [mapBounds, setMapBounds] = useState<{ north: number; south: number; east: number; west: number } | null>(null);
  const [filterInMap, setFilterInMap] = useState(true);

  useEffect(() => {
    setRestaurants(getRestaurants());
    const onStorage = () => setRestaurants(getRestaurants());
    window.addEventListener("storage", onStorage);
    window.addEventListener("restaurants-updated", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("restaurants-updated", onStorage);
    };
  }, []);

  const handleBoundsChange = useCallback((bounds: { north: number; south: number; east: number; west: number }) => {
    setMapBounds(bounds);
  }, []);

  // All filtered restaurants (category, group, search)
  const baseFiltered = useMemo(() => {
    let list = restaurants;
    if (activeCategory !== "전체") list = list.filter((r) => r.category === activeCategory);
    if (groupOnly) list = list.filter((r) => r.groupDining);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      list = list.filter((r) => r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q) || r.tags.some((t) => t.toLowerCase().includes(q)));
    }
    return list;
  }, [activeCategory, groupOnly, searchQuery]);

  // Restaurants visible in current map bounds
  const visibleInMap = useMemo(() => {
    if (!filterInMap || !mapBounds) return baseFiltered;
    return baseFiltered.filter((r) =>
      r.lat >= mapBounds.south && r.lat <= mapBounds.north &&
      r.lng >= mapBounds.west && r.lng <= mapBounds.east
    );
  }, [baseFiltered, mapBounds, filterInMap]);

  // Sorted list
  const sorted = useMemo(() => {
    const list = [...visibleInMap];
    if (sortBy === "rating") list.sort((a, b) => b.catchTableRating - a.catchTableRating);
    else if (sortBy === "recommend") list.sort((a, b) => b.recommendCount - a.recommendCount);
    else if (sortBy === "price") list.sort((a, b) => {
      const priceNum = (s: string) => parseInt(s.replace(/[^0-9]/g, "")) || 0;
      return priceNum(a.dinnerPrice) - priceNum(b.dinnerPrice);
    });
    return list;
  }, [visibleInMap, sortBy]);

  const detailRestaurant = detailId ? restaurants.find((r) => r.id === detailId) ?? null : null;

  const handleSelect = useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const handleOpenDetail = useCallback((id: number) => {
    setDetailId(id);
  }, []);

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col">
      {/* Top Filter Bar */}
      <div className="bg-white dark:bg-dark-card border-b border-gray-200 dark:border-gray-700 px-4 py-3 shrink-0 z-10">
        <div className="max-w-full mx-auto">
          {/* Search + filters row */}
          <div className="flex items-center gap-3 mb-3">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="식당 이름, 주소, 태그 검색..."
                className="w-full pl-9 pr-4 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              />
            </div>

            {/* Group toggle */}
            <button
              onClick={() => setGroupOnly(!groupOnly)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${groupOnly ? "bg-green-500 text-white border-green-500" : "bg-white dark:bg-dark-bg text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-accent"}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              회식 10+
            </button>

            {/* Map filter toggle */}
            <button
              onClick={() => setFilterInMap(!filterInMap)}
              className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors border ${filterInMap ? "bg-primary-500 text-white border-primary-500" : "bg-white dark:bg-dark-bg text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-dark-accent"}`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
              지도 영역 검색
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "rating" | "recommend" | "price")}
              className="shrink-0 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-700 dark:text-gray-300 text-xs font-medium outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="rating">평점순</option>
              <option value="recommend">추천순</option>
              <option value="price">가격순</option>
            </select>
          </div>

          {/* Category chips */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors ${cat.key === activeCategory ? "bg-primary-500 text-white shadow-sm" : "bg-gray-100 dark:bg-dark-bg text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-accent"}`}
              >
                {cat.label}
              </button>
            ))}
            <div className="shrink-0 text-xs text-gray-400 dark:text-gray-500 ml-2">
              {sorted.length}개 업장
            </div>
          </div>
        </div>
      </div>

      {/* Map + List split */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Map */}
        <div className="flex-1 relative min-h-[300px] lg:min-h-0">
          <KakaoMap
            restaurants={baseFiltered}
            onSelect={handleSelect}
            selectedId={selectedId}
            onBoundsChange={handleBoundsChange}
            className="w-full h-full z-0"
          />
          {/* "이 지역 재검색" badge */}
          {filterInMap && (
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 bg-white dark:bg-dark-card shadow-lg rounded-full px-4 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600 pointer-events-none">
              지도를 이동하면 목록이 자동 갱신됩니다
            </div>
          )}
        </div>

        {/* Side List */}
        <div className="w-full lg:w-[420px] xl:w-[460px] bg-white dark:bg-dark-card border-t lg:border-t-0 lg:border-l border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden shrink-0">
          {/* List header */}
          <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700/50 flex items-center justify-between shrink-0">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
              {filterInMap ? "지도 영역 내 " : ""}식당 목록
              <span className="ml-1.5 text-primary-500 font-bold">{sorted.length}</span>
            </h2>
            {groupOnly && (
              <span className="text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-2 py-0.5 rounded-full font-medium">
                단체 전용
              </span>
            )}
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto">
            {sorted.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400 dark:text-gray-500">
                <span className="text-4xl mb-3">🍣</span>
                <p className="text-sm">이 영역에 해당 업장이 없습니다</p>
                <p className="text-xs mt-1">지도를 이동하거나 필터를 변경해보세요</p>
              </div>
            ) : (
              sorted.map((rest) => (
                <ListItem
                  key={rest.id}
                  restaurant={rest}
                  isSelected={rest.id === selectedId}
                  onClick={() => {
                    setSelectedId(rest.id);
                    handleOpenDetail(rest.id);
                  }}
                />
              ))
            )}
          </div>

          {/* CatchTable banner */}
          <div className="shrink-0 p-3 border-t border-gray-100 dark:border-gray-700/50">
            <a
              href="https://app.catchtable.co.kr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-gradient-to-r from-red-500 to-orange-500 text-white text-sm font-medium rounded-xl hover:from-red-600 hover:to-orange-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              캐치테이블에서 예약하기
            </a>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {detailRestaurant && <RestaurantModal restaurant={detailRestaurant} onClose={() => setDetailId(null)} />}
    </div>
  );
}
