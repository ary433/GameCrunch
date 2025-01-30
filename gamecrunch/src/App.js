import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Walletgaming from './components/Walletgaming';
import GamingCollection from './components/GamingCollection';

export default function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Homepage />} />
      <Route path="/walletgaming" element={<Walletgaming />} />
      <Route path="/gamingcollection" element={<GamingCollection />} />
    </Routes>
  );
}