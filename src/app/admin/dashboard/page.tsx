"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Home, 
  BookOpen, 
  MapPin, 
  Globe, 
  Info, 
  Phone, 
  Save, 
  LogOut, 
  CheckCircle,
  Plus,
  Trash2,
  Lock,
  Menu,
  X,
  Users,
  PanelBottom,
} from "lucide-react";
import { 
  cms, 
  HomeCMSData, 
  CoursesCMSData, 
  DestinationsCMSData, 
  StudyAbroadCMSData, 
  AboutUsCMSData, 
  ContactCMSData,
  FooterCMSData,
  InquiryItem,
} from "@/utils/cmsData";
import ImageUploadField from "@/components/ImageUploadField";
import SiteLogo from "@/components/SiteLogo";
import AdminHomeEditor from "@/components/admin/AdminHomeEditor";
import AdminFooterEditor from "@/components/admin/AdminFooterEditor";
import { apiDelete, apiGet, apiGetUploadStatus, apiPost } from "@/lib/api";
import {
  ADMIN_LOGIN_PATH,
  clearAdminSession,
  fetchAdminMe,
} from "@/lib/adminAuth";

type AdminUserItem = {
  id: number;
  email: string;
  name: string;
  role: string;
  created_at: string;
};

type CurrentAdmin = {
  id: number;
  email: string;
  name: string;
  role: string;
  authenticated: boolean;
};

type SectionType = "home" | "courses" | "destinations" | "study-abroad" | "about" | "contact" | "footer" | "users";

const CMS_NAV_ITEMS: { id: SectionType; label: string; icon: typeof Home }[] = [
  { id: "home", label: "Home", icon: Home },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "destinations", label: "Destinations", icon: MapPin },
  { id: "study-abroad", label: "Study Abroad", icon: Globe },
  { id: "about", label: "About Us", icon: Info },
  { id: "contact", label: "Contact Us", icon: Phone },
  { id: "footer", label: "Footer", icon: PanelBottom },
  { id: "users", label: "Users", icon: Users },
];

