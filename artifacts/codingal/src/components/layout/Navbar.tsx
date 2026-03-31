import { Link, useLocation } from "wouter";
import { Menu, X, ChevronRight, LayoutDashboard, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { openBookingModal } from "@/lib/events";
import { useAuth } from "@/lib/auth";

const NAV_LINKS = [
  { label: "Courses", href: "/courses" },
  { label: "For Schools", href: "#" },
  { label: "About Us", href: "#" },
  { label: "Blog", href: "#" },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, navigate] = useLocation();
  const { student, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <>
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 transform group-hover:-rotate-12">
                <img 
                  src={`${import.meta.env.BASE_URL}images/logo-icon.png`} 
                  alt="Logo" 
                  className="w-6 h-6 object-contain brightness-0 invert" 
                />
              </div>
              <span className="text-2xl font-display font-bold text-gray-900 tracking-tight">
                Praise Coding Academy
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className={`text-base font-semibold transition-colors hover:text-primary ${
                    location === link.href ? "text-primary" : "text-gray-600"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {student ? (
                <>
                  <button
                    onClick={() => navigate(`/dashboard/${student.id}`)}
                    className="flex items-center gap-2 text-gray-700 font-semibold hover:text-primary transition-colors px-4 py-2"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    My Dashboard
                  </button>
                  <button
                    onClick={() => { logout(); navigate("/"); }}
                    className="text-gray-500 font-semibold hover:text-red-500 transition-colors px-3 py-2 text-sm"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/admin/login"
                    className="flex items-center gap-1.5 text-gray-500 hover:text-primary transition-colors text-sm font-medium px-2 py-1.5"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                  <button
                    onClick={() => navigate("/login")}
                    className="text-gray-600 font-semibold hover:text-primary transition-colors px-4 py-2"
                  >
                    Login
                  </button>
                  <button
                    onClick={openBookingModal}
                    className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-secondary/30 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Book a Free Class
                  </button>
                </>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-x-0 top-[72px] z-40 bg-white border-b border-gray-100 shadow-xl overflow-hidden md:hidden"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-lg font-semibold text-gray-800 py-2 border-b border-gray-50 flex items-center justify-between"
                >
                  {link.label}
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </Link>
              ))}
              <div className="mt-4 flex flex-col gap-3">
                <button className="w-full py-3 rounded-xl border-2 border-gray-200 text-gray-700 font-bold">
                  Login
                </button>
                <button 
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openBookingModal();
                  }}
                  className="w-full py-3 rounded-xl bg-secondary text-white font-bold shadow-md"
                >
                  Book a Free Class
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
