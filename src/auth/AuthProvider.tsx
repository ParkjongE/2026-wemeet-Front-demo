import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { api, getToken, setToken, type AuthResult } from "../api";
import { queryKeys } from "../hooks/queryKeys";
import { setUnauthorizedHandler } from "../hooks/queryClient";
import { AuthContext, type AuthContextValue, type AuthStatus } from "./authContext";

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const [hasToken, setHasToken] = useState(() => !!getToken());

  const meQuery = useQuery({
    queryKey: queryKeys.me,
    queryFn: api.getMe,
    enabled: hasToken,
    staleTime: Infinity,
  });

  const signOut = useCallback(() => {
    setToken(null);
    setHasToken(false);
    queryClient.clear();
  }, [queryClient]);

  const signIn = useCallback(
    async (result: AuthResult) => {
      queryClient.clear();
      setToken(result.accessToken);
      try {
        await queryClient.fetchQuery({ queryKey: queryKeys.me, queryFn: api.getMe });
      } catch (error) {
        setToken(null);
        throw error;
      }
      setHasToken(true);
    },
    [queryClient],
  );

  // 어떤 요청이든 401을 받으면 로그아웃한다. 가드가 /login으로 보낸다.
  useEffect(() => {
    setUnauthorizedHandler(signOut);
    return () => setUnauthorizedHandler(null);
  }, [signOut]);

  const value = useMemo<AuthContextValue>(() => {
    let status: AuthStatus;
    if (!hasToken) status = "anonymous";
    else if (meQuery.data) status = "authenticated";
    else if (meQuery.isError) status = "error";
    else status = "loading";

    return {
      status,
      user: meQuery.data?.user ?? null,
      child: meQuery.data?.children[0] ?? null,
      signIn,
      signOut,
      retry: () => void meQuery.refetch(),
    };
  }, [hasToken, meQuery, signIn, signOut]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
