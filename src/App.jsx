import React, { useState, useEffect } from 'react';

// ==========================================
// VIVIRION MODULE DATA
// ==========================================
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

// ==========================================
// FAKE DATABASE
// ==========================================
const mockDatabase = {
  "8241": {
    name: "Alex",
    estimatedWait: 45,
    queuePosition: 3,
    symptoms: ["Chronic Pain", "Anxiety"], // Symptoms passed from triage nurse
    journey: [
      { 
        id: '1', status: 'completed', title: 'Triage & Vitals', 
        what: 'Initial assessment of your blood pressure, heart rate, and symptom severity.',
        why: 'This helps our team prioritize care and determine the exact diagnostic tests you need.'
      },
      { 
        id: '2', status: 'current', title: 'Diagnostic X-Ray', 
        what: 'A quick, painless scan of your chest and ribs.',
        why: 'Allows the physician to see inside your body and rule out serious structural conditions or fractures.',
        facility: { name: 'X-Ray Lab B', status: 'In Use', type: 'machine' }
      },
      { 
        id: '3', status: 'upcoming', title: 'Physician Consultation', 
        what: 'A one-on-one review of your test results with the attending ER doctor.',
        why: 'The physician will provide a formal diagnosis, answer your questions, and prescribe a treatment plan.'
      },
      { 
        id: '4', status: 'upcoming', title: 'Discharge or Admission', 
        what: 'Finalizing your paperwork and providing at-home care instructions.',
        why: 'Ensures you have the medications and knowledge needed to recover safely at home.'
      }
    ]
  }
};

