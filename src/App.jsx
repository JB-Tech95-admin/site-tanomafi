import React, { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import 'leaflet-routing-machine';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';

import Navigation from "./pages/Navigation";
import Footer from "./pages/Footer";
import Dashboard from "./pages/Dashboard";
import AuthModal from "./pages/AuthModal";

import ActionsSection from "./components/ActionSection";
import ContactSection from "./components/ContactSection";
import GallerySection from "./components/GallerySection";
import HeroSection from "./components/HeroSection";
import ImpactSection from "./components/ImpactSection";
import MapSection from "./components/MapSection";
import MembersSection from "./components/MembersSection";
import Notification from "./components/Notification";
import { apiService } from "./services/api";
import { Lock, UserCheck } from "lucide-react";

import './leaflet-setup';

// ===== COMPOSANT PRINCIPAL =====
const App = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("accueil");
  const [isScrolled, setIsScrolled] = useState(false);
  const [notification, setNotification] = useState(null);
  const [counters, setCounters] = useState({ audio: 24, clips: 24, awards: 3, members: 4 });
  const [darkMode, setDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [currentView, setCurrentView] = useState("home");
  const [userRole, setUserRole] = useState("user");
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);

      const sections = ["accueil", "actions", "mpikambana", "galerie", "impact", "saritany", "contact"];
      const current = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 120 && rect.bottom >= 100;
        }
        return false;
      });

      if (current) setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Fetch dashboard stats
  useEffect(() => {
    const loadStats = async () => {
      try {
        const stats = await apiService.getDashboardStats();
        if (stats?.counters) {
          setCounters(stats.counters);
        }
      } catch (err) {}
    };
    loadStats();
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      root.style.setProperty("color-scheme", "dark");
    } else {
      root.classList.remove("dark");
      root.style.setProperty("color-scheme", "light");
    }
  }, [darkMode]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = element.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  const handleAuth = async () => {
    const emailInput = formData.email.trim().toLowerCase();

    // STRICT CHECK: Email extension @tanomafi.mg
    if (!emailInput.endsWith("@tanomafi.mg")) {
      setNotification({
        type: "error",
        message: "Ny mailaka dia tsy maintsy mifarana amin'ny @tanomafi.mg (Ex: anarana@tanomafi.mg) !",
      });
      setTimeout(() => setNotification(null), 5000);
      return;
    }

    try {
      if (authMode === "login") {
        const res = await apiService.login(emailInput, formData.password);
        if (res?.token) {
          localStorage.setItem('tanomafi_token', res.token);
        }

        setIsAuthenticated(true);
        setUserRole(res.user.role || "user");
        setUser(res.user);
        setShowAuthModal(false);

        if (res.user.role === "admin") {
          setCurrentView("dashboard");
          setNotification({ type: "success", message: "Fidirana Admin totosa ! Tongasoa amin'ny Espace Admin." });
        } else {
          setCurrentView("home");
          setNotification({ type: "success", message: `Tongasoa ${res.user.name} ! Azonao jerena izao ny Saritany.` });
        }
      } else {
        const res = await apiService.register(formData.name, emailInput, formData.password);
        if (res?.token) {
          localStorage.setItem('tanomafi_token', res.token);
        }

        setIsAuthenticated(true);
        setUserRole("user");
        setUser(res.user);
        setShowAuthModal(false);
        setCurrentView("home");
        setNotification({ type: "success", message: "Famoronana kaonty totosa ! Tongasoa mpikambana vaovao." });
      }
    } catch (err) {
      setNotification({
        type: "error",
        message: err.message || "Mailaka na teny miafina diso ! Manandrama indray.",
      });
    }
    setTimeout(() => setNotification(null), 5000);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserRole("user");
    setUser(null);
    setCurrentView("home");
    setShowProfileMenu(false);
    localStorage.removeItem('tanomafi_token');
    setFormData({ name: "", email: "", password: "" });
    setNotification({ type: "success", message: "Fivoahana totosa !" });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-slate-50 to-blue-50 text-gray-800"
    }`}>
      <Navigation
        isScrolled={isScrolled}
        darkMode={darkMode}
        currentView={currentView}
        activeSection={activeSection}
        isAuthenticated={isAuthenticated}
        userRole={userRole}
        user={user}
        setCurrentView={setCurrentView}
        setDarkMode={setDarkMode}
        setShowAuthModal={setShowAuthModal}
        setAuthMode={setAuthMode}
        showProfileMenu={showProfileMenu}
        setShowProfileMenu={setShowProfileMenu}
        handleLogout={handleLogout}
        scrollToSection={scrollToSection}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      {showAuthModal && (
        <AuthModal
          darkMode={darkMode}
          authMode={authMode}
          setAuthMode={setAuthMode}
          formData={formData}
          setFormData={setFormData}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          setShowAuthModal={setShowAuthModal}
          handleAuth={handleAuth}
        />
      )}

      {currentView === "dashboard" && userRole === "admin" ? (
        <Dashboard darkMode={darkMode} user={user} />
      ) : (
        <main className="w-full">
          <HeroSection darkMode={darkMode} scrollToSection={scrollToSection} />
          <ActionsSection darkMode={darkMode} />
          <MembersSection darkMode={darkMode} />
          <GallerySection darkMode={darkMode} />
          <ImpactSection darkMode={darkMode} counters={counters} />

          {/* MAP SECTION: Visible ONLY IF Authenticated (Client or Admin) */}
          {isAuthenticated ? (
            <MapSection darkMode={darkMode} />
          ) : (
            <section id="saritany" className={`py-20 px-4 transition-colors duration-300 ${
              darkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-900 to-blue-950 text-white"
            }`}>
              <div className="max-w-4xl mx-auto text-center p-10 bg-white/5 backdrop-blur-lg rounded-3xl border border-white/10 shadow-2xl">
                <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl flex items-center justify-center shadow-xl">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
                  Saritany sy Kajy Lalan-kalana (Carte & Itinéraire)
                </h2>
                <p className="text-gray-300 text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
                  Mila kaonty amin'ny mailaka <strong className="text-blue-400">@tanomafi.mg</strong> ianao raha te hijery ny saritany mifandray amin'ny Fiangonana sy mikajy ny halavirana.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <button
                    onClick={() => { setShowAuthModal(true); setAuthMode("register"); }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white font-bold rounded-full text-base shadow-xl transform hover:scale-105 transition-all flex items-center space-x-2 cursor-pointer"
                  >
                    <UserCheck className="w-5 h-5" />
                    <span>Hamorona Kaonty (@tanomafi.mg)</span>
                  </button>
                  <button
                    onClick={() => { setShowAuthModal(true); setAuthMode("login"); }}
                    className="px-8 py-4 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full text-base border border-white/20 transition-all cursor-pointer"
                  >
                    <span>Hiditra amin'ny kaonty</span>
                  </button>
                </div>
              </div>
            </section>
          )}

          <ContactSection darkMode={darkMode} setNotification={setNotification} />
          <Footer />
        </main>
      )}

      <Notification notification={notification} />
    </div>
  );
};

export default App;