"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Star,
  ArrowRight,
  ExternalLink,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import ContactSection from "@/components/ContactSection";
import SiteFooter from "@/components/SiteFooter";
import { ServiceIcon } from "@/utils/serviceIcons";
import { cms, HomeCMSData, CoursesCMSData } from "@/utils/cmsData";
import { useEffect } from "react";

export default function Home() {
  const [homeCMS, setHomeCMS] = useState<HomeCMSData | null>(null);
  const [coursesCMS, setCoursesCMS] = useState<CoursesCMSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const loadContent = () => {
    setLoading(true);
    setLoadError(false);
    return Promise.all([cms.getHomeData(), cms.getCoursesData()])
      .then(([home, courses]) => {
        setHomeCMS(home);
        setCoursesCMS(courses);
        setLoadError(false);
      })
      .catch(() => setLoadError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    void loadContent();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar activePage="Home" />
        <main className="flex items-center justify-center py-32">
          <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (loadError || !homeCMS || !coursesCMS) {
    return (
      <div className="min-h-screen bg-white">
        <Navbar activePage="Home" />
        <main className="flex flex-col items-center justify-center gap-4 py-32 px-6 text-center">
          <p className="text-slate-600 text-sm">
            Could not load page content. The API may be waking up (free tier) — wait a moment and try again.
          </p>
          <button
            type="button"
            onClick={() => void loadContent()}
            className="font-title font-bold text-white bg-primary hover:bg-primary-hover px-5 py-2.5 rounded-xl text-sm"
          >
            Retry
          </button>
        </main>
      </div>
    );
  }

  const featuredCourses = homeCMS.featuredCourseIds
    .map((id) => coursesCMS.items.find((item) => item.id === id))
    .filter(Boolean)
    .filter((course, index, list) => list.findIndex((c) => c!.id === course!.id) === index) as typeof coursesCMS.items;
  const coursesToShow = featuredCourses.length > 0 ? featuredCourses : coursesCMS.items.slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <Navbar activePage="Home" />

      <main>
        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-white">
          <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Hero Left Content */}
            <div className="lg:col-span-7 flex flex-col items-start text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light text-primary font-title text-xs font-extrabold rounded-full uppercase tracking-wider mb-6">
                <Check size={14} strokeWidth={3} />
                <span>{homeCMS.heroBadge}</span>
              </div>
              <h1 className="font-title text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                {homeCMS.heroTitle}
              </h1>
              <p className="text-slate-600 text-base md:text-lg mb-8 max-w-xl leading-relaxed">
                {homeCMS.heroSubtitle}
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <a href="/courses" className="inline-flex items-center gap-2 font-title font-bold text-white bg-primary hover:bg-primary-hover px-6 py-3.5 rounded-xl shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                  <span>Explore Courses</span>
                  <ArrowRight size={18} />
                </a>
                <a
                  href="/contact"
                  className="font-title font-bold text-primary border-2 border-primary hover:bg-primary-light px-6 py-3.5 rounded-xl transition-all duration-200 inline-block"
                >
                  Book Free Consultation
                </a>
              </div>
            </div>

            {/* Hero Right Graphic */}
            <div className="lg:col-span-5 w-full max-w-lg mx-auto relative">
              <div className="relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border-4 border-white">
                <Image
                  src={homeCMS.heroImageUrl}
                  alt="V Five Education Student"
                  fill
                  priority
                  sizes="(max-width: 991px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Who We Are Section */}
        <section id="about" className="py-20 md:py-28 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            {/* Metric Cards Left */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
              <div className="bg-white border border-slate-100 p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                <div className="font-title text-4xl font-extrabold text-primary mb-2">{homeCMS.stat1Value}</div>
                <div className="font-title text-lg font-bold text-slate-800 mb-3">{homeCMS.stat1Title}</div>
                <div className="text-sm text-slate-500 leading-relaxed">
                  {homeCMS.stat1Desc}
                </div>
              </div>
              
              <div className="bg-primary text-white p-8 rounded-2xl shadow-md">
                <div className="font-title text-4xl font-extrabold text-accent mb-2">{homeCMS.stat2Value}</div>
                <div className="font-title text-lg font-bold mb-3">{homeCMS.stat2Title}</div>
                <div className="text-sm text-white/80 leading-relaxed">
                  {homeCMS.stat2Desc}
                </div>
              </div>
            </div>

            {/* Who We Are Content Right */}
            <div className="flex flex-col items-start">
              <div className="font-title text-xs font-bold text-primary bg-primary-light px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-4">{homeCMS.whoWeAreBadge}</div>
              <h2 className="font-title text-3xl md:text-4xl font-extrabold text-slate-900 mb-6 leading-tight">{homeCMS.whoWeAreTitle}</h2>
              <p className="text-base text-slate-600 mb-6 leading-relaxed">
                {homeCMS.whoWeAreParagraph1}
              </p>
              <p className="text-base text-slate-600 mb-6 leading-relaxed">
                {homeCMS.whoWeAreParagraph2}
              </p>
              <a href="/contact" className="inline-flex items-center gap-2 font-title font-bold text-primary hover:text-primary-hover transition-colors">
                <span>{homeCMS.whoWeAreLinkText}</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>

        {/* Our Dedicated Services Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
              <div className="font-title text-xs font-bold text-primary bg-primary-light px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-4">{homeCMS.servicesBadge}</div>
              <h2 className="font-title text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{homeCMS.servicesTitle}</h2>
              <p className="text-base text-slate-500 leading-relaxed">
                {homeCMS.servicesSubtitle}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {homeCMS.services.map((service, idx) => (
                <div
                  key={idx}
                  className={`p-8 rounded-2xl hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between ${
                    service.featured
                      ? "bg-primary text-white hover:shadow-lg"
                      : "bg-slate-50 border border-slate-100/50"
                  }`}
                >
                  <div>
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${
                      service.featured ? "bg-white text-primary" : "bg-primary text-white"
                    }`}>
                      <ServiceIcon name={service.icon} size={24} />
                    </div>
                    <h3 className={`font-title text-xl font-bold mb-4 ${service.featured ? "" : "text-slate-950"}`}>{service.title}</h3>
                    <p className={`text-sm leading-relaxed mb-6 ${service.featured ? "text-white/80" : "text-slate-500"}`}>
                      {service.description}
                    </p>
                  </div>
                  <a href="/contact" className={`inline-flex items-center gap-1.5 text-xs font-bold font-title hover:underline ${
                    service.featured ? "text-accent" : "text-primary"
                  }`}>
                    <span>{service.linkText}</span>
                    <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Courses Section */}
        <section id="courses" className="py-20 md:py-28 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
              <div>
                <div className="font-title text-xs font-bold text-primary bg-primary-light px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-4 inline-block">{homeCMS.featuredBadge}</div>
                <h2 className="font-title text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">{homeCMS.featuredTitle}</h2>
                <p className="text-base text-slate-500 max-w-md">
                  {homeCMS.featuredSubtitle}
                </p>
              </div>
              <a href="/courses" className="inline-flex items-center gap-2 font-title font-bold text-primary border border-primary/20 bg-white hover:bg-slate-100 px-5 py-2.5 rounded-xl shadow-sm transition-all duration-200">
                <span>View All Courses</span>
                <ExternalLink size={14} />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {coursesToShow.map((course) => (
                  <div key={course.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                        {course.categoryTag && (
                          <span className="absolute top-4 left-4 z-10 font-title text-[10px] font-bold uppercase tracking-wider text-white bg-accent px-3 py-1 rounded-full">
                            {course.categoryTag}
                          </span>
                        )}
                        <Image
                          src={course.imageUrl || "/classroom_bg.png"}
                          alt={course.title}
                          fill
                          sizes="(max-width: 991px) 100vw, 360px"
                          className="object-cover"
                        />
                      </div>
                      <div className="p-6 pb-2">
                        <h3 className="font-title text-lg font-bold text-slate-950 mb-2">{course.title}</h3>
                        <p className="text-sm text-slate-500 leading-relaxed mb-4">
                          {course.description}
                        </p>
                      </div>
                    </div>
                    
                    <div className="p-6 pt-0">
                      <div className="flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Clock size={16} />
                          <span>{course.duration}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar size={16} />
                          <span>{course.batchInfo || "Batch Starts: Contact Us"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Student Success Stories Section */}
        <section className="py-20 md:py-28 bg-white">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center">
              <div className="font-title text-xs font-bold text-primary bg-primary-light px-3.5 py-1.5 rounded-full uppercase tracking-widest mb-4">{homeCMS.testimonialsBadge}</div>
              <h2 className="font-title text-3xl md:text-4xl font-extrabold text-slate-900 mb-4">{homeCMS.testimonialsTitle}</h2>
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={18} className="fill-accent text-accent" />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {homeCMS.testimonials.map((t) => (
                <div 
                  key={t.id} 
                  className={`p-8 rounded-2xl relative shadow-sm border transition-all duration-300 flex flex-col justify-between ${
                    t.featured 
                      ? "bg-primary text-white border-primary" 
                      : "bg-slate-50 text-slate-900 border-slate-100"
                  }`}
                >
                  <div>
                    <span 
                      className={`absolute top-4 right-6 text-7xl font-serif select-none pointer-events-none ${
                        t.featured ? "text-white/5" : "text-primary/5"
                      }`}
                    >
                      “
                    </span>
                    <p 
                      className={`text-sm md:text-base leading-relaxed mb-6 italic relative z-10 ${
                        t.featured ? "text-white/95" : "text-slate-600"
                      }`}
                    >
                      &quot;{t.text}&quot;
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-extrabold text-xs flex-shrink-0 ${
                        t.featured ? "bg-white/10 text-white" : "bg-primary/10 text-primary"
                      }`}
                    >
                      {t.initials || "ST"}
                    </div>
                    <div className="flex flex-col">
                      <h4 
                        className={`font-title text-sm font-bold ${
                          t.featured ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {t.name}
                      </h4>
                      <span 
                        className={`text-xs ${
                          t.featured ? "text-white/70" : "text-slate-400"
                        }`}
                      >
                        {t.location}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <ContactSection sectionId="contact" />
      </main>

      <SiteFooter />
    </div>
  );
}
