import React from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn
} from '@mui/icons-material';

const Footer = () => {
  const footerLinks = {
    'About Us': ['Company', 'Team', 'Careers', 'Blog'],
    'Services': ['Find Parking', 'List Your Space', 'Business Solutions', 'Partner With Us'],
    'Support': ['Help Center', 'Contact Us', 'Safety', 'Terms of Service'],
    'Legal': ['Privacy Policy', 'Terms & Conditions', 'Cookie Policy']
  };

  const socialLinks = [
    { icon: <Facebook />, name: 'Facebook', url: '#' },
    { icon: <Twitter />, name: 'Twitter', url: '#' },
    { icon: <Instagram />, name: 'Instagram', url: '#' },
    { icon: <LinkedIn />, name: 'LinkedIn', url: '#' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.100',
        pt: 6,
        pb: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} sm={6} md={3} key={category}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                {category}
              </Typography>
              {links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  color="text.secondary"
                  display="block"
                  sx={{
                    mb: 1,
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'primary.main',
                      textDecoration: 'underline'
                    }
                  }}
                >
                  {link}
                </Link>
              ))}
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: { xs: 2, sm: 0 } }}
          >
            © {new Date().getFullYear()} ParkEase. All rights reserved.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            {socialLinks.map((social) => (
              <IconButton
                key={social.name}
                href={social.url}
                aria-label={social.name}
                color="inherit"
                sx={{
                  '&:hover': {
                    color: 'primary.main'
                  }
                }}
              >
                {social.icon}
              </IconButton>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 