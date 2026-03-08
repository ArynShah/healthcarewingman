import React, { useState, useEffect } from 'react';

const viLearnModules = [
  {
    id: "dementia", name: "Dementia Care", length: "4 weeks", level: "Intermediate",
    description: "Types of dementia and effective communication strategies.",
    focusAreas: "Memory Care, Alzheimer's", 
    triggerSymptoms: ["Memory Loss", "Confusion"]
  },
  {
    id: "palliative", name: "Palliative Skills", length: "6 weeks", level: "Advanced",
    description: "End-of-life care, pain management, and psychosocial support.",
    focusAreas: "Hospice, Pain Management", 
    triggerSymptoms: ["Chronic Pain", "Severe Illness"]
  },
  {
    id: "behavioral", name: "Behavioral Mgmt", length: "4 weeks", level: "Intermediate",
    description: "Strategies to manage challenging behaviors in clients.",
    focusAreas: "Mental Health, Behavior", 
    triggerSymptoms: ["Agitation", "Mood Changes"]
  },
  {
    id: "wound", name: "Wound & Skin Care", length: "5 weeks", level: "Advanced",
    description: "Training on wound assessment and infection control.",
    focusAreas: "Wound Care, Assessment", 
    triggerSymptoms: ["Wounds", "Cuts", "Burns", "Skin Irritation"]
  },
  {
    id: "infection", name: "Infection Control", length: "4 weeks", level: "Essential",
    description: "Best practices for preventing infections in healthcare.",
    focusAreas: "Safety, Protocols", 
    triggerSymptoms: ["Fever", "Chills", "Cough", "Respiratory Issues"]
  },
  {
    id: "communication", name: "Therapeutic Comm", length: "3 weeks", level: "Essential",
    description: "Techniques for building therapeutic relationships.",
    focusAreas: "Interaction, Empathy", 
    triggerSymptoms: ["General Consultation", "Anxiety", "Stress"]
  }
];

const availableSymptoms = [
  "Memory Loss", "Confusion", "Chronic Pain", "Severe Illness", 
  "Agitation", "Mood Changes", "Wounds", "Cuts", "Burns", "Skin Irritation", 
  "Fever", "Chills", "Cough", "Respiratory Issues", 
  "General Consultation", "Anxiety", "Stress"
];

