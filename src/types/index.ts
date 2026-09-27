export type Role = 'citizen' | 'admin';

export type User = {
  id?: number;
  name: string;
  email: string;
  role: Role;
};

export type Language = 'en' | 'hi' | 'mr';

export type HazardCategory =
  | 'Unshaded Hotspot'
  | 'Illegal Burning'
  | 'Construction Dust'
  | 'No Tree Cover';

export type ReportIssue = HazardCategory;

export type ReportStatus =
  | 'Pending Review'
  | 'Reviewed'
  | 'Task Dispatched'
  | 'Resolved';

export type Report = {
  id: string;
  city: string;
  locationName: string;
  coordinates: [number, number];
  category: HazardCategory;
  description: string;
  photoUrl?: string;
  status: ReportStatus;
  submittedAt: string;
  source: 'Citizen Mobile' | 'Field Observer' | 'Verified Geotag';
  upvotes?: number;
  issueType?: string;
  photoLabel?: string;
};

export type CityMetric = {
  city: string;
  state: string;
  aqi: number;
  temperature: number;
  feelsLike: number;
  humidity: number;
  treeCover: number;
  targetCanopy: number;
  heatRisk: 'Low' | 'Moderate' | 'High';
  cpcbStation: string;
  imdStation: string;
  satelliteSurfaceTemp: number;
  lastUpdated: string;
};

export type RouteOverlay = {
  id: 'cool' | 'fastest';
  name: string;
  travelTime: string;
  badge: string;
  shadePercentage: number;
  heatExposure: 'Low' | 'Moderate' | 'High';
  isRecommended: boolean;
  color: string;
  dashArray?: string;
  weight: number;
  heatReduction: number;
  canopyBoost: number;
  turnInstructions: string[];
  coordinates: [number, number][];
};

export type AuthorityZone = {
  id: string;
  zoneName: string;
  city: string;
  complaintCount: number;
  canopyDeficit: number; // e.g. -24%
  currentCanopy: number; // e.g. 14%
  surfaceTemp: number; // e.g. 42.5°C
  priorityRank: number;
  status: 'Needs Dispatch' | 'Task Dispatched' | 'Planting In Progress' | 'Completed';
  targetSaplings: number;
  dispatchId?: string;
  lastReported: string;
};

export type Hotspot = {
  id: string;
  name: string;
  city: string;
  center: [number, number];
  intensity: number; // 0 - 100
  type: 'Concrete Corridor' | 'Exposed Transit' | 'Asphalt Heat Island';
};

export type AppTab = 'map' | 'dashboard' | 'authority';

export type AiConditionPreset = 'peak_heat' | 'smog_morning' | 'evening_cooling';
