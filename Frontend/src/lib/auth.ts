import { useEffect, useState } from "react";
import { getCurrentUser, loginUser, registerUser, type AuthResponse } from "@/api";

export type Role = "admin" | "customer";
export interface User {
  id?: string;
  email: string;
  name: string;
  role: Role;
  phone?: string;
  address?: string;
  tag?: string;
}

const USER_KEY = "yp_auth_user";
const TOKEN_KEY = "yp_auth_token";
const REFRESH_TOKEN_KEY = "yp_auth_refresh_token";

function emitAuthChange() {
  window.dispatchEvent(new Event("yp-auth-change"));
}

function saveSession(session: AuthResponse) {
  sessionStorage.setItem(USER_KEY, JSON.stringify(session.user));
  sessionStorage.setItem(TOKEN_KEY, session.token);
  if (session.refreshToken) {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, session.refreshToken);
  }
  emitAuthChange();
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export async function login(email: string, password: string): Promise<User> {
  const session = await loginUser(email, password) as AuthResponse;
  saveSession(session);
  return session.user;
}

export async function register(input: {
  name: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}): Promise<User> {
  const session = await registerUser(input) as AuthResponse;
  saveSession(session);
  return session.user;
}

export async function refreshMe(): Promise<User | null> {
  if (!getToken()) return null;
  try {
    const data = await getCurrentUser() as { user: User };
    sessionStorage.setItem(USER_KEY, JSON.stringify(data.user));
    emitAuthChange();
    return data.user;
  } catch {
    logout();
    return null;
  }
}

export function logout() {
  if (typeof window !== "undefined") {
    sessionStorage.removeItem(USER_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    emitAuthChange();
  }
}

export function getUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setUser(getUser());
    setReady(true);

    if (getToken()) {
      void refreshMe();
    }

    const handleAuthChange = () => setUser(getUser());
    window.addEventListener("yp-auth-change", handleAuthChange);
    window.addEventListener("storage", handleAuthChange);
    return () => {
      window.removeEventListener("yp-auth-change", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  return { user, ready };
}
