"use client";

import { useState } from "react";
import Image from "next/image";
import { isDestinationPhotoUrl } from "@/utils/destinationImage";

type Props = {
  name: string;
  flag: string;
  tagline: string;
  badge?: string;
  imageUrl?: string;
  showBadge?: boolean;
  priority?: boolean;
};

function FlagFallback({ flag }: { flag: string }) {
  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-primary via-[#123a75] to-primary-hover flex items-center justify-center">
      <span className="text-7xl drop-shadow-lg">{flag}</span>
    </div>
  );
}

export default function DestinationSpotlightCard({
  name,
  flag,
  tagline,
  badge,
  imageUrl,
  showBadge = false,
  priority = false,
}: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  const url = imageUrl?.trim() || "";
  const showPhoto = isDestinationPhotoUrl(url) && !imageFailed;

  return (
    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group">
      {showPhoto ? (
        <div className="absolute inset-0 z-0 overflow-hidden bg-slate-900">
          <Image
            src={url}
            alt={name}
            fill
            priority={priority}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover object-center min-h-full min-w-full"
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : (
        <FlagFallback flag={flag} />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/60 to-slate-900/20 p-6 flex flex-col justify-end text-white z-10">
        {showBadge && badge && (
          <span className="inline-block bg-black/40 backdrop-blur-sm px-2.5 py-1 rounded-full text-accent font-title text-[9px] font-bold uppercase tracking-wider mb-2 self-start">
            {badge}
          </span>
        )}
        <h3 className="font-title text-xl font-bold mb-1 text-white drop-shadow-md">
          <span className="mr-1">{flag}</span>
          {name}
        </h3>
        <p className="text-xs text-white/90 line-clamp-2 drop-shadow-sm">{tagline}</p>
      </div>
    </div>
  );
}
