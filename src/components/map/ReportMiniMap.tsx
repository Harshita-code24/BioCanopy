import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';

export function ReportMiniMap({
  value,
  onChange,
}: {
  value: [number, number];
  onChange: (coords: [number, number]) => void;
}) {
  return (
    <div className="h-60 overflow-hidden rounded-3xl border border-canopy-border/60">
      <MapContainer center={value} zoom={12} scrollWheelZoom className="h-full">
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CARTO'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <PickMarker position={value} onChange={onChange} />
      </MapContainer>
    </div>
  );
}

function PickMarker({
  position,
  onChange,
}: {
  position: [number, number];
  onChange: (coords: [number, number]) => void;
}) {
  const [currentPosition, setCurrentPosition] = useState(position);

  useMapEvents({
    click(event) {
      const coords: [number, number] = [event.latlng.lat, event.latlng.lng];
      setCurrentPosition(coords);
      onChange(coords);
    },
  });

  return <Marker position={currentPosition} />;
}
