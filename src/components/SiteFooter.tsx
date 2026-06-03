"use client";

import { useEffect, useState } from "react";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";
import { cms, ContactCMSData, DestinationsCMSData, FooterCMSData } from "@/utils/cmsData";

type Props = {
  showDestinations?: boolean;
};

const linkClass =
  "text-sm text-slate-400 hover:text-white hover:translate-x-0.5 transition-all inline-block";

const headingClass =
  "font-title text-white font-bold text-sm uppercase tracking-wider mb-1";

export default function SiteFooter({ showDestinations = false }: Props) {
  const [footerCMS, setFooterCMS] = useState<FooterCMSData | null>(null);
  const [contactCMS, setContactCMS] = useState<ContactCMSData | null>(null);
  const [destinationsCMS, setDestinationsCMS] = useState<DestinationsCMSData | null>(null);

  useEffect(() => {
    void Promise.all([
      cms.getFooterData().then(setFooterCMS),
      cms.getContactData().then(setContactCMS),
      showDestinations ? cms.getDestinationsData().then(setDestinationsCMS) : Promise.resolve(),
    ]);
  }, [showDestinations]);

  if (!footerCMS) return null;

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-6 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 items-start border-b border-slate-800 pb-14">
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-5">
            <h3 className={headingClass}>{footerCMS.brandTitle}</h3>
            <a href="/" className="inline-flex w-fit">
              <SiteLogo size="footer" onDark />
            </a>
            <p className="text-sm text-slate-400 leading-relaxed max-w-md">
              {footerCMS.description}
            </p>
          </div>

          <div className="lg:col-span-2 flex flex-col gap-4">
            <h3 className={headingClass}>{footerCMS.quickLinksTitle}</h3>
            <ul className="flex flex-col gap-3">
              {footerCMS.quickLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <a href={link.href} className={linkClass}>
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {showDestinations ? (
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className={headingClass}>Destinations</h3>
              <ul className="flex flex-col gap-3">
                {(destinationsCMS?.items ?? []).map((dest) => (
                  <li key={dest.id}>
                    <a href="/destinations" className={linkClass}>
                      {dest.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="lg:col-span-2 flex flex-col gap-4">
              <h3 className={headingClass}>{footerCMS.supportTitle}</h3>
              <ul className="flex flex-col gap-3">
                {footerCMS.supportLinks.map((link) => (
                  <li key={`${link.href}-${link.label}`}>
                    <a href={link.href} className={linkClass}>
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-4">
            <h3 className={headingClass}>{footerCMS.contactTitle}</h3>
            <div className="flex flex-col gap-4">
              {contactCMS?.location && (
                <div className="flex gap-3 text-sm text-slate-400">
                  <MapPin size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <span>{contactCMS.location}</span>
                </div>
              )}
              {contactCMS?.phone && (
                <div className="flex gap-3 text-sm text-slate-400">
                  <Phone size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <span>{contactCMS.phone}</span>
                </div>
              )}
              {contactCMS?.email && (
                <div className="flex gap-3 text-sm text-slate-400">
                  <Mail size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <span className="break-all">{contactCMS.email}</span>
                </div>
              )}
              {contactCMS?.hours && (
                <div className="flex gap-3 text-sm text-slate-400">
                  <Clock size={18} className="text-primary flex-shrink-0 mt-0.5" />
                  <span>{contactCMS.hours}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 text-xs text-slate-500">
          <p>
            © {new Date().getFullYear()} {footerCMS.copyrightText}
          </p>
          <p>
            {footerCMS.taglinePrefix}{" "}
            <span className="text-primary font-semibold">{footerCMS.taglineHighlight}</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
