"use client";

import { useEffect, useState } from "react";
import { MessageSquare, Phone, Mail } from "lucide-react";
import { cms, HomeCMSData, ContactCMSData, CoursesCMSData } from "@/utils/cmsData";

type Props = {
  sectionId?: string;
};

export default function ContactSection({ sectionId }: Props) {
  const [homeCMS, setHomeCMS] = useState<HomeCMSData | null>(null);
  const [contactCMS, setContactCMS] = useState<ContactCMSData | null>(null);
  const [coursesCMS, setCoursesCMS] = useState<CoursesCMSData | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    void Promise.all([
      cms.getHomeData().then(setHomeCMS),
      cms.getContactData().then(setContactCMS),
      cms.getCoursesData().then(setCoursesCMS),
    ]);
  }, []);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) return;
    setFormError("");
    setFormLoading(true);
    try {
      await cms.submitInquiry(formData);
      setFormSubmitted(true);
      setFormData({ name: "", phone: "", email: "", course: "", message: "" });
      setTimeout(() => setFormSubmitted(false), 5000);
    } catch {
      setFormError("Could not send inquiry. Is the backend running?");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <section id={sectionId} className="bg-slate-50 py-16 scroll-mt-20">
      <div className="relative mx-auto max-w-7xl px-6 md:px-8 mb-16 rounded-3xl overflow-hidden shadow-lg">
        <div className="absolute inset-0 bg-primary/95 z-10" />
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${homeCMS?.contactBannerImageUrl || "/classroom_bg.png"}')` }}
        />
        <div className="relative z-20 py-16 px-8 text-center max-w-3xl mx-auto">
          <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-accent font-title text-xs font-bold uppercase tracking-wider mb-4">
            {homeCMS?.contactBannerBadge}
          </span>
          <p className="text-white/90 text-sm md:text-base leading-relaxed max-w-xl mx-auto">
            {homeCMS?.contactBannerText}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 flex flex-col gap-6">
          <h3 className="font-title text-xl font-bold text-slate-900 mb-2">Reach Out to Our Experts</h3>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={24} />
            </div>
            <div>
              <h4 className="font-title text-base font-bold text-slate-900 mb-1">WhatsApp Us</h4>
              <p className="text-xs text-slate-500 mb-2">Instant support for quick queries</p>
              <p className="font-title font-bold text-slate-900 text-base md:text-lg">{contactCMS?.whatsapp}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary-light text-primary flex items-center justify-center flex-shrink-0">
              <Phone size={24} />
            </div>
            <div>
              <h4 className="font-title text-base font-bold text-slate-900 mb-1">Call Experts</h4>
              <p className="text-xs text-slate-500 mb-2">Direct line to our main office</p>
              <p className="font-title font-bold text-slate-900 text-base md:text-lg">{contactCMS?.phone}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Mail size={24} />
            </div>
            <div>
              <h4 className="font-title text-base font-bold text-slate-900 mb-1">Email Inquiries</h4>
              <p className="text-xs text-slate-500 mb-2">For detailed proposals and applications</p>
              <p className="font-title font-bold text-primary text-base md:text-lg">{contactCMS?.email}</p>
            </div>
          </div>

          <div className="bg-primary text-white p-8 rounded-2xl shadow-md">
            <h4 className="font-title text-xs font-black tracking-widest text-accent uppercase mb-3">OFFICE HOURS</h4>
            <p className="text-sm text-white/90 mb-6 font-sans whitespace-pre-line">{contactCMS?.hours}</p>
            <h4 className="font-title text-xs font-black tracking-widest text-accent uppercase mb-3">LOCATION</h4>
            <p className="text-sm text-white/90 font-sans whitespace-pre-line">{contactCMS?.location}</p>
          </div>
        </div>

        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="font-title text-xl font-bold text-slate-900 mb-2">{homeCMS?.inquiryFormTitle}</h3>
          <p className="text-sm text-slate-500 mb-6">{homeCMS?.inquiryFormSubtitle}</p>

          <form onSubmit={handleContactSubmit} className="flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-name" className="text-xs font-bold text-slate-700">Full Name</label>
                <input
                  id="contact-name"
                  type="text"
                  placeholder="John Doe"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-primary transition-colors font-sans"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-phone" className="text-xs font-bold text-slate-700">Phone Number</label>
                <input
                  id="contact-phone"
                  type="tel"
                  placeholder="+977 980..."
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-primary transition-colors font-sans"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-email" className="text-xs font-bold text-slate-700">Email Address</label>
                <input
                  id="contact-email"
                  type="email"
                  placeholder="john@example.com"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-primary transition-colors font-sans"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="contact-course" className="text-xs font-bold text-slate-700">Preferred Course</label>
                <select
                  id="contact-course"
                  className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-950 outline-none focus:border-primary bg-white transition-colors font-sans"
                  value={formData.course}
                  onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                  required
                >
                  <option value="">Select a course</option>
                  {(coursesCMS?.items ?? []).map((course) => (
                    <option key={course.id} value={course.title}>
                      {course.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="contact-message" className="text-xs font-bold text-slate-700">Message</label>
              <textarea
                id="contact-message"
                rows={4}
                placeholder="How can we help you with your education plans?"
                className="border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-950 placeholder-slate-400 outline-none focus:border-primary resize-none transition-colors font-sans"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
              />
            </div>

            {formError && <p className="text-sm text-red-600">{formError}</p>}
            <button
              type="submit"
              disabled={formLoading}
              className="w-full bg-primary hover:bg-primary-hover disabled:opacity-60 text-white font-title font-bold text-sm py-4 rounded-xl shadow-md transition-all uppercase tracking-wider"
            >
              {formLoading ? "Sending..." : formSubmitted ? "Submission Received!" : "Submit Inquiry"}
            </button>
            <p className="text-[10px] text-slate-400 text-center font-sans">
              By submitting this form, you agree to our privacy policy and terms of service.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}
