"use client";

import { useEffect, useRef } from "react";
import createGlobe from "cobe";

const VENUE: [number, number] = [42.352, -71.0863];

// Cobe coordinate system (from source):
//   phi   = horizontal rotation around Y axis (0 to 2π)
//   theta = vertical tilt around X axis (-π/2 to π/2)
//   U() applies a -π longitude offset, so phi=0 shows lon=-90°
//
// To center on a [lat, lon]:
//   phi   = 3π/2 - lon_radians
//   theta = lat_radians
// Rotational focus: same longitude as venue, but at the equator
const FOCUS_PHI =
  (3 * Math.PI) / 2 - (VENUE[1] * Math.PI) / 180;
const FOCUS_THETA = Math.PI / 8; // equator

// Sample guest origins — replace with geocoded addresses later
const SAMPLE_ORIGINS: [number, number][] = [
  [34.0522, -118.2437], // Los Angeles
  [40.7128, -74.006], // New York
  [41.8781, -87.6298], // Chicago
  [29.7604, -95.3698], // Houston
  [33.749, -84.388], // Atlanta
  [47.6062, -122.3321], // Seattle
  [25.7617, -80.1918], // Miami
  [39.7392, -104.9903], // Denver
  [37.7749, -122.4194], // San Francisco
  [38.9072, -77.0369], // Washington DC
  [51.5074, -0.1278], // London
];

export function Globe() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerDown = useRef(false);
  const pointerXY = useRef<[number, number]>([0, 0]);
  const velocityPhi = useRef(0);
  const velocityTheta = useRef(0);
  const lastInteraction = useRef(0);
  const currentPhi = useRef(FOCUS_PHI);
  const currentTheta = useRef(FOCUS_THETA);

  useEffect(() => {
    if (!canvasRef.current) return;

    const IDLE_DELAY = 2000;
    const LERP = 0.03;

    const globe = createGlobe(canvasRef.current, {
      devicePixelRatio: 2,
      width: Math.max(window.innerWidth, window.innerHeight) * 2,
      height: Math.max(window.innerWidth, window.innerHeight) * 2,
      phi: currentPhi.current,
      theta: currentTheta.current,
      dark: 0,
      diffuse: 1.2,
      mapSamples: 16000,
      mapBrightness: 6,
      baseColor: [0.68, 0.62, 0.78],
      markerColor: [1, 1, 1],
      glowColor: [0.78, 0.72, 0.88],
      scale: window.innerWidth <= 768 ? 0.9 : 0.73,
      offset: [0, window.innerWidth <= 768 ? 400 : 1000],
      markers: [
        { location: VENUE, size: 0.04, color: [1, 0.85, 0.2] },
        ...SAMPLE_ORIGINS.map((loc) => ({ location: loc, size: 0.015 })),
      ],
      arcs: SAMPLE_ORIGINS.map((origin) => ({
        from: origin,
        to: VENUE,
      })),
      arcColor: [1, 1, 1],
      arcWidth: 0.3,
      arcHeight: 0.3,
      opacity: 0.9,
    });

    // Animation loop — cobe v2 uses globe.update(), not onRender
    let frameId: number;
    function animate() {
      const now = Date.now();
      const idle = now - lastInteraction.current;

      if (!pointerDown.current && idle > IDLE_DELAY) {
        // Drift back to venue
        let dPhi = FOCUS_PHI - currentPhi.current;
        if (dPhi > Math.PI) dPhi -= 2 * Math.PI;
        if (dPhi < -Math.PI) dPhi += 2 * Math.PI;
        const dTheta = FOCUS_THETA - currentTheta.current;

        currentPhi.current += dPhi * LERP;
        currentTheta.current += dTheta * LERP;
      }

      // Apply drag velocity with decay
      if (!pointerDown.current) {
        currentPhi.current += velocityPhi.current;
        currentTheta.current += velocityTheta.current;
        velocityPhi.current *= 0.92;
        velocityTheta.current *= 0.92;
      }

      // Clamp theta to valid range
      currentTheta.current = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, currentTheta.current),
      );

      globe.update({ phi: currentPhi.current, theta: currentTheta.current });
      frameId = requestAnimationFrame(animate);
    }
    frameId = requestAnimationFrame(animate);

    // Pointer events for drag rotation
    const canvas = canvasRef.current;

    function onPointerDown(e: PointerEvent) {
      pointerDown.current = true;
      pointerXY.current = [e.clientX, e.clientY];
      velocityPhi.current = 0;
      velocityTheta.current = 0;
      lastInteraction.current = Date.now();
    }

    function onPointerMove(e: PointerEvent) {
      if (!pointerDown.current) return;
      const dx = e.clientX - pointerXY.current[0];
      const dy = e.clientY - pointerXY.current[1];
      const sensitivity = 0.005;
      velocityPhi.current = -dx * sensitivity * 0.3;
      velocityTheta.current = -dy * sensitivity * 0.3;
      // dx → phi (horizontal spin), dy → theta (vertical tilt)
      currentPhi.current += dx * sensitivity;
      currentTheta.current += dy * sensitivity;
      pointerXY.current = [e.clientX, e.clientY];
      lastInteraction.current = Date.now();
    }

    function onPointerUp() {
      pointerDown.current = false;
      lastInteraction.current = Date.now();
    }

    canvas.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    return () => {
      cancelAnimationFrame(frameId);
      globe.destroy();
      canvas.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="globe-canvas"
      style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: "100vmax",
        height: "100vmax",
        pointerEvents: "auto",
        cursor: "grab",
        zIndex: 2,
      }}
    />
  );
}
