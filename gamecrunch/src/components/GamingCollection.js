import React, { useEffect, useState } from 'react';
import Loader from './Loader';

const GamingCollection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [blockchain, setBlockchain] = useState('ethereum');
  const [timeRange, setTimeRange] = useState('24h');
  const [limit, setLimit] = useState(30);
  const [sortBy, setSortBy] = useState('total_users');

  const processData = (data) => {
    // Filter out duplicates based on contract_address
    const uniqueData = data.reduce((acc, current) => {
      const x = acc.find(item => item.contract_address === current.contract_address);
      if (!x) {
        return acc.concat([current]);
      } else {
        return acc;
      }
    }, []);

    return uniqueData;
  };

  const fetchData = () => {
    setLoading(true);
    const options = {
      method: 'GET',
      headers: { accept: 'application/json', 'x-api-key': '3e736dba7151eb8de28a065916dc9d70' }
    };

    fetch(`https://api.unleashnfts.com/api/v2/nft/wallet/gaming/collection/metrics?blockchain=${blockchain}&time_range=${timeRange}&offset=0&limit=${limit}&sort_by=${sortBy}&sort_order=desc`, options)
      .then(res => res.json())
      .then(res => {
        setData(processData(res.data));
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
    <div className="min-h-screen bg-gradient-to-r from-green-500 to-blue-600 p-6">
      <h1 className="text-5xl font-extrabold text-center text-white mb-10">Gaming Collection Metrics</h1>
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
        <button type="submit" className="p-3 bg-green-600 text-white rounded hover:bg-green-700 transition shadow-md">Fetch Data</button>
      </form>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 max-w-6xl mx-auto">
        {data.map((item, index) => (
          <div key={item.contract_address} className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center text-center transform transition duration-500 hover:scale-105">
            <img 
              src={item.thumbnail_url} 
              alt={item.game} 
              className="w-32 h-32 object-cover rounded-xl mb-4 shadow-md" 
            />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">{item.game}</h2>
            <div className="w-full space-y-2">
              <p className="text-sm text-gray-600">Contract Address: 
                <span className="font-mono text-xs ml-2 break-all">{item.contract_address}</span>
              </p>
              <p className="text-gray-600">Blockchain: 
                <span className="font-semibold text-gray-800 ml-2">{item.blockchain}</span>
              </p>
              {item.verified && (
                <p className="text-green-600">✓ Verified</p>
              )}
            </div>
            <div className="w-full h-px bg-gray-200 my-4"></div>
            <div className="w-full text-left space-y-2">
              {item.active_users && (
                <p className="text-gray-600">Active Users: 
                  <span className="font-bold text-gray-800 ml-2">{item.active_users}</span>
                </p>
              )}
              {item.game_activity && (
                <p className="text-gray-600">Game Activity: 
                  <span className="font-bold text-gray-800 ml-2">{item.game_activity}</span>
                </p>
              )}
              {item.unique_wallets && (
                <p className="text-gray-600">Unique Wallets: 
                  <span className="font-bold text-gray-800 ml-2">{item.unique_wallets}</span>
                </p>
              )}
              {item.engagement_rate && (
                <p className="text-gray-600">Engagement Rate: 
                  <span className="font-bold text-gray-800 ml-2">{item.engagement_rate}%</span>
                </p>
              )}
              {item.retention_rate && (
                <p className="text-gray-600">Retention Rate: 
                  <span className="font-bold text-gray-800 ml-2">{item.retention_rate}%</span>
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GamingCollection;