import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  ToggleButton,
  ToggleButtonGroup,
  Card,
  CardContent,
  IconButton,
  Chip,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Snackbar,
  Alert,
  Tooltip,
  CircularProgress,
  useTheme,
} from '@mui/material';
import {
  Today,
  ViewWeek,
  LocationOn,
  Star,
  StarBorder,
  MoreVert,
  Delete,
  Edit,
  Add,
  Refresh,
  Search,
  LocalParking,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

// Types pour les places de parking
interface ParkingSpot {
  id: string;
  name: string;
  location: string;
  timeSlot: string;
  status: 'available' | 'reserved';
}

// Données mockées pour les places de parking
const mockParkingSpots: ParkingSpot[] = [
  {
    id: 'P1',
    name: 'P1',
    location: 'Garage - étage -1',
    timeSlot: '07:00 - 18:00',
    status: 'reserved',
  },
  {
    id: 'P2',
    name: 'P2',
    location: 'Garage - étage -1',
    timeSlot: '07:00 - 18:00',
    status: 'available',
  },
  {
    id: 'P3',
    name: 'P3',
    location: 'Garage - étage -1',
    timeSlot: '07:00 - 18:00',
    status: 'available',
  },
];

interface Parking {
  id: number;
  Nom: string;
  Capacité: number;
  Tarif: number;
  image_url: string;
}

const ParkingManagement: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [view, setView] = useState<'day' | 'week'>('day');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [parkings, setParkings] = useState<Parking[]>([]);
  const [newParking, setNewParking] = useState<Parking>({
    id: 0,
    Nom: '',
    Capacité: 0,
    Tarif: 0,
    image_url: ''
  });
  const [loading, setLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [parkingToDelete, setParkingToDelete] = useState<number | null>(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  const handleViewChange = (event: React.MouseEvent<HTMLElement>, newView: 'day' | 'week') => {
    if (newView !== null) {
      setView(newView);
    }
  };

  const handleReservation = (spotId: string) => {
    const updatedSpots = mockParkingSpots.map(spot => {
      if (spot.id === spotId) {
        return {
          ...spot,
          status: spot.status === 'available' ? 'reserved' : 'available'
        };
      }
      return spot;
    });
    
    // In a real app, you would update the state with the updated spots
    // and make an API call to update the reservation status
    
    setSnackbar({
      open: true,
      message: `Place ${spotId} ${mockParkingSpots.find(s => s.id === spotId)?.status === 'available' ? 'réservée' : 'libérée'} avec succès`,
      severity: 'success'
    });
  };

  const toggleFavorite = (spotId: string) => {
    setFavorites(prev => {
      if (prev.includes(spotId)) {
        return prev.filter(id => id !== spotId);
      } else {
        return [...prev, spotId];
      }
    });
  };

  useEffect(() => {
    fetchParkings();
  }, [refreshKey]);

  const fetchParkings = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:3001/list');
      setParkings(response.data);
    } catch (error) {
      console.error('Error fetching parkings:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement des parkings',
        severity: 'error'
      });
    } finally {
      setLoading(false);
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
    setLoading(true);
    try {
      await axios.post('http://localhost:3001/add', newParking);
      setNewParking({ id: 0, Nom: '', Capacité: 0, Tarif: 0, image_url: '' }); // Reset form
      fetchParkings(); // Refresh the list
      setSnackbar({
        open: true,
        message: 'Parking ajouté avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error adding parking:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de l\'ajout du parking',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (id: number) => {
    setParkingToDelete(id);
    setOpenDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (parkingToDelete === null) return;
    
    setLoading(true);
    try {
      await axios.delete(`http://localhost:3001/delete/${parkingToDelete}`);
      fetchParkings(); // Refresh the list
      setSnackbar({
        open: true,
        message: 'Parking supprimé avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error deleting parking:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la suppression du parking',
        severity: 'error'
      });
    } finally {
      setLoading(false);
      setOpenDeleteDialog(false);
      setParkingToDelete(null);
    }
  };

  // Add update functionality
  const [editMode, setEditMode] = useState(false);
  const [editParking, setEditParking] = useState<Parking>({
    id: 0,
    Nom: '',
    Capacité: 0,
    Tarif: 0,
    image_url: ''
  });

  const handleEdit = (parking: Parking) => {
    setEditMode(true);
    setEditParking(parking);
  };

  const handleUpdateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditParking(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put(`http://localhost:3001/update/${editParking.id}`, editParking);
      setEditMode(false);
      setEditParking({ id: 0, Nom: '', Capacité: 0, Tarif: 0, image_url: '' });
      fetchParkings(); // Refresh the list
      setSnackbar({
        open: true,
        message: 'Parking mis à jour avec succès',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error updating parking:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors de la mise à jour du parking',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditMode(false);
    setEditParking({ id: 0, Nom: '', Capacité: 0, Tarif: 0, image_url: '' });
  };

  const handleRefresh = () => {
    setRefreshKey(oldKey => oldKey + 1);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Gestion du Parking
          </Typography>
          <Box display="flex" gap={2}>
            <Button 
              startIcon={<Refresh />} 
              onClick={handleRefresh}
              variant="outlined"
              disabled={loading}
            >
              {loading ? 'Actualisation...' : 'Actualiser'}
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/parking-map')}
              startIcon={<LocalParking />}
            >
              Voir le plan interactif
            </Button>
            <ToggleButtonGroup
              value={view}
              exclusive
              onChange={handleViewChange}
              aria-label="vue du parking"
            >
              <ToggleButton value="day" aria-label="vue journalière">
                <Today />
                Jour
              </ToggleButton>
              <ToggleButton value="week" aria-label="vue hebdomadaire">
                <ViewWeek />
                Semaine
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>
        </Box>

        {/* Vue du parking */}
        <Paper 
          sx={{ 
            p: 2, 
            mb: 3,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            }
          }}
        >
          <Box display="flex" alignItems="center" mb={2}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Places disponibles
            </Typography>
            <Box>
              <Chip
                label="Disponible"
                sx={{ 
                  backgroundColor: theme.palette.primary.main, 
                  color: 'white', 
                  mr: 1,
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
              <Chip
                label="Réservé"
                sx={{ 
                  backgroundColor: theme.palette.success.main, 
                  color: 'white',
                  transition: 'transform 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              />
            </Box>
          </Box>

          <Grid container spacing={2}>
            {mockParkingSpots.map((spot) => (
              <Grid item xs={12} key={spot.id}>
                <Card 
                  sx={{ 
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                    }
                  }}
                >
                  <CardContent>
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box>
                        <Typography variant="h6" component="div">
                          {spot.name}
                        </Typography>
                        <Box display="flex" alignItems="center" color="text.secondary">
                          <LocationOn fontSize="small" sx={{ mr: 0.5 }} />
                          <Typography variant="body2">{spot.location}</Typography>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {spot.timeSlot}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center">
                        <Button
                          variant={spot.status === 'available' ? 'contained' : 'outlined'}
                          color={spot.status === 'available' ? 'primary' : 'error'}
                          onClick={() => handleReservation(spot.id)}
                          sx={{ 
                            mr: 1,
                            transition: 'all 0.3s',
                            '&:hover': {
                              transform: 'scale(1.05)'
                            }
                          }}
                        >
                          {spot.status === 'available' ? 'Réserver' : 'Annuler'}
                        </Button>
                        <Tooltip title={favorites.includes(spot.id) ? "Retirer des favoris" : "Ajouter aux favoris"}>
                          <IconButton onClick={() => toggleFavorite(spot.id)}>
                            {favorites.includes(spot.id) ? 
                              <Star sx={{ color: theme.palette.warning.main }} /> : 
                              <StarBorder />
                            }
                          </IconButton>
                        </Tooltip>
                        <IconButton>
                          <MoreVert />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Paper 
          sx={{ 
            p: 3, 
            mb: 4,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            }
          }}
        >
          <Typography variant="h6" gutterBottom>
            {editMode ? 'Update Parking' : 'Add New Parking'}
          </Typography>
          <form onSubmit={editMode ? handleUpdate : handleSubmit}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <TextField
                name="Nom"
                label="Name"
                value={editMode ? editParking.Nom : newParking.Nom}
                onChange={editMode ? handleUpdateChange : handleInputChange}
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <TextField
                name="Capacité"
                label="Capacity"
                type="number"
                value={editMode ? editParking.Capacité : newParking.Capacité}
                onChange={editMode ? handleUpdateChange : handleInputChange}
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <TextField
                name="Tarif"
                label="Rate"
                type="number"
                value={editMode ? editParking.Tarif : newParking.Tarif}
                onChange={editMode ? handleUpdateChange : handleInputChange}
                required
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <TextField
                name="image_url"
                label="Image URL"
                value={editMode ? editParking.image_url : newParking.image_url}
                onChange={editMode ? handleUpdateChange : handleInputChange}
                sx={{ 
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: theme.palette.primary.main,
                    },
                  },
                }}
              />
              <Button 
                variant="contained" 
                type="submit" 
                startIcon={editMode ? <Edit /> : <Add />}
                disabled={loading}
                sx={{ 
                  height: 56,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  editMode ? 'Update Parking' : 'Add Parking'
                )}
              </Button>
              {editMode && (
                <Button 
                  variant="outlined" 
                  onClick={cancelEdit} 
                  sx={{ 
                    height: 56,
                    transition: 'transform 0.3s',
                    '&:hover': {
                      transform: 'scale(1.05)'
                    }
                  }}
                >
                  Cancel
                </Button>
              )}
            </Box>
          </form>
        </Paper>

        <TableContainer 
          component={Paper}
          sx={{ 
            mb: 4,
            transition: 'transform 0.3s, box-shadow 0.3s',
            '&:hover': {
              boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
            }
          }}
        >
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Capacity</TableCell>
                <TableCell>Rate</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <CircularProgress />
                  </TableCell>
                </TableRow>
              ) : parkings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1">No parking spaces found</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                parkings.map((parking) => (
                  <TableRow 
                    key={parking.id}
                    sx={{ 
                      transition: 'background-color 0.3s',
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.04)'
                      }
                    }}
                  >
                    <TableCell>{parking.id}</TableCell>
                    <TableCell>{parking.Nom}</TableCell>
                    <TableCell>{parking.Capacité}</TableCell>
                    <TableCell>{parking.Tarif}</TableCell>
                    <TableCell>
                      {parking.image_url && (
                        <img 
                          src={parking.image_url} 
                          alt={parking.Nom} 
                          style={{ 
                            width: 50, 
                            height: 50, 
                            objectFit: 'cover',
                            borderRadius: '4px',
                            transition: 'transform 0.3s',
                          }}
                          onMouseOver={(e) => {
                            e.currentTarget.style.transform = 'scale(1.2)';
                          }}
                          onMouseOut={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                          }}
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title="Edit">
                          <Button 
                            variant="outlined" 
                            color="primary"
                            startIcon={<Edit />}
                            onClick={() => handleEdit(parking)}
                            sx={{ 
                              transition: 'transform 0.3s',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          >
                            Edit
                          </Button>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <Button 
                            variant="outlined" 
                            color="error"
                            startIcon={<Delete />}
                            onClick={() => confirmDelete(parking.id)}
                            sx={{ 
                              transition: 'transform 0.3s',
                              '&:hover': {
                                transform: 'scale(1.05)'
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this parking space? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ParkingManagement; 