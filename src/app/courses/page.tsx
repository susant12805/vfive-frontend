"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import {
  Search,
  Filter,
  HelpCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import { cms, CoursesCMSData } from "@/utils/cmsData";
import { useEffect } from "react";

export default function CoursesPage() {
  const [coursesCMS, setCoursesCMS] = useState<CoursesCMSData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void cms
      .getCoursesData()
      .then(setCoursesCMS)
      .finally(() => setLoading(false));
  }, []);

  const courses = coursesCMS?.items ?? [];

  const availableCategories = useMemo(
    () => [...new Set(courses.map((c) => c.category))].sort(),
    [courses]
  );

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedDuration, setSelectedDuration] = useState("Any Duration");

  // Sorting & Pagination State
  const [sortBy, setSortBy] = useState("Newest First");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Handles Category Dropdown changes
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setCurrentPage(1);
  };

  // Handles Duration Dropdown changes
  const handleDurationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDuration(e.target.value);
    setCurrentPage(1);
  };

  // Filtered and Sorted Courses
  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      // 1. Search Query Match
      const matchesSearch = searchQuery.trim() === "" || 
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.categoryTag.toLowerCase().includes(searchQuery.toLowerCase());
      
      // 2. Category Select Match
      const matchesCategory = selectedCategory === "All Categories" || 
        course.category === selectedCategory;

      // 3. Duration Select Match
      let matchesDuration = true;
      if (selectedDuration !== "Any Duration") {
        const weeks = parseInt(course.duration, 10) || 0;
        if (selectedDuration === "Short ( < 10 Weeks )") {
          matchesDuration = weeks > 0 && weeks < 10;
        } else if (selectedDuration === "Long ( >= 10 Weeks )") {
          matchesDuration = weeks >= 10;
        }
      }

      return matchesSearch && matchesCategory && matchesDuration;
    }).sort((a, b) => {
      // Simple sorting simulation
      if (sortBy === "Alphabetical") {
        return a.title.localeCompare(b.title);
      }
      if (sortBy === "Duration (Short First)") {
        return (parseInt(a.duration, 10) || 0) - (parseInt(b.duration, 10) || 0);
      }
      // Default: ID descending (representing newest first)
      return b.id - a.id;
    });
  }, [courses, searchQuery, selectedCategory, selectedDuration, sortBy]);

  // Paginated Courses
  const paginatedCourses = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredCourses, currentPage]);

  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const resetAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All Categories");
    setSelectedDuration("Any Duration");
    setSortBy("Newest First");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar activePage="Courses" />

      <main>
        {/* Banner Section */}
        <section className="relative bg-primary py-24 text-white overflow-hidden flex items-center justify-center text-center">
          <div className="max-w-3xl mx-auto px-6 relative z-10">
            <span className="inline-block bg-white/10 px-4 py-1.5 rounded-full text-accent font-title text-xs font-bold uppercase tracking-wider mb-4">Global Opportunities</span>
            {loading ? (
              <div className="flex flex-col items-center gap-4 animate-pulse">
                <div className="h-10 w-3/4 max-w-lg bg-white/20 rounded-lg" />
                <div className="h-5 w-full max-w-md bg-white/10 rounded-lg" />
              </div>
            ) : (
              <>
                <h1 className="font-title text-3xl md:text-5xl font-black mb-6 leading-tight">{coursesCMS?.title}</h1>
                <p className="text-white/80 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                  {coursesCMS?.subtitle}
                </p>
              </>
            )}
          </div>
        </section>

        {/* Search & Filter Bar Section */}
        <section className="py-8 bg-white border-b border-slate-100 shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
              {/* Search Field */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold font-title text-slate-500 uppercase tracking-wide">Search Courses</span>
                <div className="relative flex items-center">
                  <Search size={18} className="absolute left-4 text-slate-400" />
                  <input
                    type="text"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:bg-white focus:border-primary outline-none transition-colors"
                    placeholder="What would you like to learn today?"
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                  />
                </div>
              </div>

              {/* Category Dropdown */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold font-title text-slate-500 uppercase tracking-wide">Category</span>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary transition-colors cursor-pointer appearance-none" 
                    value={selectedCategory} 
                    onChange={handleCategoryChange}
                  >
                    <option value="All Categories">All Categories</option>
                    {availableCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Duration Dropdown */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold font-title text-slate-500 uppercase tracking-wide">Duration</span>
                <div className="relative">
                  <select 
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:bg-white focus:border-primary transition-colors cursor-pointer appearance-none" 
                    value={selectedDuration} 
                    onChange={handleDurationChange}
                  >
                    <option value="Any Duration">Any Duration</option>
                    <option value="Short ( < 10 Weeks )">Short (&lt; 10 Weeks)</option>
                    <option value="Long ( >= 10 Weeks )">Long (&ge; 10 Weeks)</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Reset Filters Button */}
              <div>
                <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-title font-semibold text-sm rounded-xl transition-all duration-200 cursor-pointer" onClick={resetAllFilters}>
                  <Filter size={16} />
                  <span>Clear Filters</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Courses Content Area */}
        <section className="py-16 bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="flex flex-col gap-8">
              {/* Header result row */}
              <div className="flex items-center justify-between border-b border-slate-205 pb-4">
                <div className="text-sm font-semibold text-slate-600">
                  {filteredCourses.length} Courses found {selectedCategory !== "All Categories" ? `in ${selectedCategory}` : "in all categories"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <span>Sort by:</span>
                  <select 
                    className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
                    value={sortBy}
                    onChange={(e) => { setSortBy(e.target.value); setCurrentPage(1); }}
                  >
                    <option value="Newest First">Newest First</option>
                    <option value="Alphabetical">Alphabetical</option>
                    <option value="Duration (Short First)">Duration (Short First)</option>
                  </select>
                </div>
              </div>

              {/* Courses Grid */}
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((n) => (
                    <div key={n} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden animate-pulse">
                      <div className="aspect-[16/10] bg-slate-200" />
                      <div className="p-6 space-y-3">
                        <div className="h-4 w-24 bg-slate-200 rounded" />
                        <div className="h-5 w-full bg-slate-200 rounded" />
                        <div className="h-12 w-full bg-slate-100 rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginatedCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedCourses.map((course) => (
                    <div key={course.id} className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between">
                      <div>
                        <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                          <Image
                            src={course.imageUrl || "/classroom_bg.png"}
                            alt={course.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 300px"
                            className="object-cover"
                          />
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                            <span className="text-[10px] font-extrabold uppercase bg-primary-light text-primary px-2.5 py-1 rounded-full tracking-wider">
                              {course.categoryTag}
                            </span>
                            <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full tracking-wider">
                              {course.mode}
                            </span>
                          </div>

                          <h3 className="font-title text-lg font-bold text-slate-900 leading-snug mb-2">
                            {course.title}
                          </h3>
                          <p className="text-xs text-slate-500 leading-relaxed mb-4">
                            {course.description}
                          </p>
                        </div>
                      </div>

                      <div className="px-6 pb-6 pt-4 border-t border-slate-100 flex items-center justify-between gap-3 text-xs text-slate-400 font-medium mt-auto">
                        <div className="flex flex-col gap-1 text-slate-500 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <Clock size={15} className="flex-shrink-0" />
                            <span>{course.duration}</span>
                          </div>
                          {course.batchInfo && (
                            <span className="text-primary font-semibold truncate">{course.batchInfo}</span>
                          )}
                        </div>
                        <a href="/contact" className="inline-flex items-center gap-1 font-title font-bold text-primary hover:underline text-sm flex-shrink-0">
                          <span>Enroll Now</span>
                          <ChevronRight size={14} strokeWidth={3} />
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-20 px-6 text-center bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
                  <HelpCircle size={48} className="text-slate-300 mb-4" />
                  <h3 className="font-title text-lg font-bold text-slate-800 mb-2">No Courses Found</h3>
                  <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
                    We couldn't find any courses matching your filters. Try clearing your filters and search keywords.
                  </p>
                  <button className="font-title font-bold text-white bg-primary px-6 py-2.5 rounded-xl hover:bg-primary-hover shadow-sm transition-all" onClick={resetAllFilters}>
                    Clear Filters
                  </button>
                </div>
              )}

              {/* Pagination block */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-8">
                  <button 
                    className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  
                  {[...Array(totalPages)].map((_, index) => {
                    const pageNum = index + 1;
                    return (
                      <button
                        key={pageNum}
                        className={`w-10 h-10 border rounded-xl flex items-center justify-center hover:bg-slate-100 transition-all font-semibold text-sm ${currentPage === pageNum ? "bg-primary text-white border-primary hover:bg-primary-hover" : "border-slate-200"}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                  
                  <button 
                    className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    aria-label="Next page"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Global Journey CTA Section */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-6 md:px-8">
            <div className="bg-primary text-white rounded-3xl p-8 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden shadow-xl">
              <div className="lg:col-span-7 flex flex-col items-start gap-6">
                <h2 className="font-title text-3xl md:text-4xl font-extrabold leading-tight">Start Your Global Journey with V Five</h2>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                  Join thousands of successful students who have reached their academic and career goals with our professional guidance.
                </p>
                <a
                  href="/contact"
                  className="font-title font-bold text-slate-900 bg-accent hover:bg-accent-hover px-6 py-3.5 rounded-xl shadow-sm transition-all duration-200 inline-block"
                >
                  Enrol Now
                </a>
              </div>
              <div className="lg:col-span-5 w-full max-w-sm mx-auto">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border-2 border-white/10">
                  <Image
                    src="/classroom_bg.png"
                    alt="Modern Learning Space"
                    fill
                    className="object-cover"
                    sizes="(max-width: 991px) 100vw, 440px"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
