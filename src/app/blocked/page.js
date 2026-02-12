"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { detectLanguageFromIPWithRestrictions, isAllowedAccessCountry } from "../../ipGeolocation";

export default function BlockedPage() {
  const router = useRouter();
  const [message, setMessage] = useState("Sorry, you are not authorized to access this page.");

  useEffect(() => {
    let isActive = true;

    const verifyBlockedState = async () => {
      try {
        const geoData = await detectLanguageFromIPWithRestrictions();
        if (!isActive) return;

        const countryCode = geoData?.countryCode;
        const shouldBlock = geoData?.blocked ?? !isAllowedAccessCountry(countryCode);

        if (!shouldBlock) {
          router.replace("/");
          return;
        }

        if (geoData?.message) {
          setMessage(geoData.message);
        }
      } catch (_) {
        setMessage("Sorry, you are not authorized to access this page.");
      }
    };

    verifyBlockedState();

    return () => {
      isActive = false;
    };
  }, [router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
        background: "#f8fafc",
      }}
    >
      <div
        style={{
          maxWidth: "560px",
          width: "100%",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          padding: "28px",
          textAlign: "center",
          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.06)",
        }}
      >
        <h1 style={{ margin: "0 0 12px", fontSize: "1.6rem", color: "#1f2937" }}>
          Access Blocked
        </h1>
        <p style={{ margin: 0, fontSize: "1rem", color: "#374151", lineHeight: 1.6 }}>
          {message}
        </p>
      </div>
    </main>
  );
}
