"use client";

import { useState } from "react";

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
  location: string;
  address: string;
  phone: string;
  hours: string;
  price: string;
  image: string;
  photos: string[];
  description: string;
  catchTableUrl: string;
  websiteUrl: string;
  mapUrl: string;
  youtubeId: string;
  tags: string[];
  memberReviews: MemberReview[];
}

const restaurants: Restaurant[] = [
  {
    id: 1,
    name: "스시 오마카세 히든",
    category: "일식",
    location: "서울 강남구",
    address: "서울 강남구 압구정로 123 지하1층",
    phone: "02-1234-5678",
    hours: "런치 12:00-14:00 / 디너 18:00-22:00 (일요일 휴무)",
    price: "₩₩₩₩",
    image: "/placeholder-sushi.jpg",
    photos: ["/photo1.jpg", "/photo2.jpg", "/photo3.jpg", "/photo4.jpg"],
    description: "숙련된 셰프의 정통 오마카세를 경험할 수 있는 프라이빗 공간. 매일 츠키지에서 공수한 신선한 재료만을 사용하며, 10석 한정 운영으로 특별한 경험을 제공합니다.",
    catchTableUrl: "https://app.catchtable.co.kr",
    websiteUrl: "https://example.com",
    mapUrl: "https://map.naver.com",
    youtubeId: "dQw4w9WgXcQ",
    tags: ["오마카세", "프라이빗", "데이트"],
    memberReviews: [
      { name: "미식탐험가", rating: 5, comment: "인생 오마카세! 오토로가 입에서 녹아요.", date: "2026-03-18", photos: ["/review1.jpg", "/review2.jpg"] },
      { name: "초밥러버", rating: 5, comment: "셰프님의 설명이 너무 좋았습니다.", date: "2026-03-10", photos: ["/review3.jpg"] },
      { name: "강남맛집헌터", rating: 4, comment: "분위기와 맛 모두 훌륭합니다.", date: "2026-03-05", photos: [] },
    ],
  },
  {
    id: 2,
    name: "트라토리아 벨라",
    category: "이탈리안",
    location: "서울 성수동",
    address: "서울 성동구 서울숲2길 45",
    phone: "02-2345-6789",
    hours: "11:30-22:00 (월요일 휴무)",
    price: "₩₩₩",
    image: "/placeholder-pasta.jpg",
    photos: ["/photo5.jpg", "/photo6.jpg"],
    description: "직접 만든 생면 파스타와 나폴리 스타일 피자의 정석. 이탈리아에서 직접 공수한 재료로 정통의 맛을 재현합니다.",
    catchTableUrl: "https://app.catchtable.co.kr",
    websiteUrl: "https://example.com",
    mapUrl: "https://map.naver.com",
    youtubeId: "",
    tags: ["파스타", "피자", "와인"],
    memberReviews: [
      { name: "파스타러버", rating: 4, comment: "까르보나라가 크리미하면서도 느끼하지 않아요.", date: "2026-03-15", photos: ["/review4.jpg"] },
      { name: "성수동주민", rating: 5, comment: "동네 최고의 이탈리안 레스토랑!", date: "2026-03-08", photos: [] },
    ],
  },
  {
    id: 3,
    name: "한우 명가",
    category: "한식",
    location: "서울 마포구",
    address: "서울 마포구 월드컵로 89",
    phone: "02-3456-7890",
    hours: "17:00-23:00 (연중무휴)",
    price: "₩₩₩₩",
    image: "/placeholder-hanwoo.jpg",
    photos: ["/photo7.jpg", "/photo8.jpg", "/photo9.jpg"],
    description: "1++ 한우 투플러스 등급만 취급하는 프리미엄 한우 전문점. 자체 숙성고에서 28일간 드라이에이징한 한우를 제공합니다.",
    catchTableUrl: "https://app.catchtable.co.kr",
    websiteUrl: "",
    mapUrl: "https://map.naver.com",
    youtubeId: "dQw4w9WgXcQ",
    tags: ["한우", "구이", "특별한날"],
    memberReviews: [
      { name: "고기매니아", rating: 5, comment: "채끝과 꽃등심 모두 최상급이었습니다.", date: "2026-03-12", photos: ["/review5.jpg", "/review6.jpg"] },
      { name: "마포구민", rating: 5, comment: "된장찌개와 반찬도 정성이 느껴집니다.", date: "2026-03-01", photos: [] },
      { name: "미식탐험가", rating: 4, comment: "가격 대비 만족도 높은 한우집.", date: "2026-02-25", photos: ["/review7.jpg"] },
    ],
  },
  {
    id: 4,
    name: "르 프티 비스트로",
    category: "프렌치",
    location: "서울 이태원",
    address: "서울 용산구 이태원로 234",
    phone: "02-4567-8901",
    hours: "12:00-15:00 / 18:00-22:00 (화요일 휴무)",
    price: "₩₩₩",
    image: "/placeholder-french.jpg",
    photos: ["/photo10.jpg", "/photo11.jpg"],
    description: "파리 골목 비스트로를 그대로 옮겨놓은 아늑한 프렌치 레스토랑. 프랑스 출신 셰프가 직접 운영합니다.",
    catchTableUrl: "https://app.catchtable.co.kr",
    websiteUrl: "https://example.com",
    mapUrl: "https://map.naver.com",
    youtubeId: "",
    tags: ["코스요리", "와인페어링", "분위기"],
    memberReviews: [
      { name: "와인소믈리에", rating: 4, comment: "에스카르고부터 크렘브릴레까지 완벽한 코스.", date: "2026-03-08", photos: [] },
    ],
  },
  {
    id: 5,
    name: "딤섬 하우스",
    category: "중식",
    location: "서울 여의도",
    address: "서울 영등포구 여의대로 56",
    phone: "02-5678-9012",
    hours: "11:00-21:30 (연중무휴)",
    price: "₩₩",
    image: "/placeholder-dimsum.jpg",
    photos: ["/photo12.jpg"],
    description: "홍콩 출신 셰프가 만드는 정통 광동식 딤섬 전문점. 매일 아침 수작업으로 빚는 딤섬을 맛볼 수 있습니다.",
    catchTableUrl: "https://app.catchtable.co.kr",
    websiteUrl: "",
    mapUrl: "https://map.naver.com",
    youtubeId: "dQw4w9WgXcQ",
    tags: ["딤섬", "런치", "가성비"],
    memberReviews: [
      { name: "딤섬매니아", rating: 5, comment: "하가우가 정말 예술이에요!", date: "2026-03-14", photos: ["/review8.jpg"] },
      { name: "여의도직장인", rating: 4, comment: "점심 특선 가성비 최고.", date: "2026-03-07", photos: [] },
    ],
  },
  {
    id: 6,
    name: "타코 엘 리오",
    category: "멕시칸",
    location: "서울 한남동",
    address: "서울 용산구 한남대로 78",
    phone: "02-6789-0123",
    hours: "12:00-22:00 (월요일 휴무)",
    price: "₩₩",
    image: "/placeholder-taco.jpg",
    photos: ["/photo13.jpg", "/photo14.jpg"],
    description: "멕시코시티 스트릿 타코의 정수를 맛볼 수 있는 곳. 또르띠야부터 살사까지 모두 매장에서 직접 만듭니다.",
    catchTableUrl: "https://app.catchtable.co.kr",
    websiteUrl: "https://example.com",
    mapUrl: "https://map.naver.com",
    youtubeId: "",
    tags: ["타코", "캐주얼", "친구모임"],
    memberReviews: [
      { name: "한남동맛집러", rating: 4, comment: "알파스토르 타코가 미쳤어요!", date: "2026-03-11", photos: ["/review9.jpg"] },
    ],
  },
];

