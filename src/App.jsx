import React, { useState } from 'react';

export default function HospitalHackathonDemo() {
  // --- "Database"
  const [patients, setPatients] = useState([
    { 
      id: 1, name: "John Doe", age: 34, triage: 3, waitTime: 45, needsHelp: false,
      history: "Appendectomy (2018), Allergic to Penicillin",
      symptoms: "Severe abdominal pain, nausea"
    },
    { 
      id: 2, name: "Jane Smith", age: 28, triage: 2, waitTime: 15, needsHelp: true,
      history: "Asthma",
      symptoms: "Shortness of breath, chest tightness"
    },
  ]);

  const [activeTab, setActiveTab] = useState('patients'); // can also use 'doctor'
  const [selectedPatient, setSelectedPatient] = useState(null);

  const togglePatientHelp = (patientId) => {
    setPatients(patients.map(p => p.id === patientId ? { ...p, needsHelp: !p.needsHelp } : p));
  };

  const releaseReport = (e) => {
    e.preventDefault();
    alert("Report released to patient portal!");
    // This WOULD update the database
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8 font-sans flex flex-wrap gap-8">
      
      {/*VIEW A: Patient Mobile UI*/}
      <div className="w-[350px] bg-white rounded-[3rem] shadow-2xl border-[12px] border-gray-900 overflow-hidden flex flex-col h-[700px]">
        {/* Phone Header */}
        <div className="bg-blue-600 text-white p-6 pt-10 rounded-b-3xl shadow-md">
          <p className="text-sm opacity-80">Welcome back,</p>
          <h2 className="text-2xl font-bold">{patients[0].name}</h2>
        </div>

        {/* Phone Body */}
        <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto">
          <div className="bg-blue-50 p-5 rounded-2xl border border-blue-100 text-center">
            <p className="text-gray-500 text-sm font-semibold uppercase tracking-wider">Estimated Wait</p>
            <p className="text-5xl font-extrabold text-blue-700 mt-2">{patients[0].waitTime}<span className="text-xl text-blue-500"> min</span></p>
          </div>

          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h4 className="font-bold text-gray-800 mb-2">Next Step</h4>
            <p className="text-gray-600 text-sm">Doctor Consultation - Room 4</p>
          </div>

          <div className="mt-auto">
            <button 
              onClick={() => togglePatientHelp(patients[0].id)}
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg ${
                patients[0].needsHelp 
                  ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' 
                  : 'bg-red-500 text-white hover:bg-red-600 active:scale-95'
              }`}
            >
              {patients[0].needsHelp ? "Cancel Request" : "🚨 Symptoms Worsened"}
            </button>
          </div>
        </div>
      </div>

      {/*VIEW B: MEDICAL STAFF DASHBOARD*/}
      <div className="flex-1 bg-white rounded-2xl shadow-xl border border-gray-200 flex overflow-hidden min-w-[800px] h-[700px]">
        
        {/*Sidebar*/}
        <div className="w-64 bg-slate-900 text-white flex flex-col">
          <div className="p-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-blue-400">✚</span> MedBoard
            </h2>
          </div>
          <nav className="flex-1 px-4 flex flex-col gap-2">
            <button 
              onClick={() => setActiveTab('patients')}
              className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'patients' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
            >
              👥 Patient Queue
            </button>
            <button 
              onClick={() => setActiveTab('doctor')}
              className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'doctor' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-slate-800 hover:text-white'}`}
            >
              📝 Doctor Reports
            </button>
          </nav>
        </div>

        {/* Main Content*/}
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          
          {/*Top Nav*/}
          <header className="bg-white border-b border-gray-200 px-8 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">
              {activeTab === 'patients' ? 'Live Triage Queue' : 'Doctor Portal'}
            </h1>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium text-gray-600">System Sync Active</span>
            </div>
          </header>

          {/* Content Views */}
          <main className="flex-1 p-8 overflow-y-auto flex gap-6">
            
            {/*Patient List*/}
            {activeTab === 'patients' && (
              <>
                <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="p-4 text-sm font-semibold text-gray-600">Patient</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Priority</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Wait Time</th>
                        <th className="p-4 text-sm font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {patients.map(p => (
                        <tr 
                          key={p.id} 
                          onClick={() => setSelectedPatient(p)}
                          className={`cursor-pointer transition-colors ${
                            p.needsHelp 
                              ? 'bg-red-50 border-l-4 border-l-red-500 animate-pulse hover:bg-red-100' 
                              : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                          } ${selectedPatient?.id === p.id && !p.needsHelp ? 'bg-blue-50' : ''}`}
                        >
                          <td className="p-4 font-medium text-gray-900">{p.name}</td>
                          <td className="p-4">
                            <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                              Level {p.triage}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">{p.waitTime} mins</td>
                          <td className="p-4">
                            {p.needsHelp ? (
                              <span className="text-red-600 font-bold text-sm flex items-center gap-2">
                                🚨 Reassess Requested
                              </span>
                            ) : (
                              <span className="text-gray-500 text-sm">Waiting</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Patient Details*/}
                {selectedPatient && (
                  <div className="w-80 bg-white border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-4 animate-fade-in-right">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-gray-900">{selectedPatient.name}</h3>
                      <button onClick={() => setSelectedPatient(null)} className="text-gray-400 hover:text-gray-700">✖</button>
                    </div>
                    <div className="text-sm text-gray-600 border-b pb-4">Age: {selectedPatient.age} | ID: #{selectedPatient.id}</div>
                    
                    <div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1">Current Symptoms</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">{selectedPatient.symptoms}</p>
                    </div>

                    <div>
                      <h4 className="font-bold text-gray-800 text-sm mb-1">Medical History</h4>
                      <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border">{selectedPatient.history}</p>
                    </div>

                    <button className="mt-auto w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                      Admit Patient
                    </button>
                  </div>
                )}
              </>
            )}

            {/*Doctor Reports*/}
            {activeTab === 'doctor' && (
              <div className="flex-1 bg-white border border-gray-200 rounded-xl shadow-sm p-8">
                <h2 className="text-xl font-bold mb-6 text-gray-800">Release Patient Report</h2>
                <form onSubmit={releaseReport} className="max-w-xl flex flex-col gap-5">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Select Patient</label>
                    <select className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200">
                      {patients.map(p => <option key={p.id}>{p.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Diagnosis / Notes</label>
                    <textarea rows="5" className="w-full border border-gray-300 rounded-lg p-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200" placeholder="Enter medical notes here..."></textarea>
                  </div>
                  <button type="submit" className="self-start px-6 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors">
                    Securely Release Report
                  </button>
                </form>
              </div>
            )}
            
          </main>
        </div>
      </div>
    </div>
  );
}