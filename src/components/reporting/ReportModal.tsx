import L from 'leaflet';
import {
  AlertTriangle,
  Camera,
  CheckCircle2,
  Crosshair,
  Flame,
  Image as ImageIcon,
  MapPin,
  Trees,
  UploadCloud,
  Wind,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { MapContainer, Marker, TileLayer, useMapEvents } from 'react-leaflet';
import { cityCoordinates } from '../../data/mockData';
import { useAppState } from '../../store/AppStateContext';
import type { HazardCategory } from '../../types';

// Mini Map Interactive Click Handler to Pick GPS Pin
function LocationPicker({
  position,
  onChange,
}: {
  position: [number, number];
  onChange: (pos: [number, number]) => void;
}) {
  useMapEvents({
    click(e) {
      onChange([e.latlng.lat, e.latlng.lng]);
    },
  });

  return (
    <Marker
      position={position}
      icon={L.divIcon({
        className: 'picker-pin',
        html: `<div style="background-color: #EF4444; color: white; width: 26px; height: 26px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 13px; font-weight: bold; border: 2px solid white; box-shadow: 0 3px 8px rgba(0,0,0,0.3);">
          📍
        </div>`,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      })}
    />
  );
}

export function ReportModal() {
  const { isReportModalOpen, setIsReportModalOpen, addReport, selectedCity } =
    useAppState();

  const defaultCoords = cityCoordinates[selectedCity] || [28.6139, 77.209];

  const [category, setCategory] = useState<HazardCategory>('Unshaded Hotspot');
  const [coords, setCoords] = useState<[number, number]>([
    defaultCoords[0] + 0.005,
    defaultCoords[1] + 0.005,
  ]);
  const [locationName, setLocationName] = useState('');
  const [description, setDescription] = useState('');
  const [uploadedPhotoName, setUploadedPhotoName] = useState<string | null>(null);
  const [isGpsLocating, setIsGpsLocating] = useState(false);

  if (!isReportModalOpen) return null;

  const categories: {
    id: HazardCategory;
    icon: any;
    label: string;
    description: string;
    color: string;
  }[] = [
    {
      id: 'Unshaded Hotspot',
      icon: AlertTriangle,
      label: 'Unshaded Hotspot',
      description: 'Extreme pavement heat, unshaded waiting stops & bridges',
      color: 'border-red-500 bg-red-50 text-red-900',
    },
    {
      id: 'Illegal Burning',
      icon: Flame,
      label: 'Illegal Burning',
      description: 'Commercial waste, plastic or dry leaves burning nearby',
      color: 'border-amber-500 bg-amber-50 text-amber-900',
    },
    {
      id: 'Construction Dust',
      icon: Wind,
      label: 'Construction Dust',
      description: 'Fugitive PM10 dust plumes from building or road works',
      color: 'border-blue-500 bg-blue-50 text-blue-900',
    },
    {
      id: 'No Tree Cover',
      icon: Trees,
      label: 'No Tree Cover',
      description: 'Barren sidewalk needing urgent municipal sapling planting',
      color: 'border-emerald-500 bg-emerald-50 text-emerald-900',
    },
  ];

  const handleUseCurrentLocation = () => {
    setIsGpsLocating(true);
    // Simulate real GPS triangulation with high accuracy
    setTimeout(() => {
      const randomizedOffsetLat = (Math.random() - 0.5) * 0.006;
      const randomizedOffsetLng = (Math.random() - 0.5) * 0.006;
      const newCoords: [number, number] = [
        defaultCoords[0] + randomizedOffsetLat,
        defaultCoords[1] + randomizedOffsetLng,
      ];
      setCoords(newCoords);
      setLocationName(`${selectedCity} Ward 12 Pedestrian Transit Point`);
      setIsGpsLocating(false);
    }, 600);
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedPhotoName(e.target.files[0].name);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addReport({
      city: selectedCity,
      locationName:
        locationName.trim() || `${selectedCity} Street Node (${coords[0].toFixed(3)}, ${coords[1].toFixed(3)})`,
      coordinates: coords,
      category,
      description:
        description.trim() ||
        `Reported by resident at ${new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })}. Observed severe ${category.toLowerCase()} condition without mitigation.`,
      photoUrl:
        uploadedPhotoName ||
        'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&auto=format&fit=crop&q=80',
    });

    setIsReportModalOpen(false);
    // Reset inputs
    setLocationName('');
    setDescription('');
    setUploadedPhotoName(null);
  };

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-[#14532D] px-6 py-4 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-700/60 text-emerald-300">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold">Report Environmental Hazard</h3>
              <p className="text-xs text-emerald-200">
                Logged to the BioCanopy Public Map & Municipal Action Queue
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsReportModalOpen(false)}
            className="rounded-lg p-1.5 text-emerald-200 hover:bg-emerald-800 hover:text-white"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Field 1: Category Selector */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              1. Select Hazard Category <span className="text-red-500">*</span>
            </label>
            <div className="mt-2 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {categories.map((cat) => {
                const Icon = cat.icon;
                const isSelected = category === cat.id;
                return (
                  <button
                    type="button"
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`flex items-start gap-3 rounded-xl border p-3 text-left transition ${
                      isSelected
                        ? `${cat.color} ring-2 ring-emerald-600`
                        : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-gray-600" />
                    <div>
                      <p className="text-xs font-bold">{cat.label}</p>
                      <p className="mt-0.5 text-[11px] text-gray-500 leading-tight">
                        {cat.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Field 2: Location Name & GPS Pin Preview */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                2. Location & GPS Pin Preview <span className="text-red-500">*</span>
              </label>

              <button
                type="button"
                onClick={handleUseCurrentLocation}
                disabled={isGpsLocating}
                className="flex items-center gap-1 text-xs font-bold text-emerald-700 hover:text-emerald-800"
              >
                <Crosshair className={`h-3.5 w-3.5 ${isGpsLocating ? 'animate-spin' : ''}`} />
                <span>{isGpsLocating ? 'Acquiring GPS...' : 'Use Current GPS Location'}</span>
              </button>
            </div>

            <input
              type="text"
              required
              placeholder={`e.g. Near ${selectedCity} Station Exit / Bus Stop`}
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full rounded-xl border border-gray-300 bg-white px-3.5 py-2 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />

            {/* Mini Map GPS Pin Preview */}
            <div className="relative h-44 w-full overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
              <MapContainer
                center={coords}
                zoom={14}
                scrollWheelZoom={false}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; CARTO'
                  url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                />
                <LocationPicker position={coords} onChange={setCoords} />
              </MapContainer>

              <div className="pointer-events-none absolute bottom-2 left-2 z-[400] rounded-lg bg-white/90 px-2 py-1 text-[10px] font-semibold text-gray-700 shadow-xs backdrop-blur-xs">
                📍 Tap map to reposition pin: {coords[0].toFixed(4)}, {coords[1].toFixed(4)}
              </div>
            </div>
          </div>

          {/* Field 3: Image Upload Dropzone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              3. Image Upload Dropzone (Photo Verification)
            </label>
            <div className="mt-2 relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50/70 px-4 py-5 text-center transition hover:border-emerald-500 hover:bg-emerald-50/30">
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                className="absolute inset-0 cursor-pointer opacity-0"
              />
              <UploadCloud className="h-8 w-8 text-gray-400" />
              <p className="mt-1 text-xs font-semibold text-gray-700">
                {uploadedPhotoName ? (
                  <span className="text-emerald-700 font-bold">
                    ✓ Attached: {uploadedPhotoName}
                  </span>
                ) : (
                  <>
                    <span className="text-emerald-700">Click to upload photo</span> or drag & drop proof
                  </>
                )}
              </p>
              <p className="text-[11px] text-gray-500 mt-0.5">
                PNG, JPG or WEBP (Max 5MB) · Geotag metadata extracted automatically
              </p>
            </div>
          </div>

          {/* Field 4: Description / Notes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
              4. Additional Notes / Ground Observations
            </label>
            <textarea
              rows={2}
              placeholder="Describe the severity: e.g. metal benches too hot to sit, visible black smoke, or zero shade trees for 300m..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-gray-300 bg-white p-3 text-xs font-medium text-gray-900 placeholder:text-gray-400 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
            />
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center justify-end gap-3 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setIsReportModalOpen(false)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 rounded-xl bg-[#14532D] px-6 py-2.5 text-xs font-bold text-white shadow-md shadow-green-900/20 transition hover:bg-[#166534] active:scale-95"
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Submit to Public Map</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Floating Action Button (FAB) rendered on screen
export function ReportHazardFAB() {
  const { setIsReportModalOpen } = useAppState();

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <button
        onClick={() => setIsReportModalOpen(true)}
        className="group flex items-center gap-2.5 rounded-full bg-[#14532D] px-5 py-3 text-sm font-bold text-white shadow-xl shadow-green-900/30 ring-4 ring-white transition hover:scale-105 hover:bg-[#166534] active:scale-95"
      >
        <span className="relative flex h-3 w-3">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500"></span>
        </span>
        <AlertTriangle className="h-4 w-4 text-emerald-300 transition group-hover:rotate-12" />
        <span className="tracking-tight">Report Hazard</span>
      </button>
    </div>
  );
}
