import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const availableSymptoms = ["Memory Loss", "Confusion", "Chronic Pain", "Severe Illness", "Agitation", "Mood Changes", "Wounds", "Cuts", "Burns", "Skin Irritation", "Fever", "Chills", "Cough", "Respiratory Issues", "General Consultation", "Anxiety", "Stress"];

const nextStepOptions = [
  "Physician Consultation", "Blood Work", "X-Ray", "CT Scan", "MRI Scan", 
  "Ultrasound", "ECG / EKG", "Medication Review", "Specialist Consult", 
  "Discharge Instructions", "Admit to Hospital"
];

export default function NursePortal() {
  const ADMIN_PASSWORD = "mediclear123";
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [nursePage, setNursePage] = useState("create");
  
  const [nurseForm, setNurseForm] = useState({ name: "", healthCard: "" });
  const [nurseSymptoms, setNurseSymptoms] = useState([]);
  
  const [nurseNextSteps, setNurseNextSteps] = useState(["Triage & Vitals"]);
  const [patientsDb, setPatientsDb] = useState([]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchPatients();
    }
  }, [isAdminAuthenticated]);

  const fetchPatients = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/patients`);
      const data = await res.json();
      setPatientsDb(data);
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
      alert("Please enter a name, at least 1 symptom, and select at least 1 next step (Triage is default).");
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
      setPatientsDb([saved, ...patientsDb]);
      setNurseForm({ name: "", healthCard: "" });
      setNurseSymptoms([]);
      setNurseNextSteps(["Triage & Vitals"]);
      alert(`SUCCESS! Patient created.\n\nGive the patient this code: ${saved.code}`);
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
      if (res.ok) {
        fetchPatients(); 
      }
    } catch (err) {
      alert("Error updating stage.");
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center sm:p-4 font-sans">
        <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative h-[100dvh] sm:h-[850px]">
          <div className="bg-[#022c22] px-8 py-10 text-center flex-shrink-0">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Nurse Portal</h1>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if(adminPasswordInput === ADMIN_PASSWORD) setIsAdminAuthenticated(true); else alert("Incorrect"); }} className="p-8 flex-1 flex flex-col justify-center gap-6">
            <input type="password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full border-b-2 border-gray-300 py-2 bg-transparent outline-none focus:border-[#10b981] font-bold" placeholder="Password (mediclear123)" />
            <button type="submit" className="w-full py-4 bg-[#022c22] text-white font-extrabold rounded-xl hover:bg-[#047857]">Unlock Portal</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex justify-center sm:p-4 font-sans text-gray-800">
      <div className="w-full max-w-md bg-gray-50 sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative h-[100dvh] sm:h-[850px]">
        
        <div className="bg-[#022c22] px-6 py-6 text-white flex items-center justify-between">
          <h1 className="text-xl font-extrabold">Nurse Portal</h1>
          <button onClick={() => setIsAdminAuthenticated(false)} className="text-xs font-bold bg-[#047857] px-4 py-2 rounded-lg">Exit</button>
        </div>

        <div className="p-6 overflow-y-auto">
          <div className="mb-6 flex gap-2">
            <button onClick={() => setNursePage("create")} className={`flex-1 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest ${nursePage === "create" ? "bg-[#022c22] text-white" : "bg-white text-gray-600 border"}`}>Create</button>
            <button onClick={() => setNursePage("database")} className={`flex-1 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest ${nursePage === "database" ? "bg-[#022c22] text-white" : "bg-white text-gray-600 border"}`}>Database</button>
          </div>

          {nursePage === "create" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <input value={nurseForm.name} onChange={(e) => setNurseForm({...nurseForm, name: e.target.value})} className="w-full border-b-2 border-gray-300 py-2 mb-6 text-sm font-bold outline-none focus:border-[#10b981]" placeholder="Patient Name" />
              
              <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Symptoms</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {availableSymptoms.map(s => (
                  <button key={s} onClick={() => toggleNurseSymptom(s)} className={`px-2 py-1.5 rounded-lg text-[11px] font-bold ${nurseSymptoms.includes(s) ? "bg-[#10b981] text-white" : "bg-gray-100 text-gray-600"}`}>{s}</button>
                ))}
              </div>

              <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Available Steps</label>
              <div className="flex flex-wrap gap-2 mb-6">
                {nextStepOptions.map(step => (
                  <button key={step} onClick={() => toggleNurseStep(step)} className={`px-2 py-1.5 rounded-lg text-[11px] font-bold border ${nurseNextSteps.includes(step) ? "bg-emerald-50 text-[#047857] border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>{step}</button>
                ))}
              </div>

              <label className="block text-[11px] font-bold text-[#047857] mb-2 uppercase tracking-widest">Ordered Journey</label>
              <div className="flex flex-col gap-2 mb-8">
                {nurseNextSteps.map((step, index) => (
                  <div key={index} className="flex items-center justify-between bg-emerald-50 border border-emerald-100 p-2 rounded-lg text-xs font-bold text-[#022c22]">
                    <span>{index + 1}. {step}</span>
                    <div className="flex gap-1">
                      {index > 1 && (
                        <button onClick={() => moveStep(index, 'up')} className="px-2 py-1 bg-white rounded shadow-sm hover:bg-gray-100">↑</button>
                      )}
                      {index < nurseNextSteps.length - 1 && index !== 0 && (
                        <button onClick={() => moveStep(index, 'down')} className="px-2 py-1 bg-white rounded shadow-sm hover:bg-gray-100">↓</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <button onClick={createPatientRecord} className="w-full py-4 bg-[#022c22] text-white font-extrabold rounded-xl hover:bg-[#047857]">Create & Generate Code</button>
            </div>
          )}

          {nursePage === "database" && (
            <div className="flex flex-col gap-4">
              {patientsDb.map(p => (
                <div key={p._id || p.id} className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col gap-3">
                  <div className="flex justify-between items-start">
                    <p className="font-extrabold text-lg text-gray-900">{p.name}</p>
                    <span className="bg-emerald-100 text-[#047857] px-2 py-1 rounded text-xs font-bold tracking-widest">{p.code}</span>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-center">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">Current Stage</p>
                    <p className="text-sm font-black text-[#047857]">
                      {p.currentStepIndex >= p.nextSteps.length 
                        ? "Care Complete" 
                        : p.nextSteps[p.currentStepIndex]}
                    </p>
                  </div>
                  
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">Live Stage Management</p>
                    <div className="flex flex-col gap-2">
                      {p.nextSteps.map((step, idx) => (
                        <div key={idx} className={`text-xs font-bold flex justify-between items-center p-2 rounded ${idx === p.currentStepIndex ? 'bg-[#10b981] text-white' : idx < p.currentStepIndex ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                          <span>{idx + 1}. {step}</span>
                          {idx === p.currentStepIndex && <span className="text-[10px] uppercase">Active</span>}
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <button 
                        disabled={p.currentStepIndex <= 0}
                        onClick={() => updatePatientStage(p._id || p.id, p.currentStepIndex - 1)}
                        className="px-3 py-1.5 text-[10px] font-bold bg-gray-200 text-gray-600 rounded disabled:opacity-50"
                      >
                        ← Back
                      </button>
                      <button 
                        disabled={p.currentStepIndex >= p.nextSteps.length}
                        onClick={() => updatePatientStage(p._id || p.id, p.currentStepIndex + 1)}
                        className="px-3 py-1.5 text-[10px] font-bold bg-[#047857] text-white rounded disabled:opacity-50"
                      >
                        Advance Stage →
                      </button>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}