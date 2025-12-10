import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, AlertCircle, CheckCircle } from 'lucide-react';
import { Complaint, Officer } from '../types';
import { OFFICERS } from '../constants';

interface Props {
  complaints: Complaint[];
}

const AdminDashboard: React.FC<Props> = ({ complaints }) => {
  // Compute Stats
  const total = complaints.length;
  const verified = complaints.filter(c => c.status === 'Verified' || c.status === 'Closed').length;
  const resolutionRate = total > 0 ? Math.round((verified / total) * 100) : 0;
  
  // Fake timeline data
  const timelineData = [
    { name: 'Mon', complaints: 12, resolved: 8 },
    { name: 'Tue', complaints: 18, resolved: 14 },
    { name: 'Wed', complaints: 10, resolved: 9 },
    { name: 'Thu', complaints: 24, resolved: 18 },
    { name: 'Fri', complaints: 16, resolved: 15 },
    { name: 'Sat', complaints: 8, resolved: 6 },
    { name: 'Sun', complaints: 14, resolved: 10 },
  ];

  const issueData = [
    { name: 'Pothole', value: complaints.filter(c => c.issueType === 'Pothole').length },
    { name: 'Lights', value: complaints.filter(c => c.issueType === 'Street Light').length },
    { name: 'Water', value: complaints.filter(c => c.issueType === 'Water Leak').length },
    { name: 'Waste', value: complaints.filter(c => c.issueType === 'Waste Management').length },
  ];

  const COLORS = ['#FF9933', '#000080', '#138808', '#FF8042'];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6 bg-gray-50">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">City Commissioner Dashboard</h2>
          <p className="text-gray-500">Real-time civic operations overview</p>
        </div>
        <div className="text-right">
            <p className="text-sm font-bold text-gray-500">LAST UPDATED</p>
            <p className="text-india-navy font-mono">{new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-india-orange">
          <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-bold text-gray-500 uppercase">Total Complaints</p>
               <h3 className="text-3xl font-bold text-gray-900 mt-1">{total}</h3>
             </div>
             <div className="p-2 bg-orange-100 rounded text-orange-600">
               <AlertCircle className="w-5 h-5" />
             </div>
          </div>
          <p className="text-xs text-green-600 mt-2 font-bold">↑ 12% vs last week</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-india-green">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-bold text-gray-500 uppercase">Resolution Rate</p>
               <h3 className="text-3xl font-bold text-gray-900 mt-1">{resolutionRate}%</h3>
             </div>
             <div className="p-2 bg-green-100 rounded text-green-600">
               <CheckCircle className="w-5 h-5" />
             </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">Target: 85%</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-india-navy">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-bold text-gray-500 uppercase">Avg Resolution Time</p>
               <h3 className="text-3xl font-bold text-gray-900 mt-1">26h</h3>
             </div>
             <div className="p-2 bg-blue-100 rounded text-india-navy">
               <TrendingUp className="w-5 h-5" />
             </div>
          </div>
          <p className="text-xs text-green-600 mt-2 font-bold">↓ 4h improvement</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-600">
           <div className="flex justify-between items-start">
             <div>
               <p className="text-xs font-bold text-gray-500 uppercase">Fraud Prevented</p>
               <h3 className="text-3xl font-bold text-gray-900 mt-1">14</h3>
             </div>
             <div className="p-2 bg-purple-100 rounded text-purple-600">
               <Users className="w-5 h-5" />
             </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">By AI Verification</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Timeline */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Weekly Resolution Trend</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timelineData}>
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                <YAxis stroke="#94a3b8" fontSize={12} />
                <Tooltip />
                <Line type="monotone" dataKey="complaints" stroke="#FF9933" strokeWidth={3} />
                <Line type="monotone" dataKey="resolved" stroke="#138808" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Issue Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-bold text-gray-800 mb-4">Issue Type Distribution</h3>
          <div className="flex items-center">
            <div className="h-64 w-2/3">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={issueData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {issueData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/3 space-y-2 text-sm">
                {issueData.map((entry, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index % COLORS.length]}}></div>
                        <span className="text-gray-600">{entry.name}</span>
                        <span className="font-bold">{entry.value}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {/* Officer Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b">
              <h3 className="font-bold text-gray-800">Top Performing Officers</h3>
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                  <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                      <tr>
                          <th className="px-6 py-3">Officer</th>
                          <th className="px-6 py-3">Jobs Done</th>
                          <th className="px-6 py-3">Avg Time</th>
                          <th className="px-6 py-3">Quality Score</th>
                          <th className="px-6 py-3">Status</th>
                      </tr>
                  </thead>
                  <tbody>
                      {OFFICERS.map((officer) => (
                          <tr key={officer.id} className="border-b hover:bg-gray-50">
                              <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                                  <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-700 font-bold">
                                      {officer.avatar}
                                  </div>
                                  <div>
                                      <div>{officer.name}</div>
                                      <div className="text-xs text-gray-400">{officer.id}</div>
                                  </div>
                              </td>
                              <td className="px-6 py-4">{officer.jobsCompleted}</td>
                              <td className="px-6 py-4">{officer.avgTime}</td>
                              <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                      <div className="w-16 h-2 bg-gray-200 rounded-full">
                                          <div className="h-2 bg-green-500 rounded-full" style={{width: `${officer.qualityScore}%`}}></div>
                                      </div>
                                      {officer.qualityScore}%
                                  </div>
                              </td>
                              <td className="px-6 py-4">
                                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold">Active</span>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>

    </div>
  );
};

export default AdminDashboard;