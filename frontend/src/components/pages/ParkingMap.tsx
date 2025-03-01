import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Tooltip,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  Chip,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Refresh,
  ZoomIn,
  ZoomOut,
  Info,
  Edit,
  DirectionsCar,
  LocalParking,
  AccessTime,
  Person,
} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';

// Types pour les places de parking
interface ParkingSpot {
  id: string;
  number: string;
  status: 'available' | 'occupied';
  occupiedSince?: string;
  occupiedBy?: string;
  vehicleType?: string;
  floor: number;
  section: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// Données mockées pour les places de parking
const mockParkingSpots: ParkingSpot[] = [
  // Rangée 1
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `A${i + 1}`,
    number: `A${i + 1}`,
    status: Math.random() > 0.5 ? 'available' as const : 'occupied' as const,
    occupiedSince: Math.random() > 0.5 ? new Date().toISOString() : undefined,
    occupiedBy: Math.random() > 0.5 ? 'John Doe' : undefined,
    vehicleType: Math.random() > 0.5 ? 'Sedan' : 'SUV',
    floor: 1,
    section: 'A',
    x: 50 + i * 30,
    y: 100,
    width: 25,
    height: 40,
  })),
  
  // Rangée 2
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `B${i + 1}`,
    number: `B${i + 1}`,
    status: Math.random() > 0.5 ? 'available' as const : 'occupied' as const,
    occupiedSince: Math.random() > 0.5 ? new Date().toISOString() : undefined,
    occupiedBy: Math.random() > 0.5 ? 'Jane Smith' : undefined,
    vehicleType: Math.random() > 0.5 ? 'Compact' : 'Van',
    floor: 1,
    section: 'B',
    x: 50 + i * 30,
    y: 150,
    width: 25,
    height: 40,
  })),
  
  // Rangée 3
  ...Array.from({ length: 10 }, (_, i) => ({
    id: `C${i + 1}`,
    number: `C${i + 1}`,
    status: Math.random() > 0.5 ? 'available' as const : 'occupied' as const,
    occupiedSince: Math.random() > 0.5 ? new Date().toISOString() : undefined,
    occupiedBy: Math.random() > 0.5 ? 'Robert Johnson' : undefined,
    vehicleType: Math.random() > 0.5 ? 'Truck' : 'Motorcycle',
    floor: 1,
    section: 'C',
    x: 50 + i * 30,
    y: 200,
    width: 25,
    height: 40,
  })),
  
  // Rangée 4 (côté gauche)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `D${i + 1}`,
    number: `D${i + 1}`,
    status: Math.random() > 0.5 ? 'available' as const : 'occupied' as const,
    occupiedSince: Math.random() > 0.5 ? new Date().toISOString() : undefined,
    occupiedBy: Math.random() > 0.5 ? 'Emily Davis' : undefined,
    vehicleType: Math.random() > 0.5 ? 'Electric' : 'Hybrid',
    floor: 1,
    section: 'D',
    x: 50,
    y: 250 + i * 30,
    width: 40,
    height: 25,
  })),
  
  // Rangée 4 (côté droit)
  ...Array.from({ length: 5 }, (_, i) => ({
    id: `E${i + 1}`,
    number: `E${i + 1}`,
    status: Math.random() > 0.5 ? 'available' as const : 'occupied' as const,
    occupiedSince: Math.random() > 0.5 ? new Date().toISOString() : undefined,
    occupiedBy: Math.random() > 0.5 ? 'Michael Wilson' : undefined,
    vehicleType: Math.random() > 0.5 ? 'Luxury' : 'Sports',
    floor: 1,
    section: 'E',
    x: 320,
    y: 250 + i * 30,
    width: 40,
    height: 25,
  })),
];

