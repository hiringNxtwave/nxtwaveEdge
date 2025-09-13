import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { mockStudents, mockSkills, filterMockStudents, generateAdditionalMockStudents } from "./mockStudentData";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

// Check if we should use mock data (for development/fallback)
const shouldUseMockData = () => {
  const forceMock = import.meta.env.VITE_USE_MOCK_DATA === "true";
  const isDev = import.meta.env.DEV;
  return forceMock || isDev;
};

// Fallback handler for student-related endpoints
function getFallbackData(url: string, queryParams?: URLSearchParams): any {
  console.log("🔄 API failed, using fallback data for:", url);
  
  if (url.includes("/api/students")) {
    if (url.includes("/api/students/count")) {
      return { count: 1920 }; // Mock total count
    }
    
    if (url.includes("/api/students/smart-discovery")) {
      // Return subset of best students for smart discovery
      return mockStudents.filter(s => s.overallAssessmentScore! >= 80).slice(0, 12);
    }
    
    // Handle regular student listing with filters
    const limit = queryParams?.get("limit") ? parseInt(queryParams.get("limit")!) : 20;
    const offset = queryParams?.get("offset") ? parseInt(queryParams.get("offset")!) : 0;
    const university = queryParams?.get("university") || "";
    const codingRating = queryParams?.get("codingRating") ? parseInt(queryParams.get("codingRating")!) : undefined;
    const location = queryParams?.get("location") || "";
    const minCgpa = queryParams?.get("minCgpa") ? parseFloat(queryParams.get("minCgpa")!) : undefined;
    
    // Generate more students if needed for pagination
    const allMockStudents = offset > mockStudents.length 
      ? [...mockStudents, ...generateAdditionalMockStudents(50)]
      : mockStudents;
    
    return filterMockStudents(allMockStudents, {
      university,
      codingRating,
      location,
      minCgpa,
      limit,
      offset
    });
  }
  
  if (url.includes("/api/skills")) {
    return mockSkills;
  }
  
  // Default fallback for other endpoints
  return [];
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
  enableFallback?: boolean;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior, enableFallback = true }) =>
  async ({ queryKey }) => {
    const fullUrl = queryKey.join("/") as string;
    
    try {
      const res = await fetch(fullUrl, {
        credentials: "include",
      });

      if (unauthorizedBehavior === "returnNull" && res.status === 401) {
        return null;
      }

      await throwIfResNotOk(res);
      return await res.json();
    } catch (error) {
      console.warn("❌ API request failed:", fullUrl, error);
      
      // Return fallback data for student-related endpoints during development/fallback mode
      if (enableFallback && shouldUseMockData()) {
        try {
          const url = new URL(fullUrl, window.location.origin);
          const fallbackData = getFallbackData(url.pathname, url.searchParams);
          
          // Mark the data as fallback for UI indicators
          if (Array.isArray(fallbackData)) {
            (fallbackData as any)._isFallbackData = true;
          } else if (fallbackData && typeof fallbackData === 'object') {
            (fallbackData as any)._isFallbackData = true;
          }
          
          return fallbackData;
        } catch (fallbackError) {
          console.error("Fallback data generation failed:", fallbackError);
        }
      }
      
      // If fallback is disabled or fails, re-throw the original error
      throw error;
    }
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw", enableFallback: true }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});

// Helper function to check if data is from fallback
export function isFallbackData(data: any): boolean {
  if (!data) return false;
  if (Array.isArray(data)) {
    return (data as any)._isFallbackData === true;
  }
  return (data as any)._isFallbackData === true;
}
