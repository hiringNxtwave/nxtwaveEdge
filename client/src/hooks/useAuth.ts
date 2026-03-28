import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { type User } from "@shared/schema";
import { getQueryFn } from "@/lib/queryClient";

const AUTH_CACHE_KEY = "nw_edge_auth_v1";

function getCachedAuth(): User | null {
  try {
    const raw = localStorage.getItem(AUTH_CACHE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function setCachedAuth(user: User | null) {
  try {
    if (user) localStorage.setItem(AUTH_CACHE_KEY, JSON.stringify(user));
    else localStorage.removeItem(AUTH_CACHE_KEY);
  } catch {}
}

export function useAuth() {
  const cachedUser = getCachedAuth();

  const { data: user, isLoading } = useQuery<User>({
    queryKey: ["/api/auth/user"],
    queryFn: getQueryFn({ on401: "returnNull", enableFallback: false }),
    retry: false,
    initialData: cachedUser ?? undefined,
    staleTime: 2 * 60 * 1000,
  });

  useEffect(() => {
    if (!isLoading) {
      setCachedAuth(user ?? null);
    }
  }, [user, isLoading]);

  return {
    user,
    isLoading: isLoading && !cachedUser,
    isAuthenticated: !!user,
  };
}
