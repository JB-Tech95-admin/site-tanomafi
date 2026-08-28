import {
  Menu, X, Sun, Moon, User, Shield, BarChart3, UserCircle, Settings, LogOut, LayoutDashboard, ExternalLink
} from "lucide-react";

const Navigation = ({ 
  isScrolled, darkMode, currentView, activeSection, isAuthenticated, userRole, user,
  setCurrentView, setDarkMode, setShowAuthModal, setAuthMode, showProfileMenu, 
  setShowProfileMenu, handleLogout, scrollToSection, isMenuOpen, setIsMenuOpen 
}) => {
  const navItems = [
    { id: "accueil", label: "Fandraisana" },
    { id: "actions", label: "Hetsika" },
    { id: "mpikambana", label: "Tanora" },
    { id: "galerie", label: "Sary" },
    { id: "impact", label: "Taha" },
    { id: "saritany", label: "Saritany" },
    { id: "contact", label: "Fifandraisana" },
  ];

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${
      isScrolled ? darkMode ? "bg-gray-900/95 backdrop-blur-lg shadow-2xl" : "bg-white/95 backdrop-blur-lg shadow-2xl"
        : darkMode ? "bg-gray-900/90 backdrop-blur-md shadow-lg" : "bg-white/90 backdrop-blur-md shadow-lg"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer group"
            onClick={() => { setCurrentView("home"); scrollToSection("accueil"); }}>
            <div className="p-2 rounded-xl bg-blue-50 dark:bg-gray-800">
              <img src="/image/logos.png" alt="logo" className="w-12 h-12 object-contain transform group-hover:scale-105 transition-transform" />
            </div>
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
              TANOMAFI
            </span>
          </div>

          {/* Desktop Nav Items */}
          {currentView === "home" && (
            <div className="hidden lg:flex items-center space-x-1 bg-gray-50/80 dark:bg-gray-800/80 p-1.5 rounded-full border border-gray-200/50 dark:border-gray-700/50">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => scrollToSection(item.id)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                    activeSection === item.id 
                      ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md scale-105"
                      : darkMode ? "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                        : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                  }`}>
                  {item.label}
                </button>
              ))}
              <a
                href="https://site-tanomafi.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center space-x-1 px-3.5 py-2 rounded-full text-xs font-bold transition-all duration-300 ${
                  darkMode
                    ? "text-gray-300 hover:bg-gray-700 hover:text-blue-400"
                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                }`}
              >
                <span>site-tanomafi.vercel.app</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Right Action Icons & Buttons */}
          <div className="flex items-center space-x-3">
            {/* Admin Dashboard button */}
            {isAuthenticated && userRole === "admin" && (
              <button 
                onClick={() => setCurrentView(currentView === "dashboard" ? "home" : "dashboard")}
                className={`px-3.5 py-2 rounded-full font-semibold text-xs transition-all flex items-center space-x-1.5 shadow ${
                  currentView === "dashboard"
                    ? "bg-blue-600 text-white"
                    : "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-300 hover:bg-red-100"
                }`}
                title="Tabilao Admin"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="hidden sm:inline">Espace Admin</span>
              </button>
            )}

            {/* Dark Mode toggle */}
            <button onClick={() => setDarkMode(!darkMode)}
              className={`p-2.5 rounded-full transition-colors ${darkMode ? "hover:bg-gray-700 text-yellow-400" : "hover:bg-gray-100 text-gray-700"}`}>
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            {/* Login or User Profile */}
            {!isAuthenticated ? (
              <button onClick={() => { setShowAuthModal(true); setAuthMode("login"); }}
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-5 py-2.5 rounded-full text-xs font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 cursor-pointer">
                <User className="w-4 h-4" />
                <span>Hiditra (Connexion)</span>
              </button>
            ) : (
              <div className="relative">
                <button onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className={`flex items-center space-x-2 p-1.5 rounded-full border border-gray-200 dark:border-gray-700 transition-colors ${
                    darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"
                  }`}>
                  <div className="relative">
                    <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
                      {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                    {userRole === "admin" && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900">
                        <Shield className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className={`absolute right-0 mt-2 w-64 rounded-2xl shadow-2xl py-2 animate-fade-in border border-gray-100 dark:border-gray-700 ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
                  }`}>
                    <div className={`px-4 py-3 border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                      <div className="flex items-center space-x-2 mb-1">
                        <p className="font-bold text-sm truncate">{user?.name}</p>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          userRole === "admin" ? "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300"
                            : "bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300"
                        }`}>
                          {userRole === "admin" ? "Admin" : "Client"}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
                    </div>

                    {userRole === "admin" && (
                      <button 
                        onClick={() => { setCurrentView("dashboard"); setShowProfileMenu(false); }}
                        className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center space-x-2 transition-colors ${
                          darkMode ? "hover:bg-gray-700 text-blue-400" : "hover:bg-blue-50 text-blue-600"
                        }`}>
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Tabilao Admin</span>
                      </button>
                    )}

                    <button onClick={handleLogout}
                      className={`w-full px-4 py-2.5 text-left text-xs font-semibold flex items-center space-x-2 border-t transition-colors ${
                        darkMode ? "hover:bg-gray-700 text-red-400 border-gray-700"
                          : "hover:bg-gray-100 text-red-600 border-gray-200"
                      }`}>
                      <LogOut className="w-4 h-4" />
                      <span>Hivoaka (Déconnexion)</span>
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <button className={`lg:hidden p-2 rounded-xl transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-blue-50"}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />
                : <Menu className={`w-6 h-6 ${darkMode ? "text-blue-400" : "text-blue-600"}`} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav Drawer */}
      <div className={`lg:hidden transition-all duration-500 ease-in-out overflow-hidden ${
        isMenuOpen ? "max-h-96 opacity-100 border-b border-gray-200 dark:border-gray-800" : "max-h-0 opacity-0"
      }`}>
        <div className={`px-4 pb-6 pt-2 space-y-2 backdrop-blur-lg ${darkMode ? "bg-gray-900/98" : "bg-white/98"}`}>
          {currentView === "home" && navItems.map((item) => (
            <button key={item.id} onClick={() => scrollToSection(item.id)}
              className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                activeSection === item.id ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                  : darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-blue-50"
              }`}>
              {item.label}
            </button>
          ))}

          <a
            href="https://site-tanomafi.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsMenuOpen(false)}
            className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
              darkMode ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-blue-50"
            }`}
          >
            <span>site-tanomafi.vercel.app</span>
            <ExternalLink className="w-4 h-4 text-blue-500" />
          </a>

          {!isAuthenticated ? (
            <button onClick={() => { setShowAuthModal(true); setAuthMode("login"); setIsMenuOpen(false); }}
              className="w-full text-center px-4 py-3 rounded-xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md mt-4">
              Hiditra (Connexion)
            </button>
          ) : (
            userRole === "admin" && (
              <button onClick={() => { setCurrentView(currentView === "dashboard" ? "home" : "dashboard"); setIsMenuOpen(false); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold bg-red-50 text-red-600 dark:bg-red-900/50 dark:text-red-300">
                Espace Admin Dashboard
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;