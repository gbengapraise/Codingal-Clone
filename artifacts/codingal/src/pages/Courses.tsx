import { Layout } from "@/components/layout/Layout";
import { useCourses, Course } from "@/hooks/use-courses";
import { Search, Filter, BookOpen, Clock, BarChart, ArrowRight } from "lucide-react";
import { useState } from "react";
import { openBookingModal } from "@/lib/events";

export default function Courses() {
  const { data: courses, isLoading } = useCourses();
  const [activeLevel, setActiveLevel] = useState<string>("All");

  const filteredCourses = courses?.filter(c => activeLevel === "All" || c.level === activeLevel) || [];

  return (
    <Layout>
      {/* Header Banner */}
      <div className="bg-gray-900 py-20 text-center px-4">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-6">Explore Our Coding Courses</h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
          From block-based basics to advanced artificial intelligence, we have the perfect curriculum for every age and skill level.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Filters and Search Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 hide-scrollbar">
            {["All", "Beginner", "Intermediate", "Advanced"].map(level => (
              <button
                key={level}
                onClick={() => setActiveLevel(level)}
                className={`px-6 py-2.5 rounded-full font-bold whitespace-nowrap transition-all ${
                  activeLevel === level 
                    ? "bg-primary text-white shadow-md" 
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {level}
              </button>
            ))}
          </div>
          
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search courses..." 
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 bg-gray-50"
            />
          </div>
        </div>

        {/* Course Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="animate-pulse bg-white rounded-3xl p-4 border border-gray-100 h-96">
                <div className="w-full h-48 bg-gray-200 rounded-2xl mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course: Course) => (
              <div key={course.id} className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-gray-200/50 border border-gray-100 flex flex-col group hover:border-primary/50 transition-colors">
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden relative">
                  <img 
                    src={`${import.meta.env.BASE_URL}images/${course.image}`} 
                    alt={course.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  {course.popular && (
                    <div className="absolute top-4 right-4 bg-secondary text-white text-xs font-bold px-3 py-1 rounded-full shadow-md uppercase tracking-wider">
                      Popular
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-grow">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-sm font-bold">
                      <BarChart className="w-4 h-4" />
                      {course.level}
                    </span>
                    <span className="flex items-center gap-1.5 px-3 py-1 bg-orange-50 text-orange-700 rounded-md text-sm font-bold">
                      <Clock className="w-4 h-4" />
                      {course.ages}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{course.title}</h3>
                  <p className="text-gray-600 mb-8 flex-grow leading-relaxed">{course.description}</p>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 text-gray-500 font-semibold text-sm">
                      <BookOpen className="w-5 h-5" />
                      {course.lessons} Lessons
                    </div>
                    <button 
                      onClick={openBookingModal}
                      className="text-primary font-bold hover:text-primary/80 flex items-center gap-1 group/btn"
                    >
                      Enroll Now
                      <ArrowRight className="w-4 h-4 transform group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </Layout>
  );
}
