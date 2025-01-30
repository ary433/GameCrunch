import React, { useEffect, useState } from 'react';
import Loader from './Loader';

const Walletgaming = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockchain, setBlockchain] = useState('ethereum');
  const [timeRange, setTimeRange] = useState('24h');
  const [limit, setLimit] = useState(30);
  const [sortBy, setSortBy] = useState('total_users');

  const fetchData = () => {
    setLoading(true);
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-api-key': '3e736dba7151eb8de28a065916dc9d70' }
    };

    fetch(`https://api.unleashnfts.com/api/v2/nft/wallet/gaming/metrics?blockchain=${blockchain}&time_range=${timeRange}&offset=0&limit=${limit}&sort_by=${sortBy}&sort_order=desc`, options)
      .then(res => res.json())
      .then(res => {
        setData(res.data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchData();
  };

  if (loading) return <Loader />;
  if (error) return <div className="text-red-500 text-center text-xl mt-10">Error: {error.message}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-6">
      <h1 className="text-5xl font-extrabold text-center text-white mb-10">Wallet Gaming Metrics</h1>
      <form onSubmit={handleSubmit} className="mb-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-4">
        <select value={blockchain} onChange={(e) => setBlockchain(e.target.value)} className="p-3 rounded bg-white text-gray-800 shadow-md">
          <option value="ethereum">Ethereum</option>
          <option value="binance">Binance</option>
          <option value="polygon">Polygon</option>
          <option value="solana">Solana</option>
          <option value="avalanche">Avalanche</option>
          <option value="linea">Linea</option>
        </select>
        <select value={timeRange} onChange={(e) => setTimeRange(e.target.value)} className="p-3 rounded bg-white text-gray-800 shadow-md">
          <option value="24h">24h</option>
          <option value="7d">7d</option>
          <option value="30d">30d</option>
          <option value="90d">90d</option>
          <option value="all">All</option>
        </select>
        <input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} min="1" max="100" className="p-3 rounded bg-white text-gray-800 shadow-md" />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="p-3 rounded bg-white text-gray-800 shadow-md">
          <option value="total_users">Total Users</option>
          <option value="total_users_change">Total Users Change</option>
          <option value="total_interactions_volume">Total Interactions Volume</option>
          <option value="total_interactions_volume_change">Total Interactions Volume Change</option>
          <option value="nft_count">NFT Count</option>
          <option value="total_marketcap">Total Marketcap</option>
          <option value="total_marketcap_change">Total Marketcap Change</option>
          <option value="unique_wallets">Unique Wallets</option>
          <option value="unique_wallets_change">Unique Wallets Change</option>
          <option value="avg_earnings">Avg Earnings</option>
          <option value="game_revenue">Game Revenue</option>
          <option value="game_activity">Game Activity</option>
          <option value="avg_game_action">Avg Game Action</option>
          <option value="active_users">Active Users</option>
          <option value="active_users_change">Active Users Change</option>
          <option value="retention_rate">Retention Rate</option>
          <option value="retention_rate_change">Retention Rate Change</option>
          <option value="game_interactions">Game Interactions</option>
          <option value="game_interactions_change">Game Interactions Change</option>
          <option value="total_interaction">Total Interaction</option>
        </select>
        <button type="submit" className="p-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition shadow-md">Fetch Data</button>
      </form>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 max-w-6xl mx-auto">
        {data.map((item, index) => (
          <div key={index} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-500 hover:scale-105">
            <img src={item.thumbnail_url} alt={item.game} className="w-32 h-32 object-cover rounded-xl mb-4 shadow-md" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">{item.game}</h2>
            <p className="text-gray-600">Active Users: <span className="font-bold text-gray-800">{item.active_users}</span></p>
            <p className="text-gray-600">Game Activity: <span className="font-bold text-gray-800">{item.game_activity}</span></p>
            <p className="text-gray-600">Unique Wallets: <span className="font-bold text-gray-800">{item.unique_wallets}</span></p>
            <p className="text-gray-600">Engagement Rate: <span className="font-bold text-gray-800">{item.engagement_rate}</span></p>
            <p className="text-gray-600">Retention Rate: <span className="font-bold text-gray-800">{item.retention_rate}</span></p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Walletgaming;
