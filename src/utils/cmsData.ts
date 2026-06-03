// Centralized CMS data store for V Five Education Consultancy
// Loads from FastAPI backend (PostgreSQL). No browser cache — database is the source of truth.
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { normalizeServiceIcon } from "@/utils/serviceIcons";

const LEGACY_CMS_CACHE_KEYS = [
  "vfive_home_data",
  "vfive_courses_data",
  "vfive_destinations_data",
  "vfive_study_abroad_data",
  "vfive_about_data",
  "vfive_contact_data",
] as const;

/** Remove stale CMS copies saved in the browser (they caused old content on refresh). */
function clearLegacyCmsCache() {
  if (typeof window === "undefined") return;
  for (const key of LEGACY_CMS_CACHE_KEYS) {
    localStorage.removeItem(key);
  }
}

clearLegacyCmsCache();

export interface TestimonialItem {
  id: number;
  name: string;
  location: string;
  initials: string;
  text: string;
  featured: boolean; // featured = dark primary card style
}

export interface ServiceCard {
  title: string;
  description: string;
  linkText: string;
  featured: boolean;
  icon: string;
}

export interface HomeCMSData {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  whoWeAreBadge: string;
  whoWeAreTitle: string;
  whoWeAreParagraph1: string;
  whoWeAreParagraph2: string;
  whoWeAreLinkText: string;
  stat1Value: string;
  stat1Title: string;
  stat1Desc: string;
  stat2Value: string;
  stat2Title: string;
  stat2Desc: string;
  servicesBadge: string;
  servicesTitle: string;
  servicesSubtitle: string;
  services: ServiceCard[];
  featuredBadge: string;
  featuredTitle: string;
  featuredSubtitle: string;
  featuredCourseIds: number[];
  testimonialsBadge: string;
  testimonialsTitle: string;
  testimonials: TestimonialItem[];
  contactBannerBadge: string;
  contactBannerText: string;
  contactBannerImageUrl: string;
  inquiryFormTitle: string;
  inquiryFormSubtitle: string;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterCMSData {
  brandTitle: string;
  description: string;
  quickLinksTitle: string;
  quickLinks: FooterLink[];
  supportTitle: string;
  supportLinks: FooterLink[];
  contactTitle: string;
  copyrightText: string;
  taglinePrefix: string;
  taglineHighlight: string;
}

export interface CourseItem {
  id: number;
  title: string;
  category: string;
  categoryTag: string;
  description: string;
  duration: string;
  mode: string;
  language: string;
  imageUrl: string;
  batchInfo: string;
}

export interface CoursesCMSData {
  title: string;
  subtitle: string;
  items: CourseItem[];
}

export interface DestinationItem {
  id: number;
  name: string;
  tagline: string;
  badge: string;
  highlights: string[];
  imageUrl?: string;
  flag?: string;
}

export interface DestinationsCMSData {
  heroBadge: string;
  title: string;
  subtitle: string;
  gridSectionTitle: string;
  gridSectionSubtitle: string;
  items: DestinationItem[];
}

export interface StudyAbroadCMSData {
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  sectionTitle: string;
  sectionDesc: string;
  scholarshipBadge?: string;
  scholarshipTitle?: string;
  scholarshipDesc?: string;
  scholarshipButtonText?: string;
  popularDestTitle?: string;
  popularDestSubtitle?: string;
  featuredDestinationIds?: number[];
  journeyBadge?: string;
  journeyTitle?: string;
  journeyDesc?: string;
}

export interface AboutStat {
  value: string;
  label: string;
}

export interface TeamMember {
  id: number;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
}

export interface AboutUsCMSData {
  heroBadge?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroImageUrl: string;
  storyBadge?: string;
  storyTitle?: string;
  storyParagraph1?: string;
  storyParagraph2?: string;
  storyHighlights?: string[];
  storyImageUrl?: string;
  storyOverlayValue?: string;
  storyOverlayLabel?: string;
  stats?: AboutStat[];
  foundationsBadge?: string;
  foundationsTitle?: string;
  teamBadge?: string;
  teamTitle?: string;
  teamSubtitle?: string;
  teamMembers?: TeamMember[];
  ctaBadge?: string;
  ctaTitle?: string;
  ctaDesc?: string;
  ctaButtonText?: string;
  ctaImageUrl?: string;
  mission: string;
  vision: string;
  values: string;
}

export interface InquiryItem {
  id: number;
  name: string;
  phone: string;
  email: string;
  course: string;
  message: string;
  created_at: string;
}

export interface ContactCMSData {
  whatsapp: string;
  phone: string;
  email: string;
  hours: string;
  location: string;
}

// ─── Default Data ────────────────────────────────────────────────────────────

export const DEFAULT_HOME_DATA: HomeCMSData = {
  heroBadge: "YOUR TRUSTED EDUCATION PARTNER",
  heroTitle: "Unlock Global Opportunities with V Five Education",
  heroSubtitle: "Empowering students through expert Korean/Japanese language preparation, IELTS/PTE coaching, and premium university counseling.",
  heroImageUrl: "/student_hero.png",
  whoWeAreBadge: "About Us",
  whoWeAreTitle: "Who We Are",
  whoWeAreParagraph1: "V Five Education Consultancy is a premier academic mentoring institution dedicated to facilitating international education journeys. We specialize in providing comprehensive support for students seeking to study in Korea, Japan, and Western nations.",
  whoWeAreParagraph2: "Our team of certified counselors and language experts ensures that every student receives a tailored roadmap, from language proficiency to visa approval, ensuring a seamless transition to their chosen global campus.",
  whoWeAreLinkText: "Learn about our mission",
  stat1Value: "15+",
  stat1Title: "Years of Experience",
  stat1Desc: "Dedicated service in international academic placements.",
  stat2Value: "98%",
  stat2Title: "Visa Success Rate",
  stat2Desc: "Proven track record for Korea, Japan, and Western nations.",
  servicesBadge: "Our Services",
  servicesTitle: "Our Dedicated Services",
  servicesSubtitle: "We provide end-to-end assistance to ensure your educational journey is smooth, successful, and tailored to your career goals.",
  services: [
    { title: "Career Counselling", description: "Expert guidance to help you choose the right course and destination based on your academic profile and future aspirations.", linkText: "Explore More", featured: false, icon: "compass" },
    { title: "Test Preparation", description: "Intensive coaching for IELTS, PTE, TOPIK, and JLPT with experienced instructors and state-of-the-art learning resources.", linkText: "Join Class", featured: true, icon: "book-open" },
    { title: "Interview Assistance", description: "Comprehensive mock interviews and communication workshops to prepare you for university and embassy interactions.", linkText: "View Details", featured: false, icon: "users" },
  ],
  featuredBadge: "Programs",
  featuredTitle: "Featured Courses",
  featuredSubtitle: "Master a new language and open doors to world-class global universities.",
  featuredCourseIds: [1, 2, 3],
  testimonialsBadge: "Testimonials",
  testimonialsTitle: "Student Success Stories",
  contactBannerBadge: "Get in Touch",
  contactBannerText: "Our expert consultants are ready to guide your global education journey. Contact us today for personalized academic counseling.",
  contactBannerImageUrl: "/classroom_bg.png",
  inquiryFormTitle: "Send an Inquiry",
  inquiryFormSubtitle: "Fill out the form below and one of our expert education consultants will get back to you within 24 hours.",
  testimonials: [
    {
      id: 1,
      name: "Anish Thapa",
      location: "Studying in Osaka, Japan",
      initials: "AT",
      text: "V Five Education Consultancy helped me clear my JLPT N4 exam in my first attempt. Their visa processing for Japan was incredibly smooth and transparent. Truly grateful!",
      featured: false
    },
    {
      id: 2,
      name: "Priya Karki",
      location: "EPS Korea Aspirant",
      initials: "PK",
      text: "The best Korean language classes in Kathmandu! The teachers at V Five are very patient and the mock tests are exactly like the real EPS-TOPIK exam. Highly recommended.",
      featured: true
    },
    {
      id: 3,
      name: "Ramesh Gurung",
      location: "Global Scholar, Seoul",
      initials: "RG",
      text: "I was confused about studying abroad. The V Five counselling team gave me a clear path for South Korea. Their honesty and support are unmatched in Bagbazar.",
      featured: false
    }
  ]
};

export const DEFAULT_COURSES_DATA: CoursesCMSData = {
  title: "Empower Your Future with Professional Education",
  subtitle: "Providing expert language training, professional accounting courses, and university entrance preparation since 2010.",
  items: [
    {
      id: 1,
      title: "Korean Language (EPS & Student Visa)",
      category: "Languages",
      categoryTag: "LANGUAGE PROFICIENCY",
      description: "Comprehensive training for EPS-TOPIK and student visa applicants at V Five Education.",
      duration: "12 Weeks",
      mode: "In-Person Classes",
      language: "Korean Language",
      imageUrl: "/korean_course.png",
      batchInfo: "Batch Starts: 1st Nov"
    },
    {
      id: 2,
      title: "Japanese Language (N5 to N1)",
      category: "Languages",
      categoryTag: "LANGUAGE PROFICIENCY",
      description: "Master Japanese for employment or higher education. Specialized courses for SSW and student visa.",
      duration: "18 Weeks",
      mode: "In-Person Classes",
      language: "Japanese Language",
      imageUrl: "/japanese_course.png",
      batchInfo: "Daily Sessions Available"
    },
    {
      id: 3,
      title: "IELTS & PTE Preparation",
      category: "Exam Prep",
      categoryTag: "EXAM PREP",
      description: "Intensive coaching with mock tests and personalized feedback for global admission success.",
      duration: "8 Weeks",
      mode: "Online/Virtual",
      language: "English (IELTS/PTE)",
      imageUrl: "/ielts_course.png",
      batchInfo: "Free Mock Tests Included"
    },
    {
      id: 4,
      title: "Tuition Class (All Subjects)",
      category: "Academic Support",
      categoryTag: "ACADEMIC SUPPORT",
      description: "Specialized subject support for school and college levels with experienced tutors.",
      duration: "8 Weeks",
      mode: "In-Person Classes",
      language: "None",
      imageUrl: "/classroom_bg.png",
      batchInfo: "Daily Batches"
    },
    {
      id: 5,
      title: "Professional Accounting Training",
      category: "Professional",
      categoryTag: "PROFESSIONAL",
      description: "Hands-on training in financial accounting and taxation for aspiring professionals.",
      duration: "12 Weeks",
      mode: "Hybrid Learning",
      language: "None",
      imageUrl: "/student_hero.png",
      batchInfo: "Weekend Batch Available"
    },
    {
      id: 6,
      title: "Entrance Preparation",
      category: "Academic Entry",
      categoryTag: "ACADEMIC ENTRY",
      description: "Coaching for national and international university entrance exams at V Five.",
      duration: "12 Weeks",
      mode: "Online/Virtual",
      language: "None",
      imageUrl: "/classroom_bg.png",
      batchInfo: "Next Intake: Nov 1"
    }
  ]
};

export const DEFAULT_DESTINATIONS_DATA: DestinationsCMSData = {
  heroBadge: "Expand Your Horizons",
  title: "Your Gateway to Global Education",
  subtitle: "Choose from our handpicked study destinations offering world-class training, high visa success rates, and excellent career paths.",
  gridSectionTitle: "Explore Your Future Campus",
  gridSectionSubtitle: "Selected top-tier countries offering diverse academic excellence.",
  items: [
    {
      id: 1,
      name: "South Korea",
      tagline: "Global Tech Hub and Rich Cultural Heritage.",
      badge: "MOST POPULAR",
      highlights: ["Affordable Tuition", "Part-Time Job Permit", "100% Scholarship Option"],
      imageUrl: "/korean_course.png",
      flag: "🇰🇷",
    },
    {
      id: 2,
      name: "Japan",
      tagline: "World-Class Engineering, Innovation, and Work Opportunities.",
      badge: "SSW PATHWAY",
      highlights: ["SSW Job Placement", "NAT/JLPT Coaching", "High Quality of Life"],
      imageUrl: "/japanese_course.png",
      flag: "🇯🇵",
    },
    {
      id: 3,
      name: "United Kingdom",
      tagline: "Centuries of Academic Prestige and Global Recognition.",
      badge: "TOP RANKED",
      highlights: ["2-Year Post Study Work", "Fast-Track Master's", "No IELTS Pathways"],
      imageUrl: "/study_abroad_hero.png",
      flag: "🇬🇧",
    },
    {
      id: 4,
      name: "Canada",
      tagline: "Welcoming Immigration Policies and High Standard of Living.",
      badge: "PR PATHWAY",
      highlights: ["PGWP Eligible", "Co-op Internships", "Permanent Residency Route"],
      imageUrl: "/classroom_bg.png",
      flag: "🇨🇦",
    }
  ]
};

export const DEFAULT_STUDY_ABROAD_DATA: StudyAbroadCMSData = {
  heroTitle: "Global Opportunities Await You",
  heroSubtitle: "Explore high-quality education systems, scholarship opportunities, and post-study work options with V Five Education.",
  heroImageUrl: "/study_abroad_hero.png",
  sectionTitle: "Why Study Abroad?",
  sectionDesc: "Embarking on a study abroad journey is a transformative experience that broadens academic, cultural, and career perspectives. Let us guide you at every step.",
  scholarshipBadge: "Merit-Based Scholarships",
  scholarshipTitle: "Up to 100% Tuition Waiver",
  scholarshipDesc: "Comprehensive Admissions and Financial Aid support for meritorious students looking to study in top global universities.",
  scholarshipButtonText: "Check Your Eligibility",
  popularDestTitle: "Popular Destinations",
  popularDestSubtitle: "Choose from the top education hubs worldwide with tailored support for each region.",
  featuredDestinationIds: [3, 2, 4, 5, 1],
  journeyBadge: "How It Works",
  journeyTitle: "Your Four-Step Journey to Global Success",
  journeyDesc: "We've streamlined the application process to ensure a stress-free experience from your first consultation to your first day of class.",
};

export const DEFAULT_ABOUT_DATA: AboutUsCMSData = {
  heroBadge: "Our Journey & Purpose",
  heroTitle: "Empowering Your Global Dreams Since 2010",
  heroSubtitle: "V Five Education Consultancy is dedicated to paving clear pathways for students seeking quality international education and professional career success.",
  heroImageUrl: "/student_hero.png",
  storyBadge: "Who We Are",
  storyTitle: "Leading the Way in Educational Excellence",
  storyParagraph1: "Founded over a decade ago, V Five Education Consultancy has grown into a trusted beacon for students across Nepal. We bridge the gap between ambitious minds and world-class universities in countries like South Korea, Japan, United Kingdom, Canada, and Australia.",
  storyParagraph2: "Beyond study abroad counselling, we provide top-tier preparation classes for EPS-TOPIK, Japanese Language (NAT/JLPT), IELTS, and PTE. Our student-centric approach ensures you receive precise counseling, reliable document formatting, and direct visa processing guidance.",
  storyHighlights: [
    "Certified Career Counselors",
    "98% Visa Success Rate",
    "Affordable Language Prep",
    "50+ Global Partner Universities",
  ],
  storyImageUrl: "/student_hero.png",
  storyOverlayValue: "14+ Years",
  storyOverlayLabel: "Of Trusted Counselling & Training",
  foundationsBadge: "Foundations",
  foundationsTitle: "Our Core Strategy & Values",
  teamBadge: "Our Experts",
  teamTitle: "Meet Our Dedicated Leadership Team",
  teamSubtitle: "Experienced instructors, licensed counselors, and student advisors who support you at every milestone.",
  ctaBadge: "Consult with Us",
  ctaTitle: "Have Questions About Getting Started?",
  ctaDesc: "Schedule a call with our Senior Counselor to map out your language courses or higher education visa roadmap.",
  ctaButtonText: "Contact Us Now",
  ctaImageUrl: "/classroom_bg.png",
  stats: [
    { value: "10k+", label: "Students Assisted" },
    { value: "98%", label: "Visa Success Rate" },
    { value: "50+", label: "Partner Universities" },
    { value: "15+", label: "Expert Counselors" },
  ],
  teamMembers: [
    { id: 1, name: "Ramesh K.C.", role: "Managing Director", bio: "15+ years of strategic leadership in educational immigration counseling.", imageUrl: "/student_hero.png" },
    { id: 2, name: "Anita Shrestha", role: "Senior Counselor", bio: "Expert in Korean & Japanese visa guidelines and university options.", imageUrl: "/student_writing.png" },
    { id: 3, name: "Bipin Gurung", role: "Language Head (IELTS/PTE)", bio: "Dedicated to helping students cross the band score requirements smoothly.", imageUrl: "/student_hero.png" },
    { id: 4, name: "Sato Tanaka", role: "Japanese Coordinator", bio: "Native-level guidance for JLPT and cultural integration in Japan.", imageUrl: "/student_writing.png" },
  ],
  mission: "To simplify the complex study abroad process by providing accurate, personalized counselling and excellent language preparation classes that unlock global opportunities.",
  vision: "To be recognized as the most transparent and successful educational consultancy in Nepal, fostering global capability and leadership within Nepalese youth.",
  values: "Trust, transparency, and students' best interests govern our counseling rules. We ensure realistic expectations and ethical compliance at every phase."
};

export const DEFAULT_CONTACT_DATA: ContactCMSData = {
  whatsapp: "+977 98012 34567",
  phone: "+977 1 4412345 / 4412346",
  email: "info@vfiveeducation.com",
  hours: "Sunday - Friday: 9:00 AM - 6:00 PM | Saturday: Closed",
  location: "Putalisadak, Kathmandu, Nepal | Main Educational Hub Building"
};

export const DEFAULT_FOOTER_DATA: FooterCMSData = {
  brandTitle: "About Us",
  description:
    "V Five is a leading education consultancy dedicated to fulfilling your dreams of international education and career success through expert mentoring and unwavering support.",
  quickLinksTitle: "Quick Links",
  quickLinks: [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Courses", href: "/courses" },
    { label: "Destinations", href: "/destinations" },
    { label: "Study Abroad", href: "/study-abroad" },
    { label: "Contact Us", href: "/contact" },
  ],
  supportTitle: "Support",
  supportLinks: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "FAQ", href: "#" },
    { label: "Career Guidance", href: "/contact" },
  ],
  contactTitle: "Contact Info",
  copyrightText: "V Five Education Consultancy. All rights reserved.",
  taglinePrefix: "Designed with Excellence for",
  taglineHighlight: "Future Global Scholars",
};

