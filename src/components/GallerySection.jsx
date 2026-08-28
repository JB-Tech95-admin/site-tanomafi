import { useState, useEffect } from "react";
import { Search, Eye, ChevronLeft, ChevronRight, X, Image as ImageIcon } from "lucide-react";
import defaultGalleryItems from "../dataset/galleryItems";
import { apiService } from "../services/api";

const ITEMS_PER_PAGE = 8; // 4 images on 1st line + 4 images on 2nd line

const GallerySection = ({ darkMode }) => {
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState(defaultGalleryItems);
  const [currentPage, setCurrentPage] = useState(1);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const data = await apiService.getGallery();
        if (data && data.length > 0) {
          setItems(data);
        }
      } catch (err) {
        console.log("Using default gallery items.");
      }
    };
    fetchGallery();
  }, []);

  // Reset page to 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, searchQuery]);

  // Filter gallery items by category & search query
  const filteredGallery = items.filter((item) => {
    const matchesCategory = activeFilter === "all" || item.category === activeFilter;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesSearch =
      (item.title && item.title.toLowerCase().includes(q)) ||
      (item.desc && item.desc.toLowerCase().includes(q)) ||
      (item.category && item.category.toLowerCase().includes(q));
    return matchesCategory && matchesSearch;
  });

  const totalPages = Math.ceil(filteredGallery.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const displayedItems = showAll
    ? filteredGallery
    : filteredGallery.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <section id="galerie" className={`py-20 px-4 transition-colors duration-300 ${
      darkMode ? "bg-gradient-to-br from-gray-800 to-gray-900" : "bg-gradient-to-br from-slate-50 to-blue-50"
    }`}>
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          Sarin'ireo Tanora
        </h2>
        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto mb-10 rounded-full"></div>

        {/* Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-8">
          {[
            { id: "all", label: "Rehetra" },
            { id: "nature", label: "Clip" },
            { id: "energie", label: "Fifaninanana" },
            { id: "recyclage", label: "Asa" },
          ].map((filter) => (
            <button key={filter.id} onClick={() => setActiveFilter(filter.id)}
              className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all duration-300 transform hover:scale-105 cursor-pointer ${
                activeFilter === filter.id ? "bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-lg"
                  : darkMode ? "bg-gray-700 text-gray-300 hover:bg-gray-600 shadow-md"
                    : "bg-white text-gray-700 hover:bg-blue-50 shadow-md"
              }`}>
              {filter.label}
            </button>
          ))}
        </div>

        {/* SEARCH & VOIR TOUS CONTROLS */}
        <div className="max-w-3xl mx-auto mb-10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:flex-1">
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Fikarohana sarin'ny tanora (Lohateny, mombamomba)..."
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

          <button
            onClick={() => setShowAll(!showAll)}
            className={`px-5 py-3.5 rounded-2xl text-xs font-extrabold flex items-center justify-center space-x-2 shadow-md transition-all whitespace-nowrap cursor-pointer ${
              showAll
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 border-2 border-blue-100 dark:border-gray-700 hover:bg-blue-50"
            }`}
          >
            <Eye size={16} />
            <span>{showAll ? "Affichage Paginé (8 max)" : `Voir Tous (${filteredGallery.length})`}</span>
          </button>
        </div>

        {/* Image Grid: 4 columns desktop (4 images 1st line, 4 images 2nd line = 8 max) */}
        {displayedItems.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700">
            <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500 font-bold text-base">Tsy misy sary mifanaraka amin'ny fikarohana.</p>
            <button
              onClick={() => { setSearchQuery(""); setActiveFilter("all"); }}
              className="mt-3 px-4 py-2 bg-blue-50 text-blue-600 text-xs font-bold rounded-xl"
            >
              Fafana ny fikarohana
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {displayedItems.map((item, index) => (
              <div key={item.id || index}
                className="group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}>
                <div className="aspect-[4/3] overflow-hidden bg-gray-100 relative">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = '/image/mt1.png';
                    }}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-blue-950/90 via-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-5">
                  <h4 className="text-xl font-bold text-white mb-1 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.title}
                  </h4>
                  <p className="text-blue-100 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 delay-75 text-xs">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* PAGINATION CONTROLS (Next / Previous) */}
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

export default GallerySection;