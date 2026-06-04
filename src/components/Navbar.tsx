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
