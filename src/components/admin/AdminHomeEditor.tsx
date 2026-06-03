"use client";

import { Plus, Trash2 } from "lucide-react";
import ImageUploadField from "@/components/ImageUploadField";
import { HomeCMSData, CoursesCMSData } from "@/utils/cmsData";
import { SERVICE_ICON_OPTIONS, ServiceIcon, normalizeServiceIcon } from "@/utils/serviceIcons";

type Props = {
  homeData: HomeCMSData;
  coursesData: CoursesCMSData | null;
  onChange: (data: HomeCMSData) => void;
};

export default function AdminHomeEditor({ homeData, coursesData, onChange }: Props) {
  const set = (patch: Partial<HomeCMSData>) => onChange({ ...homeData, ...patch });

  const updateService = (index: number, field: string, value: string | boolean) => {
    const services = [...homeData.services];
    services[index] = { ...services[index], [field]: value };
    set({ services });
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">Hero Section</h2>
      <ImageUploadField
        label="Home Hero Image"
        folder="home"
        value={homeData.heroImageUrl}
        onChange={(heroImageUrl) => set({ heroImageUrl })}
        placeholder="/student_hero.png"
      />
      {[
        ["Hero Badge Text", "heroBadge", "text"],
        ["Hero Main Title", "heroTitle", "text"],
      ].map(([label, key]) => (
        <div key={key} className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary text-gray-900"
            value={homeData[key as keyof HomeCMSData] as string}
            onChange={(e) => set({ [key]: e.target.value } as Partial<HomeCMSData>)}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Hero Subtitle</label>
        <textarea
          rows={3}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none text-gray-900"
          value={homeData.heroSubtitle}
          onChange={(e) => set({ heroSubtitle: e.target.value })}
        />
      </div>

      <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-4">Who We Are Section</h2>
      {[
        ["Section Badge", "whoWeAreBadge"],
        ["Section Title", "whoWeAreTitle"],
        ["Link Text", "whoWeAreLinkText"],
        ["Stat 1 Value", "stat1Value"],
        ["Stat 1 Title", "stat1Title"],
        ["Stat 2 Value", "stat2Value"],
        ["Stat 2 Title", "stat2Title"],
      ].map(([label, key]) => (
        <div key={key} className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary text-gray-900"
            value={homeData[key as keyof HomeCMSData] as string}
            onChange={(e) => set({ [key]: e.target.value } as Partial<HomeCMSData>)}
          />
        </div>
      ))}
      {[
        ["Paragraph 1", "whoWeAreParagraph1"],
        ["Paragraph 2", "whoWeAreParagraph2"],
        ["Stat 1 Description", "stat1Desc"],
        ["Stat 2 Description", "stat2Desc"],
      ].map(([label, key]) => (
        <div key={key} className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
          <textarea
            rows={2}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none text-gray-900"
            value={homeData[key as keyof HomeCMSData] as string}
            onChange={(e) => set({ [key]: e.target.value } as Partial<HomeCMSData>)}
          />
        </div>
      ))}

      <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-4">Services Section</h2>
      {[
        ["Services Badge", "servicesBadge"],
        ["Services Title", "servicesTitle"],
      ].map(([label, key]) => (
        <div key={key} className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary text-gray-900"
            value={homeData[key as keyof HomeCMSData] as string}
            onChange={(e) => set({ [key]: e.target.value } as Partial<HomeCMSData>)}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Services Subtitle</label>
        <textarea
          rows={2}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none text-gray-900"
          value={homeData.servicesSubtitle}
          onChange={(e) => set({ servicesSubtitle: e.target.value })}
        />
      </div>
      {homeData.services.map((svc, index) => (
        <div key={index} className="bg-gray-50 p-4 rounded-xl border border-gray-200">
          <h4 className="text-xs font-bold text-primary mb-3 uppercase">Service Card #{index + 1}</h4>
          <div className="grid gap-3">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-bold text-gray-500 uppercase">Icon</label>
              <div className="flex flex-wrap gap-2">
                {SERVICE_ICON_OPTIONS.map((option) => {
                  const selected = normalizeServiceIcon(svc.icon, index) === option.value;
                  return (
                    <button
                      key={option.value}
                      type="button"
                      title={option.label}
                      onClick={() => updateService(index, "icon", option.value)}
                      className={`w-10 h-10 rounded-lg border flex items-center justify-center transition-all ${
                        selected
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-white text-primary border-gray-200 hover:border-primary/40"
                      }`}
                    >
                      <ServiceIcon name={option.value} size={18} />
                    </button>
                  );
                })}
              </div>
            </div>
            <input
              type="text"
              placeholder="Title"
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
              value={svc.title}
              onChange={(e) => updateService(index, "title", e.target.value)}
            />
            <textarea
              rows={2}
              placeholder="Description"
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 resize-none"
              value={svc.description}
              onChange={(e) => updateService(index, "description", e.target.value)}
            />
            <input
              type="text"
              placeholder="Link text"
              className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
              value={svc.linkText}
              onChange={(e) => updateService(index, "linkText", e.target.value)}
            />
            <label className="flex items-center gap-2 text-xs font-semibold text-gray-700">
              <input
                type="checkbox"
                checked={svc.featured}
                onChange={(e) => updateService(index, "featured", e.target.checked)}
              />
              Featured (dark card style)
            </label>
          </div>
        </div>
      ))}

      <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-4">Featured Courses Header</h2>
      {[
        ["Badge", "featuredBadge"],
        ["Title", "featuredTitle"],
      ].map(([label, key]) => (
        <div key={key} className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary text-gray-900"
            value={homeData[key as keyof HomeCMSData] as string}
            onChange={(e) => set({ [key]: e.target.value } as Partial<HomeCMSData>)}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Subtitle</label>
        <input
          type="text"
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary text-gray-900"
          value={homeData.featuredSubtitle}
          onChange={(e) => set({ featuredSubtitle: e.target.value })}
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((num) => {
          const selectedIds = (homeData.featuredCourseIds || []).filter((_, i) => i !== num);
          return (
          <div key={num} className="flex flex-col gap-1.5">
            <label className="text-[10px] font-bold text-gray-400 uppercase">Featured #{num + 1}</label>
            <select
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-900 outline-none focus:border-primary"
              value={homeData.featuredCourseIds?.[num] || ""}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : 0;
                const updatedIds = [...(homeData.featuredCourseIds || [])];
                while (updatedIds.length < 3) updatedIds.push(0);
                for (let i = 0; i < updatedIds.length; i++) {
                  if (i !== num && value > 0 && updatedIds[i] === value) {
                    updatedIds[i] = 0;
                  }
                }
                updatedIds[num] = value;
                set({ featuredCourseIds: updatedIds.filter((id) => id > 0) });
              }}
            >
              <option value="">Select Course</option>
              {coursesData?.items.map((course) => (
                <option
                  key={course.id}
                  value={course.id}
                  disabled={selectedIds.includes(course.id)}
                >
                  {course.title}
                  {selectedIds.includes(course.id) ? " (already featured)" : ""}
                </option>
              ))}
            </select>
          </div>
          );
        })}
      </div>

      <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-4">Testimonials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Section Badge</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={homeData.testimonialsBadge}
            onChange={(e) => set({ testimonialsBadge: e.target.value })}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">Section Title</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={homeData.testimonialsTitle}
            onChange={(e) => set({ testimonialsTitle: e.target.value })}
          />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-gray-800 uppercase">Success Stories</span>
        <button
          type="button"
          onClick={() => {
            const newId = homeData.testimonials.length > 0 ? Math.max(...homeData.testimonials.map((t) => t.id)) + 1 : 1;
            set({
              testimonials: [
                ...homeData.testimonials,
                { id: newId, name: "New Student", location: "Visa Approved", initials: "NS", text: "Success story text.", featured: false },
              ],
            });
          }}
          className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border border-gray-200 bg-white"
        >
          <Plus size={12} /> Add Story
        </button>
      </div>
      {homeData.testimonials.map((test, index) => (
        <div key={test.id} className="bg-gray-50 p-4 rounded-xl border border-gray-200 relative">
          <button
            type="button"
            onClick={() => set({ testimonials: homeData.testimonials.filter((t) => t.id !== test.id) })}
            className="absolute top-4 right-4 text-red-500"
          >
            <Trash2 size={16} />
          </button>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-2">
            {(["name", "location", "initials"] as const).map((field) => (
              <input
                key={field}
                type="text"
                className="bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900"
                value={test[field]}
                onChange={(e) => {
                  const updated = [...homeData.testimonials];
                  updated[index] = { ...updated[index], [field]: field === "initials" ? e.target.value.toUpperCase() : e.target.value };
                  set({ testimonials: updated });
                }}
              />
            ))}
          </div>
          <textarea
            rows={2}
            className="w-full bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs text-gray-900 resize-none mb-2"
            value={test.text}
            onChange={(e) => {
              const updated = [...homeData.testimonials];
              updated[index] = { ...updated[index], text: e.target.value };
              set({ testimonials: updated });
            }}
          />
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={test.featured}
              onChange={(e) => {
                const updated = [...homeData.testimonials];
                updated[index] = { ...updated[index], featured: e.target.checked };
                set({ testimonials: updated });
              }}
            />
            Featured highlight card
          </label>
        </div>
      ))}

      <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-4">Contact Section (on Home)</h2>
      <ImageUploadField
        label="Contact Banner Background Image"
        folder="home/contact"
        value={homeData.contactBannerImageUrl}
        onChange={(contactBannerImageUrl) => set({ contactBannerImageUrl })}
        placeholder="/classroom_bg.png"
      />
      {[
        ["Banner Badge", "contactBannerBadge"],
        ["Inquiry Form Title", "inquiryFormTitle"],
      ].map(([label, key]) => (
        <div key={key} className="flex flex-col gap-2">
          <label className="text-xs font-bold text-gray-500 uppercase">{label}</label>
          <input
            type="text"
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
            value={homeData[key as keyof HomeCMSData] as string}
            onChange={(e) => set({ [key]: e.target.value } as Partial<HomeCMSData>)}
          />
        </div>
      ))}
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Banner Text</label>
        <textarea
          rows={2}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
          value={homeData.contactBannerText}
          onChange={(e) => set({ contactBannerText: e.target.value })}
        />
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-xs font-bold text-gray-500 uppercase">Inquiry Form Subtitle</label>
        <textarea
          rows={2}
          className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
          value={homeData.inquiryFormSubtitle}
          onChange={(e) => set({ inquiryFormSubtitle: e.target.value })}
        />
      </div>

    </div>
  );
}
