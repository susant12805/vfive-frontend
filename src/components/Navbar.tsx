"use client";

import { useState, useEffect } from "react";
import { Menu, X, Phone } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";
import { cms, ContactCMSData } from "@/utils/cmsData";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Destinations", href: "/destinations" },
  { label: "Study Abroad", href: "/study-abroad" },
  { label: "About Us", href: "/about" },
  { label: "Contact Us", href: "/contact" },
];

const WHATSAPP_DISPLAY = "+977 985-7012827";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/V5edu",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.988H7.898v-2.89h2.54V9.797c0-2.507 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12Z" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    href: `https://wa.me/${WHATSAPP_DISPLAY.replace(/[^0-9]/g, "")}`,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.296-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347Zm-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884Zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
      </svg>
    ),
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@v.fiveeducationconsultan",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="h-3.5 w-3.5" aria-hidden="true">
        <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104Z" />
      </svg>
    ),
  },
];

export default function Navbar({ activePage }: { activePage?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactCMS, setContactCMS] = useState<ContactCMSData | null>(null);

  useEffect(() => {
    void cms.getContactData().then(setContactCMS).catch(() => null);
  }, []);

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

  const phone = contactCMS?.phone ?? WHATSAPP_DISPLAY;

  return (
    <>
      {/* Top rows scroll away with the page */}
      <div className="relative z-40 w-full bg-white shadow-sm">
        <div className="w-full border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-end h-9">
            <div className="flex items-center gap-1.5">
              {SOCIAL_LINKS.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  title={label}
                  className="flex h-7 w-7 items-center justify-center bg-primary text-white hover:bg-primary-hover transition-colors"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full border-b border-slate-100">
          <div className="mx-auto max-w-7xl px-4 md:px-8 py-3 md:py-4">
            <div className="flex items-center justify-between gap-4">
              <a href="/" className="flex-shrink-0 group transition-transform group-hover:scale-[1.02]">
                <SiteLogo size="lg" />
              </a>

              <p className="hidden xl:block font-title text-sm font-extrabold text-primary uppercase tracking-wide text-center max-w-xs leading-snug">
                Explore Your World of Opportunity
              </p>

              <div className="hidden lg:flex items-center gap-6 flex-1 justify-end">
                <div className="flex items-start gap-2 text-xs text-slate-600">
                  <Phone size={16} className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="leading-snug font-semibold text-slate-800">{phone}</span>
                </div>
                <a
                  href="/contact"
                  className="flex-shrink-0 font-title font-bold text-white text-xs uppercase tracking-wider bg-accent hover:bg-accent-hover px-5 py-3 rounded-md shadow-sm transition-colors whitespace-nowrap"
                >
                  Book Appointment
                </a>
              </div>

              <button
                type="button"
                className="lg:hidden p-2 text-slate-700 hover:text-primary transition-all"
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Toggle navigation menu"
                aria-expanded={mobileMenuOpen}
              >
                <Menu size={26} />
              </button>
            </div>

            <div className="lg:hidden mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-slate-600 border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Phone size={13} className="text-primary" />
                {phone.split("/")[0]?.trim() ?? phone}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Blue nav sticks to top while scrolling */}
      <nav className="hidden lg:block sticky top-0 z-50 w-full bg-primary shadow-md">
        <div className="mx-auto max-w-7xl px-4 md:px-8">
          <ul className="flex items-center justify-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = activePage === label;
              return (
                <li key={label}>
                  <a
                    href={href}
                    className={`block font-title text-xs font-bold uppercase tracking-wider px-4 py-3.5 transition-colors ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "text-white/90 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile menu bar sticks */}
      <div className="lg:hidden sticky top-0 z-50 w-full bg-primary px-4 py-2.5 flex items-center justify-between shadow-md">
        <span className="font-title text-xs font-bold uppercase tracking-wider text-white">
          {activePage ?? "Menu"}
        </span>
        <button
          type="button"
          className="p-1.5 text-white"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>
      </div>

      {mobileMenuOpen && (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-slate-900/40 lg:hidden"
          aria-label="Close menu"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div
        className={`fixed inset-y-0 right-0 z-[60] w-full max-w-xs bg-white p-6 shadow-2xl border-l border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between mb-6">
          <a href="/" onClick={() => setMobileMenuOpen(false)}>
            <SiteLogo size="sm" />
          </a>
          <button type="button" onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        <ul className="flex flex-col gap-1 flex-1">
          {NAV_LINKS.map(({ label, href }) => {
            const isActive = activePage === label;
            return (
              <li key={label}>
                <a
                  href={href}
                  className={`block font-title text-sm uppercase tracking-wide px-3 py-3 rounded-lg ${
                    isActive
                      ? "font-bold text-white bg-primary"
                      : "font-medium text-slate-600 hover:bg-primary-light hover:text-primary"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
          {SOCIAL_LINKS.map(({ label, href, icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="flex h-9 w-9 items-center justify-center bg-primary text-white rounded-md hover:bg-primary-hover"
            >
              {icon}
            </a>
          ))}
        </div>

        <a
          href="/contact"
          className="font-title font-bold text-white bg-accent hover:bg-accent-hover py-3 rounded-lg shadow-sm text-center mt-4 text-sm uppercase tracking-wide"
          onClick={() => setMobileMenuOpen(false)}
        >
          Book Appointment
        </a>
      </div>
    </>
  );
}
