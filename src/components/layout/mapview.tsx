"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix marker icon (Leaflet issue in Next.js)
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Sample Noida locations (latitude, longitude, and name)
const noidaLocations = [
  { name: "Sector 18 Market", position: [28.5708, 77.321] },
  { name: "Amity University", position: [28.545, 77.3358] },
  { name: "DLF Mall of India", position: [28.5677, 77.3211] },
  { name: "Botanical Garden Metro", position: [28.5692, 77.3181] },
  { name: "Sector 62", position: [28.6304, 77.373] },
];

export default function MapView() {
  return (
    <div className="w-full h-64 rounded-md overflow-hidden">
      <MapContainer
        center={[28.5708, 77.321]} // Centered around Noida
        zoom={13}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {noidaLocations.map((location, index) => (
          <Marker key={index} position={location.position}>
            <Popup>{location.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
