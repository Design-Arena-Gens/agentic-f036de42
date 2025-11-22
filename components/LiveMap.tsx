"use client";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import useSWR from 'swr';

const fetcher = (url: string) => fetch(url).then(r => r.json());

// Fix default icon paths for Leaflet in Next.js
const icon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function LiveMap() {
  const { data } = useSWR<{ driverId: string; lat: number; lng: number; updatedAt: number; name?: string }[]>('/api/driver-locations', fetcher, { refreshInterval: 5000 });
  const items = data ?? [];
  const center = items[0] ? [items[0].lat, items[0].lng] : [12.9716, 77.5946]; // Bengaluru default

  return (
    <MapContainer center={center as any} zoom={12} style={{ height: '100%', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      {items.map((p) => (
        <Marker key={p.driverId} position={[p.lat, p.lng]} icon={icon}>
          <Popup>
            <div style={{ minWidth: 160 }}>
              <div><strong>{p.name ?? p.driverId}</strong></div>
              <div>Last update: {new Date(p.updatedAt).toLocaleTimeString()}</div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