const categories = ["전체", "한식", "일식", "이탈리안", "프렌치", "중식", "멕시칸"];

function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "lg" }) {
  return (
    <div className={`flex items-center gap-0.5 ${size === "lg" ? "text-xl" : "text-sm"}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} className={star <= rating ? "text-yellow-500" : "text-gray-300 dark:text-gray-600"}>
          ★
        </span>
      ))}
    </div>
  );
}

function avgRating(reviews: MemberReview[]) {
  if (reviews.length === 0) return 0;
  return (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
}

/* ── Detail Modal ── */
function RestaurantModal({ restaurant, onClose }: { restaurant: Restaurant; onClose: () => void }) {
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "media">("info");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className="relative w-full max-w-3xl max-h-[90vh] bg-white dark:bg-dark-card rounded-2xl overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header image area */}
        <div className="relative h-56 bg-gradient-to-br from-orange-200 to-red-100 dark:from-dark-accent dark:to-dark-bg flex items-center justify-center shrink-0">
          {/* Photo grid preview */}
          <div className="grid grid-cols-4 gap-1 w-full h-full">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className={`bg-gradient-to-br from-orange-${100 + i * 50} to-red-${50 + i * 50} dark:from-dark-accent dark:to-dark-bg flex items-center justify-center ${i === 0 ? "col-span-2 row-span-2" : ""}`}>
                <span className="text-4xl opacity-60">📷</span>
              </div>
            ))}
          </div>
          {/* Close button */}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 bg-black/40 hover:bg-black/60 text-white rounded-full flex items-center justify-center transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto flex-1">
          {/* Title & quick info */}
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">{restaurant.category}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{restaurant.price}</span>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{restaurant.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{restaurant.location}</p>
              </div>
              <div className="text-center shrink-0">
                <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{avgRating(restaurant.memberReviews)}</div>
                <StarRating rating={Math.round(Number(avgRating(restaurant.memberReviews)))} />
                <div className="text-xs text-gray-500 mt-1">{restaurant.memberReviews.length}명 평가</div>
              </div>
            </div>

            {/* Action buttons row */}
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
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === key
                      ? "border-primary-500 text-primary-600 dark:text-primary-400"
                      : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                  }`}
                >
                  {label}
                  {key === "reviews" && ` (${restaurant.memberReviews.length})`}
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

                <div className="flex flex-wrap gap-1.5">
                  {restaurant.tags.map((tag) => (
                    <span key={tag} className="text-xs text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg px-3 py-1 rounded-full">#{tag}</span>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className="space-y-4">
                {restaurant.memberReviews.map((review, i) => (
                  <div key={i} className="p-4 bg-gray-50 dark:bg-dark-bg rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-xs font-bold text-primary-700 dark:text-primary-300">
                          {review.name.charAt(0)}
                        </div>
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
                          <div key={pi} className="w-16 h-16 rounded-lg bg-gray-200 dark:bg-dark-card flex items-center justify-center text-xl">
                            📷
                          </div>
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
                      <iframe
                        className="w-full h-full"
                        src={`https://www.youtube.com/embed/${restaurant.youtubeId}`}
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
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

/* ── Main Page ── */
export default function RestaurantsPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("전체");

  const filtered = activeCategory === "전체"
    ? restaurants
    : restaurants.filter((r) => r.category === activeCategory);

  const selected = restaurants.find((r) => r.id === selectedId) ?? null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">식당 추천</h1>
        <p className="text-gray-600 dark:text-gray-400">
          비밀미식회 회원들이 엄선한 맛집을 만나보세요. 카드를 클릭하면 상세 정보를 확인할 수 있습니다.
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              cat === activeCategory
                ? "bg-primary-500 text-white"
                : "bg-gray-100 dark:bg-dark-card text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-accent"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notion-style Box Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((restaurant) => (
          <button
            key={restaurant.id}
            onClick={() => setSelectedId(restaurant.id)}
            className="text-left card-hover bg-white dark:bg-dark-card rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
          >
            {/* Thumbnail area */}
            <div className="h-44 bg-gradient-to-br from-orange-100 to-red-50 dark:from-dark-accent dark:to-dark-bg flex items-center justify-center relative">
              <span className="text-5xl opacity-80">📷</span>
              {/* Overlay badges */}
              <div className="absolute top-3 left-3 flex gap-1.5">
                <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">{restaurant.category}</span>
              </div>
              <div className="absolute top-3 right-3">
                <span className="text-xs font-medium text-white bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md">{restaurant.price}</span>
              </div>
              {restaurant.youtubeId && (
                <div className="absolute bottom-3 right-3">
                  <span className="text-xs font-medium text-white bg-red-600/90 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1">
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z"/><path fill="#fff" d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                    영상
                  </span>
                </div>
              )}
            </div>

            {/* Card body */}
            <div className="p-4">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-1 truncate">{restaurant.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{restaurant.address}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">{restaurant.description}</p>

              {/* Bottom row */}
              <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center gap-1.5">
                  <span className="text-yellow-500 text-sm">★</span>
                  <span className="text-sm font-bold text-gray-900 dark:text-white">{avgRating(restaurant.memberReviews)}</span>
                  <span className="text-xs text-gray-400">({restaurant.memberReviews.length})</span>
                </div>
                <div className="flex gap-1">
                  {restaurant.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-dark-bg px-1.5 py-0.5 rounded">#{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Modal */}
      {selected && <RestaurantModal restaurant={selected} onClose={() => setSelectedId(null)} />}
    </div>
  );
}
