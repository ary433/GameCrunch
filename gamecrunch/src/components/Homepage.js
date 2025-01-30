import React from 'react';
import { Link } from 'react-router-dom';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-yellow-400 to-red-500 p-6 flex flex-col items-center justify-center">
      <h1 className="text-6xl font-extrabold text-white mb-10">Welcome to Gamecrunch</h1>
      <div className="flex space-x-4">
        <Link to="/walletgaming" className="p-4 bg-blue-600 text-white rounded-lg text-2xl hover:bg-blue-700 transition shadow-md">
          Wallet Gaming Metrics
        </Link>
        <Link to="/gamingcollection" className="p-4 bg-green-600 text-white rounded-lg text-2xl hover:bg-green-700 transition shadow-md">
          Gaming Collection Metrics
        </Link>
      </div>
    </div>
  );
};

export default Homepage;
