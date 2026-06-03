"use client";

import { useRef, useState } from "react";
import { Upload, Loader2, AlertCircle } from "lucide-react";
import { apiUploadImage } from "@/lib/api";

type ImageUploadFieldProps = {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  placeholder?: string;
  compact?: boolean;
};

export default function ImageUploadField({
  label,
  value,
  onChange,
  folder = "cms",
  placeholder = "/classroom_bg.png",
  compact = false,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const previewSrc = value || placeholder;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError("");
    setUploading(true);
    try {
      const result = await apiUploadImage(file, folder);
      onChange(result.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={`flex flex-col gap-2 ${compact ? "" : "pb-2"}`}>
      <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>

      <div className={`flex ${compact ? "flex-col gap-2" : "flex-col sm:flex-row gap-4"} items-start`}>
        <div
          className={`relative overflow-hidden rounded-xl border border-gray-200 bg-gray-100 flex-shrink-0 ${
            compact ? "w-full h-28" : "w-full sm:w-40 h-28 sm:h-32"
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewSrc}
            alt={label}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = placeholder;
            }}
          />
        </div>

        <div className="flex-grow w-full flex flex-col gap-2">
          <div className="flex flex-wrap gap-2">
            <input
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 bg-primary hover:bg-primary-hover disabled:opacity-60 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
            >
              {uploading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Upload size={14} />
              )}
              <span>{uploading ? "Uploading…" : "Upload to Cloudinary"}</span>
            </button>
          </div>

          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 outline-none focus:border-primary transition-colors w-full"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
          <p className="text-[10px] text-gray-400">
            Upload to Cloudinary, then click Save All Changes to store the URL in the database.
          </p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-xs">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
