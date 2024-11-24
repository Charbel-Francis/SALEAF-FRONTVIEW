import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { motion } from 'framer-motion';
import FadeInWhenVisible from './Animation';
import MainCard from 'components/MainCard';
import { useEffect, useState } from 'react';
import axiosServices from 'utils/axios';

interface Director {
  directorName: string;
  directorLastName: string;
  directorImage: string;
  directorDescription: string;
}

export default function DirectorsPage() {
  const [directors, setDirectors] = useState<Director[]>([]);

  useEffect(() => {
    axiosServices.get('/api/Director/get-all-director').then((response) => {
      setDirectors(response.data);
    });
  }, []);

  return (
    <Box sx={{ bgcolor: 'background.default', py: { xs: 6, md: 10 } }}>
      <Container>
        <Grid container spacing={4} justifyContent="center">
          {/* Header Section */}
          <Grid item xs={12}>
            <Box
              sx={{
                textAlign: 'center',
                mb: 6,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -16,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: 60,
                  height: 4,
                  bgcolor: '#14783D',
                  borderRadius: 1
                }
              }}
            >
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
                <Typography
                  variant="h2"
                  sx={{
                    mb: 1,
                    color: '#14783D',
                    fontWeight: 600
                  }}
                >
                  Meet the Directors
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    maxWidth: '600px',
                    mx: 'auto'
                  }}
                >
                  Get to know the directors of SALEAF who are dedicated to advancing education and transforming lives
                </Typography>
              </motion.div>
            </Box>
          </Grid>

          {/* Directors Grid */}
          <Grid item xs={12}>
            <Grid container spacing={4} alignItems="stretch">
              {directors.map((director, index) => (
                <Grid item xs={12} md={6} lg={4} key={index}>
                  <FadeInWhenVisible>
                    <MainCard
                      sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        borderRadius: 2,
                        p: 0,
                        overflow: 'hidden',
                        position: 'relative',
                        '&:hover': {
                          transform: 'translateY(-8px)',
                          transition: 'transform 0.3s ease-in-out'
                        },
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          right: 0,
                          height: 4,
                          bgcolor: '#14783D',
                          zIndex: 1
                        }
                      }}
                    >
                      {/* Image Container with adjusted aspect ratio */}
                      <Box
                        sx={{
                          position: 'relative',
                          width: '100%',
                          pt: '100%', // Square aspect ratio
                          backgroundColor: 'grey.100'
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={director.directorImage}
                          alt={`${director.directorName} ${director.directorLastName}`}
                          sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: '100%',
                            height: '100%',
                            objectFit: 'contain', // Changed from 'cover' to 'contain'
                            padding: 1, // Added padding to prevent image from touching edges
                            background: 'white'
                          }}
                        />
                      </Box>

                      {/* Content Section */}
                      <Box
                        sx={{
                          p: 3,
                          flexGrow: 1,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 2,
                          bgcolor: 'background.paper'
                        }}
                      >
                        <Typography
                          variant="h4"
                          sx={{
                            color: '#14783D',
                            fontWeight: 600
                          }}
                        >
                          {director.directorName} {director.directorLastName}
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            fontSize: '1rem',
                            lineHeight: 1.8,
                            color: 'text.secondary'
                          }}
                        >
                          {director.directorDescription}
                        </Typography>
                      </Box>
                    </MainCard>
                  </FadeInWhenVisible>
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
