import { useState, useEffect } from "react";
import { apiService } from "../services/api";
import { Users, Church, Sparkles, Search, ChevronLeft, ChevronRight, Eye, X } from "lucide-react";

const defaultMembers = [
  {
    id: "1",
    name: "Heritiana Andriamirado",
    role: "Responsable Tanora & Admin",
    church: "Fiangonana Tambohobe",
    photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600",
    description: "Mitarika sy mandrindra ny hetsika ara-panahy sy ara-tsosialy rehetra eo anivon'ny Tanora Manaotsara.",
  },
  {
    id: "2",
    name: "Rasoanaivo Sitraka",
    role: "Mpitarika Hira & Gitarista",
    church: "Fiangonana Mitsinjososa",
    photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=600",
    description: "Mpamorona hira fiderana sy mpampiofana ny tarika prise vocal tanora.",
  },
  {
    id: "3",
    name: "Raveloson Fitiavana",
    role: "Mpitahiry Vola & Mpikarakara",
    church: "Fiangonana Soamiafara",
    photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600",
    description: "Mandamina ny vola sy ny kojakoja ilaina amin'ireo tafika masina sy fitetezam-paritra.",
  },
  {
    id: "4",
    name: "Rakotoarisoa Faly",
    role: "Responsable Sary Mihetsika (Clip)",
    church: "Toby Manaotsara",
    photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=600",
    description: "Mpandray sary sy mpanao montage ho an'ireo video clips fitoriana filazantsara.",
  },
  {
    id: "5",
    name: "Andriatsitohaina Miora",
    role: "Choriste & Soloist",
    church: "Fiangonana Manaotsara",
    photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=600",
    description: "Mpihira mampatanjaka ny ekipam-piderana mandritra ny fitoriana filazantsara.",
  },
  {
    id: "6",
    name: "Randriamalala Tahina",
    role: "Pianiste & Arranger",
    church: "Fiangonana Mangarivotra",
    photo: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=600",
    description: "Mpandrindra feon-kira sy mpitendry zavamaneno amin'ireo fandraisam-peo hira.",
  },
  {
    id: "7",
    name: "Ranaivoarisoa Soa",
    role: "Responsable Serasera (Communication)",
    church: "Fiangonana Tambohobe",
    photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=600",
    description: "Mandrindra ny publication sy serasera amin'ireo rezo sosialy sy tranonkala.",
  },
  {
    id: "8",
    name: "Ramanantsoa Manitra",
    role: "Batteur & Sonorisateur",
    church: "Fiangonana Mitsinjososa",
    photo: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=600",
    description: "Mpitantana ny fitaovam-paneno sy feon-kira mandritra ny hetsika lehibe.",
  },
  {
    id: "9",
    name: "Razafindrakoto Mirana",
    role: "Mpitaiza Tanora",
    church: "Fiangonana Soamiafara",
    photo: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=600",
    description: "Mitarika fandalinana Baiboly sy fanabeazana tanora zandriny.",
  },
];

const ITEMS_PER_PAGE = 8; // 4 items in 1st row + 4 items in 2nd row

const MembersSection = ({ darkMode }) => {
  const [members, setMembers] = useState(defaultMembers);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await apiService.getMembers();
        if (data && data.length > 0) {
          setMembers(data);
        }
      } catch (err) {
        console.log("Using default youth members.");
      }
    };
    fetchMembers();
  }, []);

  // Filter members based on search input
  const filteredMembers = members.filter((m) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      (m.name && m.name.toLowerCase().includes(q)) ||
      (m.role && m.role.toLowerCase().includes(q)) ||
      (m.church && m.church.toLowerCase().includes(q)) ||
      (m.description && m.description.toLowerCase().includes(q))
    );
  });

  // Reset to page 1 whenever search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredMembers.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedMembers = showAll
    ? filteredMembers
    : filteredMembers.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section id="mpikambana" className={`py-20 px-4 transition-colors duration-300 ${
      darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-blue-50/50 via-white to-slate-50 text-gray-800"
    }`}>
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="px-4 py-1.5 rounded-full bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300 text-xs font-semibold uppercase tracking-wider">
            Tanora Mavitrika
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold mt-3 mb-4 bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 bg-clip-text text-transparent">
            Ireo Tanora Manaotsara
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            Ireo tanora mavitrika amin'ny fitoriana filazantsara, prise vocal, clip sy hetsika ara-panahy.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mt-4 rounded-full"></div>
        </div>

        {/* SEARCH BAR & VIEW ALL CONTROLS */}
        <div className="max-w-3xl mx-auto mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Search Input Bar */}
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Fikarohana tanora (Anarana, andraikitra, fiangonana)..."
              className="w-full pl-12 pr-10 py-3.5 rounded-2xl border-2 border-blue-100 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white outline-none focus:border-blue-600 dark:focus:border-blue-500 shadow-sm text-sm transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-3.5 text-gray-400 hover:text-gray-600 p-0.5"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Toggle "Voir tout" / "Rehetra" button */}
          <button
            onClick={() => setShowAll(!showAll)}
            className={`px-5 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-md transition-all whitespace-nowrap cursor-pointer ${
              showAll
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-100 dark:border-gray-700 hover:bg-blue-50"
            }`}
          >
            <Eye size={16} />
            <span>{showAll ? "Affichage Paginé (8 max)" : `Voir Tous (${filteredMembers.length})`}</span>
          </button>
        </div>

        {/* Member Cards Grid: 4 columns desktop (2 rows of 4 = 8 max per page) */}
        {displayedMembers.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-bold text-base">Tsy misy tanora mifanaraka amin'ny fikarohana.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl"
            >
              Fafana ny fikarohana
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {displayedMembers.map((member, index) => (
              <div
                key={member.id || index}
                className={`group rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 border flex flex-col justify-between ${
                  darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-blue-50"
                }`}
              >
                <div>
                  <div className="aspect-square relative overflow-hidden bg-gray-100">
                    <img
                      src={member.photo || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600'}
                      alt={member.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600';
                      }}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
                    <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-[11px] font-bold px-3 py-1 rounded-full shadow backdrop-blur-sm flex items-center gap-1">
                      <Sparkles size={12} />
                      <span>{member.role || 'Mpikambana'}</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {member.name}
                    </h3>
                    
                    {member.church && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 font-semibold mb-3 flex items-center gap-1">
                        <Church size={14} className="flex-shrink-0" />
                        <span>{member.church}</span>
                      </p>
                    )}

                    {member.description && (
                      <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed bg-gray-50 dark:bg-gray-750 p-3 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                        {member.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION CONTROLS (Next / Previous) - displayed when showAll is false */}
        {!showAll && totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <ChevronLeft size={16} />
              <span>Précédent</span>
            </button>

            <div className="flex items-center space-x-1.5">
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-9 h-9 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                    currentPage === i + 1
                      ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-md scale-105"
                      : "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-50 dark:hover:bg-gray-700 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <span>Next (Manaraka)</span>
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default MembersSection;
