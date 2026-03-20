"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Already logged in
  if (user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="bg-white dark:bg-dark-card rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-700 dark:text-primary-300">{user.nickname.charAt(0)}</span>
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{user.nickname}님</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{user.email}</p>
            <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full mb-6 ${
              user.role === "admin" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
            }`}>
              {user.role === "admin" ? "관리자" : "회원"}
            </span>
            <div className="flex gap-3 justify-center">
              <Link href="/" className="px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-dark-bg hover:bg-gray-200 dark:hover:bg-dark-accent rounded-xl transition-colors">
                홈으로
              </Link>
              {user.role === "admin" && (
                <Link href="/admin" className="px-5 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors">
                  관리자 대시보드
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    const result = login(email, password);
    if (!result.ok) {
      setError(result.error || "로그인에 실패했습니다.");
      return;
    }

    router.push("/");
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <span className="text-4xl">🍽️</span>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">로그인</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">비밀미식회에 다시 오신 것을 환영합니다</p>
        </div>

        <div className="bg-white dark:bg-dark-card rounded-2xl p-8 border border-gray-100 dark:border-gray-700 shadow-sm">
          <form className="space-y-5" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">이메일</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@example.com"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">비밀번호</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="비밀번호를 입력하세요"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-dark-bg text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none" />
            </div>
            <button type="submit" className="w-full px-6 py-3.5 text-base font-semibold text-white bg-primary-500 hover:bg-primary-600 rounded-xl transition-colors">
              로그인
            </button>
          </form>

          <div className="mt-5 text-center text-sm text-gray-600 dark:text-gray-400">
            아직 회원이 아니신가요?{" "}
            <Link href="/signup" className="text-primary-500 hover:text-primary-600 font-medium">회원가입</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
