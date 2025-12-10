import React, { useState } from 'react';
import { Camera, MapPin, Send } from 'lucide-react';
import { Complaint, IssueType, Coordinates } from '../types';
import { generateJaipurCoordinates } from '../constants';

interface Props {
  onSubmit: (complaint: Partial<Complaint>) => void;
}

const CitizenView: React.FC<Props> = ({ onSubmit }) => {
  const [issueType, setIssueType] = useState<IssueType>('Pothole');
  const [description, setDescription] = useState('');
  const [locationName, setLocationName] = useState('');
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Simulate reading file and getting GPS
      setPhoto(URL.createObjectURL(e.target.files[0]));
      // Simulate getting GPS from EXIF or Device
      setCoordinates(generateJaipurCoordinates());
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!coordinates || !photo) return;

    const newId = `SS-2024-${Math.floor(1000 + Math.random() * 9000)}`;
    
    onSubmit({
      id: newId,
      issueType,
      description,
      locationName: locationName || 'Unknown Location',
      coordinates,
      citizenPhoto: photo,
      submissionTime: new Date().toISOString(),
      estimatedSLA: new Date(Date.now() + 1000 * 60 * 60 * 48).toISOString(), // 48h
      status: 'Submitted',
      communityVotes: { up: 0, down: 0 }
    });
    
    setSubmittedId(newId);
  };

  if (submittedId) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center animate-fade-in">
        <div className="w-16 h-16 bg-india-green rounded-full flex items-center justify-center mb-4">
          <Send className="text-white w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-india-navy mb-2">Complaint Submitted!</h2>
        <p className="text-gray-600 mb-6">Thank you for helping keep Rajasthan clean.</p>
        
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md border-t-4 border-india-orange">
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Complaint ID:</span>
            <span className="font-mono font-bold text-india-navy">{submittedId}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Estimated Resolution:</span>
            <span className="font-medium text-india-orange">48 Hours</span>
          </div>
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 text-sm rounded">
             You can track the status in the "Community" tab or wait for SMS updates.
          </div>
        </div>
        
        <button 
          onClick={() => {
            setSubmittedId(null);
            setPhoto(null);
            setCoordinates(null);
            setDescription('');
            setLocationName('');
          }}
          className="mt-8 text-india-navy font-semibold underline"
        >
          Submit Another Issue
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        <div className="bg-india-navy p-4 text-white">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MapPin className="w-5 h-5 text-india-orange" />
            Report an Issue
          </h2>
          <p className="text-sm text-gray-300 opacity-80">Help us identify and fix civic problems.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {/* Issue Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Issue Type</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['Pothole', 'Street Light', 'Water Leak', 'Waste Management', 'Other'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setIssueType(type as IssueType)}
                  className={`p-3 text-sm rounded-lg border text-center transition-colors ${
                    issueType === type 
                    ? 'bg-india-orange/10 border-india-orange text-india-orange font-bold' 
                    : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Photo & Location */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Photo Evidence</label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors relative">
              <input 
                type="file" 
                accept="image/*" 
                onChange={handlePhotoUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              {photo ? (
                <div className="relative">
                  <img src={photo} alt="Evidence" className="mx-auto h-48 object-cover rounded-lg shadow-sm" />
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-green-400" />
                    {coordinates ? `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}` : 'Locating...'}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-3">
                    <Camera className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-medium text-gray-900">Click to upload photo</p>
                  <p className="text-xs text-gray-500 mt-1">GPS coordinates will be captured automatically</p>
                </div>
              )}
            </div>
          </div>

          {/* Location Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Location Name/Landmark</label>
            <input
              type="text"
              required
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-india-orange focus:border-india-orange outline-none"
              placeholder="e.g., Near City Palace Gate 2"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-india-orange focus:border-india-orange outline-none"
              placeholder="Describe the issue in detail..."
            />
          </div>

          <button
            type="submit"
            disabled={!photo || !coordinates}
            className="w-full py-3 bg-gradient-to-r from-india-orange to-orange-600 text-white font-bold rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            Submit Complaint
          </button>
        </form>
      </div>
    </div>
  );
};

export default CitizenView;