function mergeHome(parsed: Partial<HomeCMSData>): HomeCMSData {
  return {
    ...DEFAULT_HOME_DATA,
    ...parsed,
    services: (parsed.services?.length ? parsed.services : DEFAULT_HOME_DATA.services).map(
      (svc, index) => ({
        ...svc,
        icon: normalizeServiceIcon(svc.icon, index),
      })
    ),
    testimonials: parsed.testimonials ?? DEFAULT_HOME_DATA.testimonials,
    featuredCourseIds: parsed.featuredCourseIds ?? DEFAULT_HOME_DATA.featuredCourseIds,
    heroImageUrl: parsed.heroImageUrl ?? DEFAULT_HOME_DATA.heroImageUrl,
    contactBannerImageUrl: parsed.contactBannerImageUrl ?? DEFAULT_HOME_DATA.contactBannerImageUrl,
  };
}

function mergeDestinations(parsed: Partial<DestinationsCMSData>): DestinationsCMSData {
  return {
    ...DEFAULT_DESTINATIONS_DATA,
    ...parsed,
    items:
      parsed.items?.map((item) => ({
        ...item,
        imageUrl: item.imageUrl || "/classroom_bg.png",
        flag: item.flag || "🌐",
      })) ?? DEFAULT_DESTINATIONS_DATA.items,
  };
}

