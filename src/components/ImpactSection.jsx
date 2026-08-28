import { Music, Film, Trophy, Users } from "lucide-react";

const ImpactSection = ({ darkMode, counters }) => {
  return (
    <section id="impact" className={`py-20 px-4 transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
    }`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Vokatra sy Taha
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mb-16 rounded-full"></div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Music, label: "Hira vita", value: counters?.audio || 24, color: "from-blue-500 to-blue-600" },
            { icon: Film, label: "Clip nivoaka", value: counters?.clips || 24, color: "from-purple-500 to-purple-600" },
            { icon: Trophy, label: "Amboara azonay", value: counters?.awards || 3, color: "from-amber-500 to-amber-600" },
            { icon: Users, label: "Mpikambana", value: counters?.members || 50, color: "from-green-500 to-green-600" },
          ].map((stat, index) => (
            <div key={index}
              className={`p-8 rounded-3xl text-center shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border ${
                darkMode ? "bg-gray-800 border-gray-700" : "bg-gradient-to-br from-white to-blue-50 border-blue-100"
              }`}>
              <div className={`w-16 h-16 mx-auto mb-6 bg-gradient-to-br ${stat.color} rounded-2xl flex items-center justify-center shadow-lg text-white`}>
                <stat.icon className="w-8 h-8" />
              </div>
              <div className="text-4xl md:text-5xl font-extrabold mb-2 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {stat.value}
              </div>
              <p className={`text-sm font-semibold uppercase tracking-wider ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ImpactSection;