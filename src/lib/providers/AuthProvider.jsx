"use client";

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import {
  selectIsAuthenticated,
  fetchCurrentUser,
} from "~/lib/redux/features/authSlice";
import { useAppSelector } from "~/lib/redux/store";
import styles from "~/components/Auth/Auth.module.scss";

// Define public and protected routes
const PUBLIC_ROUTES = ["/"];
const PROTECTED_ROUTES = ["/home"];

export default function AuthProvider({ children }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const loading = useAppSelector((state) => state.auth.loading);
  const dispatch = useDispatch();
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchCurrentUser()).finally(() => {
      setIsAuthChecking(false);
    });
  }, []);

  useEffect(() => {
    // Don't redirect while still loading authentication status
    if (loading || isAuthChecking) return;

    const isPublicRoute = PUBLIC_ROUTES.includes(pathname);
    const isProtectedRoute =
      PROTECTED_ROUTES.includes(pathname) || pathname.startsWith("/home/");

    if (isAuthenticated) {
      // If user is authenticated and on a public route, redirect to home
      if (isPublicRoute) {
        router.push("/home");
      }
    } else {
      // If user is not authenticated and trying to access a protected route, redirect to login
      if (isProtectedRoute) {
        router.push("/");
      }
    }
  }, [isAuthenticated, pathname, router, loading, isAuthChecking]);

  return (
    <>
      {loading ? (
        <div className={styles["loading-container"]}>
          <div className={styles["loading-container__spinner"]}></div>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  );
}
