"use client";

import { useState, useMemo } from "react";

/* ══════════════════════════════════════
   Types
   ══════════════════════════════════════ */
interface MemberReview {
  name: string;
  rating: number;
  comment: string;
  date: string;
  photos: string[];
}

interface Restaurant {
  id: number;
  name: string;
  category: string;
  area: string;
  address: string;
  phone: string;
  hours: string;
  description: string;
  catchTableUrl: string;
  catchTableRating: number;
  catchTableReviewCount: number;
  lunchPrice: string;
  dinnerPrice: string;
  websiteUrl: string;
  mapUrl: string;
  youtubeId: string;
  tags: string[];
  groupDining: boolean;          // 10명 이상 예약 가능 여부
  groupDiningNote: string;       // 회식 관련 참고 사항
  lat: number;
  lng: number;
  memberReviews: MemberReview[];
}

/* ══════════════════════════════════════
   Data (empty – add restaurants here)
   ══════════════════════════════════════ */
const restaurants: Restaurant[] = [];

/* ══════════════════════════════════════
   Categories – 오마카세 default
   ══════════════════════════════════════ */
const categories = [
  { key: "오마카세", label: "오마카세" },
  { key: "파인다이닝", label: "파인다이닝" },
  { key: "양식", label: "양식" },
  { key: "한식", label: "한식" },
  { key: "중식", label: "중식" },
  { key: "일식", label: "일식" },
  { key: "기타", label: "기타" },
];

const areas = ["전체", "강남/서초", "성수/건대", "여의도/마포", "이태원/한남", "종로/을지로", "기타"];

/* ══════════════════════════════════════
   Helpers
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
   Map Component (Kakao Map embed)
   ══════════════════════════════════════ */