function mergeStudyAbroad(parsed: Partial<StudyAbroadCMSData>): StudyAbroadCMSData {
  return {
    ...DEFAULT_STUDY_ABROAD_DATA,
    ...parsed,
    heroImageUrl: parsed.heroImageUrl ?? DEFAULT_STUDY_ABROAD_DATA.heroImageUrl,
    featuredDestinationIds:
      parsed.featuredDestinationIds ?? DEFAULT_STUDY_ABROAD_DATA.featuredDestinationIds,
  };
}

function mergeAbout(parsed: Partial<AboutUsCMSData>): AboutUsCMSData {
  return {
    ...DEFAULT_ABOUT_DATA,
    ...parsed,
    heroImageUrl: parsed.heroImageUrl ?? DEFAULT_ABOUT_DATA.heroImageUrl,
    storyImageUrl: parsed.storyImageUrl || parsed.heroImageUrl || DEFAULT_ABOUT_DATA.storyImageUrl,
    storyHighlights: parsed.storyHighlights?.length
      ? parsed.storyHighlights
      : DEFAULT_ABOUT_DATA.storyHighlights,
    stats: parsed.stats?.length ? parsed.stats : DEFAULT_ABOUT_DATA.stats,
    teamMembers: parsed.teamMembers?.length ? parsed.teamMembers : DEFAULT_ABOUT_DATA.teamMembers,
  };
}

