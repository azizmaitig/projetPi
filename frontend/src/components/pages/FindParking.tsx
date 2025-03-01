import React, { useState } from 'react';
import {
  Box,
  Container,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  InputAdornment,
  Chip,
  Rating,
  Divider
} from '@mui/material';
import {
  Search,
  LocationOn,
  AccessTime,
  LocalParking,
  AttachMoney
} from '@mui/icons-material';

const FindParking = () => {
  const [searchParams, setSearchParams] = useState({
    location: '',
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: ''
  });

  // Mock data for parking spaces
  const parkingSpaces = [
    {
      id: 1,
      name: 'Downtown Secure Parking',
      address: '123 Main St, Downtown',
      price: 15,
      rating: 4.5,
      reviews: 128,
      image: '/images/parking-space-1.jpg',
      features: ['24/7 Access', 'Security Camera', 'Covered'],
      distance: '0.3 miles'
    },
    {
      id: 2,
      name: 'Central Station Parking',
      address: '456 Station Ave',
      price: 12,
      rating: 4.2,
      reviews: 89,
      image: '/images/parking-space-2.jpg',
      features: ['Gated', 'EV Charging', 'Well Lit'],
      distance: '0.5 miles'
    },
    {
      id: 3,
      name: 'Shopping Mall Parking',
      address: '789 Market Street',
      price: 10,
      rating: 4.0,
      reviews: 156,
      image: '/images/parking-space-3.jpg',
      features: ['Covered', 'Security Guard', 'Shopping Access'],
      distance: '0.8 miles'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Search params:', searchParams);
  };

  return (
    <Box sx={{ py: 4 }}>
      <Container maxWidth="lg">
        {/* Search Form */}
        <Card sx={{ mb: 4, p: 3 }}>
          <form onSubmit={handleSearch}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  label="Location"
                  value={searchParams.location}
                  onChange={(e) => setSearchParams({ ...searchParams, location: e.target.value })}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <LocationOn />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  value={searchParams.startDate}
                  onChange={(e) => setSearchParams({ ...searchParams, startDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="time"
                  label="Start Time"
                  value={searchParams.startTime}
                  onChange={(e) => setSearchParams({ ...searchParams, startTime: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <TextField
                  fullWidth
                  type="date"
                  label="End Date"
                  value={searchParams.endDate}
                  onChange={(e) => setSearchParams({ ...searchParams, endDate: e.target.value })}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  type="submit"
                  startIcon={<Search />}
                >
                  Search
                </Button>
              </Grid>
            </Grid>
          </form>
        </Card>

        {/* Search Results */}
        <Grid container spacing={3}>
          {parkingSpaces.map((space) => (
            <Grid item xs={12} key={space.id}>
              <Card>
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <CardMedia
                      component="img"
                      height="200"
                      image={space.image}
                      alt={space.name}
                    />
                  </Grid>
                  <Grid item xs={12} md={8}>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5" component="h2">
                          {space.name}
                        </Typography>
                        <Typography variant="h5" color="primary" sx={{ fontWeight: 'bold' }}>
                          ${space.price}/hr
                        </Typography>
                      </Box>
                      
                      <Typography color="text.secondary" gutterBottom>
                        <LocationOn sx={{ fontSize: 16, verticalAlign: 'text-bottom' }} />
                        {space.address} ({space.distance})
                      </Typography>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Rating value={space.rating} precision={0.5} readOnly />
                        <Typography variant="body2" sx={{ ml: 1 }}>
                          ({space.reviews} reviews)
                        </Typography>
                      </Box>

                      <Box sx={{ mb: 2 }}>
                        {space.features.map((feature) => (
                          <Chip
                            key={feature}
                            label={feature}
                            size="small"
                            sx={{ mr: 1, mb: 1 }}
                          />
                        ))}
                      </Box>

                      <Button
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2 }}
                      >
                        Book Now
                      </Button>
                    </CardContent>
                  </Grid>
                </Grid>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default FindParking; 