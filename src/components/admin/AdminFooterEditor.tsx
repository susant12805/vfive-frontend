"use client";

import { Plus, Trash2 } from "lucide-react";
import { ContactCMSData, FooterCMSData, FooterLink } from "@/utils/cmsData";

type Props = {
  footerData: FooterCMSData;
  onChange: (data: FooterCMSData) => void;
  contactData: ContactCMSData;
  onContactChange: (data: ContactCMSData) => void;
};

function LinkListEditor({
  title,
  links,
  onChange,
}: {
  title: string;
  links: FooterLink[];
  onChange: (links: FooterLink[]) => void;
}) {
  const updateLink = (index: number, field: keyof FooterLink, value: string) => {
    const next = links.map((link, i) => (i === index ? { ...link, [field]: value } : link));
    onChange(next);
  };

  const addLink = () => onChange([...links, { label: "New Link", href: "/" }]);

  const removeLink = (index: number) => onChange(links.filter((_, i) => i !== index));

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">{title}</h2>
      {links.map((link, index) => (
        <div
          key={index}
          className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-3 items-end bg-gray-50 border border-gray-200 rounded-xl p-4"
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Label</label>
            <input
              type="text"
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900"
              value={link.label}
              onChange={(e) => updateLink(index, "label", e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-gray-500 uppercase">URL</label>
            <input
              type="text"
              className="bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900"
              value={link.href}
              onChange={(e) => updateLink(index, "href", e.target.value)}
              placeholder="/about or https://..."
            />
          </div>
          <button
            type="button"
            onClick={() => removeLink(index)}
            className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-100 transition-colors justify-self-end sm:justify-self-auto"
            aria-label="Remove link"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={addLink}
        className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary-hover w-fit"
      >
        <Plus size={16} />
        Add link
      </button>
    </div>
  );
}

export default function AdminFooterEditor({
  footerData,
  onChange,
  contactData,
  onContactChange,
}: Props) {
  const set = (patch: Partial<FooterCMSData>) => onChange({ ...footerData, ...patch });
  const setContact = (patch: Partial<ContactCMSData>) =>
    onContactChange({ ...contactData, ...patch });

  return (
    <div className="flex flex-col gap-8 max-w-3xl">
      <p className="text-sm text-gray-500">
        Edit all footer content here. Contact details are plain text on the site (not clickable links). WhatsApp and
        inquiry forms are still under <strong>Contact Us</strong>.
      </p>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">Brand column</h2>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Section title</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={footerData.brandTitle}
            onChange={(e) => set({ brandTitle: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
          <textarea
            rows={4}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
            value={footerData.description}
            onChange={(e) => set({ description: e.target.value })}
          />
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Quick links column title</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={footerData.quickLinksTitle}
            onChange={(e) => set({ quickLinksTitle: e.target.value })}
          />
        </div>
        <LinkListEditor
          title="Quick links"
          links={footerData.quickLinks}
          onChange={(quickLinks) => set({ quickLinks })}
        />
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Support column title</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={footerData.supportTitle}
            onChange={(e) => set({ supportTitle: e.target.value })}
          />
        </div>
        <LinkListEditor
          title="Support links"
          links={footerData.supportLinks}
          onChange={(supportLinks) => set({ supportLinks })}
        />
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">Contact info column</h2>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Column title</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={footerData.contactTitle}
            onChange={(e) => set({ contactTitle: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Address / location</label>
          <textarea
            rows={2}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
            value={contactData.location}
            onChange={(e) => setContact({ location: e.target.value })}
            placeholder="Putalisadak, Kathmandu, Nepal | Main Educational Hub Building"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Phone</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={contactData.phone}
            onChange={(e) => setContact({ phone: e.target.value })}
            placeholder="+977 1 4412345 / 4412346"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Email</label>
          <input
            type="email"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={contactData.email}
            onChange={(e) => setContact({ email: e.target.value })}
            placeholder="info@vfiveeducation.com"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Office hours</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={contactData.hours}
            onChange={(e) => setContact({ hours: e.target.value })}
            placeholder="Sunday - Friday: 9:00 AM - 6:00 PM | Saturday: Closed"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">Bottom bar</h2>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Copyright text</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={footerData.copyrightText}
            onChange={(e) => set({ copyrightText: e.target.value })}
            placeholder="V Five Education Consultancy. All rights reserved."
          />
          <p className="text-xs text-gray-400">Year is added automatically (e.g. © 2026 …).</p>
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Tagline — prefix</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={footerData.taglinePrefix}
            onChange={(e) => set({ taglinePrefix: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Tagline — highlighted phrase</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={footerData.taglineHighlight}
            onChange={(e) => set({ taglineHighlight: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}
