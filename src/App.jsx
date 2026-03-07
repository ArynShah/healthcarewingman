import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot, doc, updateDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA7C_cnMGTn4twlz2wwJJL0oXGHNaBOEag",
  authDomain: "mediclear-c19b8.firebaseapp.com",
  projectId: "mediclear-c19b8",
  storageBucket: "mediclear-c19b8.firebasestorage.app",
  messagingSenderId: "297841391984",
  appId: "1:297841391984:web:5c67281567333561d3b7b5"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// HOME VIEW
function Home() {
  const [seeded, setSeeded] = useState(false);
  const [seedError, setSeedError] = useState("");

  const seedDatabase = async () => {
    try {
      await setDoc(doc(db, "patients", "patient_1"), { name: "John Doe", triage: 3, waitTime: 45, needsHelp: false });
      await setDoc(doc(db, "patients", "patient_2"), { name: "Jane Smith", triage: 2, waitTime: 15, needsHelp: true });
      await setDoc(doc(db, "machines", "mri_1"), { name: "MRI Scanner", status: "Available" });
      await setDoc(doc(db, "machines", "xray_1"), { name: "X-Ray Room A", status: "In Use" });
      setSeeded(true);
      setSeedError("");
    } catch (e) {
      setSeedError("Error: Check Firebase console. Ensure Firestore is in Test Mode.");
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center font-sans p-6">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight mb-3">MediClear</h1>
        <p className="text-lg text-gray-500">Select your portal destination</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center mb-12">
        <Link to="/patient" className="flex-1 block group">
          <div className="h-full p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-500 hover:shadow-lg transition-all flex flex-col">
            <h2 className="text-2xl font-bold text-blue-700 mb-2">Patient Portal</h2>
            <p className="text-gray-600 mb-6 flex-1">Mobile-first view for triage tracking and direct alerts.</p>
            <div className="mt-auto inline-block text-center px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg group-hover:bg-blue-700 transition-colors">
              Launch Portal &rarr;
            </div>
          </div>
        </Link>

        <Link to="/staff" className="flex-1 block group">
          <div className="h-full p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-slate-800 hover:shadow-lg transition-all flex flex-col">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Medical Staff</h2>
            <p className="text-gray-600 mb-6 flex-1">Secure dashboard for live queues and priority management.</p>
            <div className="mt-auto inline-block text-center px-6 py-3 bg-slate-900 text-white font-semibold rounded-lg group-hover:bg-slate-800 transition-colors">
              Access Dashboard &rarr;
            </div>
          </div>
        </Link>

        <Link to="/iot" className="flex-1 block group">
          <div className="h-full p-8 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-green-500 hover:shadow-lg transition-all flex flex-col">
            <h2 className="text-2xl font-bold text-green-700 mb-2">IoT Controller</h2>
            <p className="text-gray-600 mb-6 flex-1">Backend machine state simulator for facility operations.</p>
            <div className="mt-auto inline-block text-center px-6 py-3 bg-green-600 text-white font-semibold rounded-lg group-hover:bg-green-700 transition-colors">
              Open Controller &rarr;
            </div>
          </div>
        </Link>
      </div>

      <div className="mt-4">
        {seedError && <p className="text-red-600 font-bold mb-4">{seedError}</p>}
        <button 
          onClick={seedDatabase} 
          disabled={seeded}
          className={`px-8 py-4 rounded-lg font-bold text-white shadow-md transition-all ${
            seeded 
              ? 'bg-green-600 cursor-not-allowed' 
              : 'bg-amber-500 hover:bg-amber-600 active:scale-95 hover:shadow-lg'
          }`}
        >
          {seeded ? "Status: Database Successfully Seeded" : "Initialize Demo Database"}
        </button>
      </div>
    </div>
  );
}

// PATIENT VIEW
function PatientView() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const unsubPatient = onSnapshot(doc(db, "patients", "patient_1"), (doc) => {
      setPatient({ id: doc.id, ...doc.data() });
    });
    const unsubMachines = onSnapshot(collection(db, "machines"), (snapshot) => {
      setMachines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => { unsubPatient(); unsubMachines(); };
  }, []);

  const toggleHelp = async () => {
    await updateDoc(doc(db, "patients", patient.id), { needsHelp: !patient.needsHelp });
  };

  if (!patient) return <div className="p-10 text-center font-bold">Loading... (Did you seed the database?)</div>;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-sm bg-white border border-gray-300 h-[700px] flex flex-col shadow-2xl rounded-xl overflow-hidden">
        <div className="bg-blue-600 text-white p-6">
          <button onClick={() => navigate('/')} className="mb-6 px-3 py-1 bg-blue-700 hover:bg-blue-800 rounded text-sm font-semibold transition-colors">
            &larr; Return Home
          </button>
          <h2 className="text-2xl font-bold">MediClear</h2>
          <p className="text-sm opacity-90 mt-1">Patient: {patient.name}</p>
        </div>
        
        <div className="p-6 flex-1 flex flex-col gap-6 bg-gray-50">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-2">Estimated Wait</p>
            <p className="text-6xl font-extrabold text-blue-600">{patient.waitTime} <span className="text-xl text-gray-400">min</span></p>
          </div>

          <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 uppercase tracking-widest font-bold mb-4">Facility Status</p>
            {machines.map(m => (
              <div key={m.id} className="flex justify-between items-center text-sm mb-3 pb-3 border-b border-gray-50 last:border-0 last:mb-0 last:pb-0">
                <span className="font-medium text-gray-700">{m.name}</span>
                <span className={`px-2 py-1 rounded text-xs font-bold ${m.status === 'Available' ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-600'}`}>
                  {m.status}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-auto">
            <button 
              onClick={toggleHelp}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all shadow-md active:scale-95 ${
                patient.needsHelp ? 'bg-gray-500 hover:bg-gray-600' : 'bg-red-600 hover:bg-red-700'
              }`}
            >
              {patient.needsHelp ? "Cancel Request" : "Symptoms Worsened"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// MEDICAL STAFF VIEW
function StaffView() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('queue');
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "patients"), (snapshot) => {
      setPatients(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  return (
    <div className="flex h-screen bg-white font-sans">
      <div className="w-64 bg-slate-900 text-gray-300 flex flex-col">
        <div className="p-6 font-bold text-white text-2xl border-b border-slate-800">MediClear</div>
        <div className="flex flex-col p-4 gap-2 flex-1">
          <button onClick={() => setActiveTab('queue')} className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'queue' ? 'bg-blue-600 text-white font-medium shadow-md' : 'hover:bg-slate-800'}`}>
            Patient Queue
          </button>
          <button onClick={() => setActiveTab('reports')} className={`text-left px-4 py-3 rounded-lg transition-colors ${activeTab === 'reports' ? 'bg-blue-600 text-white font-medium shadow-md' : 'hover:bg-slate-800'}`}>
            Doctor Reports
          </button>
        </div>
        <div className="p-6 border-t border-slate-800">
          <button onClick={() => navigate('/')} className="w-full py-2 bg-slate-800 hover:bg-slate-700 rounded text-sm text-white font-semibold transition-colors">
            Sign Out
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-gray-50">
        <div className="px-8 py-6 border-b border-gray-200 bg-white font-bold text-xl text-gray-800 flex justify-between items-center shadow-sm">
          {activeTab === 'queue' ? 'Live Triage Queue' : 'Doctor Reports'}
          <div className="flex items-center gap-2 text-sm text-green-600 font-bold">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Live Sync
          </div>
        </div>
        
        <div className="p-8 flex-1 overflow-auto">
          {activeTab === 'queue' && (
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
              <table className="w-full text-left">
                <thead className="border-b border-gray-200 bg-gray-100">
                  <tr>
                    <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Patient Name</th>
                    <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Priority</th>
                    <th className="p-4 font-bold text-gray-600 text-sm uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {patients.map(p => (
                    <tr key={p.id} className={`transition-colors ${p.needsHelp ? 'bg-red-50' : 'hover:bg-gray-50'}`}>
                      <td className="p-4 font-semibold text-gray-900">{p.name}</td>
                      <td className="p-4">
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">Level {p.triage}</span>
                      </td>
                      <td className="p-4">
                        {p.needsHelp ? (
                          <span className="inline-flex items-center px-3 py-1 rounded bg-red-100 text-red-700 font-bold text-sm animate-pulse">
                            Needs Reassessment
                          </span>
                        ) : (
                          <span className="text-gray-500 text-sm font-medium">Waiting</span>
                        )}
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

// IOT VIEW
function IotView() {
  const navigate = useNavigate();
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "machines"), (snapshot) => {
      setMachines(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    return () => unsub();
  }, []);

  const updateStatus = async (machineId, newStatus) => {
    await updateDoc(doc(db, "machines", machineId), { status: newStatus });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-10 font-sans">
      <button onClick={() => navigate('/')} className="mb-8 px-4 py-2 bg-white border border-gray-300 shadow-sm hover:bg-gray-50 rounded font-semibold text-gray-700 transition-colors">
        &larr; Back to Home
      </button>
      
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-3xl font-extrabold text-gray-900">IoT Machine Controller</h2>
        <span className="bg-green-100 text-green-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">Live</span>
      </div>
      
      <div className="max-w-md bg-white p-8 border border-gray-200 shadow-lg rounded-xl">
        <p className="text-sm text-gray-500 mb-8 font-medium">Changing these values instantly updates the patient portal.</p>
        
        {machines.length === 0 && <p className="text-red-500 font-bold p-4 bg-red-50 rounded">No machines found. Go to home and initialize the database.</p>}
        
        {machines.map(m => (
          <div key={m.id} className="mb-6 last:mb-0">
            <label className="block text-sm font-bold text-gray-800 mb-2">{m.name}</label>
            <select 
              value={m.status} 
              onChange={(e) => updateStatus(m.id, e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 bg-gray-50 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-medium transition-all"
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

// ROUTER APP
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