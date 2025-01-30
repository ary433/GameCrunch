import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  CircularProgress,
  Alert,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Chip
} from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { API_CONFIG, API_ENDPOINTS, FEATURES } from '../config';

const GamingCollection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState(FEATURES.DEFAULT_TIME_RANGE);
  const [sortBy, setSortBy] = useState('total_users');

  useEffect(() => {
    fetchData();
  }, [timeRange, sortBy]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${API_ENDPOINTS.GAMING_METRICS}?blockchain=${FEATURES.DEFAULT_BLOCKCHAIN}&time_range=${timeRange}&offset=0&limit=10&sort_by=${sortBy}&sort_order=desc`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            'x-api-key': '3e736dba7151eb8de28a065916dc9d70'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const result = await response.json();
      const groupedData = result.data.reduce((acc, item) => {
        if (!item.game) return acc;
        
        if (!acc[item.game]) {
          acc[item.game] = {
            ...item,
            total_interactions_volume: item.total_interactions_volume || '0',
            game_activity: item.game_activity || '0',
            total_users: item.total_users || '0',
            active_users: item.active_users || '0'
          };
        } else {
          acc[item.game] = {
            ...acc[item.game],
            total_interactions_volume: ((parseFloat(acc[item.game].total_interactions_volume) || 0) + (parseFloat(item.total_interactions_volume) || 0)).toString(),
            game_activity: ((parseInt(acc[item.game].game_activity) || 0) + (parseInt(item.game_activity) || 0)).toString(),
            total_users: Math.max((parseInt(acc[item.game].total_users) || 0), (parseInt(item.total_users) || 0)).toString(),
            active_users: Math.max((parseInt(acc[item.game].active_users) || 0), (parseInt(item.active_users) || 0)).toString()
          };
        }
        return acc;
      }, {});
      
      setData(Object.values(groupedData));
    } catch (error) {
      console.error('Error:', error);
      setError(error.message || 'Failed to load gaming collection data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchData();
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">
          Gaming Collection
        </Typography>
        <Box display="flex" alignItems="center" gap={2}>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Time Range</InputLabel>
            <Select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              label="Time Range"
            >
              {FEATURES.TIME_RANGES.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="outlined" size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              label="Sort By"
            >
              {FEATURES.SORT_OPTIONS.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Tooltip title="Refresh data">
            <IconButton onClick={handleRefresh} disabled={loading}>
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Game</TableCell>
              <TableCell align="right">Total Users</TableCell>
              <TableCell align="right">Active Users</TableCell>
              <TableCell align="right">Game Activity</TableCell>
              <TableCell>Contract Address</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.game}</TableCell>
                <TableCell align="right">{parseInt(item.total_users).toLocaleString()}</TableCell>
                <TableCell align="right">{parseInt(item.active_users).toLocaleString()}</TableCell>
                <TableCell align="right">{parseInt(item.game_activity).toLocaleString()}</TableCell>
                <TableCell>
                  <Chip
                    label={item.contract_address}
                    size="small"
                    variant="outlined"
                    sx={{ 
                      maxWidth: '200px',
                      '& .MuiChip-label': {
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default GamingCollection;