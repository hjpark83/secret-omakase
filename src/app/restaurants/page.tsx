"use client";

import { useState, useMemo, useCallback } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";

/* ══════════════════════════════════════
   Leaflet Map (dynamic import - SSR off)
   ══════════════════════════════════════ */
const LeafletMap = dynamic(() => import("@/components/LeafletMap"), { ssr: false, loading: () => (
  <div className="w-full h-full bg-gray-100 dark:bg-dark-bg flex items-center justify-center text-gray-400 text-sm">지도 로딩 중...</div>
)});

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

export interface Restaurant {
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
  groupDining: boolean;
  groupDiningNote: string;
  lat: number;
  lng: number;
  recommendCount: number;
  memberReviews: MemberReview[];
}

/* ══════════════════════════════════════
   Helpers
   ══════════════════════════════════════ */
function ctUrl(name: string) {
  return `https://app.catchtable.co.kr/ct/search?keyword=${encodeURIComponent(name)}`;
}
function naverMapUrl(name: string) {
  return `https://map.naver.com/v5/search/${encodeURIComponent(name)}`;
}

/* Helper: generate restaurant entry concisely */
function r(id: number, name: string, cat: string, area: string, addr: string, lat: number, lng: number, ctRating: number, ctReviews: number, lunch: string, dinner: string, tags: string[], group: boolean, groupNote: string, rec: number, desc: string): Restaurant {
  return { id, name, category: cat, area, address: addr, phone: "", hours: "", description: desc, catchTableUrl: ctUrl(name), catchTableRating: ctRating, catchTableReviewCount: ctReviews, lunchPrice: lunch, dinnerPrice: dinner, websiteUrl: "", mapUrl: naverMapUrl(name + " " + area.split("/")[0]), youtubeId: "", tags, groupDining: group, groupDiningNote: groupNote, lat, lng, recommendCount: rec, memberReviews: [] };
}

/* ══════════════════════════════════════
   Data
   ══════════════════════════════════════ */
