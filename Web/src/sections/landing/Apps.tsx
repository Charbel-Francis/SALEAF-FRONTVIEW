import { useRef, useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import Slider, { Settings } from 'react-slick';
import SALEAFChurchhill from '../../assets/images/landing/churchill-saleaf-1024x548.jpg';
// Import your images here

export default function FundraisingPage() {
  const theme = useTheme();
  const sliderRef = useRef<Slider>(null);

  const settings: Settings = {
    autoplay: true,
    fade: true,
    dots: false,
    arrows: false,
    infinite: true,
    speed: 5000,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <Box sx={{ bgcolor: '#14783D', overflow: 'hidden', py: { md: 10, xs: 5 } }}>
      <Container>
        <Grid container spacing={3} alignItems="center" justifyContent="center">
          {/* Header Section */}
          <Grid item xs={12}>
            <Grid container spacing={2} justifyContent="center" sx={{ textAlign: 'center', mb: 5 }}>
              <Grid item xs={12}>
                <motion.div
                  initial={{ opacity: 0, translateY: 550 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{
                    type: 'spring',
                    stiffness: 150,
                    damping: 30
                  }}
                >
                  <Typography variant="h2" sx={{ color: 'white', mb: 3 }}>
                    Fundraising
                  </Typography>
                </motion.div>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        <Grid container spacing={4} alignItems="center" justifyContent="center">
          {/* Content Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, translateY: 550 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 30,
                delay: 0.2
              }}
            >
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Typography
                  color="white"
                  sx={{
                    mb: 3,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.8,
                    textAlign: 'justify'
                  }}
                >
                  In South Africa, our current socio-economic environment rightly requires that previously disadvantaged candidates continue
                  to be a priority for financial support from Government, educational institutions, NGO's and the business sector; and the
                  demand for this assistance is significant.
                </Typography>

                <Typography
                  color="white"
                  sx={{
                    mb: 3,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.8,
                    textAlign: 'justify'
                  }}
                >
                  This means that many South African Lebanese candidates who have excelled academically and are in need of financial
                  assistance to further their studies are of necessity overlooked.
                </Typography>

                <Typography
                  color="white"
                  sx={{
                    mb: 4,
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.8,
                    textAlign: 'justify'
                  }}
                >
                  Please help us to make a difference in the lives of many young students. All they need is an opportunity. No amount is too
                  small.
                </Typography>

                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: '#14783D',
                    px: 4,
                    py: 1.5,
                    fontSize: '1.1rem',
                    fontWeight: 600,
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.9)'
                    },
                    boxShadow: '0 4px 14px 0 rgba(0, 0, 0, 0.2)'
                  }}
                >
                  Donate Now
                </Button>
              </Box>
            </motion.div>
          </Grid>

          {/* Slider Section */}
          {/* Image Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, translateY: 550 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{
                type: 'spring',
                stiffness: 150,
                damping: 30,
                delay: 0.3
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: 2,
                  bgcolor: 'background.paper',
                  boxShadow: theme.customShadows?.z1,
                  p: 2,
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 4,
                    bgcolor: '#14783D'
                  }
                }}
              >
                <CardMedia
                  component="img"
                  image={SALEAFChurchhill} // Replace with your image path
                  alt="Fundraising"
                  sx={{
                    width: '100%',
                    height: { xs: '300px', md: '400px' },
                    objectFit: 'cover',
                    borderRadius: 1,
                    transition: 'transform 0.3s ease-in-out',
                    '&:hover': {
                      transform: 'scale(1.02)'
                    }
                  }}
                />
                <Typography
                  variant="subtitle1"
                  sx={{
                    mt: 2,
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  Supporting the educational journey of South African Lebanese students
                </Typography>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
