/**
 * Cookie management utilities
 */

import { useMemo } from "react";
import { env } from "~/env.mjs";

// Helper functions for direct usage outside of components
export const setCookie = (name, value, options = {}) => {
  if (typeof window === "undefined") return;

  const {
    path = "/",
    expires = new Date(Date.now() + 7 * 86400000), // 7 days by default
    secure = process.env.NODE_ENV === "production",
    sameSite = "strict",
  } = options;

  let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}`;

  if (expires instanceof Date) {
    cookieString += `; expires=${expires.toUTCString()}`;
  }

  if (secure) {
    cookieString += "; secure";
  }

  cookieString += `; samesite=${sameSite}`;

  document.cookie = cookieString;
};

export const getCookie = (name) => {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((c) => c.startsWith(`${name}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.split("=")[1]);
};

export const removeCookie = (name, path = "/") => {
  if (typeof window === "undefined") {
    console.log("removeCookie: window is undefined, exiting function.");
    return;
  }

  console.log(`removeCookie: Removing cookie with name=${name} and path=${path}`);

  const domain =
    env.NEXT_PUBLIC_NODE_ENV === "production" ? ".chillsanam.com" : undefined;

  console.log(`removeCookie: Determined domain=${domain}`);

  let cookieString = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;

  console.log(`removeCookie: Initial cookieString=${cookieString}`);

  if (domain) {
    cookieString += `; domain=${domain}`;
    console.log(`removeCookie: Added domain to cookieString=${cookieString}`);
  }

  // secure
  cookieString += "; secure";
  console.log(`removeCookie: Added secure flag to cookieString=${cookieString}`);

  // samesite
  cookieString += "; samesite=strict";
  console.log(`removeCookie: Added samesite flag to cookieString=${cookieString}`);

  document.cookie = cookieString;
  console.log(`removeCookie: Final cookieString set in document.cookie=${cookieString}`);
};

export const useCookies = () => {
  const cookieUtils = useMemo(
    () => ({
      setCookie,
      getCookie,
      removeCookie,
    }),
    []
  );

  return cookieUtils;
};
export default useCookies;