export default function MediClearApp() {
  const [currentView, setCurrentView] = useState('intake');
  const [patientData, setPatientData] = useState({ name: "", healthCard: "", hospitalCode: "", symptoms: [] });
  const [activeTab, setActiveTab] = useState('education'); 
  
  // INFRASTRUCTURE PREP: 
  // In a real app, this state would be replaced by a live listener to:
  // db.collection('facilities').doc(patientData.hospitalCode).collection('machines')
  const [adminFacilityCode, setAdminFacilityCode] = useState("1234");
  const [machines, setMachines] = useState([
    { id: "mri_1", name: "MRI Scanner Room A", status: "In Use" },
    { id: "ct_1", name: "CT Scanner", status: "Available" },
    { id: "xray_1", name: "X-Ray Lab 1", status: "Maintenance" },
    { id: "blood_1", name: "Blood Analysis Lab", status: "Available" }
  ]);

  const [isBreathing, setIsBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('idle');

  useEffect(() => {
    let timeout1, timeout2, timeout3;
    let isActive = true;

    const runBreathingCycle = () => {
      if (!isActive) return;
      setBreathPhase('inhale');
      
      timeout1 = setTimeout(() => {
        if (!isActive) return;
        setBreathPhase('hold');
        
        timeout2 = setTimeout(() => {
          if (!isActive) return;
          setBreathPhase('exhale');
          
          timeout3 = setTimeout(() => {
            if (!isActive) return;
            runBreathingCycle();
          }, 3000); 
        }, 3000); 
      }, 3000); 
    };

    if (isBreathing) {
      runBreathingCycle();
    } else {
      setBreathPhase('idle');
    }

    return () => {
      isActive = false;
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
    };
  }, [isBreathing]);

  const toggleSymptom = (symptom) => {
    setPatientData(prev => {
      const isSelected = prev.symptoms.includes(symptom);
      return isSelected 
        ? { ...prev, symptoms: prev.symptoms.filter(s => s !== symptom) }
        : { ...prev, symptoms: [...prev.symptoms, symptom] };
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!patientData.name || patientData.symptoms.length === 0) {
      alert("Please enter your name and select at least one symptom.");
      return;
    }
    if (patientData.hospitalCode.length !== 4 || isNaN(patientData.hospitalCode)) {
      alert("Please enter a valid 4-digit facility code.");
      return;
    }
    setCurrentView('patient');
  };

  const updateMachine = (id, newStatus) => {
    setMachines(machines.map(m => m.id === id ? { ...m, status: newStatus } : m));
  };

  const getRecommendedModules = () => {
    const recommended = viLearnModules.filter(module => 
      module.triggerSymptoms.some(trigger => patientData.symptoms.includes(trigger))
    );
    return recommended.length > 0 ? recommended : [viLearnModules[5]];
  };

  const getBreathText = () => {
    if (breathPhase === 'idle') return "Tap to start";
    if (breathPhase === 'inhale') return "Inhale slowly...";
    if (breathPhase === 'hold') return "Hold breath...";
    if (breathPhase === 'exhale') return "Exhale completely...";
  };

  const getBreathScale = () => {
    if (breathPhase === 'inhale' || breathPhase === 'hold') return 'scale-[3.5] opacity-0';
    return 'scale-[0.8] opacity-100';
  };

  if (currentView === 'intake') {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center sm:p-4 font-sans">
        <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative h-[100dvh] sm:h-[850px]">
          
          <div className="bg-[#022c22] px-8 py-10 text-center relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[#047857]/20 blur-3xl"></div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight relative z-10">MediClear</h1>
            <p className="text-emerald-300/80 mt-1 font-medium tracking-wide relative z-10 text-sm">Clinical Patient Check-In</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 flex-1 flex flex-col gap-6 overflow-y-auto pb-20">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Legal Full Name</label>
              <input 
                type="text" required value={patientData.name}
                onChange={(e) => setPatientData({...patientData, name: e.target.value})}
                className="w-full border-b-2 border-gray-200 py-2 bg-transparent focus:outline-none focus:border-[#10b981] transition-colors text-gray-800 font-bold"
                placeholder="e.g. Jane Doe"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-bold text-gray-500 mb-2 uppercase tracking-widest">Health Card</label>
                <input 
                  type="text" value={patientData.healthCard}
                  onChange={(e) => setPatientData({...patientData, healthCard: e.target.value})}
                  className="w-full border-b-2 border-gray-200 py-2 bg-transparent focus:outline-none focus:border-[#10b981] transition-colors text-gray-800 font-bold"
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#047857] mb-2 uppercase tracking-widest">Facility Code *</label>
                <input 
                  type="text" required maxLength="4" value={patientData.hospitalCode}
                  onChange={(e) => setPatientData({...patientData, hospitalCode: e.target.value})}
                  className="w-full border-b-2 border-[#10b981]/50 py-2 bg-transparent focus:outline-none focus:border-[#10b981] transition-colors text-gray-800 font-bold"
                  placeholder="4 Digits (e.g. 1234)"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 mb-4 uppercase tracking-widest">Select Primary Symptoms</label>
              <div className="flex flex-wrap gap-2">
                {availableSymptoms.map(symptom => {
                  const isSelected = patientData.symptoms.includes(symptom);
                  return (
                    <button
                      key={symptom} type="button" onClick={() => toggleSymptom(symptom)}
                      className={`px-3 py-2 rounded-lg text-[13px] font-bold transition-all duration-300 ${
                        isSelected 
                          ? 'bg-[#10b981] text-white shadow-md shadow-[#10b981]/30 scale-[1.02]' 
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                      }`}
                    >
                      {symptom}
                    </button>
                  );
                })}
              </div>
            </div>

            <button type="submit" className="mt-4 w-full py-4 bg-[#022c22] text-white font-extrabold rounded-xl hover:bg-[#047857] transition-all shadow-xl shadow-emerald-900/20 text-lg tracking-wide">
              {patientData.name ? "Connect to Facility" : "Secure Check-In"}
            </button>
          </form>

          <button onClick={() => setCurrentView('iot')} className="absolute bottom-4 right-4 text-[10px] font-extrabold uppercase tracking-widest text-gray-300 hover:text-gray-500 transition-colors bg-white px-2 py-1 rounded">
            Admin
          </button>
        </div>
      </div>
    );
  }

  if (currentView === 'patient') {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center sm:p-4 font-sans">
        <div className="w-full max-w-md bg-gray-50 sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative h-[100dvh] sm:h-[850px]">
          
          <nav className="flex items-center justify-between px-6 py-5 bg-[#022c22] text-white shadow-md z-20">
            <span className="text-xl font-extrabold tracking-tight">MediClear</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentView('intake')}
                className="bg-[#047857] hover:bg-[#10b981] transition-colors text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg"
              >
                Edit Profile
              </button>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
              </div>
            </div>
          </nav>

          <div className="flex-1 overflow-y-auto pb-28">
            <div className="bg-white px-6 py-6 border-b border-gray-200 shadow-sm relative">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Hi, {patientData.name}.</h1>
              <p className="text-gray-500 text-sm font-medium">Connected to Facility #{patientData.hospitalCode}</p>
            </div>

            {activeTab === 'education' && (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-extrabold text-gray-900">Education</h2>
                  <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded-full border border-emerald-200">
                    Powered by Vivirion
                  </span>
                </div>
                <div className="flex flex-col gap-5">
                  {getRecommendedModules().map(module => (
                    <div key={module.id} className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm flex flex-col">
                      <div className="flex justify-between items-center mb-4">
                        <span className="bg-[#10b981] text-white text-[10px] font-black px-3 py-1.5 rounded-full">
                          {module.length}
                        </span>
                        <span className="text-xs font-bold text-[#047857]">{module.level}</span>
                      </div>
                      <h3 className="text-xl font-black text-[#022c22] mb-2 leading-tight">{module.name}</h3>
                      <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6 flex-1">{module.description}</p>
                      <a 
                        href="https://vivirion.com/contact" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="block text-center w-full py-4 rounded-xl font-bold text-sm bg-emerald-50 text-[#047857] hover:bg-[#10b981] hover:text-white transition-colors border border-emerald-100 hover:border-transparent mt-auto"
                      >
                        Start Interactive Module
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'wellness' && (
              <div className="p-6 flex flex-col gap-6">
                <div className="mb-2">
                  <h2 className="text-lg font-extrabold text-gray-900">Wait Room Wellness</h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">Exercises to reduce clinical anxiety while you wait.</p>
                </div>
                
                <div 
                  onClick={() => setIsBreathing(!isBreathing)}
                  className="cursor-pointer relative overflow-hidden bg-[#022c22] p-8 rounded-3xl shadow-lg transition-all flex flex-col items-center justify-center min-h-[260px] border border-[#047857]"
                >
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-32 h-32 bg-[#10b981]/30 rounded-full transition-all duration-[3000ms] ease-in-out ${getBreathScale()}`}></div>
                  </div>
                  
                  <div className="relative z-10 text-center mt-4">
                    <p className="font-extrabold text-white text-xl tracking-wide">{getBreathText()}</p>
                    <p className="text-[#10b981] text-[10px] font-bold mt-3 uppercase tracking-widest">
                      {isBreathing ? "Tap anywhere to stop" : "Guided Breathing Pacer"}
                    </p>
                  </div>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
                  <h3 className="font-extrabold text-gray-900 mb-2">The 5-4-3 Method</h3>
                  <p className="text-xs text-gray-500 mb-5 font-medium leading-relaxed">Quiet your mind by silently identifying elements in the room around you.</p>
                  <ul className="flex flex-col gap-4 text-sm font-bold text-gray-700">
                    <li className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-[#047857]">5</span> 
                      Things you can see
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-[#047857]">4</span> 
                      Things you can touch
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-[#047857]">3</span> 
                      Things you can hear
                    </li>
                  </ul>
                </div>

                <div className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm">
                  <h3 className="font-extrabold text-gray-900 mb-2">Physical Release</h3>
                  <p className="text-xs text-gray-500 mb-4 font-medium leading-relaxed">Release physical tension stored in your body.</p>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 text-sm font-semibold text-gray-700">
                    Tense your shoulders by raising them toward your ears. Hold for 3 seconds. Drop them completely and exhale.
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'facility' && (
              <div className="p-6">
                <div className="mb-6 flex justify-between items-end">
                  <div>
                    <h2 className="text-lg font-extrabold text-gray-900">Facility Operations</h2>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      Live status of diagnostic machines.
                    </p>
                  </div>
                  <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-widest bg-emerald-100 px-3 py-1 rounded border border-emerald-200">
                    ID: {patientData.hospitalCode}
                  </span>
                </div>

                <div className="flex flex-col gap-4">
                  {machines.map(m => (
                    <div key={m.id} className="bg-white border border-gray-200 p-6 rounded-3xl shadow-sm flex flex-col gap-3">
                      <span className="font-extrabold text-gray-900">{m.name}</span>
                      <span className={`self-start px-4 py-1.5 rounded-full text-xs font-bold ${
                        m.status === 'Available' ? 'bg-green-100 text-green-800 border border-green-200' : 
                        m.status === 'In Use' ? 'bg-emerald-50 text-[#047857] border border-emerald-100' : 'bg-gray-100 text-gray-600 border border-gray-200'
                      }`}>
                        {m.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex p-3 pb-8 sm:pb-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
            <button 
              onClick={() => setActiveTab('education')}
              className={`flex-1 py-3 text-[11px] uppercase tracking-widest font-extrabold rounded-xl transition-colors ${activeTab === 'education' ? 'bg-[#eaf5ec] text-[#047857]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Education
            </button>
            <button 
              onClick={() => setActiveTab('wellness')}
              className={`flex-1 py-3 text-[11px] uppercase tracking-widest font-extrabold rounded-xl transition-colors ${activeTab === 'wellness' ? 'bg-[#eaf5ec] text-[#047857]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Wellness
            </button>
            <button 
              onClick={() => setActiveTab('facility')}
              className={`flex-1 py-3 text-[11px] uppercase tracking-widest font-extrabold rounded-xl transition-colors ${activeTab === 'facility' ? 'bg-[#eaf5ec] text-[#047857]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Facility
            </button>
          </div>

        </div>
      </div>
    );
  }

  if (currentView === 'iot') {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center sm:p-4 font-sans text-gray-800">
         <div className="w-full max-w-md bg-gray-50 sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col">
          
          <div className="bg-[#022c22] px-6 py-6 text-white flex items-center justify-between">
            <h1 className="text-xl font-extrabold">IoT Controller</h1>
            <button onClick={() => setCurrentView('intake')} className="text-xs font-bold bg-[#047857] px-4 py-2 rounded-lg hover:bg-[#10b981] transition-colors">Exit Admin</button>
          </div>

          <div className="p-8">
            
            <div className="mb-8 border-b border-gray-200 pb-6">
              <label className="block text-xs font-bold text-[#047857] mb-2 uppercase tracking-widest">Controlling Facility Code</label>
              <input 
                type="text" maxLength="4" value={adminFacilityCode}
                onChange={(e) => setAdminFacilityCode(e.target.value)}
                className="w-full border-b-2 border-gray-300 py-2 bg-transparent focus:outline-none focus:border-[#10b981] transition-colors text-gray-900 font-extrabold text-xl"
              />
              <p className="text-[10px] text-gray-500 mt-2 font-medium uppercase tracking-widest">
                In a production app, this isolates machine data to specific hospital databases via WebSockets.
              </p>
            </div>
            
            <div className="flex flex-col gap-6">
              {machines.map(m => (
                <div key={m.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <label className="block text-sm font-extrabold text-gray-900 mb-3">{m.name}</label>
                  <select 
                    value={m.status} 
                    onChange={(e) => updateMachine(m.id, e.target.value)}
                    className="w-full border border-gray-300 rounded-xl p-4 bg-gray-50 font-bold outline-none focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20 transition-all text-gray-700"
                  >
                    <option value="Available">Available</option>
                    <option value="In Use">In Use</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}