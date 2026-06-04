"use client";

import { useState } from "react";
import Image from "next/image";
import {
  ArrowRight,
  Calendar,
  Phone,
  Compass,
  BookOpen,
  FileText,
  Plane,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import DestinationSpotlightCard from "@/components/DestinationSpotlightCard";
import { cms, StudyAbroadCMSData, DestinationsCMSData } from "@/utils/cmsData";
import { useEffect, useMemo } from "react";

export default function StudyAbroadPage() {
  const [studyAbroadCMS, setStudyAbroadCMS] = useState<StudyAbroadCMSData | null>(null);
  const [destinationsCMS, setDestinationsCMS] = useState<DestinationsCMSData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void Promise.all([cms.getStudyAbroadData(), cms.getDestinationsData()])
      .then(([study, destinations]) => {
        setStudyAbroadCMS(study);
        setDestinationsCMS(destinations);
      })
      .finally(() => setLoading(false));
  }, []);

  const spotlightDestinations = useMemo(() => {
    if (!destinationsCMS?.items?.length) return [];
    const ids = studyAbroadCMS?.featuredDestinationIds ?? [3, 2, 4, 5, 1];
    const picked = ids
      .map((id) => destinationsCMS.items.find((d) => d.id === id))
      .filter(Boolean) as typeof destinationsCMS.items;
    return picked.length > 0 ? picked : destinationsCMS.items.slice(0, 5);
  }, [destinationsCMS, studyAbroadCMS]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activePage="Study Abroad" />

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-white overflow-hidden">
          <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center px-4 py-2 bg-primary-light text-primary font-title text-xs font-bold rounded-full mb-6">
                <span>Your Journey to Excellence</span>
              </div>
              <h1 className="font-title text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                {studyAbroadCMS?.heroTitle || "Your Gateway to Global Education"}
              </h1>
              <p className="text-slate-600 text-base md:text-lg mb-8 leading-relaxed max-w-xl">
                {studyAbroadCMS?.heroSubtitle || "Unlock a world of possibilities with V Five Education Consultancy. We provide expert guidance to help you navigate the journey of studying in the world's most prestigious academic destinations."}
              </p>
              
              <a href="/destinations" className="inline-flex items-center gap-2 font-title font-bold text-white bg-primary hover:bg-primary-hover px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
                <span>Explore Destinations</span>
                <ArrowRight size={18} />
              </a>
            </div>

            {/* Hero Right Card */}
            <div className="lg:col-span-5 w-full max-w-lg mx-auto">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border-4 border-white">
                <Image
                  src={studyAbroadCMS?.heroImageUrl || "/study_abroad_hero.png"}
                  alt="Students walking on university campus"
                  fill
                  priority
                  sizes="(max-width: 991px) 100vw, 480px"
                  className="object-cover"
                />
                <div className="absolute bottom-6 left-6 right-6 bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 flex items-center justify-between">
                  <div className="flex flex-col">
                    <h4 className="font-title text-sm font-bold text-slate-900">Fall 2024 Intakes</h4>
                    <p className="text-xs text-slate-500">Applications now open for UK & Japan</p>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-primary-light text-primary flex items-center justify-center">
                    <Calendar size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Scholarship Banner Section */}
        <section className="py-10 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="bg-gradient-to-r from-primary to-primary-hover text-white rounded-3xl p-8 md:p-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 shadow-md">
              <div>
                <span className="inline-block bg-white/10 px-3.5 py-1.5 rounded-full text-accent font-title text-xs font-bold uppercase tracking-wider mb-4">{studyAbroadCMS?.scholarshipBadge || "Merit-Based Scholarships"}</span>
                <h2 className="font-title text-2xl md:text-3xl font-extrabold mb-3">{studyAbroadCMS?.scholarshipTitle || "Up to 100% Tuition Waiver"}</h2>
                <p className="text-white/80 text-sm max-w-xl leading-relaxed">
                  {studyAbroadCMS?.scholarshipDesc || "Comprehensive Admissions and Financial Aid support for meritorious students looking to study in top global universities."}
                </p>
              </div>
              <div className="flex flex-col gap-2 items-start md:items-end w-full md:w-auto flex-shrink-0">
                <button type="button" className="bg-accent hover:bg-accent-hover text-slate-900 font-title font-bold text-sm px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all">{studyAbroadCMS?.scholarshipButtonText || "Check Your Eligibility"}</button>
                <span className="text-[10px] text-white/60 tracking-wide font-medium">Limited seats for 2024-25 session</span>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Destinations Grid Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div className="flex flex-col items-start">
                <h2 className="font-title text-3xl font-extrabold text-slate-900 mb-2">{studyAbroadCMS?.popularDestTitle || "Popular Destinations"}</h2>
                <p className="text-slate-500 text-sm leading-relaxed max-w-md">{studyAbroadCMS?.popularDestSubtitle || "Choose from the top education hubs worldwide with tailored support for each region."}</p>
              </div>
              <a href="/destinations" className="inline-flex items-center gap-2 font-title font-bold text-primary border border-primary/20 bg-white hover:bg-slate-100 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200">
                <span>View All Destinations</span>
                <ArrowRight size={14} />
              </a>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3, 4, 5].map((n) => (
                  <div key={n} className="aspect-[4/3] rounded-2xl bg-slate-200 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {spotlightDestinations.map((dest, index) => (
                  <DestinationSpotlightCard
                    key={dest.id}
                    name={dest.name}
                    flag={dest.flag || "🌐"}
                    tagline={dest.tagline}
                    badge={dest.badge}
                    imageUrl={dest.imageUrl}
                    showBadge={Boolean(dest.badge)}
                    priority={index === 0}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Four-Step Journey Process Section */}
        <section className="py-20 md:py-28 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
              <span className="font-title text-xs font-bold text-primary bg-primary-light px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-4">{studyAbroadCMS?.journeyBadge || "How It Works"}</span>
              <h2 className="font-title text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">
                {studyAbroadCMS?.journeyTitle || studyAbroadCMS?.sectionTitle || "Your Four-Step Journey to Global Success"}
              </h2>
              <p className="text-base text-slate-500 leading-relaxed">
                {studyAbroadCMS?.journeyDesc || studyAbroadCMS?.sectionDesc || "We've streamlined the application process to ensure a stress-free experience from your first consultation to your first day of class."}
              </p>
            </div>

            <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Horizontal Line for Desktop */}
              <div className="hidden md:block absolute top-10 left-[12%] right-[12%] h-0.5 bg-slate-200 z-0"></div>

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-primary flex items-center justify-center shadow-sm mb-6 hover:scale-105 transition-all">
                  <Compass size={22} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col items-center flex-grow">
                  <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Counselling</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Personalized sessions to map your career goals, interests, and budget.</p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-primary flex items-center justify-center shadow-sm mb-6 hover:scale-105 transition-all">
                  <BookOpen size={22} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col items-center flex-grow">
                  <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Admission</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Expert guidance on application forms, SOPs, and document preparation.</p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-primary flex items-center justify-center shadow-sm mb-6 hover:scale-105 transition-all">
                  <FileText size={22} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col items-center flex-grow">
                  <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Visa</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Dedicated visa specialists to help with documentation and mock interviews.</p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 text-primary flex items-center justify-center shadow-sm mb-6 hover:scale-105 transition-all">
                  <Plane size={22} />
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200/50 shadow-[0_4px_20px_rgba(0,0,0,0.01)] flex flex-col items-center flex-grow">
                  <h3 className="font-title text-lg font-bold text-slate-900 mb-2">Departure</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Pre-departure briefings and post-landing support in your destination city.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ready to take the first step CTA */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="bg-primary text-white rounded-3xl p-8 md:p-12 lg:p-16 flex flex-col items-center text-center gap-6 shadow-xl">
              <h2 className="font-title text-3xl md:text-4xl font-extrabold">Ready to take the first step?</h2>
              <p className="text-white/80 text-sm md:text-base leading-relaxed max-w-2xl">
                Join thousands of successful students worldwide. We offer transparent processing with no hidden service charges until you get your visa!
              </p>
              <div className="flex flex-wrap justify-center gap-4 mt-2">
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 font-title font-bold text-slate-900 bg-accent hover:bg-accent-hover px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <Calendar size={18} />
                  <span>Book Free Counselling</span>
                </a>
                <a
                  href="/contact"
                  className="inline-flex items-center gap-2 font-title font-bold text-white border-2 border-white hover:bg-white/10 px-6 py-3.5 rounded-xl transition-all duration-200"
                >
                  <Phone size={16} />
                  <span>Talk to Expert</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter showDestinations />
    </div>
  );
}
