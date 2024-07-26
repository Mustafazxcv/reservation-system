import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RegisterAdmin from './components/RegisterAdmin';
import AdminLogin from './components/AdminLogin';
import Dashboard from './components/Dashboard';
import Home from './components/Home';
import Navbar from './components/Navbar';
import DealerLogin from './components/DealerLogin';
import RegisterDealer from './components/RegisterDealer';
import BayiDashboard from './components/BayiDashboard';
import RezervasyonSorgusu from './components/RezervasyonSorgusu'; 

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <header className="container mx-auto p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/register/admin" element={<RegisterAdmin />} />
            <Route path="/login/admin" element={<AdminLogin />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login/dealer" element={<DealerLogin />} />
            <Route path="/register/dealer" element={<RegisterDealer />} />
            <Route path="/bayiidashboard" element={<BayiDashboard />} />
            <Route path="/rezervasyonsorgusu" element={<RezervasyonSorgusu />} />
          </Routes>
        </header>
      </div>
    </Router>
  );
}

export default App;
