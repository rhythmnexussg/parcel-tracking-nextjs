import { getBlockedCountryDisplayName } from "../../blockedCountryNames";
import { headers } from "next/headers";

function normalizeCountryCode(value) {
  const normalized = (value || "").trim().toUpperCase();
  return /^[A-Z]{2}$/.test(normalized) ? normalized : "";
}

function getCountryFromSearchParams(searchParams) {
  if (!searchParams) return "";
  const keys = ["country", "blockedCountry", "detectedCountryCode", "adminCountry", "code"];

  for (const key of keys) {
    const paramValue = searchParams?.[key];
    const firstValue = Array.isArray(paramValue) ? paramValue[0] : paramValue;
    const normalized = normalizeCountryCode(firstValue || "");
    if (normalized) return normalized;
  }

  return "";
}

function getCountryFromHeaders(headerStore) {
  const headerKeys = ["x-vercel-ip-country", "cf-ipcountry", "x-country-code", "x-geo-country"];
  for (const key of headerKeys) {
    const normalized = normalizeCountryCode(headerStore.get(key) || "");
    if (normalized) return normalized;
  }
  return "";
}

function getUnsupportedSystemGuidance(systemLabel) {
  const normalized = (systemLabel || "").toLowerCase();

  if (normalized.includes("windows")) {
    return "Please upgrade to Windows 10 or above.";
  }

  if (normalized.includes("android")) {
    return "Please upgrade to Android 13 or above.";
  }

  if (normalized.includes("iphone") || normalized.includes("ios")) {
    return "Please upgrade to iOS 17 or above.";
  }

  if (normalized.includes("mac")) {
    return "Please upgrade to macOS 12 or above.";
  }

  if (normalized.includes("linux") || normalized.includes("ubuntu") || normalized.includes("fedora") || normalized.includes("mint")) {
    return "Please use a currently supported Linux distribution release with active security updates.";
  }

  return "Please use a currently supported operating system version with active security updates.";
}

export default async function BlockedPage({ searchParams }) {
  const resolvedSearchParams = typeof searchParams?.then === "function"
    ? await searchParams
    : searchParams;

  const reasonParam = resolvedSearchParams?.reason;
  const reason = Array.isArray(reasonParam)
    ? (reasonParam[0] || "").trim().toLowerCase()
    : (reasonParam || "").trim().toLowerCase();
  const systemParam = resolvedSearchParams?.system;
  const unsupportedSystem = Array.isArray(systemParam)
    ? (systemParam[0] || "").trim()
    : (systemParam || "").trim();

  const countryCodeFromQuery = getCountryFromSearchParams(resolvedSearchParams);
  const requestHeaders = await headers();
  const countryCode = countryCodeFromQuery || getCountryFromHeaders(requestHeaders);

  let countryName = "Unknown country";
  if (countryCode) {
    const mappedName = getBlockedCountryDisplayName(countryCode);
    if (mappedName) {
      countryName = mappedName;
    } else {
    try {
      const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
      countryName = regionNames.of(countryCode) || countryCode;
    } catch (_) {
      countryName = countryCode;
    }
    }
  }

  const unsupportedOsMessage = reason === "unsupported-os"
    ? `Access is blocked because this device is using unsupported hardware or an unsupported operating system version. ${getUnsupportedSystemGuidance(unsupportedSystem)}`
    : null;

  const message = reason === "unsupported-os"
    ? unsupportedOsMessage
    : `Sorry, you are not authorized to access this page. You are located in ${countryName} that currently Rhythm Nexus does not offer any shipping there.`;

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