export default function MediClearApp() {
  const [currentView, setCurrentView] = useState('login');
  const [patientCode, setPatientCode] = useState('');
  const [patientData, setPatientData] = useState(null);
  const [activeTab, setActiveTab] = useState('journey'); 
  const [expandedStep, setExpandedStep] = useState('2'); 
  const [showEduModal, setShowEduModal] = useState(false);

  // WELLNESS LOGIC
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

  const handleLogin = (e) => {
    e.preventDefault();
    const data = mockDatabase[patientCode];
    if (data) {
      setPatientData(data);
      setCurrentView('patient');
    } else {
      alert("Invalid Nurse Code. For this demo, please use code: 8241");
    }
  };

  const toggleStep = (id) => setExpandedStep(expandedStep === id ? null : id);

  const getRecommendedModule = () => {
    if (!patientData || !patientData.symptoms) return viLearnModules[5];
    const recommended = viLearnModules.find(module => 
      module.triggerSymptoms.some(trigger => patientData.symptoms.includes(trigger))
    );
    return recommended || viLearnModules[5];
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

  // ==========================================
  // VIEW 1: NURSE CODE LOGIN
  // ==========================================
  if (currentView === 'login') {
    return (
      <div className="min-h-screen bg-gray-900 flex justify-center sm:p-4 font-sans">
        <div className="w-full max-w-md bg-white sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative h-[100dvh] sm:h-[850px]">
          
          <div className="bg-[#022c22] px-8 py-16 text-center relative overflow-hidden flex-shrink-0">
            <div className="absolute top-0 left-0 w-full h-full bg-[#047857]/20 blur-3xl"></div>
            <h1 className="text-4xl font-extrabold text-white tracking-tight relative z-10">MediClear</h1>
            <p className="text-emerald-300/80 mt-2 font-medium tracking-wide relative z-10 text-sm">Patient Transparency Portal</p>
          </div>

          <form onSubmit={handleLogin} className="p-8 flex-1 flex flex-col justify-center gap-8 pb-20">
            <div className="text-center">
              <h2 className="text-xl font-extrabold text-gray-900 mb-2">Enter Your Care Code</h2>
              <p className="text-sm text-gray-500 font-medium leading-relaxed">
                Please enter the 4-digit code provided by your triage nurse to securely access your live treatment plan.
              </p>
            </div>

            <div>
              <input 
                type="text" required maxLength="4" value={patientCode}
                onChange={(e) => setPatientCode(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl py-6 text-center text-4xl tracking-[0.5em] bg-gray-50 focus:outline-none focus:border-[#10b981] focus:bg-emerald-50/50 transition-colors text-gray-900 font-extrabold"
                placeholder="----"
              />
              <p className="text-center text-[10px] text-gray-400 mt-3 uppercase tracking-widest font-bold">Demo Code: 8241</p>
            </div>

            <button type="submit" className="w-full py-5 bg-[#022c22] text-white font-extrabold rounded-xl hover:bg-[#047857] transition-all shadow-xl shadow-emerald-900/20 text-lg tracking-wide">
              Access My Journey
            </button>
          </form>
        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: PATIENT DASHBOARD
  // ==========================================
  if (currentView === 'patient') {
    const recommendedModule = getRecommendedModule();

    return (
      <div className="min-h-screen bg-gray-900 flex justify-center sm:p-4 font-sans">
        <div className="w-full max-w-md bg-gray-50 sm:rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative h-[100dvh] sm:h-[850px]">
          
          <nav className="flex items-center justify-between px-6 py-5 bg-[#022c22] text-white shadow-md z-20 flex-shrink-0">
            <span className="text-xl font-extrabold tracking-tight">MediClear</span>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setCurrentView('login')}
                className="bg-[#047857] hover:bg-[#10b981] transition-colors text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-lg"
              >
                Sign Out
              </button>
            </div>
          </nav>

          <div className="flex-1 overflow-y-auto pb-32">
            
            {/* HERO SECTION */}
            <div className="bg-white px-6 py-8 border-b border-gray-200 shadow-sm relative">
              <h1 className="text-2xl font-extrabold text-gray-900 mb-6">Hi, {patientData.name}.</h1>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-center">
                  <p className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">Queue Position</p>
                  <p className="text-4xl font-black text-[#047857]">{patientData.queuePosition}</p>
                </div>
                <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 text-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-2 h-2 bg-[#10b981] rounded-full m-3 animate-pulse"></div>
                  <p className="text-[10px] font-extrabold text-[#047857] uppercase tracking-widest mb-1">Est. Wait</p>
                  <p className="text-4xl font-black text-[#022c22]">{patientData.estimatedWait}<span className="text-sm text-[#047857]">m</span></p>
                </div>
              </div>

              <div className="mt-4 bg-yellow-50 border border-yellow-200 p-3 rounded-xl flex gap-3 items-start">
                <span className="text-yellow-600 font-bold">!</span>
                <p className="text-[10px] text-yellow-800 font-medium leading-relaxed uppercase tracking-wider">
                  <strong>Disclaimer:</strong> This wait time is a live estimate. Emergencies and critical traumas may cause sudden shifts in queue times.
                </p>
              </div>
            </div>

            {/* TAB 1: JOURNEY */}
            {activeTab === 'journey' && (
              <div className="p-6">
                <div className="mb-6">
                  <h2 className="text-lg font-extrabold text-gray-900">Your Treatment Plan</h2>
                  <p className="text-xs text-gray-500 font-medium mt-1">Tap any step to see exactly what to expect.</p>
                </div>
                
                <div className="relative pl-4 border-l-2 border-gray-200 ml-2 space-y-6">
                  {patientData.journey.map((step) => {
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    const isExpanded = expandedStep === step.id;

                    return (
                      <div key={step.id} className="relative">
                        <div className={`absolute -left-[25px] w-4 h-4 rounded-full border-4 border-gray-50 flex items-center justify-center ${
                          isCompleted ? 'bg-[#10b981]' : isCurrent ? 'bg-[#047857]' : 'bg-gray-300'
                        }`}>
                          {isCurrent && <div className="absolute w-6 h-6 border-2 border-[#10b981] rounded-full animate-ping opacity-75"></div>}
                        </div>

                        <div 
                          onClick={() => toggleStep(step.id)}
                          className={`cursor-pointer border rounded-2xl transition-all shadow-sm ${
                            isCurrent ? 'bg-white border-[#10b981]' : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="p-4 flex justify-between items-center">
                            <div>
                              <p className={`text-[10px] font-extrabold uppercase tracking-widest mb-1 ${
                                isCompleted ? 'text-[#10b981]' : isCurrent ? 'text-[#047857]' : 'text-gray-400'
                              }`}>
                                {isCompleted ? 'Completed' : isCurrent ? 'In Progress' : 'Up Next'}
                              </p>
                              <h3 className={`font-black ${isCurrent ? 'text-[#022c22]' : 'text-gray-700'}`}>{step.title}</h3>
                            </div>
                            <span className="text-gray-400 font-bold text-lg">{isExpanded ? '-' : '+'}</span>
                          </div>

                          {isExpanded && (
                            <div className="p-4 pt-0 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
                              <div className="mt-4 mb-4">
                                <h4 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-widest mb-1">What to expect</h4>
                                <p className="text-sm text-gray-800 font-medium leading-relaxed">{step.what}</p>
                              </div>
                              <div className="mb-4">
                                <h4 className="text-[10px] font-extrabold text-[#047857] uppercase tracking-widest mb-1">Why it is important</h4>
                                <p className="text-sm text-[#022c22] font-medium leading-relaxed">{step.why}</p>
                              </div>
                              {step.facility && (
                                <div className="bg-white border border-gray-200 p-3 rounded-xl flex items-center justify-between mt-4 shadow-sm">
                                  <div>
                                    <p className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest">Facility Routing</p>
                                    <p className="text-xs font-bold text-gray-800">{step.facility.name}</p>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-[10px] font-extrabold uppercase tracking-widest ${
                                    step.facility.status === 'In Use' ? 'bg-emerald-50 text-[#047857] border border-emerald-100' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {step.facility.status}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 2: WELLNESS */}
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
                      Things You Can See
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-[#047857]">4</span> 
                      Things You Can Touch
                    </li>
                    <li className="flex items-center gap-4">
                      <span className="w-8 h-8 bg-emerald-50 rounded-full flex items-center justify-center text-[#047857]">3</span> 
                      Things You Can Hear
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
          </div>

          {/* FLOATING ACTION BUTTON (VIVIRION) */}
          <button 
            onClick={() => setShowEduModal(true)}
            className="absolute bottom-24 left-1/2 -translate-x-1/2 bg-white text-[#047857] border-2 border-[#10b981] px-6 py-3 rounded-full shadow-[0_10px_25px_rgba(16,185,129,0.3)] font-extrabold text-[11px] uppercase tracking-widest z-30 hover:bg-emerald-50 transition-all flex items-center gap-3 active:scale-95"
          >
            <span className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></span>
            Learn More
          </button>

          {/* VIVIRION MODAL OVERLAY */}
          {showEduModal && (
            <div className="absolute inset-0 z-50 bg-gray-900/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
              <div className="bg-white w-full rounded-[2rem] p-8 shadow-2xl relative animate-in fade-in slide-in-from-bottom-10 duration-300">
                <button 
                  onClick={() => setShowEduModal(false)} 
                  className="absolute top-6 right-6 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-200 font-bold"
                >
                  ✕
                </button>
                
                <span className="text-[10px] font-extrabold text-[#047857] uppercase tracking-widest bg-emerald-100 px-3 py-1.5 rounded-full border border-emerald-200 mb-6 inline-block">
                  Powered by Vivirion
                </span>
                
                <div className="flex justify-between items-center mb-4">
                  <span className="bg-[#10b981] text-white text-[10px] font-black px-3 py-1.5 rounded-full">
                    {recommendedModule.length}
                  </span>
                  <span className="text-xs font-bold text-[#047857]">{recommendedModule.level}</span>
                </div>
                
                <h3 className="text-2xl font-black text-[#022c22] mb-3 leading-tight">{recommendedModule.name}</h3>
                <p className="text-gray-600 text-sm font-medium leading-relaxed mb-8">{recommendedModule.description}</p>
                
                <a 
                  href="https://vivirion.com/contact" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="block text-center w-full py-4 rounded-xl font-bold text-sm bg-emerald-50 text-[#047857] hover:bg-[#10b981] hover:text-white transition-colors border border-emerald-100 hover:border-transparent"
                >
                  Start Interactive Module
                </a>
              </div>
            </div>
          )}

          {/* BOTTOM NAVIGATION */}
          <div className="absolute bottom-0 w-full bg-white border-t border-gray-200 flex p-3 pb-8 sm:pb-3 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] z-20">
            <button 
              onClick={() => setActiveTab('journey')}
              className={`flex-1 py-4 text-[11px] uppercase tracking-widest font-extrabold rounded-xl transition-colors ${activeTab === 'journey' ? 'bg-[#eaf5ec] text-[#047857]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              My Journey
            </button>
            <button 
              onClick={() => setActiveTab('wellness')}
              className={`flex-1 py-4 text-[11px] uppercase tracking-widest font-extrabold rounded-xl transition-colors ${activeTab === 'wellness' ? 'bg-[#eaf5ec] text-[#047857]' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Wellness
            </button>
          </div>

        </div>
      </div>
    );
  }
}