function MapSection({ restaurants: list, onSelect }: { restaurants: Restaurant[]; onSelect: (id: number) => void }) {
  // Seoul center coordinates for default view
  const defaultLat = 37.5236;
  const defaultLng = 127.0286;

  // Simplified interactive map - plots restaurant dots on a visual area grid
  // For production, replace with Kakao/Naver Map SDK
  return (
    <div className="relative w-full h-[400px] bg-gray-100 dark:bg-dark-bg rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Map placeholder background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-900">
        {/* Grid lines for reference */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Area labels */}
        {[
          { label: "종로/을지로", top: "15%", left: "40%" },
          { label: "이태원/한남", top: "45%", left: "45%" },
          { label: "강남/서초", top: "65%", left: "45%" },
          { label: "성수/건대", top: "30%", left: "65%" },
          { label: "여의도/마포", top: "40%", left: "20%" },
        ].map((a) => (
          <div key={a.label} className="absolute text-[10px] font-medium text-gray-400 dark:text-gray-500 select-none" style={{ top: a.top, left: a.left }}>
            {a.label}
          </div>
        ))}

        {/* Restaurant pins */}
        {list.map((r) => {
          // Map lat/lng to percentage positions within Seoul bounding box
          const latMin = 37.48, latMax = 37.58, lngMin = 126.90, lngMax = 127.10;
          const top = ((latMax - r.lat) / (latMax - latMin)) * 100;
          const left = ((r.lng - lngMin) / (lngMax - lngMin)) * 100;
          return (
            <button
              key={r.id}
              onClick={() => onSelect(r.id)}
              className="absolute z-10 group"
              style={{ top: `${Math.max(5, Math.min(90, top))}%`, left: `${Math.max(5, Math.min(90, left))}%`, transform: "translate(-50%, -100%)" }}
            >
              {/* Pin */}
              <div className="flex flex-col items-center">
                <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap mb-1">
                  {r.name}
                  <div className="flex items-center gap-1 text-[9px] text-red-100">
                    <span>★ {r.catchTableRating.toFixed(1)}</span>
                    <span>|</span>
                    <span>{r.lunchPrice}</span>
                  </div>
                </div>
                <svg className="w-7 h-7 text-red-500 drop-shadow-md group-hover:text-red-600 group-hover:scale-125 transition-all" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" />
                </svg>
              </div>
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 bg-white/90 dark:bg-dark-card/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-gray-600 dark:text-gray-400 shadow">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 010-5 2.5 2.5 0 010 5z" /></svg>
          <span>핀을 hover하면 정보가 표시됩니다</span>
        </div>
        <div className="mt-1 text-[10px] text-gray-400">총 {list.length}개 업장</div>
      </div>

      {/* Empty state */}
      {list.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-gray-400 dark:text-gray-500">
            <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            <p className="text-sm">등록된 업장이 없습니다</p>
            <p className="text-xs mt-1">업장을 등록하면 지도에 표시됩니다</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════
   Detail Modal
   ══════════════════════════════════════ */
function RestaurantModal({ restaurant, onClose }: { restaurant: Restaurant; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "media">("info");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>

        {/* Header image area */}
        <div className="relative h-48 bg-gradient-to-br from-orange-200 to-red-100 dark:from-dark-accent dark:to-dark-bg flex items-center justify-center shrink-0">
          <span className="text-6xl opacity-40">🍣</span>
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
          {/* Group dining badge */}
          {restaurant.groupDining && (
            <div className="absolute top-4 left-4 bg-green-500 text-white text-xs font-medium px-2.5 py-1 rounded-lg flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
              10+ 단체 가능
            </div>
          )}
        </div>

        <div className="overflow-y-auto flex-1">
          {/* Title & quick info */}
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

            {/* Price info */}
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

            {/* Action buttons */}
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
              {restaurant.websiteUrl && (
                <a href={restaurant.websiteUrl} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-accent rounded-lg transition-colors">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" /></svg>
                  홈페이지
                </a>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 px-6">
            <div className="flex gap-0">
              {([["info", "업장 정보"], ["reviews", "방문 후기"], ["media", "미디어"]] as const).map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                  {label}{key === "reviews" && ` (${restaurant.memberReviews.length})`}
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="px-6 py-5">
            {activeTab === "info" && (
              <div className="space-y-5">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{restaurant.description}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                    <span className="text-lg mt-0.5">📍</span>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">주소</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.address}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl">
                    <span className="text-lg mt-0.5">📞</span>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">전화번호</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.phone}</div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-dark-bg rounded-xl sm:col-span-2">
                    <span className="text-lg mt-0.5">🕐</span>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">영업시간</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{restaurant.hours}</div>
                    </div>
                  </div>
                </div>

                {/* Group dining info */}
                {restaurant.groupDining && (
                  <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      <span className="text-sm font-semibold text-green-800 dark:text-green-300">10인 이상 단체 예약 가능</span>
                    </div>
                    {restaurant.groupDiningNote && (
                      <p className="text-xs text-green-700 dark:text-green-400 ml-7">{restaurant.groupDiningNote}</p>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap gap-1.5">
                  {restaurant.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg px-3 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {restaurant.memberReviews.length === 0 && (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500">
                    <p className="text-sm">아직 방문 후기가 없습니다</p>
                  </div>
                )}
                {restaurant.memberReviews.map((review, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300">{review.name.charAt(0)}</div>
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{review.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <StarRating rating={review.rating} />
                        <span className="text-xs text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">{review.comment}</p>
                    {review.photos.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {review.photos.map((_, pi) => (
                          <div key={pi} className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-dark-card flex items-center justify-center text-xl">📷</div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
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
                  <div className="text-center py-12 text-gray-400 dark:text-gray-500">
                    <span className="text-4xl block mb-3">🎬</span>
                    <p className="text-sm">등록된 미디어가 없습니다</p>
                  </div>
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
   Restaurant Card
   ══════════════════════════════════════ */
function RestaurantCard({ restaurant, onClick }: { restaurant: Restaurant; onClick: () => void }) {
  return (
    <button onClick={onClick} className="text-left card-hover bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all w-full">
      {/* Thumbnail */}
      <div className="h-40 bg-gradient-to-br from-orange-100 to-red-50 dark:from-dark-accent dark:to-dark-bg flex items-center justify-center relative">
        <span className="text-5xl opacity-60">🍣</span>
        <div className="absolute top-3 left-3 flex gap-1.5">
          <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">{restaurant.category}</span>
        </div>
        {/* CatchTable rating badge */}
        <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
          ★ {restaurant.catchTableRating.toFixed(1)}
        </div>
        {/* Group dining badge */}
        {restaurant.groupDining && (
          <div className="absolute bottom-3 left-3 bg-green-500/90 text-white text-[10px] font-medium px-2 py-0.5 rounded-md backdrop-blur-sm">
            10+ 단체
          </div>
        )}
        {restaurant.youtubeId && (
          <div className="absolute bottom-3 right-3">
            <span className="text-xs font-medium text-white bg-red-600/90 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1">
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              영상
            </span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">{restaurant.name}</h3>
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{restaurant.area} | {restaurant.address}</p>

        {/* Price row */}
        <div className="flex items-center gap-3 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium text-blue-500 bg-blue-50 dark:bg-blue-900/20 px-1.5 py-0.5 rounded">L</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{restaurant.lunchPrice}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-medium text-purple-500 bg-purple-50 dark:bg-purple-900/20 px-1.5 py-0.5 rounded">D</span>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{restaurant.dinnerPrice}</span>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-red-400">캐치테이블</span>
            <span className="text-yellow-500 text-sm">★</span>
            <span className="text-sm font-bold text-gray-900 dark:text-white">{restaurant.catchTableRating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({restaurant.catchTableReviewCount})</span>
          </div>
          <div className="flex gap-1">
            {restaurant.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-bg px-1.5 py-0.5 rounded">#{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}

/* ══════════════════════════════════════
   Main Page
   ══════════════════════════════════════ */
export default function RestaurantsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("오마카세");
  const [activeArea, setActiveArea] = useState("전체");
  const [activeTab, setActiveTab] = useState<"list" | "group">("list");
  const [showMap, setShowMap] = useState(true);

  const filtered = useMemo(() => {
    let list = restaurants;

    // Tab filter
    if (activeTab === "group") {
      list = list.filter((r) => r.groupDining);
    }

    // Category filter
    list = list.filter((r) => r.category === activeCategory);

    // Area filter
    if (activeArea !== "전체") {
      list = list.filter((r) => r.area === activeArea);
    }

    return list;
  }, [activeCategory, activeArea, activeTab]);

  const selected = restaurants.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">식당 추천</h1>
        <p className="text-gray-600 dark:text-gray-400">
          비밀미식회가 엄선한 맛집을 만나보세요. 카드를 클릭하면 상세 정보를 확인할 수 있습니다.
        </p>
      </div>

      {/* Tab: 전체 / 회식 */}
      <div className="flex items-center gap-4 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setActiveTab("list")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "list" ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
          전체 보기
        </button>
        <button onClick={() => setActiveTab("group")}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5 ${activeTab === "group" ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
          회식 (10+)
        </button>
      </div>

      {/* Category Filter - 오마카세 default */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button key={cat.key} onClick={() => setActiveCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${cat.key === activeCategory ? "bg-primary-500 text-white" : "bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-accent"}`}>
            {cat.label}
          </button>
        ))}
      </div>

      {/* Area Filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {areas.map((area) => (
          <button key={area} onClick={() => setActiveArea(area)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${area === activeArea ? "bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900" : "bg-gray-50 dark:bg-dark-bg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-card"}`}>
            {area}
          </button>
        ))}
      </div>

      {/* Map toggle + Map */}
      <div className="mb-6">
        <button onClick={() => setShowMap(!showMap)} className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-500 transition-colors mb-3">
          <svg className={`w-4 h-4 transition-transform ${showMap ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
          {showMap ? "지도 숨기기" : "지도 보기"}
        </button>
        {showMap && <MapSection restaurants={filtered} onSelect={setSelectedId} />}
      </div>

      {/* Group dining description */}
      {activeTab === "group" && (
        <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-2xl p-5 mb-6">
          <div className="flex items-center gap-2 mb-1">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            <h3 className="text-sm font-semibold text-green-800 dark:text-green-300">10인 이상 단체/회식 예약 가능 업장</h3>
          </div>
          <p className="text-xs text-green-700 dark:text-green-400 ml-7">단체석 또는 프라이빗 룸이 있는 업장만 필터링됩니다.</p>
        </div>
      )}

      {/* Restaurant Grid */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-gray-500">
          <span className="text-5xl block mb-4">{activeTab === "group" ? "👥" : "🍣"}</span>
          <p className="text-sm">
            {activeTab === "group"
              ? "아직 등록된 회식 가능 업장이 없습니다"
              : "아직 등록된 식당이 없습니다"}
          </p>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((restaurant) => (
          <RestaurantCard key={restaurant.id} restaurant={restaurant} onClick={() => setSelectedId(restaurant.id)} />
        ))}
      </div>

      {/* Modal */}
      {selected && <RestaurantModal restaurant={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
