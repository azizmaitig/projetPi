import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box
} from '@mui/material';

interface Parking {
  id: number;
  Nom: string;
  Capacité: number;
  Tarif: number;
  image_url: string;
}

const ParkingManagement: React.FC = () => {
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [newParking, setNewParking] = useState({
    Nom: '',
    Capacité: 0,
    Tarif: 0,
    image_url: ''
  });

  useEffect(() => {
    fetchParkings();
  }, []);

  const fetchParkings = async () => {
    try {
      const response = await axios.get('http://localhost:3001/list');
      setParkings(response.data);
    } catch (error) {
      console.error('Error fetching parkings:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewParking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:3001/add', newParking);
      setNewParking({
        Nom: '',
        Capacité: 0,
        Tarif: 0,
        image_url: ''
      });
      fetchParkings(); // Refresh the list
    } catch (error) {
      console.error('Error adding parking:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Parking Management
        </Typography>

        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Add New Parking
          </Typography>
          <form onSubmit={handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                name="Nom"
                label="Name"
                value={newParking.Nom}
                onChange={handleInputChange}
                required
              />
              <TextField
                name="Capacité"
                label="Capacity"
                type="number"
                value={newParking.Capacité}
                onChange={handleInputChange}
                required
              />
              <TextField
                name="Tarif"
                label="Rate"
                type="number"
                value={newParking.Tarif}
                onChange={handleInputChange}
                required
              />
              <TextField
                name="image_url"
                label="Image URL"
                value={newParking.image_url}
                onChange={handleInputChange}
              />
              <Button variant="contained" type="submit" sx={{ height: 56 }}>
                Add Parking
              </Button>
            </Box>
          </form>
        </Paper>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Image</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {parkings.map((parking) => (
                <TableRow key={parking.id}>
                  <TableCell>{parking.id}</TableCell>
                  <TableCell>{parking.Nom}</TableCell>
                  <TableCell>{parking.Capacité}</TableCell>
                  <TableCell>{parking.Tarif}</TableCell>
                  <TableCell>
                    {parking.image_url && (
                      <img 
                        src={parking.image_url} 
                        alt={parking.Nom} 
                        style={{ width: 50, height: 50, objectFit: 'cover' }}
                      />
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Container>
  );
};

export default ParkingManagement; 