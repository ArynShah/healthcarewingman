import React, { useState } from 'react';

export default function HospitalHackathonDemo() {
  // Iniital Database
  const [patients, setPatients] = useState([
    { id: 1, name: "John Doe", triage: 3, waitTime: 45, needsHelp: false },
  ]);

  const [machines, setMachines] = useState([
    { id: "mri_1", name: "MRI Scanner", status: "Available" },
    { id: "xray_1", name: "X-Ray Room A", status: "In Use" },
  ]);

  // Functions to update data
  const togglePatientHelp = (patientId) => {
    setPatients(patients.map(p => 
      p.id === patientId ? { ...p, needsHelp: !p.needsHelp } : p
    ));
  };

  const updateMachineStatus = (machineId, newStatus) => {
    setMachines(machines.map(m => 
      m.id === machineId ? { ...m, status: newStatus } : m
    ));
  };

  // Views 
  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px', fontFamily: 'sans-serif' }}>
      
      {/* VIEW 1: PATIENT*/}
      <div style={{ border: '2px solid black', padding: '20px', width: '300px', borderRadius: '20px' }}>
        <h3>📱 Patient View</h3>
        <h4>Hello, {patients[0].name}</h4>
        <p>Estimated Wait: <strong>{patients[0].waitTime} mins</strong></p>
        
        <div style={{ marginTop: '20px', padding: '10px', background: '#383838' }}>
          <h5>Hospital Live Status</h5>
          {machines.map(m => (
            <p key={m.id} style={{ fontSize: '14px', margin: '5px 0' }}>
              {m.name}: <strong>{m.status}</strong>
            </p>
          ))}
        </div>

        <button 
          onClick={() => togglePatientHelp(patients[0].id)}
          style={{ 
            marginTop: '20px', width: '100%', padding: '15px', 
            backgroundColor: patients[0].needsHelp ? 'gray' : 'red', 
            color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer'
          }}
        >
          {patients[0].needsHelp ? "Cancel Request" : "🚨 Symptoms Worsened (Reassess)"}
        </button>
      </div>

      {/* VIEW 2: MEDICAL DASHBOARD */}
      <div style={{ border: '2px solid blue', padding: '20px', flex: 1, borderRadius: '8px' }}>
        <h3>💻 Medical Staff Dashboard</h3>
        <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Patient Name</th>
              <th>Triage Level</th>
              <th>Status</th>
              <th>Alerts</th>
            </tr>
          </thead>
          <tbody>
            {patients.map(p => (
              <tr key={p.id} style={{ backgroundColor: p.needsHelp ? '#884949' : 'transparent' }}>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>{p.name}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Level {p.triage}</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Waiting</td>
                <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                  {p.needsHelp && <span style={{ color: 'red', fontWeight: 'bold' }}>🚨 REQUIRES REASSESSMENT</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* VIEW 3: IoT PORTAL */}
      <div style={{ border: '2px dashed green', padding: '20px', width: '300px', borderRadius: '8px' }}>
        <h3>⚙️ Secret IoT Portal</h3>
        <p style={{ fontSize: '12px', color: 'gray' }}>Hardcode machine states here to trigger updates.</p>
        
        {machines.map(m => (
          <div key={m.id} style={{ marginBottom: '15px' }}>
            <strong>{m.name}</strong><br/>
            <select 
              value={m.status} 
              onChange={(e) => updateMachineStatus(m.id, e.target.value)}
              style={{ width: '100%', padding: '5px', marginTop: '5px' }}
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