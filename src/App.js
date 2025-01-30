import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Walletgaming from './components/Walletgaming';
import GamingCollection from './components/GamingCollection';
import GamingTrend from './components/GamingTrend';
import Navbar from './components/Navbar';

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route exact path="/" element={<Homepage />} />
          <Route path="/walletgaming" element={<Walletgaming />} />
          <Route path="/gamingcollection" element={<GamingCollection />} />
          <Route path="/gamingtrend" element={<GamingTrend />} />
        </Routes>
      </div>
    </div>
  );
}