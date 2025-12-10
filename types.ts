export type IssueType = 'Pothole' | 'Street Light' | 'Water Leak' | 'Waste Management' | 'Other';

export type Status = 
  | 'Submitted' 
  | 'Assigned' 
  | 'In Progress' 
  | 'Pending Verification' // AI Running
  | 'Flagged' // AI Failed
  | 'Pending Approval' // Waiting for Supervisor
  | 'Verified' // Supervisor Approved
  | 'Closed'; // Done

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Officer {
  id: string;
  name: string;
  avatar: string;
  jobsCompleted: number;
  avgTime: string;
  qualityScore: number;
  citizenRating: number;
}

export interface AIAnalysis {
  gpsMatch: boolean;
  timestampValid: boolean;
  changeDetected: boolean;
  qualityCheck: boolean;
  confidenceScore: number;
  verdict: 'APPROVED' | 'FLAGGED';
  notes: string[];
}

export interface Complaint {
  id: string;
  issueType: IssueType;
  description: string;
  locationName: string;
  coordinates: Coordinates;
  citizenPhoto: string;
  submissionTime: string;
  estimatedSLA: string;
  status: Status;
  
  // Officer Workflow
  assignedOfficerId?: string;
  workStartTime?: string;
  beforePhoto?: string;
  afterPhoto?: string;
  officerCoordinates?: Coordinates;
  
  // Verification
  aiAnalysis?: AIAnalysis;
  supervisorNotes?: string;
  
  // Community
  communityVotes: {
    up: number;
    down: number;
  };
}