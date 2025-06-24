"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icon loading in Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// 🔽 City-wide machine locations
const cityLocations = {
  Noida: {
    name: "Noida",
    coordinates: [28.5708, 77.321], // default view center
    subLocations: [
      { name: "Sector 18 Market", position: [28.5708, 77.321] },
      { name: "Amity University", position: [28.545, 77.3358] },
      { name: "DLF Mall of India", position: [28.5677, 77.3211] },
      { name: "Botanical Garden Metro", position: [28.5692, 77.3181] },
      { name: "Sector 62", position: [28.6304, 77.373] },
    ],
  },
  Kanpur: {
    name: "Kanpur",
    coordinates: [26.4499, 80.3319],
  },
  Germany: {
    name: "Germany",
    coordinates: [51.1657, 10.4515],
  },
};

export default function MapView() {
  return (
    <div className="w-full h-64 rounded-md overflow-hidden">
      <MapContainer
        center={cityLocations.Noida.coordinates as L.LatLngExpression}
        zoom={5}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* 🟢 Noida Sub-locations */}
        {cityLocations.Noida.subLocations.map((location, index) => (
          <Marker key={`noida-${index}`} position={location.position as L.LatLngExpression}>
            <Popup>
              {location.name}<br />
              City: Noida
            </Popup>
          </Marker>
        ))}

        {/* 🔵 Kanpur center */}
        <Marker position={cityLocations.Kanpur.coordinates as L.LatLngExpression}>
          <Popup>
            City: Kanpur<br />
            GTPL Machine(s)
          </Popup>
        </Marker>

        {/* 🔴 Germany center */}
        <Marker position={cityLocations.Germany.coordinates as L.LatLngExpression}>
          <Popup>
            Country: Germany<br />
            GTPL Machine(s)
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
