import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Generic hook to redirect based on authentication status
 * @param redirectTo - Path to redirect to if authenticated (default: "/dashboard")
 * @param requireAuth - If true, redirect to login if NOT authenticated (default: false)
 */
export function useAuthRedirect(
  redirectTo: string = "/device",
  requireAuth: boolean = false
) {
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="));

      const isAuthenticated = !!token;

      if (isAuthenticated && !requireAuth) {
        // User is logged in and shouldn't be on this page (e.g., login page)
        router.push(redirectTo);
      } else if (!isAuthenticated && requireAuth) {
        // User is not logged in but needs to be (e.g., dashboard page)
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, redirectTo, requireAuth]);
}
