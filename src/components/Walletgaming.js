import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Tooltip,
  IconButton,
  Chip,
  useTheme,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  RemoveCircleOutline as RemoveIcon,
  People as PeopleIcon,
  Casino as CasinoIcon,
  Timeline as TimelineIcon,
  AccountBalanceWallet as WalletIcon,
  Refresh as RefreshIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { API_CONFIG, API_ENDPOINTS, FEATURES } from '../config';

const WalletGaming = () => {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');
  const [sortBy, setSortBy] = useState(FEATURES.DEFAULT_SORT);
  const [error, setError] = useState(null);
  const [showError, setShowError] = useState(false);

  const timeRanges = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '90 Days' }
  ];

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.GAMING_METRICS}?blockchain=${FEATURES.DEFAULT_BLOCKCHAIN}&time_range=${timeRange}&offset=${FEATURES.PAGINATION.DEFAULT_OFFSET}&limit=${FEATURES.PAGINATION.DEFAULT_LIMIT}&sort_by=${sortBy}&sort_order=desc`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-api-key': '3e736dba7151eb8de28a065916dc9d70'
          }
        }
      );
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to fetch data');
      }

      const result = await response.json();
      // Group data by game name to consolidate multiple contracts
      const groupedData = result.data.reduce((acc, item) => {
        if (!acc[item.game]) {
          acc[item.game] = item;
        } else {
          // Aggregate key metrics
          acc[item.game].total_interactions_volume = (parseFloat(acc[item.game].total_interactions_volume || 0) + parseFloat(item.total_interactions_volume || 0)).toString();
          acc[item.game].game_activity = (parseInt(acc[item.game].game_activity || 0) + parseInt(item.game_activity || 0)).toString();
          acc[item.game].total_users = Math.max(parseInt(acc[item.game].total_users || 0), parseInt(item.total_users || 0)).toString();
          acc[item.game].active_users = Math.max(parseInt(acc[item.game].active_users || 0), parseInt(item.active_users || 0)).toString();
        }
        return acc;
      }, {});
      
      setData(Object.values(groupedData));
    } catch (err) {
      setError(err.message);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [timeRange, sortBy]);

  const handleErrorClose = () => {
    setShowError(false);
  };

  const formatNumber = (num, decimals = 2) => {
    if (num === null || num === undefined || isNaN(num)) return 'N/A';
    const n = parseFloat(num);
    if (n >= 1000000) return (n / 1000000).toFixed(decimals) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(decimals) + 'K';
    return n.toFixed(decimals);
  };

  const getChangeColor = (change) => {
    if (!change || isNaN(change)) return 'text.secondary';
    if (change > 0) return 'success.main';
    if (change < 0) return 'error.main';
    return 'text.secondary';
  };

  const getChangeIcon = (change) => {
    if (!change || isNaN(change)) return <RemoveIcon />;
    if (change > 0) return <TrendingUpIcon />;
    if (change < 0) return <TrendingDownIcon />;
    return <RemoveIcon />;
  };

  const renderMetricCard = (title, value, change, icon) => (
    <Card sx={{ height: '100%', position: 'relative' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{icon}</Avatar>
          <Typography variant="h6" component="div">
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div" gutterBottom>
          {formatNumber(value)}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {getChangeIcon(change)}
          <Typography
            variant="body2"
            sx={{ color: getChangeColor(change), ml: 1 }}
          >
            {change ? `${change > 0 ? '+' : ''}${formatNumber(change)}%` : 'No change'}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );

  const getTotalMetrics = () => {
    const totals = data.reduce((acc, game) => {
      acc.totalUsers += parseInt(game.total_users || 0);
      acc.activeUsers += parseInt(game.active_users || 0);
      acc.volume += parseFloat(game.total_interactions_volume || 0);
      acc.engagement += parseFloat(game.engagement_rate || 0);
      return acc;
    }, { totalUsers: 0, activeUsers: 0, volume: 0, engagement: 0 });

    return {
      ...totals,
      engagement: totals.engagement / (data.length || 1) // Average engagement rate
    };
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Gaming Analytics Dashboard
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small">
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              label="Time Range"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              {timeRanges.map(range => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              label="Sort By"
              onChange={(e) => setSortBy(e.target.value)}
            >
              {FEATURES.SORT_OPTIONS.map(option => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Refresh Data">
            <IconButton onClick={fetchData} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {data.length > 0 && (
              <>
                <Grid item xs={12} sm={6} md={3}>
                  {renderMetricCard(
                    'Total Users',
                    getTotalMetrics().totalUsers,
                    data.reduce((sum, game) => sum + parseFloat(game.total_users_change || 0), 0) / data.length,
                    <PeopleIcon />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  {renderMetricCard(
                    'Active Users',
                    getTotalMetrics().activeUsers,
                    data.reduce((sum, game) => sum + parseFloat(game.active_users_change || 0), 0) / data.length,
                    <CasinoIcon />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  {renderMetricCard(
                    'Total Volume',
                    getTotalMetrics().volume,
                    data.reduce((sum, game) => sum + parseFloat(game.total_interactions_volume_change || 0), 0) / data.length,
                    <TimelineIcon />
                  )}
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  {renderMetricCard(
                    'Avg Engagement',
                    getTotalMetrics().engagement,
                    data.reduce((sum, game) => sum + parseFloat(game.engagement_rate_change || 0), 0) / data.length,
                    <WalletIcon />
                  )}
                </Grid>
              </>
            )}
          </Grid>

          <TableContainer component={Paper} sx={{ mb: 4 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Game</TableCell>
                  <TableCell align="right">Active Users</TableCell>
                  <TableCell align="right">Total Users</TableCell>
                  <TableCell align="right">Volume</TableCell>
                  <TableCell align="right">Engagement Rate</TableCell>
                  <TableCell align="right">Retention Rate</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((game, index) => (
                  <TableRow key={index} hover>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar
                          src={game.thumbnail_url}
                          alt={game.name}
                          sx={{ width: 40, height: 40, mr: 2 }}
                        />
                        <Box>
                          <Typography variant="subtitle2">{game.name}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {game.category}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                        {formatNumber(game.active_users, 0)}
                        <Chip
                          size="small"
                          icon={getChangeIcon(game.active_users_change)}
                          label={`${formatNumber(game.active_users_change)}%`}
                          color={game.active_users_change > 0 ? 'success' : 'error'}
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">{formatNumber(game.total_users, 0)}</TableCell>
                    <TableCell align="right">{formatNumber(game.total_interactions_volume)}</TableCell>
                    <TableCell align="right">{formatNumber(game.engagement_rate)}%</TableCell>
                    <TableCell align="right">
                      <Tooltip title={`${game.retained_players} retained players`}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                          {formatNumber(game.retention_rate)}%
                          {game.retention_rate >= 80 && (
                            <StarIcon sx={{ ml: 1, color: 'warning.main' }} fontSize="small" />
                          )}
                        </Box>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}

      <Snackbar 
        open={showError} 
        autoHideDuration={6000} 
        onClose={handleErrorClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleErrorClose} severity="error" sx={{ width: '100%' }}>
          {error || 'An error occurred while fetching data'}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default WalletGaming;