const ParkingMap: React.FC = () => {
  const theme = useTheme();
  const [parkingSpots, setParkingSpots] = useState<ParkingSpot[]>(mockParkingSpots);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [selectedSpot, setSelectedSpot] = useState<ParkingSpot | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  useEffect(() => {
    fetchParkingSpots();
  }, []);

  const fetchParkingSpots = async () => {
    setLoading(true);
    try {
      // Dans un environnement réel, vous feriez un appel API ici
      // const response = await axios.get('http://localhost:3001/parking-spots');
      // setParkingSpots(response.data);
      
      // Simulation d'un appel API avec un délai
      setTimeout(() => {
        setParkingSpots(mockParkingSpots);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching parking spots:', error);
      setSnackbar({
        open: true,
        message: 'Erreur lors du chargement du plan de parking',
        severity: 'error'
      });
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchParkingSpots();
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 2));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleSpotClick = (spot: ParkingSpot) => {
    setSelectedSpot(spot);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditMode(false);
  };

  const handleToggleStatus = () => {
    if (!selectedSpot) return;
    
    const updatedSpots = parkingSpots.map(spot => {
      if (spot.id === selectedSpot.id) {
        const newStatus = spot.status === 'available' ? 'occupied' as const : 'available' as const;
        return {
          ...spot,
          status: newStatus,
          occupiedSince: newStatus === 'occupied' ? new Date().toISOString() : undefined,
        };
      }
      return spot;
    });
    
    setParkingSpots(updatedSpots);
    setSelectedSpot(prev => prev ? {
      ...prev,
      status: prev.status === 'available' ? 'occupied' as const : 'available' as const,
      occupiedSince: prev.status === 'available' ? new Date().toISOString() : undefined,
    } : null);
    
    setSnackbar({
      open: true,
      message: `Place ${selectedSpot.number} ${selectedSpot.status === 'available' ? 'occupée' : 'libérée'} avec succès`,
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getOccupationDuration = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const occupiedDate = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - occupiedDate.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) {
      return `${diffMins} min`;
    } else {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return `${hours}h ${mins}min`;
    }
  };

  return (
    <Box sx={{ flexGrow: 1, py: 3 }}>
      <Container maxWidth="lg">
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1">
            Plan du Parking
          </Typography>
          <Box display="flex" gap={1}>
            <Button 
              startIcon={<Refresh />} 
              onClick={handleRefresh}
              variant="outlined"
              disabled={loading}
            >
              {loading ? 'Actualisation...' : 'Actualiser'}
            </Button>
            <IconButton onClick={handleZoomIn} disabled={zoom >= 2}>
              <ZoomIn />
            </IconButton>
            <IconButton onClick={handleZoomOut} disabled={zoom <= 0.5}>
              <ZoomOut />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={3}>
          <Grid item xs={12} md={9}>
            <Paper 
              sx={{ 
                p: 2, 
                height: 600, 
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                }
              }}
            >
              {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100%">
                  <CircularProgress />
                </Box>
              ) : (
                <Box 
                  sx={{ 
                    position: 'relative',
                    height: '100%',
                    transform: `scale(${zoom})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.3s ease',
                  }}
                >
                  {/* Entrée du parking */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 20,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 80,
                      height: 30,
                      bgcolor: theme.palette.grey[300],
                      borderRadius: 1,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      border: '2px dashed',
                      borderColor: theme.palette.grey[500],
                    }}
                  >
                    <Typography variant="caption" fontWeight="bold">ENTRÉE</Typography>
                  </Box>
                  
                  {/* Routes */}
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 50,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 20,
                      height: 350,
                      bgcolor: theme.palette.grey[300],
                      borderRadius: 1,
                    }}
                  />
                  
                  <Box 
                    sx={{ 
                      position: 'absolute',
                      top: 230,
                      left: 50,
                      width: 310,
                      height: 20,
                      bgcolor: theme.palette.grey[300],
                      borderRadius: 1,
                    }}
                  />
                  
                  {/* Places de parking */}
                  {parkingSpots.map((spot) => (
                    <Tooltip
                      key={spot.id}
                      title={
                        <Box>
                          <Typography variant="body2"><strong>Place:</strong> {spot.number}</Typography>
                          <Typography variant="body2"><strong>Statut:</strong> {spot.status === 'available' ? 'Disponible' : 'Occupée'}</Typography>
                          {spot.status === 'occupied' && (
                            <>
                              <Typography variant="body2"><strong>Depuis:</strong> {formatTime(spot.occupiedSince)}</Typography>
                              <Typography variant="body2"><strong>Durée:</strong> {getOccupationDuration(spot.occupiedSince)}</Typography>
                              {spot.occupiedBy && (
                                <Typography variant="body2"><strong>Par:</strong> {spot.occupiedBy}</Typography>
                              )}
                            </>
                          )}
                        </Box>
                      }
                      arrow
                    >
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: spot.id.charCodeAt(0) * 0.01 }}
                        style={{
                          position: 'absolute',
                          left: spot.x,
                          top: spot.y,
                          width: spot.width,
                          height: spot.height,
                          backgroundColor: spot.status === 'available' ? theme.palette.success.main : theme.palette.error.main,
                          borderRadius: 4,
                          display: 'flex',
                          justifyContent: 'center',
                          alignItems: 'center',
                          cursor: 'pointer',
                          color: '#fff',
                          fontWeight: 'bold',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                          transition: 'all 0.2s ease',
                        }}
                        whileHover={{ 
                          scale: 1.1, 
                          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
                        }}
                        onClick={() => handleSpotClick(spot)}
                      >
                        {spot.number}
                      </motion.div>
                    </Tooltip>
                  ))}
                </Box>
              )}
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, mb: 2 }}>
              <Typography variant="h6" gutterBottom>Statistiques</Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Places totales:</Typography>
                  <Typography variant="body1" fontWeight="bold">{parkingSpots.length}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Places disponibles:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="success.main">
                    {parkingSpots.filter(spot => spot.status === 'available').length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Places occupées:</Typography>
                  <Typography variant="body1" fontWeight="bold" color="error.main">
                    {parkingSpots.filter(spot => spot.status === 'occupied').length}
                  </Typography>
                </Box>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Typography variant="body2">Taux d'occupation:</Typography>
                  <Typography variant="body1" fontWeight="bold">
                    {Math.round((parkingSpots.filter(spot => spot.status === 'occupied').length / parkingSpots.length) * 100)}%
                  </Typography>
                </Box>
              </Box>
            </Paper>
            
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>Légende</Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 20, height: 20, bgcolor: 'success.main', borderRadius: 1 }} />
                  <Typography variant="body2">Place disponible</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 20, height: 20, bgcolor: 'error.main', borderRadius: 1 }} />
                  <Typography variant="body2">Place occupée</Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Box sx={{ width: 20, height: 20, bgcolor: 'grey.300', borderRadius: 1 }} />
                  <Typography variant="body2">Route / Allée</Typography>
                </Box>
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Cliquez sur une place pour voir plus de détails ou modifier son statut.
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {/* Dialog pour les détails de la place */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        {selectedSpot && (
          <>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6">
                Place {selectedSpot.number}
              </Typography>
              <Chip 
                label={selectedSpot.status === 'available' ? 'Disponible' : 'Occupée'} 
                color={selectedSpot.status === 'available' ? 'success' : 'error'}
              />
            </DialogTitle>
            <DialogContent dividers>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <LocalParking color="primary" />
                    <Typography variant="body1"><strong>Section:</strong> {selectedSpot.section}</Typography>
                  </Box>
                  <Box display="flex" alignItems="center" gap={1} mb={1}>
                    <Info color="primary" />
                    <Typography variant="body1"><strong>Étage:</strong> {selectedSpot.floor}</Typography>
                  </Box>
                  {selectedSpot.status === 'occupied' && (
                    <>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AccessTime color="primary" />
                        <Typography variant="body1">
                          <strong>Depuis:</strong> {formatTime(selectedSpot.occupiedSince)}
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1} mb={1}>
                        <AccessTime color="primary" />
                        <Typography variant="body1">
                          <strong>Durée:</strong> {getOccupationDuration(selectedSpot.occupiedSince)}
                        </Typography>
                      </Box>
                    </>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  {selectedSpot.status === 'occupied' && (
                    <>
                      {selectedSpot.occupiedBy && (
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <Person color="primary" />
                          <Typography variant="body1">
                            <strong>Occupant:</strong> {selectedSpot.occupiedBy}
                          </Typography>
                        </Box>
                      )}
                      {selectedSpot.vehicleType && (
                        <Box display="flex" alignItems="center" gap={1} mb={1}>
                          <DirectionsCar color="primary" />
                          <Typography variant="body1">
                            <strong>Véhicule:</strong> {selectedSpot.vehicleType}
                          </Typography>
                        </Box>
                      )}
                    </>
                  )}
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog}>Fermer</Button>
              <Button 
                variant="contained" 
                color={selectedSpot.status === 'available' ? 'error' : 'success'}
                onClick={handleToggleStatus}
              >
                {selectedSpot.status === 'available' ? 'Marquer comme occupée' : 'Marquer comme disponible'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
      
      {/* Snackbar pour les notifications */}
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

export default ParkingMap; 