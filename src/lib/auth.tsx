"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

/* ══════════════════════════════════════
   Types
   ══════════════════════════════════════ */
export interface User {
  email: string;
  nickname: string;
  role: "admin" | "member" | "pending";
  joinedAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => { ok: boolean; error?: string };
  signup: (email: string, password: string, nickname: string) => { ok: boolean; error?: string };
  logout: () => void;
  isAdmin: boolean;
}

/* ══════════════════════════════════════
   Storage helpers
   ══════════════════════════════════════ */
const USERS_KEY = "secret-gourmet-users";
const SESSION_KEY = "secret-gourmet-session";

interface StoredUser {
  email: string;
  password: string;  // In a real app, this would be hashed on a server
  nickname: string;
  role: "admin" | "member" | "pending";
  joinedAt: string;
}

function getUsers(): StoredUser[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function getSession(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SESSION_KEY);
  } catch {
    return null;
  }
}

function saveSession(email: string) {
  localStorage.setItem(SESSION_KEY, email);
}

function clearSession() {
  localStorage.removeItem(SESSION_KEY);
}

/* Seed admin account if not exists */
function ensureAdmin() {
  const users = getUsers();
  const adminExists = users.some((u) => u.role === "admin");
  if (!adminExists) {
    users.push({
      email: "admin@bibmis.com",
      password: "admin1234",
      nickname: "관리자",
      role: "admin",
      joinedAt: new Date().toISOString().slice(0, 10),
    });
    saveUsers(users);
  }
}

/* ══════════════════════════════════════
   Context
   ══════════════════════════════════════ */
const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: () => ({ ok: false }),
  signup: () => ({ ok: false }),
  logout: () => {},
  isAdmin: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Init: seed admin + restore session
  useEffect(() => {
    ensureAdmin();
    const sessionEmail = getSession();
    if (sessionEmail) {
      const users = getUsers();
      const found = users.find((u) => u.email === sessionEmail);
      if (found) {
        setUser({ email: found.email, nickname: found.nickname, role: found.role, joinedAt: found.joinedAt });
      }
    }
    setIsLoading(false);
  }, []);

  const login = (email: string, password: string): { ok: boolean; error?: string } => {
    const users = getUsers();
    const found = users.find((u) => u.email === email);
    if (!found) return { ok: false, error: "등록되지 않은 이메일입니다." };
    if (found.password !== password) return { ok: false, error: "비밀번호가 일치하지 않습니다." };
    if (found.role === "pending") return { ok: false, error: "관리자 승인 대기 중입니다. 승인 후 로그인할 수 있습니다." };

    const u: User = { email: found.email, nickname: found.nickname, role: found.role, joinedAt: found.joinedAt };
    setUser(u);
    saveSession(found.email);
    return { ok: true };
  };

  const signup = (email: string, password: string, nickname: string): { ok: boolean; error?: string } => {
    if (!email || !password || !nickname) return { ok: false, error: "모든 필드를 입력해주세요." };
    if (password.length < 8) return { ok: false, error: "비밀번호는 8자 이상이어야 합니다." };

    const users = getUsers();
    if (users.some((u) => u.email === email)) return { ok: false, error: "이미 가입된 이메일입니다." };

    const newUser: StoredUser = {
      email,
      password,
      nickname,
      role: "pending",  // 관리자 승인 후 member로 변경
      joinedAt: new Date().toISOString().slice(0, 10),
    };
    users.push(newUser);
    saveUsers(users);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    clearSession();
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
