"use client";

import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activePage="Contact Us" />

      <section className="relative bg-primary py-20 text-white text-center">
        <div className="max-w-3xl mx-auto px-6">
          <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-accent font-title text-xs font-bold uppercase tracking-wider mb-4">
            Get in Touch
          </span>
          <h1 className="font-title text-3xl md:text-5xl font-black mb-4">Contact V Five Education</h1>
          <p className="text-white/80 text-base md:text-lg leading-relaxed">
            Reach our counselors for course guidance, study abroad planning, and visa support.
          </p>
        </div>
      </section>

      <ContactSection />
      <SiteFooter />
    </div>
  );
}
