import React from 'react';
import { ThumbsUp, ThumbsDown, MapPin, Search } from 'lucide-react';
import { Complaint } from '../types';
import { JAIPUR_BOUNDS } from '../constants';

interface Props {
  complaints: Complaint[];
  onVote: (id: string, type: 'up' | 'down') => void;
}

const CommunityView: React.FC<Props> = ({ complaints, onVote }) => {
  const completed = complaints.filter(c => c.status === 'Verified' || c.status === 'Closed');

  // Simple relative positioning for map
  const getMapPosition = (lat: number, lng: number) => {
    const latPercent = (lat - JAIPUR_BOUNDS.minLat) / (JAIPUR_BOUNDS.maxLat - JAIPUR_BOUNDS.minLat) * 100;
    const lngPercent = (lng - JAIPUR_BOUNDS.minLng) / (JAIPUR_BOUNDS.maxLng - JAIPUR_BOUNDS.minLng) * 100;
    return { top: `${100 - latPercent}%`, left: `${lngPercent}%` };
  };

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col lg:flex-row gap-6 h-[calc(100vh-140px)]">
      
      {/* Left: Map */}
      <div className="lg:w-2/3 bg-blue-50 rounded-xl border-2 border-india-navy relative overflow-hidden shadow-inner">
        <div className="absolute top-4 left-4 z-10 bg-white/90 p-2 rounded shadow backdrop-blur-sm">
          <h3 className="font-bold text-india-navy flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Jaipur Live Impact Map
          </h3>
          <p className="text-xs text-gray-500">Showing recently completed works</p>
        </div>
        
        {/* Mock Map Grid */}
        <div className="w-full h-full relative opacity-50" 
             style={{ 
               backgroundImage: 'radial-gradient(#000080 1px, transparent 1px)', 
               backgroundSize: '20px 20px' 
             }}>
          {/* Decorative Map Elements */}
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl text-india-navy/10 font-black pointer-events-none select-none">
             JAIPUR
           </div>
        </div>

        {/* Pins */}
        {complaints.map((c) => {
          if (c.status === 'Submitted') return null; // Don't show new unverified complaints
          const pos = getMapPosition(c.coordinates.lat, c.coordinates.lng);
          const color = c.status === 'Verified' ? 'bg-india-green' : c.status === 'In Progress' ? 'bg-india-orange' : 'bg-red-500';
          
          return (
            <div 
              key={c.id}
              className={`absolute w-4 h-4 rounded-full border-2 border-white shadow-md cursor-pointer hover:scale-150 transition-transform group ${color}`}
              style={pos}
            >
              <div className="hidden group-hover:block absolute bottom-6 left-1/2 -translate-x-1/2 bg-white text-xs p-2 rounded shadow-xl w-48 z-20 pointer-events-none">
                <p className="font-bold text-gray-800">{c.issueType}</p>
                <p className="text-gray-500 truncate">{c.locationName}</p>
                <p className="text-[10px] mt-1 text-blue-600 font-bold">{c.status}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Right: Feed */}
      <div className="lg:w-1/3 flex flex-col bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="p-4 border-b">
           <h3 className="font-bold text-lg text-gray-800">Verified Work Feed</h3>
           <div className="mt-2 relative">
             <input type="text" placeholder="Search area..." className="w-full pl-9 pr-3 py-2 bg-gray-50 border rounded-lg text-sm outline-none focus:ring-1 focus:ring-india-orange" />
             <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
           </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {completed.map(job => (
            <div key={job.id} className="border rounded-lg p-3 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                 <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-700">
                    {job.assignedOfficerId?.split('-')[1]}
                 </div>
                 <div>
                   <p className="text-sm font-bold text-gray-900">Resolved {job.issueType}</p>
                   <p className="text-xs text-gray-500">{new Date(job.submissionTime).toLocaleDateString()} • {job.locationName}</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-1 mb-3 rounded-lg overflow-hidden h-24">
                <div className="relative">
                  <img src={job.beforePhoto || job.citizenPhoto} className="w-full h-full object-cover" alt="Before" />
                  <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1 rounded">Before</span>
                </div>
                <div className="relative">
                  <img src={job.afterPhoto} className="w-full h-full object-cover" alt="After" />
                  <span className="absolute bottom-1 left-1 bg-green-600/90 text-white text-[10px] px-1 rounded">After</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                 <div className="text-xs text-gray-500">
                   Was this fixed properly?
                 </div>
                 <div className="flex gap-3">
                   <button 
                    onClick={() => onVote(job.id, 'up')}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-green-600"
                   >
                     <ThumbsUp className="w-4 h-4" /> {job.communityVotes.up}
                   </button>
                   <button 
                    onClick={() => onVote(job.id, 'down')}
                    className="flex items-center gap-1 text-sm text-gray-600 hover:text-red-600"
                   >
                     <ThumbsDown className="w-4 h-4" /> {job.communityVotes.down}
                   </button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommunityView;