import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Données mockées pour les graphiques
const occupancyData = [
  { date: '2024-01', value: 65 },
  { date: '2024-02', value: 75 },
  { date: '2024-03', value: 85 },
  { date: '2024-04', value: 70 },
  { date: '2024-05', value: 90 },
  { date: '2024-06', value: 80 },
];

const pieData = [
  { name: 'Places Occupées', value: 85 },
  { name: 'Places Libres', value: 35 },
];

const COLORS = ['#0088FE', '#00C49F'];

const recentReservations = [
  { id: 1, user: 'Jean Dupont', spot: 'P1', date: '2024-03-01', duration: '8h' },
  { id: 2, user: 'Marie Martin', spot: 'P2', date: '2024-03-01', duration: '4h' },
  { id: 3, user: 'Pierre Durant', spot: 'P3', date: '2024-03-02', duration: '6h' },
];

const Reports = () => {
  const [timeRange, setTimeRange] = useState('month');

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="lg">
        <Typography variant="h4" gutterBottom component="h1">
          Rapports
        </Typography>

        {/* Filtres */}
        <Box sx={{ mb: 3 }}>
          <FormControl sx={{ minWidth: 200 }}>
            <InputLabel>Période</InputLabel>
            <Select
              value={timeRange}
              label="Période"
              onChange={(e) => setTimeRange(e.target.value)}
            >
              <MenuItem value="week">Cette semaine</MenuItem>
              <MenuItem value="month">Ce mois</MenuItem>
              <MenuItem value="year">Cette année</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Grid container spacing={3}>
          {/* Graphique d'occupation */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Taux d'occupation
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={occupancyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Graphique circulaire */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Répartition des places
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Paper>
          </Grid>

          {/* Tableau des réservations récentes */}
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Réservations récentes" />
              <CardContent>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Utilisateur</TableCell>
                        <TableCell>Place</TableCell>
                        <TableCell>Date</TableCell>
                        <TableCell>Durée</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {recentReservations.map((reservation) => (
                        <TableRow key={reservation.id}>
                          <TableCell>{reservation.user}</TableCell>
                          <TableCell>{reservation.spot}</TableCell>
                          <TableCell>{reservation.date}</TableCell>
                          <TableCell>{reservation.duration}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Reports; 