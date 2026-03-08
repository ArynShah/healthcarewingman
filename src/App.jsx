import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import PatientPortal from './PatientPortal';
import NursePortal from './NursePortal';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Patient View is the default home page */}
        <Route path="/" element={<PatientPortal />} />
        
        {/* Nurse View gets its own hidden URL */}
        <Route path="/nurse" element={<NursePortal />} />
      </Routes>
    </Router>
  );
}