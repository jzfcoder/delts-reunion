import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MIT DTD 2026 Alumni Reunion";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)",
          color: "white",
          fontFamily: "sans-serif",
          textAlign: "center",
          padding: "60px",
        }}
      >
        <div
          style={{
            fontSize: 36,
            letterSpacing: "0.3em",
            opacity: 0.7,
            marginBottom: 24,
          }}
        >
          MIT
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: "0.15em",
            marginBottom: 16,
          }}
        >
          DELTA TAU DELTA
        </div>
        <div
          style={{
            width: 120,
            height: 2,
            background: "rgba(255,255,255,0.4)",
            marginBottom: 24,
          }}
        />
        <div
          style={{
            fontSize: 40,
            fontWeight: 600,
            letterSpacing: "0.2em",
          }}
        >
          2026 ALUMNI REUNION
        </div>
      </div>
    ),
    { ...size }
  );
}
