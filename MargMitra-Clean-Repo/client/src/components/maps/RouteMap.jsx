import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

// Custom DivIcons with SVG markup for sharp icons that never break
const createPinIcon = (color, label) => {
  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="display:flex; flex-direction:column; align-items:center; transform: translate(-50%, -100%);">
        <div style="background-color:${color}; color:white; font-size:11px; font-weight:700; padding:2px 8px; border-radius:12px; box-shadow:0 2px 6px rgba(0,0,0,0.3); white-space:nowrap; border:2px solid white;">
          ${label}
        </div>
        <div style="width:14px; height:14px; background-color:${color}; border:3px solid white; border-radius:50%; box-shadow:0 2px 4px rgba(0,0,0,0.4); margin-top:-2px;"></div>
      </div>
    `,
    iconSize: [30, 42],
    iconAnchor: [15, 42]
  });
};

const createVehicleIcon = () => {
  return L.divIcon({
    className: 'custom-vehicle-marker',
    html: `
      <div style="display:flex; align-items:center; justify-content:center; width:34px; height:34px; background:#059669; color:white; border-radius:50%; border:3px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.35); transform:translate(-50%, -50%);">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
          <path d="M15 18H9"/>
          <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
          <circle cx="17" cy="18" r="2"/>
          <circle cx="7" cy="18" r="2"/>
        </svg>
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17]
  });
};

// Component to dynamically fit map bounds when coordinates change
function FitBounds({ points }) {
  const map = useMap();
  useEffect(() => {
    if (points && points.length > 0) {
      const validPoints = points.filter(p => p && !isNaN(p[0]) && !isNaN(p[1]));
      if (validPoints.length > 1) {
        map.fitBounds(validPoints, { padding: [50, 50] });
      } else if (validPoints.length === 1) {
        map.setView(validPoints[0], 11);
      }
    }
  }, [points, map]);

  return null;
}

export default function RouteMap({
  origin = { lat: 20.0768, lng: 74.1105, name: 'Origin' },
  destination = { lat: 19.0732, lng: 73.0039, name: 'Destination' },
  vehiclePos = null,
  routeTitle = 'Route',
  height = '350px'
}) {
  const originCoord = [origin.lat, origin.lng];
  const destCoord = [destination.lat, destination.lng];
  const polylineCoords = [originCoord, destCoord];

  return (
    <div style={{ height }} className="w-full relative rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={originCoord}
        zoom={9}
        scrollWheelZoom={false}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Origin Marker */}
        <Marker position={originCoord} icon={createPinIcon('#059669', 'Pickup')}>
          <Popup>
            <div className="text-xs">
              <strong className="text-emerald-700 block">Pickup Location</strong>
              <span>{origin.name}</span>
            </div>
          </Popup>
        </Marker>

        {/* Destination Marker */}
        <Marker position={destCoord} icon={createPinIcon('#dc2626', 'Dropoff')}>
          <Popup>
            <div className="text-xs">
              <strong className="text-rose-700 block">Dropoff Point</strong>
              <span>{destination.name}</span>
            </div>
          </Popup>
        </Marker>

        {/* Optional Vehicle Location Marker */}
        {vehiclePos && (
          <Marker position={[vehiclePos.lat, vehiclePos.lng]} icon={createVehicleIcon()}>
            <Popup>
              <div className="text-xs">
                <strong className="text-emerald-800 block">Transporter Location</strong>
                <span>En Route</span>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Connecting route polyline */}
        <Polyline
          positions={polylineCoords}
          pathOptions={{
            color: '#059669',
            weight: 4,
            opacity: 0.85,
            dashArray: '8, 8'
          }}
        />

        <FitBounds points={[originCoord, destCoord, vehiclePos ? [vehiclePos.lat, vehiclePos.lng] : null]} />
      </MapContainer>
    </div>
  );
}
