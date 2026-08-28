import { X, User, Mail, Lock, Eye, EyeOff } from "lucide-react";

const AuthModal = ({ darkMode, authMode, setAuthMode, formData, setFormData, showPassword, setShowPassword, setShowAuthModal, handleAuth }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div className={`rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all border ${
      darkMode ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-100 text-gray-800"
    }`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-extrabold">
            {authMode === "login" ? "Hiditra amin'ny kaonty" : "Hamorona kaonty vaovao"}
          </h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {authMode === "login" ? "Ampidiro ny mailaka @tanomafi.mg sy teny miafina" : "Mila mailaka mifarana amin'ny @tanomafi.mg"}
          </p>
        </div>
        <button onClick={() => setShowAuthModal(false)} className={`p-2 rounded-full transition-colors ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-100"}`}>
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); handleAuth(); }} className="space-y-4">
        {authMode === "register" && (
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Anarana Feno</label>
            <div className="relative">
              <User className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="text" 
                required
                value={formData.name} 
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none text-sm transition-all ${
                  darkMode ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                    : "border-gray-200 bg-gray-50 text-gray-800 focus:border-blue-500"}`}
                placeholder="Anaranao" 
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">
            Mailaka (tsy maintsy @tanomafi.mg)
          </label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
            <input 
              type="email" 
              required
              value={formData.email} 
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full pl-11 pr-4 py-3 rounded-xl border-2 outline-none text-sm transition-all ${
                darkMode ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                  : "border-gray-200 bg-gray-50 text-gray-800 focus:border-blue-500"}`}
              placeholder="anarana@tanomafi.mg" 
            />
          </div>
          <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1 font-medium">
            Ex: client@tanomafi.mg na admin@tanomafi.mg
          </p>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider mb-1.5">Teny Miafina</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
            <input 
              type={showPassword ? "text" : "password"} 
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full pl-11 pr-11 py-3 rounded-xl border-2 outline-none text-sm transition-all ${
                darkMode ? "border-gray-600 bg-gray-700 text-white focus:border-blue-500"
                  : "border-gray-200 bg-gray-50 text-gray-800 focus:border-blue-500"}`}
              placeholder="••••••••" 
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <button 
          type="submit"
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-3.5 rounded-xl font-bold text-sm shadow-lg hover:shadow-xl transform hover:scale-[1.02] transition-all duration-300 mt-2 cursor-pointer"
        >
          {authMode === "login" ? "Hiditra (Connexion)" : "Hamorona kaonty (S'inscrire)"}
        </button>

        <div className="pt-2 text-center">
          <button 
            type="button"
            onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {authMode === "login" ? "Tsy mbola manana kaonty ? Hamorona kaonty" : "Efa manana kaonty ? Hiditra"}
          </button>
        </div>
      </form>
    </div>
  </div>
);

export default AuthModal;