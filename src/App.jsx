import React, { useState } from 'react';

export default function MediClearApp() {
  // Database
  const [currentView, setCurrentView] = useState('home'); // 'home', 'patient', 'staff', 'iot'
  const [activeTab, setActiveTab] = useState('queue'); // 'queue', 'reports'
  
  const [patients, setPatients] = useState([
    { id: 1, name: "John Doe", triage: 3, waitTime: 45, needsHelp: false },
    { id: 2, name: "Jane Smith", triage: 2, waitTime: 15, needsHelp: true },
  ]);

  const [machines, setMachines] = useState([
    { id: "mri_1", name: "MRI Scanner", status: "Available" },
    { id: "xray_1", name: "X-Ray Room A", status: "In Use" },
  ]);

  // Actions
  const togglePatientHelp = (patientId) => {
    setPatients(patients.map(p => p.id === patientId ? { ...p, needsHelp: !p.needsHelp } : p));
  };

  const updateMachineStatus = (machineId, newStatus) => {
    setMachines(machines.map(m => m.id === machineId ? { ...m, status: newStatus } : m));
  };

  // VIEWS
  
  {/* VIEW 0: Home / Landing */}
  if (currentView === 'home') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-6 font-sans">
        <h1 className="text-4xl font-bold text-gray-900">MediClear</h1>
        <p className="text-gray-500 mb-4">Select your portal</p>
        <div className="flex gap-4">
          <button onClick={() => setCurrentView('patient')} className="px-6 py-3 bg-blue-600 text-white font-medium rounded hover:bg-blue-700">
            Patient Portal
          </button>
          <button onClick={() => setCurrentView('staff')} className="px-6 py-3 bg-gray-900 text-white font-medium rounded hover:bg-gray-800">
            Medical Staff
          </button>
          <button onClick={() => setCurrentView('iot')} className="px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded hover:bg-gray-300">
            IoT Controller
          </button>
        </div>
      </div>
    );
  }

  {/* VIEW A: Patient Mobile UI */}
  if (currentView === 'patient') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white border border-gray-300 h-[700px] flex flex-col">
          <div className="bg-blue-600 text-white p-4">
            <button onClick={() => setCurrentView('home')} className="text-sm underline mb-4">Back</button>
            <h2 className="text-xl font-bold">MediClear Patient</h2>
          </div>
          
          <div className="p-6 flex-1 flex flex-col gap-6">
            <div>
              <p className="text-sm text-gray-500 uppercase">Estimated Wait</p>
              <p className="text-4xl font-bold">{patients[0].waitTime} min</p>
            </div>

            <div className="border-t border-gray-200 pt-4">
              <p className="text-sm font-bold mb-2">Facility Status</p>
              {machines.map(m => (
                <div key={m.id} className="flex justify-between text-sm mb-1">
                  <span>{m.name}</span>
                  <span className="text-gray-500">{m.status}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <button 
                onClick={() => togglePatientHelp(patients[0].id)}
                className={`w-full py-4 font-bold text-white transition-colors ${patients[0].needsHelp ? 'bg-gray-500' : 'bg-red-600'}`}
              >
                {patients[0].needsHelp ? "Cancel Request" : "Symptoms Worsened"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  {/* VIEW B: Medical Staff UI */}
  if (currentView === 'staff') {
    return (
      <div className="flex h-screen bg-white font-sans">
        {/* Sidebar */}
        <div className="w-64 bg-gray-900 text-gray-300 flex flex-col">
          <div className="p-4 font-bold text-white text-xl border-b border-gray-800">
            MediClear
          </div>
          <div className="flex flex-col p-2 gap-1 flex-1">
            <button 
              onClick={() => setActiveTab('queue')}
              className={`text-left px-3 py-2 rounded ${activeTab === 'queue' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'}`}
            >
              Patient Queue
            </button>
            <button 
              onClick={() => setActiveTab('reports')}
              className={`text-left px-3 py-2 rounded ${activeTab === 'reports' ? 'bg-gray-800 text-white' : 'hover:bg-gray-800'}`}
            >
              Reports
            </button>
          </div>
          <div className="p-4 border-t border-gray-800">
            <button onClick={() => setCurrentView('home')} className="text-sm hover:text-white">Sign Out</button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-gray-200 font-bold text-lg">
            {activeTab === 'queue' ? 'Live Triage Queue' : 'Doctor Reports'}
          </div>
          
          <div className="p-6 flex-1 overflow-auto bg-gray-50">
            {activeTab === 'queue' && (
              <table className="w-full bg-white border border-gray-200 text-left">
                <thead className="border-b border-gray-200 bg-gray-100">
                  <tr>
                    <th className="p-3">Name</th>
                    <th className="p-3">Priority</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map(p => (
                    <tr key={p.id} className={`border-b border-gray-100 ${p.needsHelp ? 'bg-red-50' : ''}`}>
                      <td className="p-3 font-medium">{p.name}</td>
                      <td className="p-3">Level {p.triage}</td>
                      <td className="p-3 text-sm">
                        {p.needsHelp ? <span className="text-red-600 font-bold">Needs Reassessment</span> : "Waiting"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTab === 'reports' && (
              <div className="text-gray-500">Report generation view goes here...</div>
            )}
          </div>
        </div>
      </div>
    );
  }

  {/* VIEW C: IoT Portal */}
  if (currentView === 'iot') {
    return (
      <div className="min-h-screen bg-gray-50 p-8 font-sans">
        <button onClick={() => setCurrentView('home')} className="text-sm underline mb-6">Back to Home</button>
        <h2 className="text-2xl font-bold mb-6">IoT Machine Controller</h2>
        
        <div className="max-w-md bg-white p-6 border border-gray-200 shadow-sm">
          {machines.map(m => (
            <div key={m.id} className="mb-4">
              <label className="block text-sm font-bold mb-1">{m.name}</label>
              <select 
                value={m.status} 
                onChange={(e) => updateMachineStatus(m.id, e.target.value)}
                className="w-full border border-gray-300 p-2"
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
}