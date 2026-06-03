"use client";

import { useState } from "react";
import { LogIn, Menu, X } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";

const NAV_LINKS = [
  { label: "Home",         href: "/" },
  { label: "Courses",      href: "/courses" },
  { label: "Destinations", href: "/destinations" },
  { label: "Study Abroad", href: "/study-abroad" },
  { label: "About Us",     href: "/about" },
  { label: "Contact Us",   href: "/contact" },
];

export default function Navbar({ activePage }: { activePage?: string }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-slate-100 bg-white/95 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-6 md:px-8 flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="group transition-transform group-hover:scale-[1.02]">
            <SiteLogo size="md" />
          </a>

          {/* Desktop Nav */}
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

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-4">
            <button className="flex items-center gap-2 font-title font-semibold text-slate-700 hover:text-primary px-4 py-2 rounded-lg transition-all duration-200">
              <LogIn size={18} />
              <span>Login</span>
            </button>
            <a
              href="/contact"
              className="font-title font-bold text-white bg-primary hover:bg-primary-hover px-6 py-3 rounded-xl shadow-sm hover:shadow-md transition-all duration-200"
            >
              Contact Now
            </a>
          </div>

          {/* Mobile Toggle */}
          <button
            className="lg:hidden p-2 text-slate-700 hover:text-primary transition-all"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 w-full max-w-xs bg-white p-6 shadow-2xl border-l border-slate-100 flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:hidden ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          <div className="flex items-center justify-between mb-8">
            <a href="/">
              <SiteLogo size="sm" />
            </a>
            <button onClick={() => setMobileMenuOpen(false)} aria-label="Close menu">
              <X size={24} className="text-slate-600" />
            </button>
          </div>

          <ul className="flex flex-col gap-5">
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
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <button
            className="flex items-center justify-center gap-2 font-title font-semibold text-slate-700 border border-slate-200 py-3 rounded-xl hover:bg-slate-50"
            onClick={() => setMobileMenuOpen(false)}
          >
            <LogIn size={18} />
            <span>Login</span>
          </button>
          <a
            href="/contact"
            className="font-title font-bold text-white bg-primary py-3 rounded-xl hover:bg-primary-hover shadow-sm text-center"
            onClick={() => setMobileMenuOpen(false)}
          >
            Contact Now
          </a>
        </div>
      </div>
    </>
  );
}
