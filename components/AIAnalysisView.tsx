import React, { useEffect, useState } from 'react';
import { ShieldCheck, Cpu, Map, Clock, Image, CheckCircle, XCircle } from 'lucide-react';
import { Complaint, AIAnalysis } from '../types';

interface Props {
  complaintId: string;
  onComplete: (analysis: AIAnalysis) => void;
}

const AIAnalysisView: React.FC<Props> = ({ complaintId, onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState(0); // 0: Init, 1: GPS, 2: Time, 3: Visual, 4: Quality, 5: Done

  useEffect(() => {
    // Simulate multi-step analysis
    const timer = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 100));
    }, 60);

    const stageTimer = setInterval(() => {
      setStage(prev => prev + 1);
    }, 800);

    return () => {
      clearInterval(timer);
      clearInterval(stageTimer);
    };
  }, []);

  useEffect(() => {
    if (stage > 5) {
      // Finalize
      const result: AIAnalysis = {
        gpsMatch: true,
        timestampValid: true,
        changeDetected: Math.random() > 0.1, // 90% chance of success
        qualityCheck: true,
        confidenceScore: 85 + Math.floor(Math.random() * 14),
        verdict: 'APPROVED',
        notes: ['Significant repair detected', 'Lighting conditions matched']
      };
      
      // Introduce a fake failure scenario for demo if needed, but let's stick to success mostly
      if (!result.changeDetected) {
        result.verdict = 'FLAGGED';
        result.confidenceScore = 45;
        result.notes = ['Minimal visual change detected', 'Suspicious activity'];
      }

      setTimeout(() => onComplete(result), 1000);
    }
  }, [stage, onComplete]);

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-gradient-to-r from-indigo-900 to-india-navy p-6 text-white text-center">
          <Cpu className="w-12 h-12 mx-auto mb-3 animate-pulse" />
          <h2 className="text-xl font-bold">AI Verification Engine</h2>
          <p className="text-indigo-200 text-sm">Analyzing Complaint #{complaintId}</p>
        </div>

        <div className="p-6 space-y-4">
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
            <div 
              className="bg-india-orange h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="space-y-3">
            <StepItem 
              icon={<Map className="w-5 h-5" />} 
              label="GPS Geofence Validation" 
              status={stage >= 1 ? 'done' : 'waiting'} 
            />
            <StepItem 
              icon={<Clock className="w-5 h-5" />} 
              label="Timestamp Metadata Check" 
              status={stage >= 2 ? 'done' : 'waiting'} 
            />
            <StepItem 
              icon={<Image className="w-5 h-5" />} 
              label="Visual Change Detection" 
              status={stage >= 3 ? 'done' : 'waiting'} 
            />
            <StepItem 
              icon={<ShieldCheck className="w-5 h-5" />} 
              label="Anti-Fraud Pattern Match" 
              status={stage >= 4 ? 'done' : 'waiting'} 
            />
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center border border-gray-200">
             <p className="text-gray-500 text-sm animate-pulse">
               {stage < 5 ? 'Processing neural network layers...' : 'Finalizing Verdict...'}
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const StepItem = ({ icon, label, status }: { icon: any, label: string, status: 'waiting' | 'done' }) => (
  <div className={`flex items-center justify-between p-3 rounded-lg transition-all ${status === 'done' ? 'bg-green-50 text-green-900' : 'text-gray-400'}`}>
    <div className="flex items-center gap-3">
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
    {status === 'done' && <CheckCircle className="w-5 h-5 text-green-600" />}
    {status === 'waiting' && <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
  </div>
);

export default AIAnalysisView;