import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "motion/react";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { Stats } from "./components/Stats";
import { HowItWorks } from "./components/HowItWorks";
import { CompanyIntroduction } from "./components/CompanyIntroduction";
import { FeaturedProducts } from "./components/FeaturedProducts";
import { Ecosystem } from "./components/Ecosystem";
import { Features } from "./components/Features";
import { DashboardSimulation } from "./components/DashboardSimulation";
import { Testimonials } from "./components/Testimonials";
import { Comparison } from "./components/Comparison";
import { FAQ } from "./components/FAQ";
import { CTA } from "./components/CTA";
import { Footer } from "./components/Footer";

// Page modules
import { About } from "./pages/About";
import { Opportunity } from "./pages/Opportunity";
import { CompensationPlan } from "./pages/CompensationPlan";
import { PricingPage } from "./pages/PricingPage";
import { ContactPage } from "./pages/ContactPage";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Dashboard } from "./pages/Dashboard";
import { AdminPanel } from "./pages/AdminPanel";
import { ShopStorefront } from "./pages/ShopStorefront";

export default function App() {
  const [currentPage, setCurrentPage] = useState<string>(() => {
    // Basic bookmarking reload preserve
    const params = new URLSearchParams(window.location.search);
    const view = params.get("p");
    return view || "home";
  });

  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem("ecom-network-theme");
    return stored ? stored === "dark" : false;
  });

  // Authentication states
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem("ecom-network-token") || null;
  });

  const [user, setUser] = useState<any>(() => {
    const storedUser = localStorage.getItem("ecom-network-user");
    try {
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const toggleTheme = () => {
    setIsDark((prev) => {
      const next = !prev;
      localStorage.setItem("ecom-network-theme", next ? "dark" : "light");
      return next;
    });
  };

  // Synchronize layout styling selectors
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [isDark]);

  // Handle routing navigation updates
  const navigate = (page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
    
    // Seamless push state in URL parameters so user can refresh without losing place
    const url = new URL(window.location.href);
    url.searchParams.set("p", page);
    window.history.pushState({}, "", url.toString());
  };

  // On Login/Register success callback
  const handleLoginSuccess = (newToken: string, newUser: any) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem("ecom-network-token", newToken);
    localStorage.setItem("ecom-network-user", JSON.stringify(newUser));
  };

  // On Logout callback
  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("ecom-network-token");
    localStorage.removeItem("ecom-network-user");
    navigate("home");
  };

  return (
    <div className="min-h-screen font-sans bg-white text-gray-900">
      
      {/* Conditionally show normal header navbar unless the user is on credentials or dashboard layouts */}
      {!["login", "register", "dashboard", "admin"].includes(currentPage) && (
        <Navbar
          isDark={isDark}
          toggleTheme={toggleTheme}
          user={user}
          navigate={navigate}
          currentPage={currentPage}
        />
      )}

      {/* Pages Switchboard wrapped with gorgeous AnimatePresence routes transitions fades */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentPage}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.25, ease: "easeInOut" }}
        >
          {currentPage === "home" && (
            <>
              <Hero navigate={navigate} />
              <CompanyIntroduction />
              <FeaturedProducts navigate={navigate} />
              <HowItWorks />
              <DashboardSimulation />
              <Testimonials />
              <FAQ />
              <CTA navigate={navigate} />
            </>
          )}

          {currentPage === "about" && <About navigate={navigate} />}
          
          {currentPage === "opportunity" && <Opportunity navigate={navigate} />}
          
          {currentPage === "compensation" && <CompensationPlan navigate={navigate} />}
          
          {currentPage === "pricing" && <PricingPage navigate={navigate} />}
          
          {currentPage === "contact" && <ContactPage navigate={navigate} />}

          {currentPage === "shop" && (
            <ShopStorefront navigate={navigate} token={token} />
          )}

          {currentPage === "login" && (
            <Login onLoginSuccess={handleLoginSuccess} navigate={navigate} />
          )}

          {currentPage === "register" && (
            <Register onLoginSuccess={handleLoginSuccess} navigate={navigate} />
          )}

          {currentPage === "dashboard" && (
            <Dashboard token={token} onLogout={handleLogout} navigate={navigate} />
          )}

          {currentPage === "admin" && (
            <AdminPanel token={token} navigate={navigate} />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Render matching footers */}
      {!["login", "register", "dashboard", "admin"].includes(currentPage) && (
        <Footer navigate={navigate} />
      )}

    </div>
  );
}
