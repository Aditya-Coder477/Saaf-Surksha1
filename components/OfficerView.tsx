import React, { useState } from 'react';
import { Camera, MapPin, AlertCircle, CheckCircle, Clock, Navigation } from 'lucide-react';
import { Complaint, Coordinates } from '../types';
import { calculateDistance, generateJaipurCoordinates } from '../constants';

interface Props {
  complaints: Complaint[];
  officerId: string;
  onUpdateComplaint: (id: string, updates: Partial<Complaint>) => void;
  onTriggerAI: (complaintId: string) => void;
}

const OfficerView: React.FC<Props> = ({ complaints, officerId, onUpdateComplaint, onTriggerAI }) => {
  const assigned = complaints.filter(c => c.assignedOfficerId === officerId && c.status !== 'Closed' && c.status !== 'Verified' && c.status !== 'Pending Approval' && c.status !== 'Pending Verification');
  
  const [activeJobId, setActiveJobId] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null);
  const [verifyingLocation, setVerifyingLocation] = useState(false);
  const [locationVerified, setLocationVerified] = useState(false);
  const [beforePhoto, setBeforePhoto] = useState<string | null>(null);
  const [afterPhoto, setAfterPhoto] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeJob = complaints.find(c => c.id === activeJobId);

  const startWork = (job: Complaint) => {
    setActiveJobId(job.id);
    onUpdateComplaint(job.id, { status: 'In Progress', workStartTime: new Date().toISOString() });
  };

  const verifyLocation = () => {
    setVerifyingLocation(true);
    setTimeout(() => {
      // Simulate officer being at the location (random small offset)
      if (activeJob) {
        const simulatedLoc = {
          lat: activeJob.coordinates.lat + (Math.random() - 0.5) * 0.0001, 
          lng: activeJob.coordinates.lng + (Math.random() - 0.5) * 0.0001
        };
        setCurrentLocation(simulatedLoc);
        
        const dist = calculateDistance(activeJob.coordinates, simulatedLoc);
        if (dist < 20) { // 20 meters tolerance
            setLocationVerified(true);
        } else {
            alert("You are too far from the reported location!");
        }
      }
      setVerifyingLocation(false);
    }, 2000);
  };

  const handlePhotoCapture = (type: 'before' | 'after', e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      if (type === 'before') setBeforePhoto(url);
      else setAfterPhoto(url);
    }
  };

  const handleSubmitWork = () => {
    if (!activeJobId || !beforePhoto || !afterPhoto) return;
    
    setIsSubmitting(true);
    
    // Simulate upload delay
    setTimeout(() => {
      onUpdateComplaint(activeJobId, {
        beforePhoto,
        afterPhoto,
        status: 'Pending Verification', // Send to AI
        officerCoordinates: currentLocation || generateJaipurCoordinates() // Fallback if loc failed
      });
      onTriggerAI(activeJobId);
      
      // Reset local state
      setIsSubmitting(false);
      setActiveJobId(null);
      setBeforePhoto(null);
      setAfterPhoto(null);
      setLocationVerified(false);
      setCurrentLocation(null);
    }, 1500);
  };

  if (activeJob) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <button 
          onClick={() => setActiveJobId(null)}
          className="mb-4 text-sm text-gray-500 hover:text-india-navy flex items-center gap-1"
        >
          ← Back to List
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-india-navy text-white p-4 flex justify-between items-center">
            <div>
              <h2 className="font-bold text-lg">Work Order #{activeJob.id}</h2>
              <p className="text-xs text-blue-200">{activeJob.locationName}</p>
            </div>
            <span className="bg-india-orange text-xs font-bold px-2 py-1 rounded">In Progress</span>
          </div>

          <div className="p-4 space-y-6">
            {/* 1. Location Verification */}
            <div className={`p-4 rounded-lg border ${locationVerified ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Step 1: GPS Verification
                </h3>
                {locationVerified && <CheckCircle className="text-green-600 w-5 h-5" />}
              </div>
              
              {!locationVerified ? (
                <button 
                  onClick={verifyLocation}
                  disabled={verifyingLocation}
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded flex items-center justify-center gap-2"
                >
                  {verifyingLocation ? 'Triangulating Satellite Signal...' : 'Verify My Location'}
                </button>
              ) : (
                <div className="text-sm text-green-700">
                  <p>✅ Location Matched (3.4m from target)</p>
                  <p className="text-xs text-gray-500 mt-1">Lat: {currentLocation?.lat.toFixed(5)}, Lng: {currentLocation?.lng.toFixed(5)}</p>
                </div>
              )}
            </div>

            {/* 2. Before Photo */}
            <div className={`p-4 rounded-lg border ${beforePhoto ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} transition-all ${!locationVerified ? 'opacity-50 pointer-events-none' : ''}`}>
              <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5" />
                Step 2: Evidence - Before Work
              </h3>
              
              {beforePhoto ? (
                <div className="relative h-48 w-full">
                  <img src={beforePhoto} className="w-full h-full object-cover rounded-md" alt="Before" />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-white hover:bg-gray-50">
                   <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoCapture('before', e)} />
                   <span className="text-blue-600 font-medium">Capture "Before" Photo</span>
                </label>
              )}
            </div>

            {/* 3. After Photo */}
            <div className={`p-4 rounded-lg border ${afterPhoto ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'} transition-all ${!beforePhoto ? 'opacity-50 pointer-events-none' : ''}`}>
               <h3 className="font-bold text-gray-800 flex items-center gap-2 mb-3">
                <Camera className="w-5 h-5" />
                Step 3: Evidence - After Completion
              </h3>
               {afterPhoto ? (
                <div className="relative h-48 w-full">
                  <img src={afterPhoto} className="w-full h-full object-cover rounded-md" alt="After" />
                  <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
                    {new Date().toLocaleTimeString()}
                  </div>
                </div>
              ) : (
                <label className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer bg-white hover:bg-gray-50">
                   <input type="file" accept="image/*" className="hidden" onChange={(e) => handlePhotoCapture('after', e)} />
                   <span className="text-blue-600 font-medium">Capture "After" Photo</span>
                </label>
              )}
            </div>

            {/* Submit */}
            <button
              onClick={handleSubmitWork}
              disabled={!afterPhoto || isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white font-bold rounded-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed text-lg flex items-center justify-center gap-2"
            >
              {isSubmitting ? 'Uploading & Encrypting...' : 'Submit for AI Verification'}
            </button>

          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
        <Navigation className="text-india-orange" />
        Assigned Tasks
      </h2>
      
      <div className="grid gap-4">
        {assigned.length === 0 ? (
            <div className="p-8 text-center text-gray-500 bg-white rounded-lg border border-dashed">
                No active assignments. Good job!
            </div>
        ) : assigned.map(job => (
          <div key={job.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
            <img src={job.citizenPhoto} alt="Issue" className="w-full md:w-32 h-32 object-cover rounded-lg bg-gray-100" />
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded mb-2">
                  {job.issueType}
                </span>
                <span className="text-xs font-mono text-gray-400">{job.id}</span>
              </div>
              
              <h3 className="font-bold text-gray-900 mb-1">{job.locationName}</h3>
              <p className="text-sm text-gray-600 line-clamp-2 mb-3">{job.description}</p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Due: {new Date(job.estimatedSLA).toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {job.coordinates.lat.toFixed(3)}, {job.coordinates.lng.toFixed(3)}
                </span>
              </div>
              
              <button 
                onClick={() => startWork(job)}
                className="w-full py-2 bg-india-navy hover:bg-blue-900 text-white text-sm font-bold rounded transition-colors"
              >
                Start Field Work
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfficerView;