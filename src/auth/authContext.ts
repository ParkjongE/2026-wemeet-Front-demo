import { createContext, useContext } from "react";
import type { AuthResult } from "../api";
import type { Child, User } from "../types";

export type AuthStatus = "loading" | "anonymous" | "authenticated" | "error";

export interface AuthContextValue {
  status: AuthStatus;
  user: User | null;
  // 지금은 아이 1명만 지원한다.
  child: Child | null;
  signIn: (result: AuthResult) => Promise<void>;
  signOut: () => void;
  retry: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

// 아이가 있는 화면(RequireChild 안쪽)에서만 쓴다.
export function useCurrentChild(): Child {
  const { child } = useAuth();
  if (!child) throw new Error("useCurrentChild must be used inside RequireChild");
  return child;
}
