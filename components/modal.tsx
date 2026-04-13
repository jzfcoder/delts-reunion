"use client";

import { useEffect, useRef } from "react";

export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const backdropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      ref={backdropRef}
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === backdropRef.current) onClose();
      }}
    >
      <div className="modal-content">
        {/* Mobile drag handle */}
        <div className="modal-drag-handle" style={{
          display: "none",
          width: 40,
          height: 4,
          background: "rgba(255,255,255,0.2)",
          margin: "0 auto 16px",
          borderRadius: 2,
          flexShrink: 0,
        }} />
        <button
          type="button"
          onClick={onClose}
          className="modal-close"
          aria-label="Close"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
