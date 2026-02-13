"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";

export default function BlockedPage() {
  const searchParams = useSearchParams();
  const countryCode = (searchParams.get("country") || "").trim().toUpperCase();

  const countryName = useMemo(() => {
    if (!countryCode) return "your location";
    try {
      if (typeof Intl !== "undefined" && typeof Intl.DisplayNames === "function") {
        const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
        return regionNames.of(countryCode) || countryCode;
      }
    } catch (_) {
      // ignore and fallback to code
    }
    return countryCode;
  }, [countryCode]);

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
          {`Sorry, you are not authorized to access this page. You are located in ${countryName} that currently Rhythm Nexus does not offer any shipping there.`}
        </p>
      </div>
    </main>
  );
}
