import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  FormControlLabel,
  Switch,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as ChartTooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

const GamingTrend = () => {
  const [trendData, setTrendData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedGame, setSelectedGame] = useState('');
  const [games, setGames] = useState([]);
  const [timeRange, setTimeRange] = useState('30d');
  const [filteredData, setFilteredData] = useState([]);

  const timeRangeOptions = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: 'all', label: 'All Time' }
  ];

  const filterDataByTimeRange = useCallback((data, range) => {
    const now = Date.now();
    const ranges = {
      '24h': now - 24 * 60 * 60 * 1000,
      '7d': now - 7 * 24 * 60 * 60 * 1000,
      '30d': now - 30 * 24 * 60 * 60 * 1000,
      'all': 0
    };
    return data.filter(item => item.timestamp >= ranges[range]);
  }, []);

  useEffect(() => {
    setFilteredData(filterDataByTimeRange(trendData, timeRange));
  }, [trendData, timeRange, filterDataByTimeRange]);

  const formatValue = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toFixed(0);
  };

  const formatPercentage = (value) => {
    if (value === null || value === undefined) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  const calculateGrowth = (current, previous) => {
    if (!previous) return null;
    return ((current - previous) / previous);
  };

  const fetchTrendData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(
        'https://api.unleashnfts.com/api/v2/nft/wallet/gaming/collection/trend?sort_by=active_users',
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-api-key': '3e736dba7151eb8de28a065916dc9d70'
          }
        }
      );

      const result = await response.json();
      if (!result.data || result.data.length === 0) {
        throw new Error('No data available');
      }

      // Extract unique games
      const uniqueGames = Array.from(new Set(result.data.map(item => ({
        name: item.game,
        contract: item.contract_address,
        blockchain: item.blockchain
      }))));
      setGames(uniqueGames);

      // Set first game as default if none selected
      if (!selectedGame && uniqueGames.length > 0) {
        setSelectedGame(uniqueGames[0].contract);
      }

      // Process data for the selected game
      const gameData = result.data.find(item => item.contract_address === (selectedGame || uniqueGames[0].contract));
      if (gameData) {
        const processed = processGameData(gameData);
        setTrendData(processed);
      }

      setLastUpdated(new Date().toLocaleString());
      setError(null);
    } catch (err) {
      console.error('Error fetching trend data:', err);
      setError('Failed to fetch trend data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [selectedGame]);

  const processGameData = (gameData) => {
    const dates = JSON.parse(gameData.maxdate.replace(/'/g, '"'));
    console.log('Processed Dates:', dates);  // Log the raw date strings

    const processedData = dates.map((date, index) => ({
      timestamp: new Date(date).getTime(),
      activeUsers: Number(gameData.active_users[index].replace(/'/g, '')),
      activeUsersChange: Number(gameData.active_users_change[index].replace(/'/g, '')) || 0,
      avgGameAction: Number(gameData.avg_game_action[index].replace(/'/g, '')),
      gameActivity: Number(gameData.game_activity[index].replace(/'/g, '')),
      gameInteractions: Number(gameData.game_interactions[index].replace(/'/g, '')),
      gameInteractionsChange: Number(gameData.game_interactions_change[index].replace(/'/g, '')) || 0,
      game: gameData.game,
      blockchain: gameData.blockchain
    })).sort((a, b) => a.timestamp - b.timestamp);

    console.log('Processed Data:', processedData);  // Log the processed data
    return processedData;
  };

  useEffect(() => {
    fetchTrendData();
  }, [fetchTrendData]);

  useEffect(() => {
    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(fetchTrendData, 60000);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [autoRefresh, fetchTrendData]);

  const handleGameChange = (event) => {
    setSelectedGame(event.target.value);
  };

  const handleAutoRefreshChange = (event) => {
    setAutoRefresh(event.target.checked);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getChangeColor = (value) => {
    if (value > 0) return '#4caf50';
    if (value < 0) return '#f44336';
    return '#757575';
  };

  const renderMetricCard = (title, value, change = null, tooltip = '') => (
    <Card sx={{ p: 2, height: '100%' }}>
      <CardContent>
        <Typography variant="subtitle2" color="textSecondary" gutterBottom>
          {title}
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="h4" component="div">
            {value}
          </Typography>
          {change !== null && (
            <Chip
              icon={change > 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              label={`${change > 0 ? '+' : ''}${(change * 100).toFixed(1)}%`}
              size="small"
              sx={{
                backgroundColor: getChangeColor(change),
                color: 'white',
                ml: 1
              }}
            />
          )}
        </Box>
        {tooltip && (
          <Tooltip title={tooltip}>
            <Typography variant="caption" sx={{ mt: 1 }}>
              {tooltip}
            </Typography>
          </Tooltip>
        )}
      </CardContent>
    </Card>
  );

  const latestData = trendData[trendData.length - 1] || {};
  const selectedGameInfo = games.find(g => g.contract === selectedGame) || {};

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Gaming Trends
          {selectedGameInfo.name && (
            <Typography variant="subtitle1" color="textSecondary">
              {selectedGameInfo.name} ({selectedGameInfo.blockchain})
            </Typography>
          )}
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Game</InputLabel>
            <Select
              value={selectedGame}
              onChange={handleGameChange}
              label="Game"
            >
              {games.map((game) => (
                <MenuItem key={game.contract} value={game.contract}>
                  {game.contract} ({game.blockchain})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120, ml: 2 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              {timeRangeOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={autoRefresh}
                onChange={handleAutoRefreshChange}
                color="primary"
              />
            }
            label="Auto Refresh"
          />
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchTrendData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
          {lastUpdated && (
            <Typography variant="caption" sx={{ ml: 2 }}>
              Last updated: {lastUpdated}
            </Typography>
          )}
        </Box>
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            {renderMetricCard(
              'Active Users',
              formatValue(latestData.activeUsers || 0),
              latestData.activeUsersChange,
              'Total number of unique users actively engaging with the game'
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderMetricCard(
              'Game Activity',
              formatValue(latestData.gameActivity || 0),
              calculateGrowth(
                latestData.gameActivity,
                trendData[trendData.length - 2]?.gameActivity
              ),
              'Total number of gaming sessions and interactions'
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderMetricCard(
              'Avg Game Actions',
              formatValue(latestData.avgGameAction || 0),
              calculateGrowth(
                latestData.avgGameAction,
                trendData[trendData.length - 2]?.avgGameAction
              ),
              'Average number of actions per user session'
            )}
          </Grid>
          <Grid item xs={12} md={3}>
            {renderMetricCard(
              'Game Interactions',
              formatValue(latestData.gameInteractions || 0),
              latestData.gameInteractionsChange,
              'Total number of user interactions within the game'
            )}
          </Grid>

          <Grid item xs={12}>
            <Card>
              <CardContent>
                {loading ? (
                  <Box display="flex" justifyContent="center" alignItems="center" height={400}>
                    <CircularProgress />
                  </Box>
                ) : (
                  <Box height={400}>
                    <ResponsiveContainer>
                      <LineChart
                        data={filteredData}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                          dataKey="timestamp"
                          tickFormatter={formatDate}
                          type="number"
                          domain={[Math.min(...filteredData.map(data => data.timestamp)), Math.max(...filteredData.map(data => data.timestamp))]}
                        />
                        <YAxis />
                        <ChartTooltip
                          labelFormatter={formatDate}
                          contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', padding: '10px', border: '1px solid #ccc' }}
                          formatter={(value, name) => [formatValue(value), name]}
                        />
                        <Legend />
                        <ReferenceLine y={0} stroke="#666" />
                        <Line
                          type="monotone"
                          dataKey="activeUsers"
                          name="Active Users"
                          stroke="#8884d8"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="gameActivity"
                          name="Game Activity"
                          stroke="#82ca9d"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="avgGameAction"
                          name="Avg Game Actions"
                          stroke="#ffc658"
                          dot={false}
                        />
                        <Line
                          type="monotone"
                          dataKey="gameInteractions"
                          name="Game Interactions"
                          stroke="#ff7300"
                          dot={false}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </Box>
  );
};

export default GamingTrend;