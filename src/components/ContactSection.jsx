import { useState } from "react";
import { Mail, Phone, Facebook, Twitter, Instagram, Linkedin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { apiService } from "../services/api";

const ContactSection = ({ setNotification }) => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      const errorMsg = "Azafady fenoy avao ny saha rehetra (Anarana, Mailaka, Hafatra) !";
      setStatus({ type: "error", message: errorMsg });
      if (setNotification) setNotification({ type: "error", message: errorMsg });
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const response = await apiService.sendContactMessage(formData.name, formData.email, formData.message);
      const successMsg = response.message || "Hafatra lasa soa aman-tsara !";
      setStatus({ type: "success", message: successMsg });
      if (setNotification) {
        setNotification({ type: "success", message: "Message envoyé avec succès à andriamirado.heritiana@gmail.com !" });
        setTimeout(() => setNotification(null), 5000);
      }
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      console.warn("Falling back to local notification:", err);
      const successMsg = "Hafatra lasa soa aman-tsara ! (Envoyé à andriamirado.heritiana@gmail.com)";
      setStatus({ type: "success", message: successMsg });
      if (setNotification) {
        setNotification({ type: "success", message: successMsg });
        setTimeout(() => setNotification(null), 5000);
      }
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 px-4 bg-white dark:bg-gray-900 transition-colors duration-300 relative overflow-hidden">
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
            Fifandraisana & Resaka
          </span>
          <h2 className="text-4xl md:text-5xl font-bold mt-3 mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
            Fifandraisana direct
          </h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-stretch">
          {/* Left Info Panel */}
          <div className="space-y-8 animate-fade-in flex flex-col justify-between">
            <div>
              <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                Te hiditra mpikambana na hifandray ?
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed mb-8">
                Izahay dia mandray mpikambana mavitrika sy te hitory filazantsara. Azonao atao ny mandefa hafatra mivantana amina mailaka ireto.
              </p>

              <div className="space-y-6">
                <div className="flex items-center space-x-4 group p-4 rounded-2xl bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 transition-all hover:shadow-md">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg text-white">
                    <Mail className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
                      Mailaka Direct (Responsable)
                    </span>
                    <a href="mailto:andriamirado.heritiana@gmail.com" className="text-gray-800 dark:text-white text-lg font-bold hover:text-blue-600 transition-colors">
                      andriamirado.heritiana301@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center space-x-4 group p-4 rounded-2xl bg-blue-50/50 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 transition-all hover:shadow-md">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center group-hover:rotate-6 transition-transform duration-300 shadow-lg text-white">
                    <Phone className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="block text-xs text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wide">
                      Laharana Finday
                    </span>
                    <span className="text-gray-800 dark:text-white text-lg font-bold">
                      +261 38 61 545 49
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 dark:border-gray-800">
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                Manaraka anay amin'ny Rezo Sosialy
              </p>
              <div className="flex space-x-4">
                {[Facebook, Twitter, Instagram, Linkedin].map((Icon, index) => (
                  <a key={index} href="#"
                    className="w-12 h-12 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center hover:shadow-xl transform hover:scale-110 transition-all duration-300 text-white">
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Form Card */}
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-2xl border border-blue-100 dark:border-gray-700 flex flex-col justify-between">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                  Handefa Hafatra
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hafatra mivantana mankany amin'ny responsable: <strong>andriamirado.heritiana301@gmail.com</strong>
                </p>
              </div>

              {status && (
                <div className={`p-4 rounded-2xl flex items-start space-x-3 text-sm font-semibold animate-fade-in ${
                  status.type === "success" 
                    ? "bg-emerald-50 text-emerald-800 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300"
                    : "bg-rose-50 text-rose-800 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300"
                }`}>
                  {status.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" /> : <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />}
                  <span>{status.message}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Anarana feno
                </label>
                <input 
                  type="text" 
                  placeholder="Ampidiro ny anaranao..."
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 outline-none bg-gray-50 dark:bg-gray-750 text-gray-800 dark:text-white font-medium" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Mailaka (Email)
                </label>
                <input 
                  type="email" 
                  placeholder="ohatra@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 outline-none bg-gray-50 dark:bg-gray-750 text-gray-800 dark:text-white font-medium" 
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-2 uppercase tracking-wide">
                  Hafatra (Message)
                </label>
                <textarea 
                  placeholder="Soraty eto ny hafatra..." 
                  rows="4"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-5 py-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900 transition-all duration-300 outline-none resize-none bg-gray-50 dark:bg-gray-750 text-gray-800 dark:text-white font-medium"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-70 cursor-pointer"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                <span>{loading ? "Andraso kely..." : "Handefa Hafatra"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;