const restaurants: Restaurant[] = [
  // -- 오마카세: 강남/서초 --
  r(1,"스시 초희","오마카세","강남/서초","서울 강남구 도산대로 318",37.5238,127.0392,4.9,487,"100,000원","250,000원",["에도마에","하이엔드","예약필수"],false,"",24,"도산공원 인근 정통 에도마에 오마카세. 셰프의 20년 내공이 담긴 숙성 기술이 돋보이는 프리미엄 코스."),
  r(2,"스시 스미레","오마카세","강남/서초","서울 강남구 압구정로46길 15",37.5268,127.0355,4.7,312,"80,000원","200,000원",["청담","숙성","데이트"],false,"",18,"청담 골목의 아늑한 12석 카운터. 매일 공수하는 최상급 네타와 자체 숙성 기법의 조화."),
  r(3,"스시 센","오마카세","강남/서초","서울 강남구 선릉로 152길 8",37.5195,127.0385,4.6,278,"65,000원","160,000원",["선릉","런치추천","직장인"],false,"",12,"선릉역 인근 가성비 오마카세. 런치 코스가 특히 인기이며 신선한 제철 네타를 사용."),
  r(4,"스시 하루","오마카세","강남/서초","서울 강남구 역삼로 240",37.5012,127.0378,4.5,345,"55,000원","140,000원",["역삼","가성비","입문"],false,"",8,"역삼역 도보 3분. 오마카세 입문자에게 추천하는 합리적 가격의 정통 스시 코스."),
  r(5,"스시 아라이","오마카세","강남/서초","서울 강남구 학동로 234",37.5178,127.0312,4.8,198,"90,000원","220,000원",["신사","프라이빗","8석"],false,"",16,"가로수길 뒷골목 8석 프라이빗 오마카세. 셰프와 1:1 소통하며 즐기는 특별한 경험."),
  r(6,"스시 카이","오마카세","강남/서초","서울 강남구 도산대로53길 25",37.5243,127.0365,4.7,256,"85,000원","200,000원",["청담","코스","분위기"],false,"",14,"청담동 고급 오마카세. 일본 전통 스시 기법에 모던한 감성을 더한 시그니처 코스."),
  r(7,"오마카세 유","오마카세","강남/서초","서울 강남구 봉은사로 110",37.5142,127.0255,4.4,412,"45,000원","110,000원",["삼성","가성비","혼밥"],false,"",5,"삼성역 인근 1인 오마카세도 가능한 캐주얼 스시바. 합리적 가격에 퀄리티 있는 네타."),
  r(8,"스시 모리","오마카세","강남/서초","서울 강남구 논현로 168길 14",37.5155,127.0325,4.6,189,"70,000원","170,000원",["논현","숙성","조용한"],false,"",10,"논현동 골목 안 숨은 오마카세. 3일~7일 숙성 네타의 깊은 감칠맛이 특징."),
  r(9,"기꾸스시","오마카세","강남/서초","서울 강남구 강남대로 102길 15",37.5095,127.0285,4.5,523,"40,000원","100,000원",["강남역","가성비","인기"],false,"",7,"강남역 인근 줄서는 오마카세. 가성비 최고로 오마카세 입문자들에게 인기."),
  r(10,"스시 시미즈","오마카세","강남/서초","서울 강남구 압구정로 234",37.5262,127.0335,4.8,167,"110,000원","280,000원",["압구정","프리미엄","6석"],false,"",21,"압구정 6석 한정 하이엔드 오마카세. 일본에서 15년 수련한 셰프의 철학이 담긴 코스."),
  r(11,"스시 효","오마카세","강남/서초","서울 서초구 사평대로 68",37.5048,127.0025,4.5,234,"60,000원","150,000원",["서초","제철","코스"],false,"",9,"서초 법원 근처 제철 오마카세. 매 시즌 바뀌는 코스 구성이 매력적."),
  r(12,"오마카세 겐","오마카세","강남/서초","서울 강남구 논현로153길 42",37.5160,127.0330,4.6,156,"75,000원","190,000원",["카이세키","코스","프리미엄"],true,"프라이빗 룸 최대 12인, 최소 2주 전 예약",11,"카이세키와 스시를 결합한 독특한 코스. 일본 가이세키 요리의 정수와 스시 오마카세를 한 자리에서."),

  // -- 오마카세: 이태원/한남 --
  r(13,"스시 이토","오마카세","이태원/한남","서울 용산구 이태원로55나길 30",37.5340,126.9970,4.9,89,"–","220,000원",["한남","6석","하이엔드"],false,"",22,"한남동 6석 카운터. 셰프와 가까이 대화하며 먹는 친밀한 분위기의 최상급 오마카세."),
  r(14,"히사시","오마카세","이태원/한남","서울 용산구 한남대로42길 18",37.5335,127.0005,4.7,214,"70,000원","180,000원",["한남","숙성","분위기"],false,"",15,"한남동 숙성 전문 오마카세. 시즈오카 출신 셰프의 섬세한 숙성 기술이 돋보이는 곳."),
  r(15,"스시 엔","오마카세","이태원/한남","서울 용산구 이태원로 178",37.5355,126.9935,4.5,178,"55,000원","130,000원",["이태원","캐주얼","와인"],false,"",6,"이태원 메인로드의 캐주얼 오마카세. 스시와 사케/와인 페어링이 가능한 모던 스시바."),
  r(16,"아키라","오마카세","이태원/한남","서울 용산구 녹사평대로 188",37.5365,126.9885,4.6,267,"60,000원","150,000원",["이태원","모던","코스"],false,"",10,"경리단길 인근 모던 오마카세. 전통과 현대를 넘나드는 창의적인 코스 구성."),

  // -- 오마카세: 성수/건대 --
  r(17,"스시 준","오마카세","성수/건대","서울 성동구 서울숲2길 32",37.5445,127.0440,4.5,456,"45,000원","120,000원",["서울숲","가성비","런치"],false,"",6,"서울숲 인근 가성비 오마카세. 런치 코스가 특히 인기이며 퀄리티 대비 합리적 가격."),
  r(18,"오마카세 무","오마카세","성수/건대","서울 성동구 뚝섬로 400",37.5470,127.0560,4.4,312,"40,000원","100,000원",["건대","가성비","혼밥"],false,"",4,"건대입구역 도보 5분. 1인 오마카세도 부담 없는 캐주얼한 스시 카운터."),
  r(19,"스시 타쿠미","오마카세","성수/건대","서울 성동구 성수이로 118",37.5420,127.0510,4.6,198,"65,000원","160,000원",["성수","장인","숙성"],false,"",11,"성수동 골목 장인 오마카세. 30년 경력 셰프의 정교한 손기술과 숙성 네타의 조화."),

  // -- 오마카세: 여의도/마포 --
  r(20,"스시 나미","오마카세","여의도/마포","서울 영등포구 여의대로 108",37.5250,126.9240,4.5,345,"50,000원","130,000원",["여의도","직장인","런치"],false,"",7,"여의도 IFC 인근 직장인 오마카세. 런치 특선 코스가 인기이며 접근성 우수."),
  r(21,"스시 히로","오마카세","여의도/마포","서울 마포구 와우산로29길 18",37.5536,126.9230,4.3,287,"35,000원","90,000원",["홍대","가성비","입문"],false,"",4,"홍대 인근 합리적 오마카세. 오마카세 입문자에게 추천하는 가성비 코스."),
  r(22,"스시 마루","오마카세","여의도/마포","서울 마포구 독막로 112",37.5395,126.9445,4.4,223,"55,000원","140,000원",["마포","숙성","코스"],false,"",8,"마포역 인근 숙성 전문 오마카세. 3~5일 숙성한 네타의 감칠맛이 일품."),
  r(23,"한우 오마카세 소울","오마카세","여의도/마포","서울 영등포구 여의대로 76",37.5235,126.9255,4.5,234,"60,000원","150,000원",["한우","특수부위","구이"],true,"단체룸 최대 15인, 회식 코스 별도 운영",8,"1++ 한우 특수부위 오마카세. 숯불구이부터 타르타르까지 한우의 모든 것."),

  // -- 오마카세: 종로/을지로 --
  r(24,"스시 나루","오마카세","종로/을지로","서울 종로구 삼일대로32길 21",37.5660,126.9920,4.4,198,"50,000원","130,000원",["을지로","숙성","분위기"],false,"",7,"을지로 골목 12석 카운터. 계절감을 살린 코스 구성과 자체 숙성 기술이 인상적."),
  r(25,"오마카세 후지","오마카세","종로/을지로","서울 종로구 종로3길 17",37.5710,126.9860,4.3,345,"40,000원","100,000원",["종로","가성비","노포감성"],false,"",5,"종로3가 가성비 오마카세. 노포 감성의 인테리어와 정직한 스시 코스."),
  r(26,"스시 쿄","오마카세","종로/을지로","서울 종로구 북촌로 23",37.5795,126.9850,4.6,156,"70,000원","170,000원",["북촌","한옥","프리미엄"],false,"",13,"북촌 한옥마을 인근 한옥 오마카세. 전통 한옥 공간에서 즐기는 프리미엄 스시 코스."),
  r(27,"스시 겐지","오마카세","종로/을지로","서울 중구 을지로 124",37.5660,126.9890,4.5,278,"55,000원","140,000원",["을지로","레트로","분위기"],false,"",9,"을지로3가 레트로 감성 오마카세. 80년대 건물 리노베이션 공간에서 즐기는 모던 스시."),

  // -- 오마카세: 잠실/송파 --
  r(28,"스시 진","오마카세","기타","서울 송파구 올림픽로 300",37.5145,127.1050,4.4,389,"45,000원","120,000원",["잠실","롯데타워","접근성"],false,"",6,"잠실 롯데월드몰 인근 오마카세. 접근성 좋고 퀄리티 안정적인 스시 코스."),
  r(29,"오마카세 소노","오마카세","기타","서울 송파구 백제고분로 340",37.5085,127.0980,4.5,167,"60,000원","150,000원",["송파","조용한","숙성"],false,"",10,"송파 주택가 골목의 숨은 오마카세. 조용한 분위기에서 즐기는 숙성 스시 코스."),

  // -- 오마카세: 기타 --
  r(30,"스시 쿠로","오마카세","기타","서울 서대문구 연세로 50",37.5595,126.9370,4.3,234,"35,000원","90,000원",["신촌","가성비","학생"],false,"",3,"신촌 가성비 오마카세. 대학가답게 합리적인 가격에 괜찮은 퀄리티."),
  r(31,"스시 코코로","오마카세","기타","서울 광진구 아차산로 262",37.5385,127.0720,4.4,312,"50,000원","130,000원",["건대","코스","분위기"],false,"",7,"건대 먹자골목 인근 분위기 좋은 오마카세. 데이트 코스로 인기."),
  r(32,"이치오마카세","오마카세","기타","서울 동작구 동작대로 100",37.4965,126.9825,4.3,189,"40,000원","110,000원",["이수","가성비","동네"],false,"",4,"이수역 인근 동네 오마카세. 가격 대비 만족도 높은 알짜 스시 코스."),

  // -- 파인다이닝 --
  r(33,"밍글스","파인다이닝","강남/서초","서울 강남구 도산대로67길 19",37.5255,127.0380,4.9,412,"95,000원","280,000원",["이노베이티브","아시아50","미쉐린"],false,"",22,"아시아 50 베스트 레스토랑. 한식 기반 글로벌 테크닉의 이노베이티브 다이닝."),
  r(34,"정식당","파인다이닝","강남/서초","서울 강남구 선릉로158길 5",37.5215,127.0400,4.8,387,"100,000원","250,000원",["미쉐린2스타","한식","코스"],true,"프라이빗 룸 10인, 최소 1주 전 예약",16,"미쉐린 2스타 한식 파인다이닝. 한국 전통 조리법의 깊이와 현대적 플레이팅의 조화."),
  r(35,"모수","파인다이닝","강남/서초","서울 강남구 선릉로158길 11",37.5210,127.0410,4.8,523,"90,000원","230,000원",["한식","모던코리안","미쉐린"],true,"단체 프라이빗 다이닝 10-20인 가능",18,"한식 파인다이닝의 선두주자. 한국 전통 식재료와 조리법을 현대적으로 재해석."),
  r(36,"레스토랑 라미띠에","파인다이닝","이태원/한남","서울 용산구 한남대로20길 42",37.5350,127.0010,4.7,312,"85,000원","250,000원",["프렌치","미쉐린","와인페어링"],true,"개인룸 10-16인 수용 가능",9,"프렌치 파인다이닝의 정수. 프랑스 미쉐린 출신 셰프가 한국 식재료로 풀어낸 모던 프렌치."),
  r(37,"알토 바이 조태권","파인다이닝","강남/서초","서울 강남구 도산대로 317",37.5242,127.0388,4.7,289,"80,000원","200,000원",["이탈리안","코스","와인"],true,"프라이빗 룸 12인",12,"조태권 셰프의 모던 이탈리안. 이탈리아 정통 기법에 한국적 감성을 더한 코스."),
  r(38,"에빗","파인다이닝","이태원/한남","서울 용산구 한남대로 98",37.5342,127.0035,4.6,198,"75,000원","180,000원",["모던","코스","분위기"],false,"",8,"한남동 모던 유러피안 파인다이닝. 제철 식재료 중심의 시즌별 코스 운영."),

  // -- 양식 --
  r(39,"볼피노","양식","이태원/한남","서울 용산구 이태원로54길 22",37.5345,126.9940,4.4,678,"25,000원~","60,000원~",["이탈리안","파스타","와인"],true,"2층 단체석 최대 20인",5,"나폴리 스타일 정통 이탈리안. 생면 파스타와 화덕 피자가 시그니처."),
  r(40,"리스토란테 에오","양식","강남/서초","서울 강남구 도산대로45길 6",37.5235,127.0340,4.5,289,"55,000원","150,000원",["이탈리안","파스타","와인페어링"],true,"프라이빗 룸 10인",7,"토스카나 감성의 파인 이탈리안. 직접 만든 파스타와 직수입 식재료."),
  r(41,"더 그린테이블","양식","여의도/마포","서울 마포구 양화로 45",37.5505,126.9215,4.3,456,"20,000원~","45,000원~",["브런치","파스타","캐주얼"],true,"단체석 15인",3,"합정 브런치 & 파스타 전문. 캐주얼한 분위기에서 즐기는 양식 코스."),

  // -- 일식 (오마카세 외) --
  r(42,"텐동 하카타","일식","종로/을지로","서울 종로구 우정국로2길 28",37.5700,126.9830,4.2,567,"15,000원~","35,000원~",["텐동","텐푸라","가성비"],true,"2층 단체석 12인",3,"하카타 스타일 텐동과 텐푸라 오마카세를 합리적 가격에 즐기는 곳."),
  r(43,"이자카야 무겐","일식","이태원/한남","서울 용산구 이태원로 166",37.5358,126.9928,4.4,389,"–","40,000원~",["이자카야","사케","안주"],true,"프라이빗 룸 14인",4,"이태원 정통 이자카야. 100종 이상의 사케와 제철 안주를 즐길 수 있는 곳."),
  r(44,"라멘 카게무샤","일식","성수/건대","서울 성동구 서울숲4길 18",37.5455,127.0420,4.3,712,"12,000원~","15,000원~",["라멘","돈코츠","혼밥"],false,"",2,"서울숲 인근 돈코츠 라멘 전문. 18시간 우린 돈코츠 육수가 시그니처."),

  // -- 한식 --
  r(45,"한식 오마카세 온","한식","종로/을지로","서울 종로구 북촌로5길 62",37.5810,126.9835,4.6,234,"70,000원","160,000원",["한옥","한정식","프리미엄"],true,"한옥 별채 10인",11,"북촌 한옥에서 즐기는 한식 오마카세. 전통 한정식을 현대적으로 재해석."),
  r(46,"광화문 국밥","한식","종로/을지로","서울 종로구 새문안로 76",37.5720,126.9770,4.1,892,"10,000원~","15,000원~",["국밥","혼밥","가성비"],false,"",1,"광화문 직장인들의 소울푸드. 40년 전통의 소머리 국밥."),

  // -- 중식 --
  r(47,"도원","중식","강남/서초","서울 강남구 테헤란로 521",37.5090,127.0630,4.5,345,"30,000원~","80,000원~",["광동식","딤섬","코스"],true,"프라이빗 룸 20인",6,"프리미엄 광동식 중식당. 홍콩 출신 셰프의 정통 딤섬과 코스 요리."),
  r(48,"차이나팩토리","중식","성수/건대","서울 성동구 왕십리로 115",37.5480,127.0535,4.2,567,"15,000원~","35,000원~",["마라","사천","캐주얼"],true,"단체석 20인",2,"성수 마라 전문 중식당. 직접 블렌딩한 마라 소스가 인기."),
];

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
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "media">("info");

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
              {([["info", "업장 정보"], ["reviews", "방문 후기"], ["media", "미디어"]] as const).map(([key, label]) => (
                <button key={key} onClick={() => setActiveTab(key)}
                  className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === key ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
                  {label}{key === "reviews" && ` (${restaurant.memberReviews.length})`}
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
            {activeTab === "reviews" && (
              <div className="space-y-4">
                {restaurant.memberReviews.length === 0 && (
                  <div className="text-center py-8 text-gray-400 dark:text-gray-500"><p className="text-sm">아직 방문 후기가 없습니다</p></div>
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
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detailId, setDetailId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState("오마카세");
  const [groupOnly, setGroupOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"rating" | "recommend" | "price">("rating");
  const [mapBounds, setMapBounds] = useState<{ north: number; south: number; east: number; west: number } | null>(null);
  const [filterInMap, setFilterInMap] = useState(true);

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
          <LeafletMap
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
