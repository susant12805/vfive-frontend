"use client";

import Image from "next/image";
import { 
  Award, 
  Target, 
  ShieldCheck,
  CheckCircle2,
  PhoneCall
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { cms, AboutUsCMSData } from "@/utils/cmsData";
import { useEffect, useState } from "react";

export default function AboutPage() {
  const [aboutCMS, setAboutCMS] = useState<AboutUsCMSData | null>(null);

  useEffect(() => {
    void cms.getAboutData().then(setAboutCMS);
  }, []);

  const storyImage = aboutCMS?.storyImageUrl || aboutCMS?.heroImageUrl || "/student_hero.png";

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activePage="About Us" />

      {/* Hero Banner */}
      <section className="relative bg-primary py-24 text-white overflow-hidden flex items-center justify-center text-center">
        <div className="absolute inset-0 bg-primary/90 z-10" />
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40" 
          style={{ backgroundImage: `url(${aboutCMS?.heroImageUrl || '/classroom_bg.png'})` }} 
        />
        <div className="max-w-4xl mx-auto px-6 relative z-20">
          <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-accent font-title text-xs font-bold uppercase tracking-wider mb-4">
            {aboutCMS?.heroBadge}
          </span>
          <h1 className="font-title text-4xl md:text-6xl font-black mb-6 leading-tight">
            {aboutCMS?.heroTitle}
          </h1>
          <p className="text-white/80 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-sans">
            {aboutCMS?.heroSubtitle}
          </p>
        </div>
      </section>

      {/* Our Story & Who We Are */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 flex flex-col items-start text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-primary-light text-primary font-title text-xs font-extrabold rounded-full uppercase tracking-wider mb-6">
              {aboutCMS?.storyBadge}
            </div>
            <h2 className="font-title text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">
              {aboutCMS?.storyTitle}
            </h2>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-6 font-sans">
              {aboutCMS?.storyParagraph1}
            </p>
            <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-8 font-sans">
              {aboutCMS?.storyParagraph2}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              {(aboutCMS?.storyHighlights ?? []).map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <CheckCircle2 className="text-primary flex-shrink-0" size={20} />
                  <span className="text-sm font-bold text-slate-700 font-sans">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative w-full aspect-[4/3] md:aspect-video lg:aspect-square rounded-3xl overflow-hidden shadow-2xl">
            <Image
              src={storyImage}
              alt="V Five Students Studying"
              fill
              className="object-cover"
              sizes="(max-width: 991px) 100vw, 450px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white z-10">
              <div className="font-title text-2xl font-black mb-1">{aboutCMS?.storyOverlayValue}</div>
              <div className="text-xs text-white/90 uppercase tracking-widest font-bold">{aboutCMS?.storyOverlayLabel}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="py-12 bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {(aboutCMS?.stats ?? []).map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="font-title text-3xl md:text-5xl font-black text-accent mb-2">{stat.value}</span>
              <span className="text-xs md:text-sm font-bold uppercase tracking-wider text-white/80 font-sans">{stat.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Vision, Mission, & Core Values */}
      <section className="py-20 bg-slate-50">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-title text-xs font-bold text-primary bg-primary-light px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
              {aboutCMS?.foundationsBadge}
            </span>
            <h2 className="font-title text-3xl md:text-4xl font-extrabold text-slate-900">
              {aboutCMS?.foundationsTitle}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-6">
                <Target size={24} />
              </div>
              <h3 className="font-title text-xl font-bold text-slate-900 mb-4">Our Mission</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-sans">{aboutCMS?.mission}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-accent-light text-accent-dark flex items-center justify-center mb-6">
                <Award size={24} />
              </div>
              <h3 className="font-title text-xl font-bold text-slate-900 mb-4">Our Vision</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-sans">{aboutCMS?.vision}</p>
            </div>

            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center mb-6">
                <ShieldCheck size={24} />
              </div>
              <h3 className="font-title text-xl font-bold text-slate-900 mb-4">Core Integrity</h3>
              <p className="text-slate-600 text-sm leading-relaxed font-sans whitespace-pre-wrap">{aboutCMS?.values}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="font-title text-xs font-bold text-primary bg-primary-light px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">
              {aboutCMS?.teamBadge}
            </span>
            <h2 className="font-title text-3xl md:text-4xl font-extrabold text-slate-900">
              {aboutCMS?.teamTitle}
            </h2>
            <p className="text-slate-500 text-sm md:text-base mt-4 font-sans">
              {aboutCMS?.teamSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {(aboutCMS?.teamMembers ?? []).map((member) => (
              <div key={member.id} className="flex flex-col items-center text-center group">
                <div className="relative w-48 h-48 rounded-full overflow-hidden mb-6 shadow-md border-4 border-slate-50 group-hover:border-primary transition-all">
                  <Image
                    src={member.imageUrl || "/student_hero.png"}
                    alt={member.name}
                    fill
                    className="object-cover scale-110 group-hover:scale-100 transition-transform duration-300"
                  />
                </div>
                <h4 className="font-title text-lg font-bold text-slate-900 mb-1">{member.name}</h4>
                <span className="text-xs text-primary font-bold uppercase tracking-wider mb-2">{member.role}</span>
                <p className="text-xs text-slate-500 max-w-[200px] leading-relaxed font-sans">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20 bg-slate-50 border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-6 md:px-8">
          <div className="bg-primary rounded-3xl p-8 md:p-12 lg:p-16 text-white grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden shadow-xl">
            <div className="absolute inset-0 bg-primary/95 z-10" />
            <div 
              className="absolute inset-0 bg-cover bg-center opacity-10" 
              style={{ backgroundImage: `url('${aboutCMS?.ctaImageUrl || '/classroom_bg.png'}')` }} 
            />
            <div className="lg:col-span-8 flex flex-col items-start relative z-10 text-left">
              <span className="bg-white/10 px-3.5 py-1 text-accent font-title text-xs font-bold rounded-full uppercase tracking-wider mb-4">
                {aboutCMS?.ctaBadge}
              </span>
              <h3 className="font-title text-2xl md:text-4xl font-extrabold mb-4 leading-tight">
                {aboutCMS?.ctaTitle}
              </h3>
              <p className="text-white/80 text-sm md:text-base max-w-xl font-sans">
                {aboutCMS?.ctaDesc}
              </p>
            </div>
            <div className="lg:col-span-4 flex justify-start lg:justify-end w-full relative z-10">
              <a 
                href="/contact" 
                className="inline-flex items-center gap-3 bg-accent hover:bg-accent-hover text-slate-900 font-title font-bold text-sm px-8 py-4 rounded-xl shadow-md transition-all uppercase tracking-wider"
              >
                <PhoneCall size={18} />
                <span>{aboutCMS?.ctaButtonText}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
