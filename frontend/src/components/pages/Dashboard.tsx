import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  CardHeader,
  Button,
  Tooltip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  MoreVert,
  TrendingUp,
  TrendingDown,
  LocalParking,
  DirectionsCar,
  AttachMoney,
  Refresh,
  Info,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
} from 'recharts';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [parkingData, setParkingData] = useState([]);
  const [parkingCount, setParkingCount] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);

  // Mock data for statistics
  const stats = [
    {
      title: 'Total Parkings',
      value: parkingCount,
      icon: <LocalParking />,
      color: theme.palette.primary.main,
      change: '+12%',
      trend: 'up',
    },
    {
      title: 'Occupancy Rate',
      value: '78%',
      icon: <DirectionsCar />,
      color: theme.palette.success.main,
      change: '+5%',
      trend: 'up',
    },
    {
      title: 'Revenue',
      value: '€2,450',
      icon: <AttachMoney />,
      color: theme.palette.warning.main,
      change: '-3%',
      trend: 'down',
    },
  ];

  // Weekly occupancy data
  const weeklyData = [
    { name: 'Lundi', occupancy: 65 },
    { name: 'Mardi', occupancy: 59 },
    { name: 'Mercredi', occupancy: 80 },
    { name: 'Jeudi', occupancy: 81 },
    { name: 'Vendredi', occupancy: 90 },
    { name: 'Samedi', occupancy: 40 },
    { name: 'Dimanche', occupancy: 30 },
  ];

  // Parking type distribution data
  const parkingTypeData = [
    { name: 'Standard', value: 60 },
    { name: 'Premium', value: 25 },
    { name: 'Handicap', value: 10 },
    { name: 'Electric', value: 5 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  // Monthly revenue data
  const revenueData = [
    { name: 'Jan', revenue: 1200 },
    { name: 'Feb', revenue: 1900 },
    { name: 'Mar', revenue: 2000 },
    { name: 'Apr', revenue: 2400 },
    { name: 'May', revenue: 1800 },
    { name: 'Jun', revenue: 2800 },
  ];

  useEffect(() => {
    fetchParkingData();
  }, [refreshKey]);

  const fetchParkingData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/list');
      setParkingData(response.data);
      setParkingCount(response.data.length);
    } catch (error) {
      console.error('Error fetching parking data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  const handleMoreInfo = (statTitle: string) => {
    console.log(`More info requested for: ${statTitle}`);
    // You can implement a modal or redirect to a detailed view
    if (statTitle === 'Total Parkings') {
      navigate('/parking');
    }
  };

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Tableau de bord
          </Typography>
          <Button 
            startIcon={<Refresh />} 
            onClick={handleRefresh}
            variant="outlined"
            disabled={loading}
          >
            {loading ? 'Actualisation...' : 'Actualiser'}
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={3}>
          {stats.map((stat) => (
            <Grid item xs={12} sm={6} md={4} key={stat.title}>
              <Card 
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.3s, box-shadow 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                    cursor: 'pointer'
                  }
                }}
                onClick={() => handleCardClick('/parking')}
              >
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Box 
                      sx={{ 
                        backgroundColor: `${stat.color}20`, 
                        borderRadius: '50%',
                        p: 1.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Box sx={{ color: stat.color }}>
                        {stat.icon}
                      </Box>
                    </Box>
                    <Tooltip title="Plus d'informations">
                      <IconButton 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMoreInfo(stat.title);
                        }}
                      >
                        <Info fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                  <Typography variant="h5" component="div" fontWeight="bold">
                    {loading ? <CircularProgress size={24} /> : stat.value}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <Typography variant="body2" color="text.secondary">
                      {stat.title}
                    </Typography>
                    <Box 
                      sx={{ 
                        ml: 'auto', 
                        display: 'flex', 
                        alignItems: 'center',
                        color: stat.trend === 'up' ? 'success.main' : 'error.main'
                      }}
                    >
                      {stat.trend === 'up' ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
                      <Typography variant="body2" sx={{ ml: 0.5 }}>
                        {stat.change}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={3}>
          {/* Weekly Occupancy Chart */}
          <Grid item xs={12} lg={8}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Taux d'occupation hebdomadaire</Typography>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Bar 
                      dataKey="occupancy" 
                      fill={theme.palette.primary.main} 
                      radius={[4, 4, 0, 0]}
                      animationDuration={1500}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Parking Type Distribution */}
          <Grid item xs={12} sm={6} lg={4}>
            <Paper sx={{ p: 3, height: '100%' }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Types de places</Typography>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ height: 300, display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={parkingTypeData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      animationDuration={1500}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {parkingTypeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Monthly Revenue */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6">Revenus mensuels</Typography>
                <IconButton>
                  <MoreVert />
                </IconButton>
              </Box>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={revenueData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="revenue" 
                      stroke={theme.palette.success.main} 
                      activeDot={{ r: 8 }}
                      animationDuration={1500}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 