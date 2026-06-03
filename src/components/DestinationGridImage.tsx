"use client";

import { useState } from "react";
import Image from "next/image";
import { isDestinationPhotoUrl } from "@/utils/destinationImage";

type Props = {
  src: string;
  alt: string;
  flag: string;
  badge?: string | null;
};

function FlagFallback({ flag }: { flag: string }) {
  return (
    <div className="relative aspect-[16/10] flex items-center justify-center bg-gradient-to-br from-primary via-[#024d3d] to-[#023a2f] text-white">
      <span className="text-6xl drop-shadow-md">{flag}</span>
    </div>
  );
}

export default function DestinationGridImage({ src, alt, flag, badge }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  const url = src?.trim() || "";
  const showPhoto = isDestinationPhotoUrl(url) && !imageFailed;

  if (!showPhoto) {
    return <FlagFallback flag={flag} />;
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
      {badge && (
        <span className="absolute top-4 left-4 z-10 font-title text-[9px] font-bold uppercase tracking-wider text-white bg-accent px-3 py-1 rounded-full shadow-sm">
          {badge}
        </span>
      )}
      <Image
        src={url}
        alt={alt}
        fill
        sizes="(max-width: 576px) 100vw, (max-width: 991px) 50vw, 33vw"
        className="object-cover object-center min-h-full min-w-full"
        onError={() => setImageFailed(true)}
      />
    </div>
  );
}