const SECTION_LABELS: Record<SectionType, string> = {
  home: "Home",
  courses: "Courses",
  destinations: "Destinations",
  "study-abroad": "Study Abroad",
  about: "About Us",
  contact: "Contact Us",
  footer: "Footer",
  users: "Users",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<SectionType>("home");
  const [toastMessage, setToastMessage] = useState("");

  // Editor states
  const [homeData, setHomeData] = useState<HomeCMSData | null>(null);
  const [coursesData, setCoursesData] = useState<CoursesCMSData | null>(null);
  const [destinationsData, setDestinationsData] = useState<DestinationsCMSData | null>(null);
  const [studyAbroadData, setStudyAbroadData] = useState<StudyAbroadCMSData | null>(null);
  const [aboutData, setAboutData] = useState<AboutUsCMSData | null>(null);
  const [contactData, setContactData] = useState<ContactCMSData | null>(null);
  const [footerData, setFooterData] = useState<FooterCMSData | null>(null);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [adminUsers, setAdminUsers] = useState<AdminUserItem[]>([]);
  const [currentAdmin, setCurrentAdmin] = useState<CurrentAdmin | null>(null);
  const [newUserEmail, setNewUserEmail] = useState("");
  const [newUserPassword, setNewUserPassword] = useState("");
  const [newUserName, setNewUserName] = useState("");
  const [userFormError, setUserFormError] = useState("");
  const [cloudinaryReady, setCloudinaryReady] = useState<boolean | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSidebarOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    void apiGetUploadStatus()
      .then((s) => setCloudinaryReady(s.configured))
      .catch(() => setCloudinaryReady(false));
  }, []);

  useEffect(() => {
    void (async () => {
      try {
        await Promise.all([
          cms.getHomeData().then(setHomeData),
          cms.getCoursesData().then(setCoursesData),
          cms.getDestinationsData().then(setDestinationsData),
          cms.getStudyAbroadData().then(setStudyAbroadData),
          cms.getAboutData().then(setAboutData),
          cms.getContactData().then(setContactData),
          cms.getFooterData().then(setFooterData),
          cms.getInquiries().then(setInquiries).catch(() => setInquiries([])),
        ]);
      } catch {
        showToast("Could not load CMS data. Is the backend running?");
      }
      try {
        const me = await fetchAdminMe();
        setCurrentAdmin({ ...me, authenticated: true });
        const users = await apiGet<AdminUserItem[]>("/api/users");
        setAdminUsers(users);
      } catch {
        clearAdminSession();
        router.replace(ADMIN_LOGIN_PATH);
      }
    })();
  }, [router]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleLogout = () => {
    clearAdminSession();
    router.replace(ADMIN_LOGIN_PATH);
  };

  const refreshUsers = async () => {
    try {
      const users = await apiGet<AdminUserItem[]>("/api/users");
      setAdminUsers(users);
    } catch {
      setAdminUsers([]);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserFormError("");
    try {
      await apiPost(
        "/api/users",
        {
          email: newUserEmail.trim().toLowerCase(),
          password: newUserPassword,
          name: newUserName.trim(),
        },
        true
      );
      setNewUserEmail("");
      setNewUserPassword("");
      setNewUserName("");
      await refreshUsers();
      showToast("Admin user added successfully!");
    } catch (err) {
      setUserFormError(err instanceof Error ? err.message : "Could not add user.");
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await apiDelete(`/api/users/${userId}`);
      await refreshUsers();
      showToast("User removed.");
    } catch (err) {
      showToast(err instanceof Error ? err.message : "Could not delete user.");
    }
  };

  const handleSave = async () => {
    try {
      if (activeSection === "home" && homeData) {
        await cms.saveHomeData(homeData);
        showToast("Home Page configuration updated!");
      } else if (activeSection === "courses" && coursesData) {
        await cms.saveCoursesData(coursesData);
        showToast("Courses details updated successfully!");
      } else if (activeSection === "destinations" && destinationsData) {
        await cms.saveDestinationsData(destinationsData);
        showToast("Destinations listings updated!");
      } else if (activeSection === "study-abroad" && studyAbroadData) {
        await cms.saveStudyAbroadData(studyAbroadData);
        showToast("Study Abroad program guide saved!");
      } else if (activeSection === "about" && aboutData) {
        await cms.saveAboutData(aboutData);
        showToast("About Us details updated!");
      } else if (activeSection === "contact" && contactData) {
        await cms.saveContactData(contactData);
        showToast("Contact information updated!");
      } else if (activeSection === "footer" && footerData && contactData) {
        await Promise.all([
          cms.saveFooterData(footerData),
          cms.saveContactData(contactData),
        ]);
        showToast("Footer and contact info updated!");
      }
    } catch {
      showToast("Error updating configuration. Is the backend running?");
    }
  };

  // Add items dynamic helper functions
  const addCourseItem = () => {
    if (!coursesData) return;
    const newId = coursesData.items.length > 0 ? Math.max(...coursesData.items.map(i => i.id)) + 1 : 1;
    const newItem = {
      id: newId,
      title: "New Professional Course",
      category: "Languages",
      categoryTag: "LANGUAGE PROFICIENCY",
      description: "Enter detailed curriculum and syllabus outlines here.",
      duration: "12 Weeks",
      mode: "In-Person Classes",
      language: "Korean Language",
      imageUrl: "/classroom_bg.png",
      batchInfo: "Batch Starts: Contact Us"
    };
    setCoursesData({
      ...coursesData,
      items: [...coursesData.items, newItem]
    });
  };

  const deleteCourseItem = (id: number) => {
    if (!coursesData) return;
    setCoursesData({
      ...coursesData,
      items: coursesData.items.filter(item => item.id !== id)
    });
  };

  const updateCourseItem = (index: number, key: string, value: string) => {
    if (!coursesData) return;
    const updatedItems = [...coursesData.items];
    updatedItems[index] = { ...updatedItems[index], [key]: value };
    setCoursesData({ ...coursesData, items: updatedItems });
  };

  const addDestinationItem = () => {
    if (!destinationsData) return;
    const newId = destinationsData.items.length > 0 ? Math.max(...destinationsData.items.map(i => i.id)) + 1 : 1;
    const newItem = {
      id: newId,
      name: "New Country Destination",
      tagline: "High-quality academic training and globally recognized certificates.",
      badge: "NEW ROUTE",
      highlights: ["Affordable Living", "Part-Time Job Access", "Scholarships"]
    };
    setDestinationsData({
      ...destinationsData,
      items: [...destinationsData.items, newItem]
    });
  };

  const deleteDestinationItem = (id: number) => {
    if (!destinationsData) return;
    setDestinationsData({
      ...destinationsData,
      items: destinationsData.items.filter(item => item.id !== id)
    });
  };

  const updateDestinationItem = (index: number, key: string, value: string) => {
    if (!destinationsData) return;
    const updatedItems = [...destinationsData.items];
    updatedItems[index] = { ...updatedItems[index], [key]: value };
    setDestinationsData({ ...destinationsData, items: updatedItems });
  };

  const toggleFeaturedDestination = (id: number) => {
    if (!studyAbroadData) return;
    const current = studyAbroadData.featuredDestinationIds ?? [];
    const next = current.includes(id)
      ? current.filter((x) => x !== id)
      : [...current, id];
    setStudyAbroadData({ ...studyAbroadData, featuredDestinationIds: next });
  };

  const addTeamMember = () => {
    if (!aboutData) return;
    const members = aboutData.teamMembers ?? [];
    const newId = members.length > 0 ? Math.max(...members.map((m) => m.id)) + 1 : 1;
    setAboutData({
      ...aboutData,
      teamMembers: [
        ...members,
        { id: newId, name: "New Team Member", role: "Role", bio: "Short bio", imageUrl: "/student_hero.png" },
      ],
    });
  };

  const updateTeamMember = (index: number, key: string, value: string) => {
    if (!aboutData?.teamMembers) return;
    const members = [...aboutData.teamMembers];
    members[index] = { ...members[index], [key]: value };
    setAboutData({ ...aboutData, teamMembers: members });
  };

  const deleteTeamMember = (id: number) => {
    if (!aboutData?.teamMembers) return;
    setAboutData({
      ...aboutData,
      teamMembers: aboutData.teamMembers.filter((m) => m.id !== id),
    });
  };

  const updateDestinationHighlight = (destIndex: number, hlIndex: number, value: string) => {
    if (!destinationsData) return;
    const updatedItems = [...destinationsData.items];
    const updatedHighlights = [...updatedItems[destIndex].highlights];
    updatedHighlights[hlIndex] = value;
    updatedItems[destIndex] = { ...updatedItems[destIndex], highlights: updatedHighlights };
    setDestinationsData({ ...destinationsData, items: updatedItems });
  };

  const selectSection = (id: SectionType) => {
    setActiveSection(id);
    setSidebarOpen(false);
  };

  const renderSidebarNav = (onNavigate?: () => void) => (
    <>
      <div>
        <div className="flex items-center justify-between gap-3 mb-8 lg:mb-10">
          <SiteLogo size="sm" />
          <button
            type="button"
            onClick={() => {
              setSidebarOpen(false);
              onNavigate?.();
            }}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-4">Website Sections</h3>
        <ul className="flex flex-col gap-2">
          {CMS_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => selectSection(item.id)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-all ${
                    isActive
                      ? "bg-primary text-white shadow-lg shadow-primary/20"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  }`}
                >
                  <Icon size={18} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2.5 bg-red-950/20 text-red-400 hover:bg-red-950/40 hover:text-red-300 py-3 rounded-xl text-sm font-semibold transition-all border border-red-950/40"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex font-sans">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-sm z-[60] bg-green-600 text-white font-semibold px-4 sm:px-6 py-3 sm:py-4 rounded-xl shadow-xl flex items-center gap-3">
          <CheckCircle size={20} className="flex-shrink-0" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Mobile sidebar overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-50 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!sidebarOpen}
      >
        <button
          type="button"
          className="absolute inset-0 bg-slate-900/50"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close menu overlay"
        />
        <aside
          className={`absolute left-0 top-0 bottom-0 w-[min(18rem,88vw)] max-w-full bg-white flex flex-col justify-between border-r border-gray-200 p-6 shadow-xl transition-transform duration-300 ease-out ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          role="dialog"
          aria-modal="true"
          aria-label="Admin navigation"
        >
          {renderSidebarNav()}
        </aside>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:w-64 lg:min-h-screen lg:sticky lg:top-0 lg:h-screen bg-white flex-col justify-between border-r border-gray-200 p-6 flex-shrink-0 shadow-sm overflow-y-auto">
        {renderSidebarNav()}
      </aside>

      {/* Main column */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-1 rounded-xl text-gray-700 hover:bg-gray-100 active:scale-95 transition-all"
            aria-label="Open menu"
            aria-expanded={sidebarOpen}
          >
            <Menu size={22} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-primary uppercase tracking-wider">V Five CMS</p>
            <h1 className="text-sm font-extrabold text-gray-900 truncate">{SECTION_LABELS[activeSection]}</h1>
          </div>
          {activeSection !== "users" && (
            <button
              type="button"
              onClick={handleSave}
              className="flex-shrink-0 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-title font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-primary/25 flex items-center gap-1.5 transition-all"
            >
              <Save size={16} />
              <span>Save</span>
            </button>
          )}
        </header>

        {/* Editor Content Area */}
        <main className="flex-1 p-4 sm:p-6 lg:p-10 flex flex-col overflow-y-auto">
          {/* Editor Top Bar — desktop / tablet */}
          <div className="hidden sm:flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-200 pb-6 mb-6 lg:mb-8">
            <div className="min-w-0">
              <h1 className="text-xl lg:text-2xl font-extrabold uppercase tracking-wide text-gray-900 truncate">
                Editing: {SECTION_LABELS[activeSection]}
              </h1>
              <p className="text-gray-400 text-xs mt-1">
                Customize text content and structure for V Five page listings.
              </p>
            </div>
            {activeSection !== "users" && (
              <button
                type="button"
                onClick={handleSave}
                className="w-full sm:w-auto flex-shrink-0 bg-primary hover:bg-primary-hover active:scale-[0.98] text-white font-title font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2 transition-all"
              >
                <Save size={18} />
                <span>Save All Changes</span>
              </button>
            )}
          </div>

          {/* Mobile-only helper under header */}
          <p className="sm:hidden text-gray-400 text-xs mb-4 -mt-2">
            Tap the menu icon to switch sections.
          </p>

        {/* Dynamic Editor Panel */}
        <div className="flex-grow bg-white border border-gray-200 rounded-2xl p-6 lg:p-8 max-w-4xl shadow-sm">
          {cloudinaryReady === false && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs text-amber-900 mb-6">
              Cloudinary is not configured. Add CLOUDINARY_* keys to backend/.env to enable image uploads.
              You can still paste image URLs manually.
            </div>
          )}

          {activeSection === "home" && homeData && (
            <AdminHomeEditor
              homeData={homeData}
              coursesData={coursesData}
              onChange={setHomeData}
            />
          )}

          {activeSection === "footer" && footerData && contactData && (
            <AdminFooterEditor
              footerData={footerData}
              onChange={setFooterData}
              contactData={contactData}
              onContactChange={setContactData}
            />
          )}

          {/* COURSES PANEL */}
          {activeSection === "courses" && coursesData && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">Page Header Text</h2>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Main Title</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={coursesData.title}
                  onChange={(e) => setCoursesData({ ...coursesData, title: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Subtitle Description</label>
                <textarea
                  rows={2}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-colors text-gray-900"
                  value={coursesData.subtitle}
                  onChange={(e) => setCoursesData({ ...coursesData, subtitle: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mt-6">
                <h2 className="text-lg font-bold text-gray-800">Manage Course Listings</h2>
                <button
                  onClick={addCourseItem}
                  className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 active:scale-95 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all duration-150"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Add New Course</span>
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {coursesData.items.map((course, index) => (
                  <div key={course.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
                    <button
                      onClick={() => deleteCourseItem(course.id)}
                      className="absolute top-6 right-6 text-red-500 hover:text-red-400 transition-colors"
                      title="Delete Course"
                    >
                      <Trash2 size={16} />
                    </button>

                    <h4 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">Course #{index + 1}</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Title</label>
                        <input
                          type="text"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                          value={course.title}
                          onChange={(e) => updateCourseItem(index, "title", e.target.value)}
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Category Tag</label>
                          <input
                            type="text"
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                            value={course.categoryTag}
                            onChange={(e) => updateCourseItem(index, "categoryTag", e.target.value)}
                          />
                        </div>
                        <div className="flex flex-col gap-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase">Language Group</label>
                          <select
                            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                            value={course.language}
                            onChange={(e) => updateCourseItem(index, "language", e.target.value)}
                          >
                            <option value="Korean Language">Korean Language</option>
                            <option value="Japanese Language">Japanese Language</option>
                            <option value="English (IELTS/PTE)">English (IELTS/PTE)</option>
                            <option value="None">None</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Duration</label>
                        <input
                          type="text"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                          value={course.duration}
                          onChange={(e) => updateCourseItem(index, "duration", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Category Group</label>
                        <input
                          type="text"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                          value={course.category}
                          onChange={(e) => updateCourseItem(index, "category", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Teaching Mode</label>
                        <select
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                          value={course.mode}
                          onChange={(e) => updateCourseItem(index, "mode", e.target.value)}
                        >
                          <option value="In-Person Classes">In-Person Classes</option>
                          <option value="Online/Virtual">Online/Virtual</option>
                          <option value="Hybrid Learning">Hybrid Learning</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Description</label>
                      <textarea
                        rows={2}
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary resize-none"
                        value={course.description}
                        onChange={(e) => updateCourseItem(index, "description", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="md:col-span-2">
                        <ImageUploadField
                          compact
                          label="Course Image"
                          folder="courses"
                          value={course.imageUrl || ""}
                          onChange={(url) => updateCourseItem(index, "imageUrl", url)}
                          placeholder="/classroom_bg.png"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Batch Schedule Info</label>
                        <input
                          type="text"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                          value={course.batchInfo || ""}
                          onChange={(e) => updateCourseItem(index, "batchInfo", e.target.value)}
                          placeholder="Batch Starts: 1st Nov"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* DESTINATIONS PANEL */}
          {activeSection === "destinations" && destinationsData && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">Page Header Text</h2>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Hero Badge</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={destinationsData.heroBadge}
                  onChange={(e) => setDestinationsData({ ...destinationsData, heroBadge: e.target.value })}
                />
              </div>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Main Title</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={destinationsData.title}
                  onChange={(e) => setDestinationsData({ ...destinationsData, title: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Subtitle Description</label>
                <textarea
                  rows={2}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-colors text-gray-900"
                  value={destinationsData.subtitle}
                  onChange={(e) => setDestinationsData({ ...destinationsData, subtitle: e.target.value })}
                />
              </div>

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-2">Grid Section</h2>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Grid Section Title</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                  value={destinationsData.gridSectionTitle}
                  onChange={(e) => setDestinationsData({ ...destinationsData, gridSectionTitle: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Grid Section Subtitle</label>
                <textarea
                  rows={2}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
                  value={destinationsData.gridSectionSubtitle}
                  onChange={(e) => setDestinationsData({ ...destinationsData, gridSectionSubtitle: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mt-6">
                <h2 className="text-lg font-bold text-gray-800">Manage Destinations</h2>
                <button
                  onClick={addDestinationItem}
                  className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 active:scale-95 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md transition-all duration-150"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Add Destination</span>
                </button>
              </div>

              <div className="flex flex-col gap-6">
                {destinationsData.items.map((dest, index) => (
                  <div key={dest.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
                    <button
                      onClick={() => deleteDestinationItem(dest.id)}
                      className="absolute top-6 right-6 text-red-500 hover:text-red-400 transition-colors"
                      title="Delete Destination"
                    >
                      <Trash2 size={16} />
                    </button>

                    <h4 className="text-xs font-bold text-primary mb-4 uppercase tracking-widest">Destination #{index + 1}</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Country Name</label>
                        <input
                          type="text"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                          value={dest.name}
                          onChange={(e) => updateDestinationItem(index, "name", e.target.value)}
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Badge Label</label>
                        <input
                          type="text"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                          value={dest.badge}
                          onChange={(e) => updateDestinationItem(index, "badge", e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 mb-4">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Tagline</label>
                      <input
                        type="text"
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                        value={dest.tagline}
                        onChange={(e) => updateDestinationItem(index, "tagline", e.target.value)}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[10px] font-bold text-gray-400 uppercase">Flag Emoji</label>
                        <input
                          type="text"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                          value={dest.flag || ""}
                          onChange={(e) => updateDestinationItem(index, "flag", e.target.value)}
                          placeholder="🇰🇷"
                        />
                      </div>
                    </div>
                    <div className="mb-4">
                      <ImageUploadField
                        compact
                        label="Destination Card Image"
                        folder="destinations"
                        value={dest.imageUrl || ""}
                        onChange={(url) => updateDestinationItem(index, "imageUrl", url)}
                        placeholder="/classroom_bg.png"
                      />
                      <p className="text-[10px] text-gray-500 mt-1.5 leading-relaxed">
                        Upload a wide landscape photo (campus or city), not a logo. Recommended about 1200×800 px. Leave empty to show the flag instead.
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-[10px] font-bold text-gray-400 uppercase">Highlights list</label>
                      {dest.highlights.map((hl, hlIdx) => (
                        <input
                          key={hlIdx}
                          type="text"
                          className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 outline-none focus:border-primary"
                          value={hl}
                          onChange={(e) => updateDestinationHighlight(index, hlIdx, e.target.value)}
                          placeholder={`Highlight ${hlIdx + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STUDY ABROAD PANEL */}
          {activeSection === "study-abroad" && studyAbroadData && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">Hero Section</h2>
              
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Main Hero Title</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={studyAbroadData.heroTitle}
                  onChange={(e) => setStudyAbroadData({ ...studyAbroadData, heroTitle: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Hero Subtitle</label>
                <textarea
                  rows={2}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-colors text-gray-900"
                  value={studyAbroadData.heroSubtitle}
                  onChange={(e) => setStudyAbroadData({ ...studyAbroadData, heroSubtitle: e.target.value })}
                />
              </div>

              <ImageUploadField
                label="Study Abroad Hero Image"
                folder="study-abroad"
                value={studyAbroadData.heroImageUrl}
                onChange={(heroImageUrl) => setStudyAbroadData({ ...studyAbroadData, heroImageUrl })}
                placeholder="/study_abroad_hero.png"
              />

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-6">Scholarship Banner</h2>
              {[
                ["Badge", "scholarshipBadge"],
                ["Title", "scholarshipTitle"],
                ["Button Text", "scholarshipButtonText"],
                ["Popular Dest. Title", "popularDestTitle"],
              ].map(([label, key]) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                    value={(studyAbroadData as Record<string, string>)[key] || ""}
                    onChange={(e) => setStudyAbroadData({ ...studyAbroadData, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Scholarship Description</label>
                <textarea
                  rows={2}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
                  value={studyAbroadData.scholarshipDesc || ""}
                  onChange={(e) => setStudyAbroadData({ ...studyAbroadData, scholarshipDesc: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Popular Destinations Subtitle</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                  value={studyAbroadData.popularDestSubtitle || ""}
                  onChange={(e) => setStudyAbroadData({ ...studyAbroadData, popularDestSubtitle: e.target.value })}
                />
              </div>

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-6">Introductory Info</h2>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Section Title</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={studyAbroadData.sectionTitle}
                  onChange={(e) => setStudyAbroadData({ ...studyAbroadData, sectionTitle: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Section Description</label>
                <textarea
                  rows={3}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-colors text-gray-900"
                  value={studyAbroadData.sectionDesc}
                  onChange={(e) => setStudyAbroadData({ ...studyAbroadData, sectionDesc: e.target.value })}
                />
              </div>

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-6">Journey Section</h2>
              {[
                ["Journey Badge", "journeyBadge"],
                ["Journey Title", "journeyTitle"],
              ].map(([label, key]) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                    value={(studyAbroadData as Record<string, string>)[key] || ""}
                    onChange={(e) => setStudyAbroadData({ ...studyAbroadData, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Journey Description</label>
                <textarea
                  rows={2}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
                  value={studyAbroadData.journeyDesc || ""}
                  onChange={(e) => setStudyAbroadData({ ...studyAbroadData, journeyDesc: e.target.value })}
                />
              </div>

              {destinationsData && (
                <div className="flex flex-col gap-3 mt-4">
                  <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">Featured Destinations (Study Abroad grid)</h2>
                  <p className="text-xs text-gray-500">Select countries to show on the Study Abroad page. Order follows selection order.</p>
                  {destinationsData.items.map((dest) => {
                    const selected = (studyAbroadData.featuredDestinationIds ?? []).includes(dest.id);
                    return (
                      <label key={dest.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={selected}
                          onChange={() => toggleFeaturedDestination(dest.id)}
                          className="accent-primary"
                        />
                        <span className="text-sm text-gray-900">{dest.flag} {dest.name}</span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ABOUT PANEL */}
          {activeSection === "about" && aboutData && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">About Hero Text</h2>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Hero Badge</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                  value={aboutData.heroBadge || ""}
                  onChange={(e) => setAboutData({ ...aboutData, heroBadge: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Hero Title</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={aboutData.heroTitle}
                  onChange={(e) => setAboutData({ ...aboutData, heroTitle: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Hero Subtitle</label>
                <textarea
                  rows={2}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-colors text-gray-900"
                  value={aboutData.heroSubtitle}
                  onChange={(e) => setAboutData({ ...aboutData, heroSubtitle: e.target.value })}
                />
              </div>

              <ImageUploadField
                label="About Page Hero Image"
                folder="about"
                value={aboutData.heroImageUrl}
                onChange={(heroImageUrl) => setAboutData({ ...aboutData, heroImageUrl })}
                placeholder="/student_hero.png"
              />

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-6">Our Story Section</h2>
              {[
                ["Story Badge", "storyBadge"],
                ["Story Title", "storyTitle"],
              ].map(([label, key]) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                    value={(aboutData as Record<string, string>)[key] || ""}
                    onChange={(e) => setAboutData({ ...aboutData, [key]: e.target.value })}
                  />
                </div>
              ))}
              {[
                ["Story Paragraph 1", "storyParagraph1"],
                ["Story Paragraph 2", "storyParagraph2"],
              ].map(([label, key]) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
                  <textarea
                    rows={3}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
                    value={(aboutData as Record<string, string>)[key] || ""}
                    onChange={(e) => setAboutData({ ...aboutData, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Story Highlights (bullet list)</label>
                {(aboutData.storyHighlights || []).map((item, idx) => (
                  <input
                    key={idx}
                    type="text"
                    className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                    value={item}
                    onChange={(e) => {
                      const storyHighlights = [...(aboutData.storyHighlights || [])];
                      storyHighlights[idx] = e.target.value;
                      setAboutData({ ...aboutData, storyHighlights });
                    }}
                  />
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Image Overlay Value</label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                    value={aboutData.storyOverlayValue || ""}
                    onChange={(e) => setAboutData({ ...aboutData, storyOverlayValue: e.target.value })}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Image Overlay Label</label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                    value={aboutData.storyOverlayLabel || ""}
                    onChange={(e) => setAboutData({ ...aboutData, storyOverlayLabel: e.target.value })}
                  />
                </div>
              </div>
              <ImageUploadField
                label="Story Section Image"
                folder="about"
                value={aboutData.storyImageUrl || aboutData.heroImageUrl}
                onChange={(storyImageUrl) => setAboutData({ ...aboutData, storyImageUrl })}
                placeholder="/student_hero.png"
              />
              <div className="flex flex-col gap-3">
                <label className="text-xs font-bold text-slate-400 uppercase">Stats (4 counters)</label>
                {(aboutData.stats || []).map((stat, idx) => (
                  <div key={idx} className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Value e.g. 98%"
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      value={stat.value}
                      onChange={(e) => {
                        const stats = [...(aboutData.stats || [])];
                        stats[idx] = { ...stats[idx], value: e.target.value };
                        setAboutData({ ...aboutData, stats });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Label"
                      className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                      value={stat.label}
                      onChange={(e) => {
                        const stats = [...(aboutData.stats || [])];
                        stats[idx] = { ...stats[idx], label: e.target.value };
                        setAboutData({ ...aboutData, stats });
                      }}
                    />
                  </div>
                ))}
              </div>

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-6">Foundations Section Header</h2>
              {[
                ["Foundations Badge", "foundationsBadge"],
                ["Foundations Title", "foundationsTitle"],
              ].map(([label, key]) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                    value={(aboutData as Record<string, string>)[key] || ""}
                    onChange={(e) => setAboutData({ ...aboutData, [key]: e.target.value })}
                  />
                </div>
              ))}

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-6">Core Values & Statements</h2>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Our Mission</label>
                <textarea
                  rows={3}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-colors text-gray-900"
                  value={aboutData.mission}
                  onChange={(e) => setAboutData({ ...aboutData, mission: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Our Vision</label>
                <textarea
                  rows={3}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-colors text-gray-900"
                  value={aboutData.vision}
                  onChange={(e) => setAboutData({ ...aboutData, vision: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Core Integrity Values</label>
                <textarea
                  rows={3}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary resize-none transition-colors text-gray-900"
                  value={aboutData.values}
                  onChange={(e) => setAboutData({ ...aboutData, values: e.target.value })}
                />
              </div>

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-6">Team Section Header</h2>
              {[
                ["Team Badge", "teamBadge"],
                ["Team Title", "teamTitle"],
              ].map(([label, key]) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                    value={(aboutData as Record<string, string>)[key] || ""}
                    onChange={(e) => setAboutData({ ...aboutData, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Team Subtitle</label>
                <textarea
                  rows={2}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
                  value={aboutData.teamSubtitle || ""}
                  onChange={(e) => setAboutData({ ...aboutData, teamSubtitle: e.target.value })}
                />
              </div>

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-6">Bottom CTA Block</h2>
              {[
                ["CTA Badge", "ctaBadge"],
                ["CTA Title", "ctaTitle"],
                ["CTA Button Text", "ctaButtonText"],
              ].map(([label, key]) => (
                <div key={key} className="flex flex-col gap-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">{label}</label>
                  <input
                    type="text"
                    className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900"
                    value={(aboutData as Record<string, string>)[key] || ""}
                    onChange={(e) => setAboutData({ ...aboutData, [key]: e.target.value })}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">CTA Description</label>
                <textarea
                  rows={2}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 resize-none"
                  value={aboutData.ctaDesc || ""}
                  onChange={(e) => setAboutData({ ...aboutData, ctaDesc: e.target.value })}
                />
              </div>
              <ImageUploadField
                label="CTA Background Image"
                folder="about"
                value={aboutData.ctaImageUrl || "/classroom_bg.png"}
                onChange={(ctaImageUrl) => setAboutData({ ...aboutData, ctaImageUrl })}
                placeholder="/classroom_bg.png"
              />

              <div className="flex items-center justify-between border-b border-gray-200 pb-3 mt-6">
                <h2 className="text-lg font-bold text-gray-800">Leadership Team</h2>
                <button
                  onClick={addTeamMember}
                  className="flex items-center gap-2 bg-white text-slate-900 hover:bg-slate-100 text-xs font-bold px-4 py-2.5 rounded-xl shadow-md"
                >
                  <Plus size={14} strokeWidth={2.5} />
                  <span>Add Member</span>
                </button>
              </div>
              <div className="flex flex-col gap-6">
                {(aboutData.teamMembers ?? []).map((member, index) => (
                  <div key={member.id} className="bg-gray-50 p-6 rounded-xl border border-gray-200 relative">
                    <button
                      onClick={() => deleteTeamMember(member.id)}
                      className="absolute top-6 right-6 text-red-500 hover:text-red-400"
                      title="Remove member"
                    >
                      <Trash2 size={16} />
                    </button>
                    <h4 className="text-xs font-bold text-primary mb-4 uppercase">Team Member #{index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <input
                        type="text"
                        placeholder="Name"
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                        value={member.name}
                        onChange={(e) => updateTeamMember(index, "name", e.target.value)}
                      />
                      <input
                        type="text"
                        placeholder="Role"
                        className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900"
                        value={member.role}
                        onChange={(e) => updateTeamMember(index, "role", e.target.value)}
                      />
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Bio"
                      className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-900 w-full mb-4 resize-none"
                      value={member.bio}
                      onChange={(e) => updateTeamMember(index, "bio", e.target.value)}
                    />
                    <ImageUploadField
                      compact
                      label="Photo"
                      folder="about/team"
                      value={member.imageUrl}
                      onChange={(url) => updateTeamMember(index, "imageUrl", url)}
                      placeholder="/student_hero.png"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CONTACT PANEL */}
          {activeSection === "contact" && contactData && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">Global Contact Channels</h2>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">WhatsApp Number</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={contactData.whatsapp}
                  onChange={(e) => setContactData({ ...contactData, whatsapp: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Call Center Lines</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={contactData.phone}
                  onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Inquiry Email</label>
                <input
                  type="email"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={contactData.email}
                  onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                />
              </div>

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-6">Office Location Details</h2>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Office Hours</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={contactData.hours}
                  onChange={(e) => setContactData({ ...contactData, hours: e.target.value })}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Address / Location</label>
                <input
                  type="text"
                  className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-primary transition-colors text-gray-900"
                  value={contactData.location}
                  onChange={(e) => setContactData({ ...contactData, location: e.target.value })}
                />
              </div>

              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800 mt-6">Form Inquiries</h2>
              <p className="text-xs text-gray-500">Submissions from the home and contact page forms (newest first).</p>
              {inquiries.length === 0 ? (
                <p className="text-sm text-gray-400 py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No inquiries yet.
                </p>
              ) : (
                <div className="flex flex-col gap-4">
                  {inquiries.map((inq) => (
                    <div key={inq.id} className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-800">
                      <div className="flex flex-wrap justify-between gap-2 mb-2">
                        <span className="font-bold">{inq.name}</span>
                        <span className="text-xs text-gray-400">
                          {new Date(inq.created_at).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-xs text-gray-600">{inq.phone} · {inq.email}</p>
                      <p className="text-xs text-primary font-semibold mt-1">Course: {inq.course}</p>
                      <p className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">{inq.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* USERS PANEL */}
          {activeSection === "users" && currentAdmin && (
            <div className="flex flex-col gap-6">
              <h2 className="text-lg font-bold border-b border-gray-200 pb-3 text-gray-800">CMS Admin Users</h2>
              <p className="text-xs text-gray-500">
                Signed in as <span className="font-semibold text-gray-800">{currentAdmin.email}</span>.
                Any admin can add or remove team accounts. The primary administrator cannot be deleted.
              </p>

              <form onSubmit={handleAddUser} className="bg-gray-50 border border-gray-200 rounded-xl p-6 flex flex-col gap-4">
                <h3 className="text-sm font-bold text-gray-800">Add New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Display name (optional)"
                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                  />
                  <input
                    type="email"
                    placeholder="Email address"
                    required
                    className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                  />
                </div>
                <input
                  type="password"
                  placeholder="Password (min. 6 characters)"
                  required
                  minLength={6}
                  className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900"
                  value={newUserPassword}
                  onChange={(e) => setNewUserPassword(e.target.value)}
                />
                {userFormError && <p className="text-xs text-red-600">{userFormError}</p>}
                <button
                  type="submit"
                  className="self-start flex items-center gap-2 bg-primary text-white text-xs font-bold px-4 py-2.5 rounded-xl"
                >
                  <Plus size={14} />
                  <span>Add User</span>
                </button>
              </form>

              <div className="flex flex-col gap-3">
                <h3 className="text-sm font-bold text-gray-800">Existing Users</h3>
                {adminUsers.length === 0 ? (
                  <p className="text-sm text-gray-400 py-6 text-center bg-gray-50 rounded-xl border border-dashed border-gray-200">
                    No users found.
                  </p>
                ) : (
                  adminUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex flex-wrap items-center justify-between gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {user.name || user.email}
                          {user.role === "superadmin" && (
                            <span className="ml-2 text-[10px] uppercase bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                              Administrator
                            </span>
                          )}
                          {currentAdmin?.id === user.id && (
                            <span className="ml-2 text-[10px] uppercase bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                              You
                            </span>
                          )}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Added {new Date(user.created_at).toLocaleString()}
                        </p>
                      </div>
                      {user.role !== "superadmin" && currentAdmin?.id !== user.id && (
                        <button
                          type="button"
                          onClick={() => handleDeleteUser(user.id)}
                          className="text-red-500 hover:text-red-600 p-2"
                          title="Remove user"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </main>
      </div>
    </div>
  );
}
