import React, { useState } from 'react';
import { LayoutDashboard, FileCheck, HardHat, PlusCircle, Globe } from 'lucide-react';
import CitizenView from './components/CitizenView';
import OfficerView from './components/OfficerView';
import SupervisorView from './components/SupervisorView';
import CommunityView from './components/CommunityView';
import AdminDashboard from './components/AdminDashboard';
import AIAnalysisView from './components/AIAnalysisView';
import { Complaint, AIAnalysis } from './types';
import { INITIAL_COMPLAINTS } from './constants';

type Tab = 'report' | 'officer' | 'supervisor' | 'community' | 'dashboard';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('report');
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  
  // State to handle the modal AI view
  const [aiProcessingId, setAiProcessingId] = useState<string | null>(null);

  const addComplaint = (newComplaint: Partial<Complaint>) => {
    setComplaints(prev => [newComplaint as Complaint, ...prev]);
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const handleAIComplete = (analysis: AIAnalysis) => {
    if (aiProcessingId) {
      updateComplaint(aiProcessingId, {
        aiAnalysis: analysis,
        status: analysis.verdict === 'APPROVED' ? 'Pending Approval' : 'Flagged'
      });
      setAiProcessingId(null);
    }
  };

  const handleSupervisorAction = (id: string, action: 'approve' | 'reject', notes: string) => {
    updateComplaint(id, {
      status: action === 'approve' ? 'Verified' : 'In Progress', // If reject, send back to officer? Or flagged. Simplifying for prototype.
      supervisorNotes: notes
    });
  };

  const handleCommunityVote = (id: string, type: 'up' | 'down') => {
    setComplaints(prev => prev.map(c => {
      if (c.id === id) {
        return {
          ...c,
          communityVotes: {
            up: type === 'up' ? c.communityVotes.up + 1 : c.communityVotes.up,
            down: type === 'down' ? c.communityVotes.down + 1 : c.communityVotes.down
          }
        };
      }
      return c;
    }));
  };

  const NavButton = ({ tab, icon: Icon, label }: { tab: Tab, icon: any, label: string }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex flex-col items-center justify-center p-2 min-w-[60px] md:min-w-[80px] rounded-lg transition-all ${
        activeTab === tab 
          ? 'text-india-orange font-bold bg-orange-50' 
          : 'text-gray-500 hover:text-india-navy hover:bg-gray-50'
      }`}
    >
      <Icon className={`w-6 h-6 mb-1 ${activeTab === tab ? 'stroke-2' : 'stroke-1'}`} />
      <span className="text-[10px] md:text-xs">{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-sans pb-20 md:pb-0">
      {/* Header */}
      <header className="bg-india-navy text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
               <span className="text-india-orange font-bold text-lg">R</span>
             </div>
             <h1 className="text-xl font-bold tracking-tight">
               Reboost<span className="text-india-orange">Rajasthan</span>
             </h1>
          </div>
          <div className="hidden md:flex gap-1">
             {/* Desktop Nav - usually simpler or part of header */}
          </div>
          <div className="text-xs text-blue-200">
            Govt. Prototype v1.0
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-6">
        {activeTab === 'report' && <CitizenView onSubmit={addComplaint} />}
        {activeTab === 'officer' && (
          <OfficerView 
            complaints={complaints} 
            officerId="OFF-001" // Hardcoded active officer
            onUpdateComplaint={updateComplaint}
            onTriggerAI={setAiProcessingId}
          />
        )}
        {activeTab === 'supervisor' && (
          <SupervisorView 
            complaints={complaints}
            onApprove={(id, n) => handleSupervisorAction(id, 'approve', n)}
            onReject={(id, n) => handleSupervisorAction(id, 'reject', n)}
          />
        )}
        {activeTab === 'community' && <CommunityView complaints={complaints} onVote={handleCommunityVote} />}
        {activeTab === 'dashboard' && <AdminDashboard complaints={complaints} />}
      </main>

      {/* AI Overlay */}
      {aiProcessingId && (
        <AIAnalysisView 
          complaintId={aiProcessingId} 
          onComplete={handleAIComplete}
        />
      )}

      {/* Mobile/Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-50">
        <div className="max-w-3xl mx-auto flex justify-around p-2">
          <NavButton tab="report" icon={PlusCircle} label="Report" />
          <NavButton tab="officer" icon={HardHat} label="Field Work" />
          <NavButton tab="supervisor" icon={FileCheck} label="Approval" />
          <NavButton tab="community" icon={Globe} label="Community" />
          <NavButton tab="dashboard" icon={LayoutDashboard} label="Admin" />
        </div>
      </nav>
    </div>
  );
};

export default App;