function mergeFooter(parsed: Partial<FooterCMSData>): FooterCMSData {
  return {
    ...DEFAULT_FOOTER_DATA,
    ...parsed,
    quickLinks: parsed.quickLinks?.length ? parsed.quickLinks : DEFAULT_FOOTER_DATA.quickLinks,
    supportLinks: parsed.supportLinks?.length ? parsed.supportLinks : DEFAULT_FOOTER_DATA.supportLinks,
  };
}

function mergeCourses(parsed: Partial<CoursesCMSData>): CoursesCMSData {
  return {
    ...DEFAULT_COURSES_DATA,
    ...parsed,
    items:
      parsed.items?.map((item) => ({
        ...item,
        imageUrl: item.imageUrl || "/classroom_bg.png",
        batchInfo: item.batchInfo || "Contact for Schedule",
      })) ?? DEFAULT_COURSES_DATA.items,
  };
}

// ─── CMS Read/Write Helpers ───────────────────────────────────────────────────
export const cms = {
  async getHomeData(): Promise<HomeCMSData> {
    const data = await apiGet<HomeCMSData>("/api/cms/home");
    return mergeHome(data);
  },
  async saveHomeData(data: HomeCMSData): Promise<void> {
    await apiPut("/api/cms/home", data);
  },

  async getCoursesData(): Promise<CoursesCMSData> {
    const data = await apiGet<CoursesCMSData>("/api/cms/courses");
    return mergeCourses(data);
  },
  async saveCoursesData(data: CoursesCMSData): Promise<void> {
    await apiPut("/api/cms/courses", data);
  },

  async getDestinationsData(): Promise<DestinationsCMSData> {
    const data = await apiGet<DestinationsCMSData>("/api/cms/destinations");
    return mergeDestinations(data);
  },
  async saveDestinationsData(data: DestinationsCMSData): Promise<void> {
    await apiPut("/api/cms/destinations", data);
  },

  async getStudyAbroadData(): Promise<StudyAbroadCMSData> {
    const data = await apiGet<StudyAbroadCMSData>("/api/cms/study-abroad");
    return mergeStudyAbroad(data);
  },
  async saveStudyAbroadData(data: StudyAbroadCMSData): Promise<void> {
    await apiPut("/api/cms/study-abroad", data);
  },

  async getAboutData(): Promise<AboutUsCMSData> {
    const data = await apiGet<AboutUsCMSData>("/api/cms/about");
    return mergeAbout(data);
  },
  async saveAboutData(data: AboutUsCMSData): Promise<void> {
    await apiPut("/api/cms/about", data);
  },

  async getContactData(): Promise<ContactCMSData> {
    const data = await apiGet<ContactCMSData>("/api/cms/contact");
    return { ...DEFAULT_CONTACT_DATA, ...data };
  },
  async saveContactData(data: ContactCMSData): Promise<void> {
    await apiPut("/api/cms/contact", data);
  },

  async getFooterData(): Promise<FooterCMSData> {
    const data = await apiGet<FooterCMSData>("/api/cms/footer");
    return mergeFooter(data);
  },
  async saveFooterData(data: FooterCMSData): Promise<void> {
    await apiPut("/api/cms/footer", data);
  },

  async submitInquiry(payload: {
    name: string;
    phone: string;
    email: string;
    course: string;
    message: string;
  }): Promise<void> {
    await apiPost("/api/inquiries", payload);
  },

  async getInquiries(): Promise<InquiryItem[]> {
    return apiGet<InquiryItem[]>("/api/inquiries");
  },
};
