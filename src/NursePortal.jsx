import React, { useState, useEffect } from 'react';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:4000";
const availableSymptoms = ["Memory Loss", "Confusion", "Chronic Pain", "Severe Illness", "Agitation", "Mood Changes", "Wounds", "Cuts", "Burns", "Skin Irritation", "Fever", "Chills", "Cough", "Respiratory Issues", "General Consultation", "Anxiety", "Stress"];
const nextStepOptions = ["Nurse Assessment", "Physician Review", "Blood Work", "X-Ray", "CT Scan", "MRI Scan", "Ultrasound", "Medication Review", "Specialist Consult", "Discharge Instructions"];

export default function NursePortal() {
  const ADMIN_PASSWORD = "mediclear123";
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState("");
  const [nursePage, setNursePage] = useState("create");
  
  const [nurseForm, setNurseForm] = useState({ name: "", healthCard: "" });
  const [nurseSymptoms, setNurseSymptoms] = useState([]);
  const [nurseNextSteps, setNurseNextSteps] = useState([]);
  const [patientsDb, setPatientsDb] = useState([]);
  const [adminFacilityCode, setAdminFacilityCode] = useState("1234");

  // Fetch all patients for the Database tab
  useEffect(() => {
    if (isAdminAuthenticated) {
      fetch(`${API_BASE}/api/patients`)
        .then(res => res.json())
        .then(data => setPatientsDb(data))
        .catch(() => console.log("Database not connected yet"));
    }
  }, [isAdminAuthenticated]);

  const toggleNurseSymptom = (symptom) => {
    setNurseSymptoms(prev => prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]);
  };

  const toggleNurseStep = (step) => {
    setNurseNextSteps(prev => {
      if (prev.includes(step)) return prev.filter(s => s !== step);
      if (prev.length >= 4) return prev;
      return [...prev, step];
    });
  };

  const generatePatientCode = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
    return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const createPatientRecord = async () => {
    if (!nurseForm.name.trim() || nurseSymptoms.length === 0 || nurseNextSteps.length !== 4) {
      alert("Please enter a name, at least 1 symptom, and EXACTLY 4 next steps.");
      return;
    }

    const record = {
      code: generatePatientCode(),
      name: nurseForm.name.trim(),
      healthCard: nurseForm.healthCard.trim(),
      symptoms: nurseSymptoms,
      nextSteps: nurseNextSteps,
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
      setNurseNextSteps([]);
      alert(`SUCCESS! Patient created.\n\nGive the patient this code: ${saved.code}`);
    } catch (err) {
      alert("Error saving to database. Is your backend server running?");
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center sm:p-4 font-sans">
        <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative h-[100dvh] sm:h-[850px]">
          <div className="bg-[#022c22] px-8 py-10 text-center flex-shrink-0">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Nurse Portal</h1>
            <p className="text-emerald-300/80 mt-1 font-medium tracking-wide text-sm">Admin password required</p>
          </div>
          <form onSubmit={(e) => { e.preventDefault(); if(adminPasswordInput === ADMIN_PASSWORD) setIsAdminAuthenticated(true); else alert("Incorrect"); }} className="p-8 flex-1 flex flex-col justify-center gap-6">
            <input type="password" value={adminPasswordInput} onChange={(e) => setAdminPasswordInput(e.target.value)} className="w-full border-b-2 border-gray-300 py-2 bg-transparent outline-none focus:border-[#10b981] font-bold" placeholder="Enter password (mediclear123)" />
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

        <div className="p-8 overflow-y-auto">
          <div className="mb-6 flex gap-2">
            <button onClick={() => setNursePage("create")} className={`flex-1 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest ${nursePage === "create" ? "bg-[#022c22] text-white" : "bg-white text-gray-600 border"}`}>Create</button>
            <button onClick={() => setNursePage("database")} className={`flex-1 py-2.5 rounded-xl text-[11px] font-extrabold uppercase tracking-widest ${nursePage === "database" ? "bg-[#022c22] text-white" : "bg-white text-gray-600 border"}`}>Database</button>
          </div>

          {nursePage === "create" && (
            <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
              <input value={nurseForm.name} onChange={(e) => setNurseForm({...nurseForm, name: e.target.value})} className="w-full border-b-2 border-gray-300 py-2 mb-4 text-sm font-bold outline-none focus:border-[#10b981]" placeholder="Patient Name" />
              
              <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Symptoms</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {availableSymptoms.map(s => (
                  <button key={s} onClick={() => toggleNurseSymptom(s)} className={`px-2 py-1.5 rounded-lg text-[11px] font-bold ${nurseSymptoms.includes(s) ? "bg-[#10b981] text-white" : "bg-gray-100 text-gray-600"}`}>{s}</button>
                ))}
              </div>

              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest">Next Steps</label>
                <span className="text-[10px] font-bold text-[#047857]">{nurseNextSteps.length}/4 selected</span>
              </div>
              <div className="grid grid-cols-2 gap-2 mb-6">
                {nextStepOptions.map(step => (
                  <button key={step} onClick={() => toggleNurseStep(step)} className={`px-2 py-2 rounded-lg text-[11px] font-bold border ${nurseNextSteps.includes(step) ? "bg-emerald-50 text-[#047857] border-emerald-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}>{step}</button>
                ))}
              </div>

              <button onClick={createPatientRecord} className="w-full py-3 bg-[#022c22] text-white font-extrabold rounded-xl hover:bg-[#047857]">Create + Generate Code</button>
            </div>
          )}

          {nursePage === "database" && (
            <div className="flex flex-col gap-3">
              {patientsDb.map(p => (
                <div key={p.id || p._id} className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm">
                  <div className="flex justify-between items-start">
                    <p className="font-extrabold">{p.name}</p>
                    <span className="bg-emerald-100 text-[#047857] px-2 py-1 rounded text-xs font-bold tracking-widest">{p.code}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{p.symptoms.join(", ")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}