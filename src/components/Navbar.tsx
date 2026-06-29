"use client";

import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Destinations", href: "/destinations" },
  { label: "Study Abroad", href: "/study-abroad" },
  { label: "About Us", href: "/about" },
];

const WHATSAPP_DISPLAY = "+977 985-7012827";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/V5edu",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12Z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/${WHATSAPP_DISPLAY.replace(/[^0-9]/g, "")}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884Zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@v.fiveeducationconsultan",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104Z" />
      </svg>
    ),
  },
];

export default function Navbar({ activePage }: { activePage?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  return (
    <>
      {/* Top utility bar — socials */}
      <div className="w-full bg-primary text-white">
        <div className="mx-auto max-w-7xl px-6 md:px-8 flex items-center justify-between gap-4 h-10 text-xs">
          <span className="hidden sm:inline font-title font-medium tracking-wide text-white/90">
            Your trusted partner for global education
          </span>
          <div className="flex items-center gap-3 ml-auto">
            <span className="hidden sm:inline text-white/70">Follow us</span>
            {SOCIAL_LINKS.map(({ label, href, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                title={label}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 transition-colors"
              >
                {icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 md:px-8 flex items-center justify-between h-20">
          <a href="/" className="group transition-transform group-hover:scale-[1.02]">
            <SiteLogo size="md" />
          </a>

          {/* Desktop nav (large screens) */}
          <nav className="hidden lg:block">
            <ul className="flex items-center gap-8">
              {NAV_LINKS.map(({ label, href }) => {
                const isActive = activePage === label;
                return (
                  <li key={label}>
                    <a
                      href={href}
                      className={
                        isActive
                          ? "font-title font-bold text-primary border-b-2 border-primary pb-1"
                          : "font-title font-medium text-slate-600 hover:text-primary transition-all duration-200"
                      }
                    >
                      {label}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop CTA — large screens only (avoids duplicate with mobile drawer) */}
          <div className="hidden lg:flex items-center">
            <a
              href="/contact"
              className={`font-title font-bold text-white bg-primary hover:bg-primary-hover px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200 ${
                activePage === "Contact Us" ? "ring-2 ring-primary ring-offset-2" : ""
              }`}
            >
              Contact Now
            </a>
          </div>

          {/* Mobile / tablet menu toggle */}
          <button
            type="button"
            className="lg:hidden p-2 text-slate-700 hover:text-primary transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Backdrop */}
      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile drawer — one contact action: Contact Now button only */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-6 shadow-2xl border-l border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <a href="/" onClick={() => setMobileMenuOpen(false)}>
            <SiteLogo size="sm" />
          </a>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        <ul className="flex flex-col gap-5 flex-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = activePage === label;
            return (
              <li key={label}>
                <a
                  href={href}
                  className={`block font-title text-lg ${
                    isActive
                      ? "font-bold text-primary"
                      : "font-medium text-slate-600 hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <a
          href="/contact"
          className="font-title font-bold text-white bg-primary py-3 rounded-xl hover:bg-primary-hover shadow-sm text-center mt-6"
          onClick={() => setMobileMenuOpen(false)}
        >
          Contact Now
        </a>
      </div>
    </>
  );
}
