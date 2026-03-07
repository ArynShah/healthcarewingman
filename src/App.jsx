import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';

// SHARED STATE (Replaced by Firebase later)
const mockPatients = [
  { id: 1, name: "John Doe", triage: 3, waitTime: 45, needsHelp: false },
  { id: 2, name: "Jane Smith", triage: 2, waitTime: 15, needsHelp: true },
];

const mockMachines = [
  { id: "mri_1", name: "MRI Scanner", status: "Available" },
  { id: "xray_1", name: "X-Ray Room A", status: "In Use" },
];

// VIEW 0: HOME / LANDING PAGE
function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-3">MediClear</h1>
        <p className="text-lg text-gray-500">Select your portal destination</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
        
        <Link to="/patient" className="flex-1 block group">
          <div className="h-full p-8 bg-white border-2 border-blue-100 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-md transition-all">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Patient Portal</h2>
            <p className="text-gray-600 mb-6">Mobile-first view for triage tracking, wait times, and direct alerts.</p>
            <span className="text-blue-600 font-semibold group-hover:underline">Launch Portal &rarr;</span>
          </div>
        </Link>

        <Link to="/staff" className="flex-1 block group">
          <div className="h-full p-8 bg-white border-2 border-slate-200 rounded-xl shadow-sm hover:border-slate-800 hover:shadow-md transition-all">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Medical Staff</h2>
            <p className="text-gray-600 mb-6">Secure dashboard for live queues, priority management, and reports.</p>
            <span className="text-slate-800 font-semibold group-hover:underline">Access Dashboard &rarr;</span>
          </div>
        </Link>

        <Link to="/iot" className="flex-1 block group">
          <div className="h-full p-8 bg-white border-2 border-green-100 rounded-xl shadow-sm hover:border-green-500 hover:shadow-md transition-all">
            <h2 className="text-2xl font-bold text-green-700 mb-2">IoT Controller</h2>
            <p className="text-gray-600 mb-6">Backend machine state simulator for facility operations.</p>
            <span className="text-green-600 font-semibold group-hover:underline">Open Controller &rarr;</span>
          </div>
        </Link>

      </div>
    </div>
  );
}

// VIEW A: PATIENT MOBILE UI
function PatientView() {
  const navigate = useNavigate();
  // Using mock data
  const patient = mockPatients[0]; 

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white border border-gray-300 h-[700px] flex flex-col shadow-lg">
        <div className="bg-blue-600 text-white p-4">
          <button onClick={() => navigate('/')} className="text-sm underline mb-4 hover:text-blue-200">Return Home</button>
          <h2 className="text-xl font-bold">MediClear Patient</h2>
        </div>
        
        <div className="p-6 flex-1 flex flex-col gap-6">
          <div>
            <p className="text-sm text-gray-500 uppercase tracking-wide">Estimated Wait</p>
            <p className="text-5xl font-bold text-gray-900">{patient.waitTime} min</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-sm font-bold text-gray-800 mb-3">Facility Status</p>
            {mockMachines.map(m => (
              <div key={m.id} className="flex justify-between text-sm mb-2 pb-2 border-b border-gray-50">
                <span className="font-medium">{m.name}</span>
                <span className="text-gray-500">{m.status}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <button className={`w-full py-4 font-bold text-white transition-colors ${patient.needsHelp ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'}`}>
              {patient.needsHelp ? "Cancel Request" : "Symptoms Worsened"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// VIEW B: MEDICAL STAFF UI
function StaffView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('queue');

  return (
    <div className="flex h-screen bg-white font-sans">
      <div className="w-64 bg-gray-900 text-gray-300 flex flex-col">
        <div className="p-6 font-bold text-white text-2xl border-b border-gray-800">
          MediClear
        </div>
        <div className="flex flex-col p-4 gap-2 flex-1">
          <button onClick={() => setActiveTab('queue')} className={`text-left px-4 py-3 rounded ${activeTab === 'queue' ? 'bg-gray-800 text-white font-medium' : 'hover:bg-gray-800'}`}>
            Patient Queue
          </button>
          <button onClick={() => setActiveTab('reports')} className={`text-left px-4 py-3 rounded ${activeTab === 'reports' ? 'bg-gray-800 text-white font-medium' : 'hover:bg-gray-800'}`}>
            Doctor Reports
          </button>
        </div>
        <div className="p-6 border-t border-gray-800">
          <button onClick={() => navigate('/')} className="text-sm text-gray-400 hover:text-white transition-colors">Sign Out / Home</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="px-8 py-6 border-b border-gray-200 bg-white font-bold text-xl text-gray-800">
          {activeTab === 'queue' ? 'Live Triage Queue' : 'Doctor Reports'}
        </div>
        
        <div className="p-8 flex-1 overflow-auto">
          {activeTab === 'queue' && (
            <div className="bg-white border border-gray-200 rounded shadow-sm">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-50">
                  <tr>
                    <th className="p-4 font-semibold text-gray-600">Patient Name</th>
                    <th className="p-4 font-semibold text-gray-600">Priority</th>
                    <th className="p-4 font-semibold text-gray-600">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {mockPatients.map(p => (
                    <tr key={p.id} className={`border-b border-gray-100 ${p.needsHelp ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                      <td className="p-4 font-medium text-gray-900">{p.name}</td>
                      <td className="p-4 text-gray-700">Level {p.triage}</td>
                      <td className="p-4 text-sm">
                        {p.needsHelp ? <span className="text-red-600 font-bold">Needs Reassessment</span> : <span className="text-gray-500">Waiting</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// VIEW C: IOT PORTAL
function IotView() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans">
      <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline mb-8 block">&larr; Back to Home</button>
      <h2 className="text-3xl font-bold mb-8 text-gray-900">IoT Machine Controller</h2>
      
      <div className="max-w-md bg-white p-8 border border-gray-200 shadow-sm rounded">
        <p className="text-sm text-gray-500 mb-6">Changing these values will update the live facility status.</p>
        {mockMachines.map(m => (
          <div key={m.id} className="mb-6">
            <label className="block text-sm font-bold text-gray-800 mb-2">{m.name}</label>
            <select 
              defaultValue={m.status} 
              className="w-full border border-gray-300 rounded p-3 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              <option value="Available">Available</option>
              <option value="In Use">In Use</option>
              <option value="Maintenance">Maintenance</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

// MAIN ROUTER
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/patient" element={<PatientView />} />
        <Route path="/staff" element={<StaffView />} />
        <Route path="/iot" element={<IotView />} />
      </Routes>
    </Router>
  );
}