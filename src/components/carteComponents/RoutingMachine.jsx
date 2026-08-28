// RoutingMachine.jsx - Guaranteed Route Calculation & Drawing
import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

// Haversine formula for fallback distance
function haversineDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // in meters
}

function RoutingMachine({ start, end, onSummaryReady }) {
  const map = useMap();
  const polylineRef = useRef(null);

  useEffect(() => {
    if (!start || !end) return;

    let isMounted = true;

    // Clean previous route line
    if (polylineRef.current) {
      map.removeLayer(polylineRef.current);
      polylineRef.current = null;
    }

    const startLat = start[0];
    const startLng = start[1];
    const endLat = end[0];
    const endLng = end[1];

    const fetchRoute = async () => {
      let routeCoords = [
        [startLat, startLng],
        [endLat, endLng],
      ];
      let distanceMeters = haversineDistance(startLat, startLng, endLat, endLng) * 1.25; // 1.25 factor for road winding
      let durationSeconds = (distanceMeters / 1000) * 120; // ~30km/h average driving/walking speed

      try {
        const url = `https://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            distanceMeters = route.distance;
            durationSeconds = route.duration;
            routeCoords = route.geometry.coordinates.map((c) => [c[1], c[0]]);
          }
        }
      } catch (err) {
        console.warn("OSRM routing API fallback active:", err);
      }

      if (!isMounted) return;

      // Draw thick blue route polyline on Leaflet map
      const polyline = L.polyline(routeCoords, {
        color: "#2563eb",
        weight: 6,
        opacity: 0.85,
        lineCap: "round",
        lineJoin: "round",
        dashArray: null,
      }).addTo(map);

      polylineRef.current = polyline;

      // Fit map view to fit the route
      const bounds = L.latLngBounds(routeCoords);
      map.fitBounds(bounds, { padding: [60, 60], maxZoom: 16 });

      const routeKey = `${startLat.toFixed(4)},${startLng.toFixed(4)}-${endLat.toFixed(4)},${endLng.toFixed(4)}`;

      if (onSummaryReady) {
        onSummaryReady({
          distance: distanceMeters,
          duration: durationSeconds,
          start,
          end,
          date: new Date().toISOString(),
          routeKey,
        });
      }
    };

    fetchRoute();

    return () => {
      isMounted = false;
      if (polylineRef.current) {
        map.removeLayer(polylineRef.current);
        polylineRef.current = null;
      }
    };
  }, [start, end, map, onSummaryReady]);

  return null;
}

export default RoutingMachine;