import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "StoreLink - The Engine for Naija Hustle";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #f0fdf4, #ffffff)", // emerald-50 to white
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", marginBottom: 20 }}>
            <svg
            width="120"
            height="120"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#059669" // Emerald-600
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            >
            <rect width="7" height="9" x="3" y="3" rx="1" />
            <rect width="7" height="5" x="14" y="3" rx="1" />
            <rect width="7" height="9" x="14" y="12" rx="1" />
            <rect width="7" height="5" x="3" y="16" rx="1" />
            </svg>
        </div>

        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: "#111827", // gray-900
            letterSpacing: "-0.05em",
            marginBottom: 10,
          }}
        >
          StoreLink.
        </div>

        <div
          style={{
            fontSize: 32,
            fontWeight: 500,
            color: "#059669", // emerald-600
            letterSpacing: "-0.02em",
          }}
        >
          The Engine for Naija Hustle
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}