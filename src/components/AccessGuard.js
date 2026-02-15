"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { detectLanguageFromIPWithRestrictions, isAllowedAccessCountry } from "../ipGeolocation";

const ACCESS_TAB_SESSION_KEY = "rnx_access_tab_verified";

function isCaptchaRequiredPath(pathname) {
  if (!pathname || typeof pathname !== "string") return false;

  return (
    pathname === "/" ||
    pathname === "/about" ||
    pathname === "/FAQ" ||
    pathname === "/faq" ||
    pathname === "/blog" ||
    pathname.startsWith("/blog/") ||
    pathname === "/track-your-item"
  );
}

export function AccessGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [accessChecked, setAccessChecked] = useState(false);

  useEffect(() => {
    let isActive = true;

    const checkAccess = async () => {
      const isLocalhost = (() => {
        try {
          const host = (window.location.hostname || "").toLowerCase();
          return host === "localhost" || host === "127.0.0.1" || host === "::1";
        } catch (_) {
          return false;
        }
      })();

      if (isLocalhost || pathname === "/access" || pathname === "/blocked" || !isCaptchaRequiredPath(pathname)) {
        if (isActive) setAccessChecked(true);
        return;
      }

      const hasTabCaptcha = sessionStorage.getItem(ACCESS_TAB_SESSION_KEY) === "1";
      if (!hasTabCaptcha) {
        const nextPath = `${pathname}${window.location.search || ""}`;
        router.replace(`/access?next=${encodeURIComponent(nextPath)}`);
        if (isActive) setAccessChecked(true);
        return;
      }

      if (isActive) setAccessChecked(false);

      const fallbackCountryFromUrl = (() => {
        try {
          const params = new URLSearchParams(window.location.search || "");
          return (params.get("country") || params.get("adminCountry") || "").trim().toUpperCase();
        } catch (_) {
          return "";
        }
      })();

      try {
        const geoData = await detectLanguageFromIPWithRestrictions();
        if (!isActive) return;

        const countryCode = geoData?.countryCode;
        const blocked = geoData?.blocked ?? !isAllowedAccessCountry(countryCode);

        if (blocked) {
          const blockedCountry =
            geoData?.countryCode ||
            geoData?.detectedCountryCode ||
            geoData?.secondaryCountryCode ||
            geoData?.blockedSignalCountry ||
            fallbackCountryFromUrl;
          router.replace(blockedCountry ? `/blocked?country=${encodeURIComponent(blockedCountry)}` : "/blocked");
          setAccessChecked(true);
          return;
        }

        setAccessChecked(true);
      } catch (_) {
        if (!isActive) return;
        const fallbackCountry = fallbackCountryFromUrl;
        router.replace(fallbackCountry ? `/blocked?country=${encodeURIComponent(fallbackCountry)}` : "/blocked");
        setAccessChecked(true);
      }
    };

    checkAccess();

    return () => {
      isActive = false;
    };
  }, [pathname, router]);

  return pathname === "/blocked" || accessChecked ? children : null;
}
