import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const availableSymptoms = ["Memory Loss", "Confusion", "Chronic Pain", "Severe Illness", "Agitation", "Mood Changes", "Wounds", "Cuts", "Burns", "Skin Irritation", "Fever", "Chills", "Cough", "Respiratory Issues", "General Consultation", "Anxiety", "Stress"];

const nextStepOptions = [
  "Physician Consultation", "Blood Work", "X-Ray", "CT Scan", "MRI Scan", 
  "Ultrasound", "ECG / EKG", "Medication Review", "Specialist Consult", 
  "Discharge Instructions", "Admit to Hospital"
];

export default function NursePortal() {
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || "Aryan123";
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [activeTab, setActiveTab] = useState("create");
  
  const [nurseForm, setNurseForm] = useState({ name: "", healthCard: "" });
  const [nurseSymptoms, setNurseSymptoms] = useState([]);
  const [nurseNextSteps, setNurseNextSteps] = useState(["Triage & Vitals"]);
  
  const [patientsDb, setPatientsDb] = useState([]);
  const [machinesDb, setMachinesDb] = useState([]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchPatients();
      fetchMachines();
    }
  }, [isAdminAuthenticated]);

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/patients`);
      setPatientsDb(await res.json());
    } catch (e) {
      console.log("Database not connected");
    }
  };

  const fetchMachines = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/machines`);
      setMachinesDb(await res.json());
    } catch (e) {
      console.log("Database not connected");
    }
  };

  const toggleNurseSymptom = (symptom) => {
    setNurseSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
  };

  const toggleNurseStep = (step) => {
    if (step === "Triage & Vitals") return; 
    setNurseNextSteps(prev => {
      if (prev.includes(step)) return prev.filter(s => s !== step);
      return [...prev, step];
    });
  };

  const moveStep = (index, direction) => {
    const newSteps = [...nurseNextSteps];
    if (direction === 'up' && index > 1) { 
      [newSteps[index - 1], newSteps[index]] = [newSteps[index], newSteps[index - 1]];
    } else if (direction === 'down' && index < newSteps.length - 1) {
      [newSteps[index + 1], newSteps[index]] = [newSteps[index], newSteps[index + 1]];
    }
    setNurseNextSteps(newSteps);
  };

  const generatePatientCode = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const createPatientRecord = async () => {
    if (!nurseForm.name.trim() || nurseSymptoms.length === 0 || nurseNextSteps.length < 2) {
      alert("Please enter a name, at least 1 symptom, and select at least 1 next step.");
      return;
    }

    const record = {
      code: generatePatientCode(),
      name: nurseForm.name.trim(),
      healthCard: nurseForm.healthCard.trim(),
      symptoms: nurseSymptoms,
      nextSteps: nurseNextSteps,
      currentStepIndex: 1 
    };

    try {
      const res = await fetch(`${API_BASE}/api/patients`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(record),
      });

      if (!res.ok) throw new Error("API create failed");

      const saved = await res.json();
      fetchPatients();
      setNurseForm({ name: "", healthCard: "" });
      setNurseSymptoms([]);
      setNurseNextSteps(["Triage & Vitals"]);
      alert(`SUCCESS! Patient created.\n\nCode: ${saved.code}`);
    } catch (err) {
      alert("Error saving to database.");
    }
  };

  const updatePatientStage = async (id, newIndex) => {
    try {
      const res = await fetch(`${API_BASE}/api/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentStepIndex: newIndex }),
      });
      if (res.ok) fetchPatients(); 
    } catch (err) {
      alert("Error updating stage.");
    }
  };

  const updateMachineStatus = async (id, newStatus) => {
    try {
      const res = await fetch(`${API_BASE}/api/machines/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) fetchMachines();
    } catch (err) {
      alert("Error updating machine.");
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center items-center font-sans">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col relative">
          <div className="bg-[#022c22] px-8 py-10 text-center">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">MediClear Command</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if(adminPasswordInput === ADMIN_PASSWORD) setIsAdminAuthenticated(true); else alert("Incorrect"); }} className="p-8 flex flex-col gap-6">
            <input type="password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full border-b-2 border-gray-300 py-2 outline-none focus:border-[#10b981] font-bold" placeholder="Password" />
            <button type="submit" className="w-full py-4 bg-[#022c22] text-white font-extrabold rounded-xl hover:bg-[#047857]">Access System</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 font-sans text-gray-800 flex flex-col">
      <nav className="bg-[#022c22] px-8 py-5 text-white flex items-center justify-between shadow-md">
        <h1 className="text-2xl font-extrabold tracking-tight">MediClear Command Center</h1>
        <button onClick={() => setIsAdminAuthenticated(false)} className="text-sm font-bold bg-[#047857] px-5 py-2 rounded-lg hover:bg-[#10b981] transition-colors">Sign Out</button>
      </nav>

      <div className="flex-1 max-w-7xl w-full mx-auto p-8 grid grid-cols-12 gap-8">
        
        {/* SIDEBAR NAVIGATION */}
        <div className="col-span-3 flex flex-col gap-3">
          <button onClick={() => setActiveTab("create")} className={`text-left px-6 py-4 rounded-xl font-extrabold tracking-wide uppercase text-sm transition-all ${activeTab === "create" ? "bg-[#10b981] text-white shadow-lg" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
            + Add Patient
          </button>
          <button onClick={() => setActiveTab("database")} className={`text-left px-6 py-4 rounded-xl font-extrabold tracking-wide uppercase text-sm transition-all ${activeTab === "database" ? "bg-[#10b981] text-white shadow-lg" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
            Active Directory
          </button>
          <button onClick={() => setActiveTab("machines")} className={`text-left px-6 py-4 rounded-xl font-extrabold tracking-wide uppercase text-sm transition-all ${activeTab === "machines" ? "bg-[#10b981] text-white shadow-lg" : "bg-white text-gray-500 hover:bg-gray-50"}`}>
            Facility Routing
          </button>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="col-span-9 bg-white rounded-3xl shadow-sm border border-gray-200 p-8 min-h-[700px]">
          
          {activeTab === "create" && (
            <div className="max-w-3xl">
              <h2 className="text-2xl font-black text-gray-900 mb-8 border-b pb-4">New Patient Intake</h2>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Legal Name</label>
                  <input value={nurseForm.name} onChange={(e) => setNurseForm({...nurseForm, name: e.target.value})} className="w-full border-b-2 border-gray-300 py-3 text-lg font-bold outline-none focus:border-[#10b981]" placeholder="Jane Doe" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Health Card (Optional)</label>
                  <input value={nurseForm.healthCard} onChange={(e) => setNurseForm({...nurseForm, healthCard: e.target.value})} className="w-full border-b-2 border-gray-300 py-3 text-lg font-bold outline-none focus:border-[#10b981]" placeholder="XXXX-XXXX-XXXX" />
                </div>
              </div>
              
              <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Primary Symptoms</label>
              <div className="flex flex-wrap gap-2 mb-8 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                {availableSymptoms.map(s => (
                  <button key={s} onClick={() => toggleNurseSymptom(s)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${nurseSymptoms.includes(s) ? "bg-[#10b981] text-white shadow-md" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"}`}>{s}</button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-12">
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-3 uppercase tracking-widest">Available Routing Steps</label>
                  <div className="flex flex-wrap gap-2">
                    {nextStepOptions.map(step => (
                      <button key={step} onClick={() => toggleNurseStep(step)} className={`px-3 py-2 rounded-lg text-xs font-bold border transition-all ${nurseNextSteps.includes(step) ? "bg-emerald-50 text-[#047857] border-emerald-200" : "bg-white text-gray-600 border-gray-200 hover:bg-gray-50"}`}>{step}</button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#047857] mb-3 uppercase tracking-widest">Ordered Journey</label>
                  <div className="flex flex-col gap-2">
                    {nurseNextSteps.map((step, index) => (
                      <div key={index} className="flex items-center justify-between bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-sm font-bold text-[#022c22]">
                        <span>{index + 1}. {step}</span>
                        <div className="flex gap-1">
                          {index > 1 && <button onClick={() => moveStep(index, 'up')} className="px-2 py-1 bg-white rounded shadow-sm hover:bg-gray-100">↑</button>}
                          {index < nurseNextSteps.length - 1 && index !== 0 && <button onClick={() => moveStep(index, 'down')} className="px-2 py-1 bg-white rounded shadow-sm hover:bg-gray-100">↓</button>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-12 pt-6 border-t border-gray-200">
                <button onClick={createPatientRecord} className="px-8 py-4 bg-[#022c22] text-white font-black tracking-wide text-lg rounded-xl hover:bg-[#047857] shadow-xl shadow-emerald-900/20">Authorize & Generate Care Code</button>
              </div>
            </div>
          )}

          {activeTab === "database" && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-8 border-b pb-4">Active Directory</h2>
              <div className="grid grid-cols-2 gap-6">
                {patientsDb.map(p => (
                  <div key={p._id || p.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-200 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-black text-xl text-gray-900">{p.name}</h3>
                      <span className="bg-[#10b981] text-white px-3 py-1 rounded-lg text-xs font-black tracking-widest shadow-sm">{p.code}</span>
                    </div>

                    <div className="bg-white p-4 rounded-xl border border-gray-100 mb-4 flex-1">
                      <div className="flex justify-between items-center mb-3">
                        <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">Live Treatment Stage</p>
                        <p className="text-xs font-black text-[#047857]">
                          {p.currentStepIndex >= p.nextSteps.length ? "Complete" : `Step ${p.currentStepIndex + 1} of ${p.nextSteps.length}`}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2">
                        {p.nextSteps.map((step, idx) => (
                          <div key={idx} className={`text-xs font-bold flex justify-between items-center p-2 rounded ${idx === p.currentStepIndex ? 'bg-emerald-50 border border-emerald-200 text-[#047857]' : idx < p.currentStepIndex ? 'text-gray-400 line-through' : 'text-gray-500'}`}>
                            <span>{idx + 1}. {step}</span>
                            {idx === p.currentStepIndex && <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span>}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-auto">
                      <button disabled={p.currentStepIndex <= 1} onClick={() => updatePatientStage(p._id || p.id, p.currentStepIndex - 1)} className="px-4 py-2 text-xs font-extrabold bg-white border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 disabled:opacity-50">← Revert</button>
                      <button disabled={p.currentStepIndex >= p.nextSteps.length} onClick={() => updatePatientStage(p._id || p.id, p.currentStepIndex + 1)} className="px-6 py-2 text-xs font-extrabold bg-[#022c22] text-white rounded-lg shadow-md hover:bg-[#047857] disabled:opacity-50">Advance Stage →</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "machines" && (
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-8 border-b pb-4">Facility Routing Control</h2>
              <div className="grid grid-cols-2 gap-6">
                {machinesDb.map(m => (
                  <div key={m.id} className="bg-gray-50 p-6 rounded-3xl border border-gray-200">
                    <label className="block text-sm font-black text-gray-900 mb-4">{m.name}</label>
                    <select value={m.status} onChange={(e) => updateMachineStatus(m.id, e.target.value)} className="w-full border border-gray-300 rounded-xl p-4 bg-white font-bold outline-none focus:border-[#10b981] shadow-sm text-gray-700">
                      <option value="Available">🟢 Available</option>
                      <option value="In Use">🔵 In Use</option>
                      <option value="Maintenance">🔴 Maintenance</option>
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}