"use client";

import { useState } from "react";

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

const roleLabels: Record<Member["role"], string> = {
  admin: "관리자",
  member: "회원",
  pending: "승인대기",
};

const roleColors: Record<Member["role"], string> = {
  admin: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  member: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
};

const initialMembers: Member[] = [
  { id: 1, name: "관리자 (나)", email: "admin@secret-gourmet.com", role: "admin", joinedAt: "2025-01-01", lastActive: "2026-03-20", reviewCount: 0, voteCount: 0, avatar: "AD" },
];

/* ── Stat Card ── */
function StatCard({ label, value, icon, color }: { label: string; value: string | number; icon: React.ReactNode; color: string }) {
  return (
    <div className="bg-white dark:bg-dark-card rounded-2xl p-5 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{value}</p>
        </div>
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
    </div>
  );
}

/* ── Main Page ── */
export default function AdminPage() {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [roleFilter, setRoleFilter] = useState<"all" | Member["role"]>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [confirmAction, setConfirmAction] = useState<{ id: number; action: "delete" | "approve" } | null>(null);

  const filtered = members.filter((m) => {
    if (roleFilter !== "all" && m.role !== roleFilter) return false;
    if (searchQuery && !m.name.toLowerCase().includes(searchQuery.toLowerCase()) && !m.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalMembers = members.filter((m) => m.role !== "pending").length;
  const pendingCount = members.filter((m) => m.role === "pending").length;
  const totalReviews = members.reduce((s, m) => s + m.reviewCount, 0);
  const totalVotes = members.reduce((s, m) => s + m.voteCount, 0);

  const changeRole = (id: number, newRole: Member["role"]) => {
    setMembers((prev) => prev.map((m) => (m.id === id ? { ...m, role: newRole } : m)));
    setEditingId(null);
  };

  const approveMember = (id: number) => {
    changeRole(id, "member");
    setConfirmAction(null);
  };

  const deleteMember = (id: number) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    setConfirmAction(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">관리자 대시보드</h1>
            <p className="text-gray-600 dark:text-gray-400">회원 관리 및 커뮤니티 현황을 확인하세요</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="전체 회원" value={totalMembers} color="bg-blue-100 dark:bg-blue-900/30"
          icon={<svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>} />
        <StatCard label="승인 대기" value={pendingCount} color="bg-yellow-100 dark:bg-yellow-900/30"
          icon={<svg className="w-6 h-6 text-yellow-600 dark:text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} />
        <StatCard label="총 리뷰" value={totalReviews} color="bg-green-100 dark:bg-green-900/30"
          icon={<svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>} />
        <StatCard label="총 투표 참여" value={totalVotes} color="bg-purple-100 dark:bg-purple-900/30"
          icon={<svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" /></svg>} />
      </div>

      {/* Pending Approvals */}
      {pendingCount > 0 && (
        <div className="bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-2xl p-5 mb-8">
          <h3 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300 mb-3 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            승인 대기 중인 회원 ({pendingCount}명)
          </h3>
          <div className="space-y-2">
            {members.filter((m) => m.role === "pending").map((m) => (
              <div key={m.id} className="flex items-center justify-between bg-white dark:bg-dark-card rounded-xl p-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-xs font-bold text-yellow-700 dark:text-yellow-300">{m.avatar}</div>
                  <div>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 block">{m.email} | 가입: {m.joinedAt}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => approveMember(m.id)}
                    className="px-3 py-1.5 text-xs font-medium text-white bg-green-500 hover:bg-green-600 rounded-lg transition-colors">승인</button>
                  <button onClick={() => setConfirmAction({ id: m.id, action: "delete" })}
                    className="px-3 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors">거절</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Member Table */}
      <div className="bg-white dark:bg-dark-card rounded-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Table header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">회원 목록</h2>
            <div className="flex gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="이름 또는 이메일 검색"
                  className="w-full pl-9 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                />
              </div>
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value as typeof roleFilter)}
                className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary-500 outline-none"
              >
                <option value="all">전체</option>
                <option value="admin">관리자</option>
                <option value="member">회원</option>
                <option value="pending">승인대기</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 dark:bg-dark-bg">
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">회원</th>
                <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden md:table-cell">이메일</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">역할</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">리뷰</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden sm:table-cell">투표</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider hidden lg:table-cell">최근 활동</th>
                <th className="text-center px-6 py-3 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">관리</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50 dark:hover:bg-dark-bg/50 transition-colors">
                  {/* Name */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold ${
                        member.role === "admin"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300"
                          : "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                      }`}>
                        {member.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{member.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 md:hidden">{member.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400 hidden md:table-cell">{member.email}</td>

                  {/* Role */}
                  <td className="px-6 py-4 text-center">
                    {editingId === member.id ? (
                      <select
                        value={member.role}
                        onChange={(e) => changeRole(member.id, e.target.value as Member["role"])}
                        onBlur={() => setEditingId(null)}
                        autoFocus
                        className="text-xs px-2 py-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary-500"
                      >
                        <option value="admin">관리자</option>
                        <option value="member">회원</option>
                        <option value="pending">승인대기</option>
                      </select>
                    ) : (
                      <span className={`inline-flex text-xs font-medium px-2.5 py-1 rounded-full ${roleColors[member.role]}`}>
                        {roleLabels[member.role]}
                      </span>
                    )}
                  </td>

                  {/* Review count */}
                  <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{member.reviewCount}</td>

                  {/* Vote count */}
                  <td className="px-6 py-4 text-center text-sm text-gray-600 dark:text-gray-400 hidden sm:table-cell">{member.voteCount}</td>

                  {/* Last active */}
                  <td className="px-6 py-4 text-center text-xs text-gray-500 dark:text-gray-400 hidden lg:table-cell">{member.lastActive}</td>

                  {/* Actions */}
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        onClick={() => setEditingId(editingId === member.id ? null : member.id)}
                        title="역할 변경"
                        className="p-1.5 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      {member.role !== "admin" && (
                        <button
                          onClick={() => setConfirmAction({ id: member.id, action: "delete" })}
                          title="회원 삭제"
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-dark-bg transition-colors"
                        >
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

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 dark:text-gray-500">
            <p className="text-sm">검색 결과가 없습니다</p>
          </div>
        )}
      </div>

      {/* Confirm Dialog */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setConfirmAction(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative bg-white dark:bg-dark-card rounded-2xl p-6 max-w-sm w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              {confirmAction.action === "delete" ? "회원 삭제" : "회원 승인"}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
              {confirmAction.action === "delete"
                ? `"${members.find((m) => m.id === confirmAction.id)?.name}" 회원을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`
                : `"${members.find((m) => m.id === confirmAction.id)?.name}" 회원을 승인하시겠습니까?`
              }
            </p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setConfirmAction(null)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-accent rounded-xl transition-colors">취소</button>
              <button
                onClick={() => confirmAction.action === "delete" ? deleteMember(confirmAction.id) : approveMember(confirmAction.id)}
                className={`px-4 py-2 text-sm font-medium text-white rounded-xl transition-colors ${
                  confirmAction.action === "delete" ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
                }`}
              >
                {confirmAction.action === "delete" ? "삭제" : "승인"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
