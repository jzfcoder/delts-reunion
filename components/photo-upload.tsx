"use client";

import { useState, useRef } from "react";

export function PhotoUpload({
  currentUrl,
}: {
  currentUrl: string | null;
}) {
  const [preview, setPreview] = useState<string | null>(currentUrl);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setUploading(true);

    const body = new FormData();
    body.append("file", file);

    const res = await fetch("/api/upload-photo", { method: "POST", body });
    const data = await res.json();

    if (data.url) {
      setPreview(data.url);
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="text-sm font-medium">Profile Photo</p>
      <div className="flex items-center gap-4">
        <div
          onClick={() => inputRef.current?.click()}
          className="flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-white/10 bg-white/5 hover:border-purple-500 transition-colors"
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-2xl text-gray-500">+</span>
          )}
        </div>
        <div className="flex flex-col gap-1 text-sm text-gray-400">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="text-left text-purple-400 hover:text-purple-300"
          >
            {preview ? "Change photo" : "Upload a photo"}
          </button>
          {uploading && <span>Uploading...</span>}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
    </div>
  );
}
