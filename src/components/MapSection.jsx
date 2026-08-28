// MapSection.jsx
import { useState, useEffect, useCallback } from "react";
import defaultChurches from "../dataset/churches";
import { apiService } from "../services/api";

import MouseCoordinates from "./carteComponents/MouseCoordinates";
import RoutingMachine from "./carteComponents/RoutingMachine";
import UserClick from "./carteComponents/UserClick";

import { Trash2, History, Download, X, Navigation, MapPin, Church as ChurchIcon, Phone, Clock, User, Compass, Info, CheckCircle2 } from "lucide-react";
import { MapContainer, TileLayer, Marker, LayersControl, Popup, useMap } from "react-leaflet";
import L from "leaflet";

// Icon for user location
const userLocationIcon = new L.DivIcon({
  className: "custom-user-marker",
  html: `<div class="w-8 h-8 bg-emerald-500 border-4 border-white rounded-full shadow-2xl flex items-center justify-center animate-bounce">
          <div class="w-3 h-3 bg-white rounded-full"></div>
         </div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

// Icon for Church
const churchMapIcon = new L.DivIcon({
  className: "custom-church-marker",
  html: `<div class="w-9 h-9 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-2xl border-2 border-white flex items-center justify-center cursor-pointer transform hover:scale-110 transition-transform">
          <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 22v-5a2 2 0 0 1 2-2v0a2 2 0 0 1 2 2v5"/><path d="M18 22V11l-6-4-6 4v11"/><path d="M12 2v3"/><path d="M10 3.5h4"/></svg>
         </div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

// Component to dynamically pan/fly map to user position or bounds
function MapViewController({ centerPos }) {
  const map = useMap();
  useEffect(() => {
    if (centerPos) {
      map.flyTo(centerPos, 15, { duration: 1.5 });
    }
  }, [centerPos, map]);
  return null;
}

function calculateDirectDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of Earth in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(2);
}

const MapSection = ({ darkMode }) => {
  const [churches, setChurches] = useState(defaultChurches);
  const [clickPos, setClickPos] = useState(null);
  const [destination, setDestination] = useState(null);
  const [selectedChurch, setSelectedChurch] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [routeInfo, setRouteInfo] = useState(null);
  const [locatingUser, setLocatingUser] = useState(false);
  const [centerPos, setCenterPos] = useState(null);

  const initialCenter = [-21.4415, 47.105];

  // Load churches dynamically from NestJS backend
  useEffect(() => {
    const loadChurches = async () => {
      try {
        const data = await apiService.getChurches();
        if (data && data.length > 0) {
          const formatted = data.map((item) => ({
            id: item.id,
            name: item.name,
            coords: [item.latitude, item.longitude],
            description: item.description || 'Fiangonana FFSM eto Fianarantsoa.',
            address: item.address || 'Fianarantsoa',
            pastor: item.pastor || 'Pasteur Mpitandrina',
            phone: item.phone || '+261 34 00 000 00',
            schedule: item.schedule || 'Alahady 09:00',
            photo: item.photo || 'https://images.unsplash.com/photo-1548625361-195fe5772323?auto=format&fit=crop&q=80&w=800',
          }));
          setChurches(formatted);
        }
      } catch (err) {
        console.log("Using static default churches dataset.");
      }
    };
    loadChurches();
  }, []);

  // Load history
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ffsm-route-history');
      if (saved) setHistory(JSON.parse(saved));
    } catch (err) {}
  }, []);

  // Save history
  useEffect(() => {
    if (history.length > 0) {
      try {
        localStorage.setItem('ffsm-route-history', JSON.stringify(history));
      } catch (err) {}
    }
  }, [history]);

  const addToHistory = useCallback((routeData) => {
    setRouteInfo(routeData);
    setHistory(prev => {
      const exists = prev.some(h => h.routeKey === routeData.routeKey);
      if (exists) return prev;
      return [routeData, ...prev].slice(0, 50);
    });
  }, []);

  const handleGeolocateUser = () => {
    if (!navigator.geolocation) {
      alert("Tsy manohana Géolocalisation ny navigateur-nao. Kitiho amin'ny saritany ny toerana misy anao.");
      return;
    }
    setLocatingUser(true);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const userCoords = [pos.coords.latitude, pos.coords.longitude];
        setClickPos(userCoords);
        setCenterPos(userCoords);
        setLocatingUser(false);
      },
      (err) => {
        console.warn("Geolocation warning:", err.message);
        // Fallback to Fianarantsoa center position if user denies or location fails
        const fallbackPos = [-21.4440, 47.0890];
        setClickPos(fallbackPos);
        setCenterPos(fallbackPos);
        setLocatingUser(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const clearHistory = () => {
    if (window.confirm("Voulez-vous vraiment effacer tout l'historique ?")) {
      setHistory([]);
      localStorage.removeItem('ffsm-route-history');
    }
  };

  return (
    <section id="saritany" className={`py-16 px-4 relative overflow-hidden transition-colors duration-300 ${
      darkMode ? "bg-gray-900" : "bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900"
    }`}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <span className="px-4 py-1.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-wider border border-blue-500/30">
            Saritany & Itinéraire
          </span>
          <h2 className="text-3xl md:text-5xl font-bold text-white mt-3 mb-4">
            Ny Fiangonana FFSM eto Fianarantsoa
          </h2>
          <p className="text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
            Kitiho ny <strong>"Ma position"</strong> na kitiho amin'ny saritany ny toeranao, mifidiana fiangonana, ary mikajy ny lalan-kalana (itinéraire sy halavirana).
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-blue-900/30">
          {/* Top Control Bar */}
          <div className="p-4 bg-gradient-to-r from-slate-900 to-blue-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
                <Compass className="w-5 h-5 text-white animate-spin-slow" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-base">Kajy lalan-kalana (Itinéraire)</h3>
                <p className="text-xs text-blue-200">
                  {clickPos ? `Toeranao: [${clickPos[0].toFixed(4)}, ${clickPos[1].toFixed(4)}]` : "Kitiho 'Ma position' na kitiho ny saritany"}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleGeolocateUser}
                disabled={locatingUser}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 active:scale-95 cursor-pointer"
                title="Détecter ma position actuelle"
              >
                <Navigation size={15} className={locatingUser ? "animate-spin" : ""} />
                <span>{locatingUser ? "Fikarohana..." : "Ma position"}</span>
              </button>

              <button
                onClick={() => { setDestination(null); setClickPos(null); setRouteInfo(null); setCenterPos(null); }}
                className="px-3.5 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
                title="Fafana ny lalan-kalana"
              >
                <Trash2 size={14} /> Fafana (Effacer)
              </button>

              <button
                onClick={() => setShowHistory(!showHistory)}
                className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <History size={14} /> Historique {history.length > 0 && `(${history.length})`}
              </button>
            </div>
          </div>

          {/* Route Summary Notification Panel */}
          {routeInfo && (
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-4 text-sm animate-fade-in shadow-inner">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-yellow-300" />
                  <span className="font-bold">Halavirana (Distance):</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-yellow-300 font-extrabold text-base">
                    {(routeInfo.distance / 1000).toFixed(2)} km
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-200" />
                  <span className="font-bold">Faharetana (Durée):</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full text-white font-extrabold text-base">
                    {Math.max(1, Math.floor(routeInfo.duration / 60))} min
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-xs bg-emerald-500/30 px-3 py-1.5 rounded-full border border-emerald-400/40">
                <CheckCircle2 size={14} className="text-emerald-300" />
                <span>Lalan-kalana voatsara amin'ny saritany (Route tracée)</span>
              </div>
            </div>
          )}

          {/* History modal */}
          {showHistory && (
            <div className="absolute top-24 right-6 bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-5 w-96 z-[9999] max-h-[75vh] flex flex-col border border-gray-200 dark:border-gray-700 animate-fade-in">
              <div className="flex justify-between items-center mb-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-base font-bold text-gray-800 dark:text-white flex items-center gap-2">
                  <History size={18} className="text-blue-600" />
                  Historique des Itinéraires ({history.length})
                </h3>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {history.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Mbola tsy misy historique.</p>
                </div>
              ) : (
                <div className="overflow-y-auto space-y-3 flex-1 pr-1">
                  {history.map((h, i) => (
                    <div key={i} className="border border-gray-200 dark:border-gray-700 p-3 rounded-xl text-xs bg-gray-50 dark:bg-gray-750">
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-bold text-blue-600 dark:text-blue-400">
                          {(h.distance / 1000).toFixed(2)} km ({Math.floor(h.duration / 60)} min)
                        </span>
                        <span className="text-[10px] text-gray-400">
                          {new Date(h.date).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500">
                        Départ: [{h.start[0].toFixed(3)}, {h.start[1].toFixed(3)}]
                      </p>
                    </div>
                  ))}
                  <button onClick={clearHistory} className="w-full mt-2 py-2 bg-rose-600 text-white rounded-lg font-bold text-xs">
                    Effacer l'historique
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Map Container */}
          <div className="h-[600px] w-full relative z-10">
            <MapContainer center={initialCenter} zoom={13.5} className="h-full w-full">
              <MapViewController centerPos={centerPos} />

              <LayersControl position="topright">
                <LayersControl.BaseLayer checked name="OpenStreetMap Standard">
                  <TileLayer 
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; OpenStreetMap contributors'
                  />
                </LayersControl.BaseLayer>
                <LayersControl.BaseLayer name="Google Satellite View">
                  <TileLayer 
                    url="https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"
                    attribution='&copy; Google Satellite'
                  />
                </LayersControl.BaseLayer>
              </LayersControl>

              <UserClick onMapClick={(coords) => {
                setClickPos(coords);
                setCenterPos(coords);
              }} />

              {/* User selected point marker */}
              {clickPos && (
                <Marker position={clickPos} icon={userLocationIcon}>
                  <Popup>
                    <div className="text-center p-1">
                      <strong className="text-emerald-700 font-bold text-sm block">Ny Toeranao (Départ)</strong>
                      <p className="text-xs text-gray-600 mt-1">
                        Lat: {clickPos[0].toFixed(4)}, Lng: {clickPos[1].toFixed(4)}
                      </p>
                    </div>
                  </Popup>
                </Marker>
              )}

              {/* Church Markers with Rich Popups */}
              {churches.map((c, i) => {
                const distanceDirect = clickPos
                  ? calculateDirectDistance(clickPos[0], clickPos[1], c.coords[0], c.coords[1])
                  : null;

                return (
                  <Marker 
                    key={c.id || i} 
                    position={c.coords} 
                    icon={churchMapIcon}
                  >
                    <Popup maxWidth={320}>
                      <div className="text-gray-800 font-sans p-1">
                        {c.photo && (
                          <div className="w-full h-32 rounded-xl overflow-hidden mb-2 shadow-sm">
                            <img src={c.photo} alt={c.name} className="w-full h-full object-cover" />
                          </div>
                        )}
                        
                        <h4 className="text-base font-bold text-blue-900 border-b pb-1 mb-2 flex items-center gap-1.5">
                          <ChurchIcon className="w-4 h-4 text-blue-600 flex-shrink-0" />
                          <span>{c.name}</span>
                        </h4>

                        <div className="space-y-1.5 text-xs text-gray-600 mb-3">
                          {c.address && (
                            <div className="flex items-start gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                              <span>{c.address}</span>
                            </div>
                          )}

                          {c.pastor && (
                            <div className="flex items-center gap-1.5">
                              <User className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                              <span>Mpitandrina: <strong>{c.pastor}</strong></span>
                            </div>
                          )}

                          {c.schedule && (
                            <div className="flex items-start gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                              <span>{c.schedule}</span>
                            </div>
                          )}

                          {distanceDirect && (
                            <div className="mt-2 p-2 bg-blue-50 rounded-lg border border-blue-200 text-blue-900 text-xs font-semibold flex items-center justify-between">
                              <span>Halavirana mitsery (Vol d'oiseau):</span>
                              <span className="text-blue-700 font-bold">{distanceDirect} km</span>
                            </div>
                          )}
                        </div>

                        <button 
                          onClick={() => {
                            setDestination(c.coords);
                            if (!clickPos) {
                              // If user didn't pick start point yet, default to Fianarantsoa center
                              const defaultStart = [-21.4440, 47.0890];
                              setClickPos(defaultStart);
                              setCenterPos(defaultStart);
                            }
                          }}
                          className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white text-xs font-extrabold rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Navigation size={14} />
                          <span>Kajio sy Tano ny Lalan-kalana (Itinéraire)</span>
                        </button>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}

              {/* ROUTE LINE GENERATOR & ROUTING ENGINE */}
              {clickPos && destination && (
                <RoutingMachine 
                  start={clickPos} 
                  end={destination}
                  onSummaryReady={addToHistory}
                />
              )}

              <MouseCoordinates />
            </MapContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MapSection;