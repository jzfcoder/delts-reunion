"use client";

import { useEffect, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSpeed: number;
  radius: number;
  opacity: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const CONNECT_DIST = 130;
const CONNECT_DIST_SQ = CONNECT_DIST * CONNECT_DIST;
const MOUSE_RADIUS = 165;
const MOUSE_RADIUS_SQ = MOUSE_RADIUS * MOUSE_RADIUS;
const MOUSE_STRENGTH = 0.022;
const DAMPEN = 0.984;
const OFF_SCREEN = -9999;

// ─── Helpers ─────────────────────────────────────────────────────────────────

function createParticle(w: number, h: number): Particle {
  const baseSpeed = 0.1 + Math.random() * 0.22;
  const angle = Math.random() * Math.PI * 2;
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: Math.cos(angle) * baseSpeed,
    vy: Math.sin(angle) * baseSpeed,
    baseSpeed,
    // Slightly larger stars — range 1.5 – 3.5 px
    radius: 1.5 + Math.random() * 2.0,
    opacity: 0.35 + Math.random() * 0.45,
  };
}

// One particle per ~14 000 px² of canvas area, clamped to a sensible range.
// Recalculated on every resize so the field stays proportional at any size.
function targetCount(w: number, h: number): number {
  return Math.min(Math.max(Math.round((w * h) / 14000), 28), 150);
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ParticleConstellation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Mouse position in canvas-local coordinates; starts off-screen so no
  // gravity well until the user actually moves their cursor over the hero.
  const mouseRef = useRef({ x: OFF_SCREEN, y: OFF_SCREEN });

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    // Typed non-null aliases so closures below don't need repeated assertions.
    const el: HTMLCanvasElement = canvasRef.current;
    const cx: CanvasRenderingContext2D = ctx;

    let width = 0;
    let height = 0;
    let particles: Particle[] = [];
    let frameId = 0;
    let resizeTimer: ReturnType<typeof setTimeout>;

    // ── Canvas sizing (DPR-aware) ──────────────────────────────────────────
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width    = el.offsetWidth;
      height   = el.offsetHeight;
      el.width  = width  * dpr;
      el.height = height * dpr;
      cx.scale(dpr, dpr);
    }

    // ── Sync particle array to the target count for current dimensions ────
    // Adds new particles at random positions; trims excess from the tail.
    function syncParticleCount() {
      const target = targetCount(width, height);
      while (particles.length < target) {
        particles.push(createParticle(width, height));
      }
      if (particles.length > target) {
        particles.length = target;
      }
    }

    function init() {
      resize();
      particles = [];
      syncParticleCount();
    }

    // ── Draw loop ─────────────────────────────────────────────────────────
    function draw() {
      cx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      // ── Update particle positions ──────────────────────────────────────
      for (const p of particles) {
        // Gravity toward mouse
        const dxm = mx - p.x;
        const dym = my - p.y;
        const distSqM = dxm * dxm + dym * dym;

        if (distSqM < MOUSE_RADIUS_SQ && distSqM > 1) {
          const distM = Math.sqrt(distSqM);
          const force = ((MOUSE_RADIUS - distM) / MOUSE_RADIUS) * MOUSE_STRENGTH;
          p.vx += (dxm / distM) * force;
          p.vy += (dym / distM) * force;
        }

        // Dampen velocity
        p.vx *= DAMPEN;
        p.vy *= DAMPEN;

        // Prevent stalling — gentle random nudge when almost stopped
        const speedSq = p.vx * p.vx + p.vy * p.vy;
        if (speedSq < p.baseSpeed * p.baseSpeed * 0.25) {
          p.vx += (Math.random() - 0.5) * 0.025;
          p.vy += (Math.random() - 0.5) * 0.025;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap at canvas edges (5px bleed to avoid pop-in)
        if      (p.x < -5)        p.x = width  + 5;
        else if (p.x > width  + 5) p.x = -5;
        if      (p.y < -5)        p.y = height + 5;
        else if (p.y > height + 5) p.y = -5;
      }

      // ── Draw particles (shared glow state, one pass) ─────────────────
      cx.shadowBlur  = 7;
      cx.shadowColor = "rgba(255, 255, 255, 0.75)";
      for (const p of particles) {
        cx.beginPath();
        cx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        cx.fillStyle = `rgba(255,255,255,${p.opacity.toFixed(2)})`;
        cx.fill();
      }
      cx.shadowBlur = 0;

      // ── Draw connections ──────────────────────────────────────────────
      for (let i = 0; i < particles.length; i++) {
        const a = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const b = particles[j];
          // Quick AABB rejection before computing full distance
          const dx = a.x - b.x;
          if (dx > CONNECT_DIST || dx < -CONNECT_DIST) continue;
          const dy = a.y - b.y;
          if (dy > CONNECT_DIST || dy < -CONNECT_DIST) continue;
          const distSq = dx * dx + dy * dy;
          if (distSq > CONNECT_DIST_SQ) continue;

          const alpha = (1 - Math.sqrt(distSq) / CONNECT_DIST) * 0.18;
          cx.beginPath();
          cx.moveTo(a.x, a.y);
          cx.lineTo(b.x, b.y);
          cx.strokeStyle = `rgba(255,255,255,${alpha.toFixed(3)})`;
          cx.lineWidth   = 0.55;
          cx.stroke();
        }
      }

      frameId = requestAnimationFrame(draw);
    }

    init();
    frameId = requestAnimationFrame(draw);

    // ── Mouse tracking (canvas-local coordinates) ──────────────────────
    function onMouseMove(e: MouseEvent) {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      // Only activate gravity when cursor is actually over the hero
      mouseRef.current =
        x >= 0 && x <= rect.width && y >= 0 && y <= rect.height
          ? { x, y }
          : { x: OFF_SCREEN, y: OFF_SCREEN };
    }

    // ── Responsive resize ─────────────────────────────────────────────
    function onResize() {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        // Clamp any out-of-bounds particles after a shrink, then adjust count
        for (const p of particles) {
          if (p.x > width)  p.x = Math.random() * width;
          if (p.y > height) p.y = Math.random() * height;
        }
        syncParticleCount();
      }, 120);
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("resize",    onResize,    { passive: true });

    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(resizeTimer);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize",    onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        // Sits above the noise texture (::before, z-index 1) but below
        // the globe canvas and UI panels (z-index 2+).
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
