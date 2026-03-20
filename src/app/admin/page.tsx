"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";
import { getRestaurants, saveRestaurants, addRestaurant, deleteRestaurant, geocodeAddress, type Restaurant } from "@/lib/restaurants";

/* ── Types ── */
interface Member {
  id: number;
  name: string;
  email: string;
  role: "admin" | "member" | "pending";
  joinedAt: string;
  lastActive: string;
  reviewCount: number;
  voteCount: number;
  avatar: string;
}

const roleLabels: Record<Member["role"], string> = { admin: "관리자", member: "회원", pending: "승인대기" };
const roleColors: Record<Member["role"], string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  member: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>{icon}</div>
      </div>
    </div>
  );
}

/* ── Restaurant Add/Edit Modal ── */
const CATEGORIES = ["오마카세","파인다이닝","양식","한식","중식","일식","기타"];
const AREAS = ["강남/서초","이태원/한남","성수/건대","여의도/마포","종로/을지로","기타"];

function RestaurantFormModal({ restaurant, onClose, onSave }: { restaurant?: Restaurant; onClose: () => void; onSave: (data: Omit<Restaurant, "id"> | Restaurant) => void }) {
  const isEdit = !!restaurant;
  const [name, setName] = useState(restaurant?.name ?? "");
  const [category, setCategory] = useState(restaurant?.category ?? "오마카세");
  const [area, setArea] = useState(restaurant?.area ?? "강남/서초");
  const [address, setAddress] = useState(restaurant?.address ?? "");
  const [phone, setPhone] = useState(restaurant?.phone ?? "");
  const [hours, setHours] = useState(restaurant?.hours ?? "");
  const [description, setDescription] = useState(restaurant?.description ?? "");
  const [ctRating, setCtRating] = useState(restaurant?.catchTableRating?.toString() ?? "0");
  const [ctReviews, setCtReviews] = useState(restaurant?.catchTableReviewCount?.toString() ?? "0");
  const [lunchPrice, setLunchPrice] = useState(restaurant?.lunchPrice ?? "");
  const [dinnerPrice, setDinnerPrice] = useState(restaurant?.dinnerPrice ?? "");
  const [tags, setTags] = useState(restaurant?.tags?.join(", ") ?? "");
  const [groupDining, setGroupDining] = useState(restaurant?.groupDining ?? false);
  const [groupNote, setGroupNote] = useState(restaurant?.groupDiningNote ?? "");
  const [lat, setLat] = useState(restaurant?.lat?.toString() ?? "");
  const [lng, setLng] = useState(restaurant?.lng?.toString() ?? "");
  const [geocoding, setGeocoding] = useState(false);

  const handleGeocode = async () => {
    if (!address) return;
    setGeocoding(true);
    const result = await geocodeAddress(address);
    if (result) {
      setLat(result.lat.toString());
      setLng(result.lng.toString());
    } else {
      alert("주소를 좌표로 변환하지 못했습니다. 직접 입력해주세요.");
    }
    setGeocoding(false);
  };

  const handleSubmit = () => {
    if (!name || !address) return;
    const ctUrlStr = `https://app.catchtable.co.kr/ct/search?keyword=${encodeURIComponent(name)}`;
    const mapUrlStr = `https://map.naver.com/v5/search/${encodeURIComponent(name + " " + area.split("/")[0])}`;
    const data = {
      ...(isEdit ? { id: restaurant!.id } : {}),
      name, category, area, address, phone, hours, description,
      catchTableUrl: ctUrlStr,
      catchTableRating: parseFloat(ctRating) || 0,
      catchTableReviewCount: parseInt(ctReviews) || 0,
      lunchPrice, dinnerPrice,
      websiteUrl: "", mapUrl: mapUrlStr, youtubeId: "",
      tags: tags.split(",").map((t) => t.trim()).filter(Boolean),
      groupDining, groupDiningNote: groupNote,
      lat: parseFloat(lat) || 0, lng: parseFloat(lng) || 0,
      recommendCount: restaurant?.recommendCount ?? 0,
    };
    onSave(data as Restaurant);
    onClose();
  };

  const inputCls = "w-full px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-dark-card rounded-2xl shadow-2xl flex flex-col overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700 shrink-0">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{isEdit ? "식당 수정" : "식당 추가"}</h2>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">식당 이름 *</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="식당 이름" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">카테고리</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputCls}>
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">지역</label>
              <select value={area} onChange={(e) => setArea(e.target.value)} className={inputCls}>
                {AREAS.map((a) => <option key={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">전화번호</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="02-1234-5678" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">주소 *</label>
            <div className="flex gap-2">
              <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="서울 강남구 도산대로 318" className={`${inputCls} flex-1`} />
              <button onClick={handleGeocode} disabled={geocoding || !address} className="shrink-0 px-3 py-2 text-xs font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 rounded-lg transition-colors">
                {geocoding ? "변환중..." : "좌표 변환"}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">위도 (lat)</label>
              <input value={lat} onChange={(e) => setLat(e.target.value)} placeholder="37.5238" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">경도 (lng)</label>
              <input value={lng} onChange={(e) => setLng(e.target.value)} placeholder="127.0392" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">영업시간</label>
            <input value={hours} onChange={(e) => setHours(e.target.value)} placeholder="12:00 ~ 22:00 (월 휴무)" className={inputCls} />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">설명</label>
            <textarea rows={2} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="간단한 식당 소개" className={`${inputCls} resize-none`} />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">캐치테이블 평점</label>
              <input value={ctRating} onChange={(e) => setCtRating(e.target.value)} placeholder="4.5" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">리뷰 수</label>
              <input value={ctReviews} onChange={(e) => setCtReviews(e.target.value)} placeholder="100" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">런치 가격</label>
              <input value={lunchPrice} onChange={(e) => setLunchPrice(e.target.value)} placeholder="50,000원" className={inputCls} />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">디너 가격</label>
              <input value={dinnerPrice} onChange={(e) => setDinnerPrice(e.target.value)} placeholder="150,000원" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">태그 (쉼표 구분)</label>
            <input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="에도마에, 하이엔드, 예약필수" className={inputCls} />
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={groupDining} onChange={(e) => setGroupDining(e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500" />
              <span className="text-sm text-gray-700 dark:text-gray-300">10인 이상 단체 가능</span>
            </label>
          </div>
          {groupDining && (
            <div>
              <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">단체 예약 참고사항</label>
              <input value={groupNote} onChange={(e) => setGroupNote(e.target.value)} placeholder="프라이빗 룸 최대 12인" className={inputCls} />
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-accent rounded-xl transition-colors">취소</button>
          <button onClick={handleSubmit} disabled={!name || !address} className="px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 disabled:bg-gray-300 rounded-xl transition-colors">
            {isEdit ? "수정" : "추가"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════
   Main Page
   ══════════════════════════════════════ */
export default function AdminPage() {
  const { user, isAdmin, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<"members" | "restaurants">("members");

  /* ── Members state ── */
  const [members, setMembers] = useState<Member[]>([]);
  const [roleFilter, setRoleFilter] = useState<"all" | Member["role"]>("all");
  const [memberSearch, setMemberSearch] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: number; action: "delete" | "approve" } | null>(null);

  /* ── Restaurants state ── */
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [restSearch, setRestSearch] = useState("");
  const [showRestForm, setShowRestForm] = useState(false);
  const [editingRest, setEditingRest] = useState<Restaurant | undefined>(undefined);
  const [deleteRestConfirm, setDeleteRestConfirm] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Load members
    try {
      const raw = localStorage.getItem("secret-gourmet-users");
      if (raw) {
        const users = JSON.parse(raw) as { email: string; nickname: string; role: string; joinedAt: string }[];
        setMembers(users.map((u, i) => ({
          id: i + 1, name: u.nickname, email: u.email,
          role: u.role as Member["role"], joinedAt: u.joinedAt, lastActive: u.joinedAt,
          reviewCount: 0, voteCount: 0, avatar: u.nickname.slice(0, 2).toUpperCase(),
        })));
      }
    } catch { /* ignore */ }
    // Load restaurants
    setRestaurants(getRestaurants());
  }, []);

  // Auth guard
  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><div className="text-gray-400 text-sm">로딩 중...</div></div>;
  if (!user || !isAdmin) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">접근 권한이 없습니다</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">관리자 계정으로 로그인해주세요.</p>
          <Link href="/login" className="inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors">로그인하기</Link>
        </div>
      </div>
    );
  }

  /* ── Member helpers ── */
  const syncToStorage = (updatedMembers: Member[]) => {
    try {
      const raw = localStorage.getItem("secret-gourmet-users");
      if (!raw) return;
      const users = JSON.parse(raw) as { email: string; password: string; nickname: string; role: string; joinedAt: string }[];
      const updated = users.map((u) => {
        const match = updatedMembers.find((m) => m.email === u.email);
        if (match) return { ...u, role: match.role };
        return u;
      }).filter((u) => updatedMembers.some((m) => m.email === u.email));
      localStorage.setItem("secret-gourmet-users", JSON.stringify(updated));
    } catch { /* ignore */ }
  };
  const changeRole = (id: number, newRole: Member["role"]) => {
    setMembers((prev) => { const next = prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)); syncToStorage(next); return next; });
    setEditingId(null);
  };
  const approveMember = (id: number) => { changeRole(id, "member"); setConfirmAction(null); };
  const deleteMember = (id: number) => { setMembers((prev) => { const next = prev.filter((m) => m.id !== id); syncToStorage(next); return next; }); setConfirmAction(null); };

  const filteredMembers = members.filter((m) => {
    if (roleFilter !== "all" && m.role !== roleFilter) return false;
    if (memberSearch && !m.name.toLowerCase().includes(memberSearch.toLowerCase()) && !m.email.toLowerCase().includes(memberSearch.toLowerCase())) return false;
    return true;
  });
  const pendingCount = members.filter((m) => m.role === "pending").length;

  /* ── Restaurant helpers ── */
  const filteredRest = restaurants.filter((r) => {
    if (!restSearch) return true;
    const q = restSearch.toLowerCase();
    return r.name.toLowerCase().includes(q) || r.address.toLowerCase().includes(q) || r.category.toLowerCase().includes(q);
  });

  const handleSaveRestaurant = (data: Omit<Restaurant, "id"> | Restaurant) => {
    if ("id" in data && data.id) {
      // Edit
      const list = getRestaurants().map((r) => r.id === data.id ? { ...r, ...data } : r);
      saveRestaurants(list);
      setRestaurants(list);
    } else {
      // Add
      const newItem = addRestaurant(data as Omit<Restaurant, "id">);
      setRestaurants((prev) => [...prev, newItem]);
    }
    window.dispatchEvent(new Event("restaurants-updated"));
  };

  const handleDeleteRestaurant = (id: number) => {
    deleteRestaurant(id);
    setRestaurants((prev) => prev.filter((r) => r.id !== id));
    setDeleteRestConfirm(null);
    window.dispatchEvent(new Event("restaurants-updated"));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">관리자 대시보드</h1>
            <p className="text-gray-600 dark:text-gray-400">회원 및 식당을 관리하세요</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="전체 회원" value={members.filter((m) => m.role !== "pending").length} color="bg-blue-100 dark:bg-blue-900/30"
          icon={<svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard label="승인 대기" value={pendingCount} color="bg-yellow-100 dark:bg-yellow-900/30"
          icon={<svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard label="등록된 식당" value={restaurants.length} color="bg-orange-100 dark:bg-orange-900/30"
          icon={<svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>} />
        <StatCard label="오마카세" value={restaurants.filter((r) => r.category === "오마카세").length} color="bg-red-100 dark:bg-red-900/30"
          icon={<svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>} />
      </div>

      {/* Tab Switch */}
      <div className="flex items-center gap-1 mb-6 border-b border-gray-200 dark:border-gray-700">
        <button onClick={() => setActiveTab("members")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "members" ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
          회원 관리
        </button>
        <button onClick={() => setActiveTab("restaurants")} className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === "restaurants" ? "border-primary-500 text-primary-600 dark:text-primary-400" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
          식당 관리
        </button>
      </div>

      {/* ═══════ Members Tab ═══════ */}
      {activeTab === "members" && (
        <>
          {pendingCount > 0 && (
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
                승인 대기 ({pendingCount}명)
              </h3>
              <div className="space-y-2">
                {members.filter((m) => m.role === "pending").map((m) => (
                  <div key={m.id} className="flex items-center justify-between bg-white dark:bg-dark-card rounded-xl p-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-xs font-bold text-yellow-700 dark:text-yellow-300">{m.avatar}</div>
                      <div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</span>
                        <span className="text-xs text-gray-500 block">{m.email}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => approveMember(m.id)} className="px-3 py-1.5 text-xs font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg">승인</button>
                      <button onClick={() => setConfirmAction({ id: m.id, action: "delete" })} className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg">거절</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">회원 목록</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <input value={memberSearch} onChange={(e) => setMemberSearch(e.target.value)} placeholder="이름 또는 이메일 검색"
                  className="flex-1 sm:w-56 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary-500" />
                <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                  className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-sm text-gray-900 dark:text-white outline-none">
                  <option value="all">전체</option><option value="admin">관리자</option><option value="member">회원</option><option value="pending">승인대기</option>
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead><tr className="bg-gray-50 dark:bg-dark-bg">
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">회원</th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">이메일</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">역할</th>
                  <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">관리</th>
                </tr></thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {filteredMembers.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50">
                      <td className="px-6 py-4"><div className="flex items-center gap-3"><div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${m.role === "admin" ? "bg-red-100 text-red-700" : "bg-primary-100 text-primary-700"}`}>{m.avatar}</div><div><div className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</div><div className="text-xs text-gray-500 md:hidden">{m.email}</div></div></div></td>
                      <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{m.email}</td>
                      <td className="px-6 py-4 text-center">
                        {editingId === m.id ? (
                          <select value={m.role} onChange={(e) => changeRole(m.id, e.target.value as Member["role"])} onBlur={() => setEditingId(null)} autoFocus className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg outline-none">
                            <option value="admin">관리자</option><option value="member">회원</option><option value="pending">승인대기</option>
                          </select>
                        ) : (
                          <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[m.role]}`}>{roleLabels[m.role]}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={() => setEditingId(editingId === m.id ? null : m.id)} className="p-1.5 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                          </button>
                          {m.role !== "admin" && (
                            <button onClick={() => setConfirmAction({ id: m.id, action: "delete" })} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredMembers.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">검색 결과가 없습니다</div>}
          </div>
        </>
      )}

      {/* ═══════ Restaurants Tab ═══════ */}
      {activeTab === "restaurants" && (
        <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">식당 목록 ({restaurants.length})</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <input value={restSearch} onChange={(e) => setRestSearch(e.target.value)} placeholder="식당 이름, 주소, 카테고리 검색"
                className="flex-1 sm:w-64 px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-sm text-gray-900 dark:text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary-500" />
              <button onClick={() => { setEditingRest(undefined); setShowRestForm(true); }}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-primary-500 hover:bg-primary-600 rounded-lg transition-colors">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                추가
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead><tr className="bg-gray-50 dark:bg-dark-bg">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">식당</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden md:table-cell">카테고리</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden lg:table-cell">지역</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">평점</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase hidden sm:table-cell">가격</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 uppercase">관리</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {filteredRest.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50">
                    <td className="px-6 py-3">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{r.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[200px]">{r.address}</div>
                    </td>
                    <td className="px-6 py-3 hidden md:table-cell"><span className="text-xs font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded">{r.category}</span></td>
                    <td className="px-6 py-3 text-xs text-gray-600 dark:text-gray-400 hidden lg:table-cell">{r.area}</td>
                    <td className="px-6 py-3 text-center"><span className="text-sm font-bold text-red-500">★ {r.catchTableRating.toFixed(1)}</span></td>
                    <td className="px-6 py-3 text-center hidden sm:table-cell">
                      <div className="text-xs text-gray-600 dark:text-gray-400">L {r.lunchPrice}</div>
                      <div className="text-xs text-gray-600 dark:text-gray-400">D {r.dinnerPrice}</div>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => { setEditingRest(r); setShowRestForm(true); }} className="p-1.5 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </button>
                        <button onClick={() => setDeleteRestConfirm(r.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredRest.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">검색 결과가 없습니다</div>}
        </div>
      )}

      {/* ═══════ Modals ═══════ */}
      {showRestForm && (
        <RestaurantFormModal
          restaurant={editingRest}
          onClose={() => { setShowRestForm(false); setEditingRest(undefined); }}
          onSave={handleSaveRestaurant}
        />
      )}

      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setConfirmAction(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{confirmAction.action === "delete" ? "회원 삭제" : "회원 승인"}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {confirmAction.action === "delete"
                ? `"${members.find((m) => m.id === confirmAction.id)?.name}" 회원을 삭제하시겠습니까?`
                : `"${members.find((m) => m.id === confirmAction.id)?.name}" 회원을 승인하시겠습니까?`}
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg rounded-xl">취소</button>
              <button onClick={() => confirmAction.action === "delete" ? deleteMember(confirmAction.id) : approveMember(confirmAction.id)}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl ${confirmAction.action === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}>
                {confirmAction.action === "delete" ? "삭제" : "승인"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteRestConfirm !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDeleteRestConfirm(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">식당 삭제</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              &quot;{restaurants.find((r) => r.id === deleteRestConfirm)?.name}&quot; 식당을 삭제하시겠습니까?
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteRestConfirm(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg rounded-xl">취소</button>
              <button onClick={() => handleDeleteRestaurant(deleteRestConfirm)} className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl">삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
