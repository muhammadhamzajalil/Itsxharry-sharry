import React, { useState, useEffect } from "react";
import { Logo } from "./Logo";
import { DynamicIcon } from "./DynamicIcon";

interface NavbarProps {
  isDark: boolean;
  toggleTheme: () => void;
  user: any;
  navigate: (page: string) => void;
  currentPage: string;
}

export const Navbar: React.FC<NavbarProps> = ({ isDark, toggleTheme, user, navigate, currentPage }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Products", page: "shop" },
    { label: "Price Plan", page: "pricing" },
    { label: "Support", page: "contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || currentPage !== "home"
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-200/80 text-gray-900"
          : "bg-white/40 backdrop-blur-md text-gray-900"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-[30px] md:px-[40px] w-full">
        <div className="flex items-center justify-between h-20 lg:h-[85px] relative">
          
          {/* Logo Brand */}
          <button 
            onClick={() => navigate("home")} 
            className="flex items-center text-left bg-transparent border-none outline-none select-none cursor-pointer w-[140px] md:w-[160px] lg:w-[200px]"
          >
            <Logo iconOnly={false} className="w-full" />
          </button>

          {/* Centered Desktop Nav Menu */}
          <div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center justify-center">
            <div className="flex items-center gap-[45px]">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => navigate(link.page)}
                  className={`cursor-pointer transition-colors duration-200 relative group bg-transparent text-[16px] font-medium pb-1.5 ${
                    currentPage === link.page
                      ? "text-[#0B7A33]"
                      : "text-gray-600 hover:text-[#0B7A33]"
                  }`}
                >
                  {link.label}
                  <span className={`absolute bottom-0 left-0 h-0.5 bg-[#0B7A33] group-hover:w-full transition-all duration-200 ${currentPage === link.page ? "w-full" : "w-0"}`} />
                </button>
              ))}
            </div>
          </div>

          {/* Authentication & User Buttons on Right */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <button
                onClick={() => navigate(user.role === "admin" ? "admin" : "dashboard")}
                className="px-4 py-2 rounded-lg border border-[#0B7A33]/30 text-[#0B7A33] hover:bg-[#0B7A33]/5 text-xs font-mono font-bold uppercase cursor-pointer transition-colors duration-150"
              >
                {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate("login")}
                  className="text-xs font-bold uppercase tracking-widest text-gray-600 hover:text-gray-900 cursor-pointer px-3 py-2 transition-colors"
                >
                  Log In
                </button>

                <button
                  onClick={() => navigate("register")}
                  className="px-5 py-2.5 rounded-lg bg-[#0B7A33] hover:bg-[#12A84A] text-white text-xs font-bold tracking-wider uppercase shadow-xs transition-all duration-200 cursor-pointer"
                >
                  Register
                </button>
              </>
            )}
          </div>

          {/* Mobile Right Bar Actions */}
          <div className="flex lg:hidden items-center">


            {/* Mobile Hamburger menu */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-950 transition-colors cursor-pointer"
              aria-label="Toggle Navigation Tray"
            >
              <DynamicIcon name={mobileMenuOpen ? "X" : "Menu"} size={22} />
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 py-4 px-4 bg-white border-b border-gray-200 shadow-xl flex flex-col gap-4 animate-fadeIn">
          <div className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => {
                  navigate(link.page);
                  setMobileMenuOpen(false);
                }}
                className={`text-left py-2 text-sm font-semibold uppercase tracking-wider border-b border-gray-100 cursor-pointer ${
                  currentPage === link.page ? "text-[#0B7A33] font-bold" : "text-gray-600 hover:text-gray-950"
                }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2.5 pt-2">
            {user ? (
              <button
                onClick={() => {
                  navigate(user.role === "admin" ? "admin" : "dashboard");
                  setMobileMenuOpen(false);
                }}
                className="py-2.5 text-center rounded-lg bg-[#0B7A33] text-white text-xs font-bold uppercase cursor-pointer"
              >
                {user.role === "admin" ? "Admin Panel" : "My Dashboard"}
              </button>
            ) : (
              <>
                <button
                  onClick={() => {
                    navigate("login");
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 text-center rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold uppercase cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    navigate("register");
                    setMobileMenuOpen(false);
                  }}
                  className="py-2.5 text-center rounded-lg bg-[#0B7A33] text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Join Ecom Network
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
