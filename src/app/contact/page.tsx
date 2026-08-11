"use client";

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activePage="Contact Us" />

      {/* Hero — full-bleed background; center the artwork so it isn't cropped mid-frame */}
      <section className="relative bg-primary text-white overflow-hidden flex items-center justify-center text-center min-h-[650px] md:min-h-[660px] lg:min-h-[660px]">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/student_writing.png"
            alt=""
            className="h-full w-full object-cover object-center"
          />
        </div>
        <div className="absolute inset-0 z-10 bg-gradient-to-b from-primary/70 via-primary/65 to-primary/80" />
        <div className="max-w-3xl mx-auto px-6 py-8 md:py-10 relative z-20">
          <div className="bg-hero-glass backdrop-blur-md border border-white/20 rounded-3xl px-6 py-8 sm:px-10 md:px-12 md:py-10 shadow-2xl">
            <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-white/80 font-title text-xs font-bold uppercase tracking-wider mb-4">
              Get in Touch
            </span>
            <h1 className="font-title text-4xl md:text-6xl font-black mb-6 leading-tight text-white">Contact V Five Education</h1>
            <p className="text-white/90 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
              Reach our counselors for course guidance, study abroad planning, and visa support.
            </p>
          </div>
        </div>
      </section>

      <ContactSection />
      <SiteFooter />
    </div>
  );
}
