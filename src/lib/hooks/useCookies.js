/**
 * Cookie management utilities
 */

// Helper functions for direct usage outside of components
export const setCookie = (name, value, options = {}) => {
  if (typeof window === "undefined") return;

  const {
    path = "/",
    expires = new Date(Date.now() + 7 * 86400000), // 7 days by default
    secure = process.env.NODE_ENV === "production",
    sameSite = "strict",
    httpOnly = true,
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
  if (typeof window === "undefined") return;
  document.cookie = `${name}=; path=${path}; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

// React hook for use in components

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
