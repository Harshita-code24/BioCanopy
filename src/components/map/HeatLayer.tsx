import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.heat';

export function HeatLayer({
  points,
  visible,
}: {
  points: [number, number, number][];
  visible: boolean;
}) {
  const map = useMap();

  useEffect(() => {
    if (!visible) {
      return;
    }

    const layer = (L as typeof L & {
      heatLayer: (
        latlngs: [number, number, number][],
        options: {
          radius: number;
          blur: number;
          maxZoom: number;
          gradient: Record<number, string>;
        },
      ) => L.Layer;
    }).heatLayer(points, {
      radius: 35,
      blur: 28,
      maxZoom: 13,
      gradient: {
        0.25: '#4ADE80',
        0.55: '#FBBF24',
        0.9: '#F87171',
      },
    }).addTo(map);

    return () => {
      map.removeLayer(layer);
    };
  }, [map, points, visible]);

  return null;
}
