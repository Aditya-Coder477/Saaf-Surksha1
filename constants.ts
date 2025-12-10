import { Complaint, Officer, Coordinates } from './types';

export const JAIPUR_BOUNDS = {
  minLat: 26.8,
  maxLat: 27.0,
  minLng: 75.7,
  maxLng: 75.9,
};

export const OFFICERS: Officer[] = [
  { id: 'OFF-001', name: 'Rajesh Kumar', avatar: 'RK', jobsCompleted: 142, avgTime: '3.5h', qualityScore: 98, citizenRating: 4.8 },
  { id: 'OFF-002', name: 'Suresh Singh', avatar: 'SS', jobsCompleted: 89, avgTime: '4.2h', qualityScore: 92, citizenRating: 4.5 },
  { id: 'OFF-003', name: 'Anita Desai', avatar: 'AD', jobsCompleted: 210, avgTime: '2.8h', qualityScore: 99, citizenRating: 4.9 },
  { id: 'OFF-004', name: 'Vikram Mehta', avatar: 'VM', jobsCompleted: 65, avgTime: '5.1h', qualityScore: 85, citizenRating: 4.0 },
  { id: 'OFF-005', name: 'Priya Sharma', avatar: 'PS', jobsCompleted: 112, avgTime: '3.9h', qualityScore: 94, citizenRating: 4.7 },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'SS-2024-1024',
    issueType: 'Pothole',
    description: 'Deep pothole near the main market entrance, causing traffic slowdown.',
    locationName: 'MI Road, Jaipur',
    coordinates: { lat: 26.9124, lng: 75.8090 },
    citizenPhoto: 'https://picsum.photos/400/300?random=1',
    submissionTime: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(), // 4 hours ago
    estimatedSLA: new Date(Date.now() + 1000 * 60 * 60 * 44).toISOString(),
    status: 'Assigned',
    assignedOfficerId: 'OFF-001',
    communityVotes: { up: 5, down: 0 },
  },
  {
    id: 'SS-2024-1025',
    issueType: 'Street Light',
    description: 'Street light flickering constantly near park gate.',
    locationName: 'Vaishali Nagar',
    coordinates: { lat: 26.9050, lng: 75.7450 },
    citizenPhoto: 'https://picsum.photos/400/300?random=2',
    submissionTime: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    estimatedSLA: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
    status: 'Pending Verification',
    assignedOfficerId: 'OFF-002',
    beforePhoto: 'https://picsum.photos/400/300?random=3',
    afterPhoto: 'https://picsum.photos/400/300?random=4',
    communityVotes: { up: 0, down: 0 },
  },
  {
    id: 'SS-2024-1026',
    issueType: 'Water Leak',
    description: 'Main pipeline leaking water on the street.',
    locationName: 'Mansarovar Sector 5',
    coordinates: { lat: 26.8550, lng: 75.7650 },
    citizenPhoto: 'https://picsum.photos/400/300?random=5',
    submissionTime: new Date(Date.now() - 1000 * 60 * 60 * 50).toISOString(),
    estimatedSLA: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // Overdue
    status: 'Submitted',
    communityVotes: { up: 12, down: 1 },
  },
  {
    id: 'SS-2024-1020',
    issueType: 'Waste Management',
    description: 'Garbage not collected for 3 days.',
    locationName: 'Raja Park',
    coordinates: { lat: 26.8900, lng: 75.8200 },
    citizenPhoto: 'https://picsum.photos/400/300?random=6',
    submissionTime: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    estimatedSLA: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    status: 'Verified',
    assignedOfficerId: 'OFF-003',
    beforePhoto: 'https://picsum.photos/400/300?random=7',
    afterPhoto: 'https://picsum.photos/400/300?random=8',
    aiAnalysis: {
      gpsMatch: true,
      timestampValid: true,
      changeDetected: true,
      qualityCheck: true,
      confidenceScore: 96,
      verdict: 'APPROVED',
      notes: ['Clear difference detected', 'Coordinates match within 3m']
    },
    communityVotes: { up: 45, down: 2 },
  },
   {
    id: 'SS-2024-1030',
    issueType: 'Other',
    description: 'Broken bench in the public park.',
    locationName: 'Central Park',
    coordinates: { lat: 26.9100, lng: 75.8000 },
    citizenPhoto: 'https://picsum.photos/400/300?random=9',
    submissionTime: new Date(Date.now() - 1000 * 60 * 60 * 1).toISOString(),
    estimatedSLA: new Date(Date.now() + 1000 * 60 * 60 * 47).toISOString(),
    status: 'Pending Approval',
    assignedOfficerId: 'OFF-004',
    beforePhoto: 'https://picsum.photos/400/300?random=10',
    afterPhoto: 'https://picsum.photos/400/300?random=11',
    aiAnalysis: {
      gpsMatch: true,
      timestampValid: true,
      changeDetected: true,
      qualityCheck: true,
      confidenceScore: 89,
      verdict: 'APPROVED',
      notes: ['Good cleanup visible']
    },
    communityVotes: { up: 0, down: 0 },
  }
];

// Helper to generate random coordinates within Jaipur
export const generateJaipurCoordinates = (): Coordinates => {
  return {
    lat: JAIPUR_BOUNDS.minLat + Math.random() * (JAIPUR_BOUNDS.maxLat - JAIPUR_BOUNDS.minLat),
    lng: JAIPUR_BOUNDS.minLng + Math.random() * (JAIPUR_BOUNDS.maxLng - JAIPUR_BOUNDS.minLng),
  };
};

// Haversine formula for distance (simulated in meters)
export const calculateDistance = (c1: Coordinates, c2: Coordinates): number => {
  // Simplified calculation for demo purposes (approx conversion)
  const R = 6371e3; // metres
  const φ1 = c1.lat * Math.PI/180;
  const φ2 = c2.lat * Math.PI/180;
  const Δφ = (c2.lat-c1.lat) * Math.PI/180;
  const Δλ = (c2.lng-c1.lng) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};