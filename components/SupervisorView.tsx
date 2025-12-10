import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, User } from 'lucide-react';
import { Complaint } from '../types';

interface Props {
  complaints: Complaint[];
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, notes: string) => void;
}

const SupervisorView: React.FC<Props> = ({ complaints, onApprove, onReject }) => {
  const pendingReview = complaints.filter(c => c.status === 'Pending Approval' || c.status === 'Flagged');

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Supervisor Dashboard</h2>
        <span className="bg-india-orange text-white px-3 py-1 rounded-full text-sm font-bold">
          {pendingReview.length} Pending
        </span>
      </div>

      <div className="space-y-8">
        {pendingReview.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl shadow border border-gray-100">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">All Caught Up!</h3>
            <p className="text-gray-500 mt-2">No pending works for verification.</p>
          </div>
        ) : (
          pendingReview.map(complaint => (
            <div key={complaint.id} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 p-4 border-b flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg text-india-navy">{complaint.id}</h3>
                  <p className="text-sm text-gray-500">{complaint.locationName}</p>
                </div>
                {complaint.aiAnalysis?.verdict === 'APPROVED' ? (
                  <span className="flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">
                    <CheckCircle className="w-3 h-3" /> AI APPROVED
                  </span>
                ) : (
                   <span className="flex items-center gap-1 bg-red-100 text-red-800 px-3 py-1 rounded-full text-xs font-bold border border-red-200">
                    <AlertTriangle className="w-3 h-3" /> AI FLAGGED
                  </span>
                )}
              </div>

              <div className="p-4 grid md:grid-cols-2 gap-6">
                {/* Images */}
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase block mb-1">Before</span>
                      <img src={complaint.beforePhoto || complaint.citizenPhoto} className="w-full h-32 object-cover rounded border" alt="Before" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-gray-500 uppercase block mb-1">After</span>
                      <img src={complaint.afterPhoto || ''} className="w-full h-32 object-cover rounded border" alt="After" />
                    </div>
                  </div>
                  
                  {/* AI Stats */}
                  <div className="bg-slate-50 p-3 rounded border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">AI Analysis</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex justify-between">
                         <span className="text-gray-600">GPS Match:</span>
                         <span className={complaint.aiAnalysis?.gpsMatch ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                           {complaint.aiAnalysis?.gpsMatch ? 'Pass' : 'Fail'}
                         </span>
                      </div>
                      <div className="flex justify-between">
                         <span className="text-gray-600">Visual Change:</span>
                         <span className={complaint.aiAnalysis?.changeDetected ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}>
                           {complaint.aiAnalysis?.changeDetected ? 'Significant' : 'None'}
                         </span>
                      </div>
                       <div className="col-span-2 mt-1 pt-1 border-t border-slate-200 flex justify-between items-center">
                         <span className="font-medium text-slate-700">Confidence Score:</span>
                         <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-gray-200 rounded-full">
                              <div 
                                className={`h-2 rounded-full ${complaint.aiAnalysis?.confidenceScore! > 80 ? 'bg-green-500' : 'bg-orange-500'}`}
                                style={{ width: `${complaint.aiAnalysis?.confidenceScore}%` }}
                              />
                            </div>
                            <span className="text-xs font-bold">{complaint.aiAnalysis?.confidenceScore}%</span>
                         </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-gray-900 mb-2 flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-500" />
                      Officer Details
                    </h4>
                    <div className="text-sm text-gray-600 mb-4 bg-white p-3 border rounded">
                      <p>ID: <span className="font-mono">{complaint.assignedOfficerId}</span></p>
                      <p>Time Taken: 2h 15m</p>
                      <p>Distance Variance: 3.2m</p>
                    </div>

                    <h4 className="text-sm font-bold text-gray-900 mb-2">Verdict Notes</h4>
                    <textarea 
                      className="w-full text-sm p-2 border rounded h-24 resize-none focus:ring-1 focus:ring-blue-500 outline-none" 
                      placeholder="Add notes for the record..."
                    ></textarea>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-4">
                    <button 
                      onClick={() => onReject(complaint.id, "Rejected by supervisor")}
                      className="py-2 border border-red-500 text-red-600 rounded-lg hover:bg-red-50 font-medium flex items-center justify-center gap-2"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                    <button 
                      onClick={() => onApprove(complaint.id, "Approved by supervisor")}
                      className="py-2 bg-india-green text-white rounded-lg hover:bg-green-700 font-medium shadow flex items-center justify-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SupervisorView;