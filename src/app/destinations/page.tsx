"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Globe,
  ArrowRight,
  SlidersHorizontal,
  AlignJustify,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import DestinationGridImage from "@/components/DestinationGridImage";
import { cms, DestinationsCMSData } from "@/utils/cmsData";

function HighlightTagline({
  tagline,
  highlights,
}: {
  tagline: string;
  highlights: string[];
}) {
  let result = tagline;
  highlights.forEach((h) => {
    result = result.replace(h, `<span class="text-primary font-semibold">${h}</span>`);
  });
  return (
    <p
      className="text-sm text-slate-500 leading-relaxed mb-6"
      dangerouslySetInnerHTML={{ __html: result }}
    />
  );
}

type DestinationCard = {
  id: number;
  country: string;
  flag: string;
  tagline: string;
  highlights: string[];
  image: string;
  badge: string | null;
};

function mapDestinations(cmsData: DestinationsCMSData): DestinationCard[] {
  return cmsData.items.map((item) => ({
    id: item.id,
    country: item.name,
    flag: item.flag || "🌐",
    tagline: item.tagline,
    highlights: item.highlights || [],
    image: item.imageUrl || "",
    badge: item.badge || null,
    gradient: null,
  }));
}

export default function DestinationsPage() {
  const [destinationsCMS, setDestinationsCMS] = useState<DestinationsCMSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    void cms
      .getDestinationsData()
      .then((data) => {
        setDestinationsCMS(data);
        setLoadError(false);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar activePage="Destinations" />
        <main className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (loadError || !destinationsCMS) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar activePage="Destinations" />
        <main className="flex flex-col items-center justify-center gap-4 py-32 px-6 text-center">
          <p className="text-slate-600 text-sm">Could not load destinations. Make sure the backend is running.</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="font-title font-bold text-white bg-primary hover:bg-primary-hover px-5 py-2.5 rounded-xl text-sm"
          >
            Retry
          </button>
        </main>
      </div>
    );
  }

  const destinations = mapDestinations(destinationsCMS);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activePage="Destinations" />

      <main>
        {/* Hero — full-bleed background; center the artwork so it isn't cropped mid-frame */}
        <section className="relative bg-primary text-white overflow-hidden flex items-center justify-center text-center min-h-[650px] md:min-h-[660px] lg:min-h-[660px]">
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/study_abroad_hero.png"
              alt=""
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="absolute inset-0 z-10 bg-gradient-to-b from-primary/70 via-primary/65 to-primary/80" />
          <div className="max-w-3xl mx-auto px-6 py-8 md:py-10 relative z-20">
            <div className="bg-hero-glass backdrop-blur-md border border-white/20 rounded-3xl px-6 py-8 sm:px-10 md:px-12 md:py-10 shadow-2xl">
              {/* <span className="inline-flex items-center gap-2 bg-white/10 px-4 py-1.5 rounded-full text-white/80 font-title text-xs font-bold uppercase tracking-wider mb-4">
                <Globe size={12} />
                <span>{destinationsCMS.heroBadge}</span>
              </span> */}
              <h1 className="font-title text-4xl md:text-6xl font-black mb-6 leading-tight text-white">
                {destinationsCMS.title}
              </h1>
              <p className="text-white/90 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
                {destinationsCMS.subtitle}
              </p>
            </div>
          </div>
        </section>

        {/* Destinations Grid Section */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="flex flex-col items-start">
                <h2 className="font-title text-3xl font-extrabold text-slate-900 mb-2">
                  {destinationsCMS.gridSectionTitle}
                </h2>
                <p className="text-slate-500 text-sm md:text-base leading-relaxed">
                  {destinationsCMS.gridSectionSubtitle}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  className="w-10 h-10 border border-slate-200 bg-white rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-950 transition-all cursor-pointer"
                  aria-label="Filter view"
                >
                  <SlidersHorizontal size={16} />
                </button>
                <button
                  type="button"
                  className="w-10 h-10 border border-slate-200 bg-white rounded-xl flex items-center justify-center text-slate-500 hover:text-slate-950 transition-all cursor-pointer"
                  aria-label="List view"
                >
                  <AlignJustify size={16} />
                </button>
              </div>
            </div>

            {destinations.length === 0 ? (
              <p className="text-center text-slate-500 py-16">No destinations added yet. Add them in the admin panel.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {destinations.map((dest) => (
                  <div
                    key={dest.id}
                    className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
                  >
                    <DestinationGridImage
                      src={dest.image || ""}
                      alt={dest.country}
                      flag={dest.flag}
                      badge={dest.badge}
                    />

                    <div className="p-6 flex flex-col justify-between flex-grow">
                      <div>
                        <h3 className="font-title text-xl font-bold text-slate-900 mb-2">{dest.country}</h3>
                        <HighlightTagline tagline={dest.tagline} highlights={dest.highlights} />
                      </div>
                      <a
                        href="/contact"
                        className="inline-flex items-center gap-1 font-title font-bold text-primary hover:underline text-sm mt-auto"
                      >
                        <span>Learn More</span>
                        <ArrowRight size={14} />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-6">
            <h2 className="font-title text-3xl md:text-4xl font-extrabold text-slate-900 leading-tight">
              Ready to start your journey?
            </h2>
            <p className="text-slate-500 text-sm md:text-base leading-relaxed max-w-xl">
              Speak with our certified education consultants today and take the first step towards
              your international academic career.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a
                href="/contact"
                className="font-title font-bold text-primary border-2 border-primary hover:bg-primary-light px-6 py-3.5 rounded-xl transition-all duration-200 inline-block"
              >
                Book Free Consultation
              </a>
              <a
                href="/contact"
                className="font-title font-bold text-white bg-primary hover:bg-primary-hover px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 inline-block"
              >
                Talk to Expert
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
