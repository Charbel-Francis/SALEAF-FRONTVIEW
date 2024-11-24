import React from 'react';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import MainCard from 'components/MainCard';

// Animation component
const FadeInWhenVisible: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const controls = useAnimation();
  const [ref, inView] = useInView();

  React.useEffect(() => {
    if (inView) {
      controls.start('visible');
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      transition={{ duration: 0.3 }}
      variants={{
        visible: { opacity: 1, y: 0 },
        hidden: { opacity: 0, y: 20 }
      }}
    >
      {children}
    </motion.div>
  );
};

// Type declaration for theme
declare module '@mui/material/styles' {
  interface Theme {
    customShadows: {
      z1: string;
    };
  }
  interface ThemeOptions {
    customShadows?: {
      z1?: string;
    };
  }
}

// Example testimonials data
interface Testimonial {
  id: number;
  name: string;
  course: string;
  quote: string;
  image?: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    course: 'Bachelor of Commerce',
    quote:
      "SALEAF's support has been instrumental in my academic journey. Their funding helped me focus on my studies without financial worry."
  },
  {
    id: 2,
    name: 'Michael Smith',
    course: 'Engineering',
    quote: 'Thanks to SALEAF, I was able to pursue my dream of becoming an engineer. Their support goes beyond just financial assistance.'
  },
  {
    id: 3,
    name: 'Emma Davis',
    course: 'Medicine',
    quote: "The foundation's belief in my potential made all the difference. I'm proud to be a SALEAF beneficiary."
  }
];

export default function TestimonialsPage() {
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
                  Student Testimonials
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
                  Hear directly from our students about how SALEAF has transformed their educational journey
                </Typography>
              </motion.div>
            </Box>
          </Grid>

          {/* Video Section */}
          <Grid item xs={12}>
            <FadeInWhenVisible>
              <MainCard
                sx={{
                  p: { xs: 2, sm: 3, md: 4 },
                  borderRadius: 2,
                  overflow: 'hidden',
                  boxShadow: (theme: { customShadows: { z1: any } }) => theme.customShadows?.z1,
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
                <Box
                  sx={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '56.25%',
                    bgcolor: 'grey.100',
                    borderRadius: 1,
                    overflow: 'hidden'
                  }}
                >
                  <iframe
                    src="https://www.youtube.com/embed/PWBGFM2wD94"
                    title="Student Testimonials"
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0
                    }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </Box>

                <Typography
                  variant="body1"
                  sx={{
                    mt: 2,
                    textAlign: 'center',
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  Watch our students share their inspiring stories and experiences with SALEAF
                </Typography>
              </MainCard>
            </FadeInWhenVisible>
          </Grid>

          {/* Written Testimonials Section */}
          <Grid item xs={12} sx={{ mt: 4 }}>
            <Grid container spacing={3}>
              {testimonials.map((testimonial) => (
                <Grid item xs={12} md={4} key={testimonial.id}>
                  <FadeInWhenVisible>
                    <MainCard
                      sx={{
                        height: '100%',
                        p: 3,
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
                      <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', gap: 2 }}>
                        <Typography
                          sx={{
                            fontSize: '3rem',
                            color: '#14783D',
                            opacity: 0.2,
                            height: 30,
                            lineHeight: 1
                          }}
                        >
                          "
                        </Typography>
                        <Typography
                          variant="body1"
                          sx={{
                            flex: 1,
                            fontSize: '1rem',
                            lineHeight: 1.8,
                            fontStyle: 'italic'
                          }}
                        >
                          {testimonial.quote}
                        </Typography>
                        <Box sx={{ mt: 2 }}>
                          <Typography variant="h6" color="#14783D">
                            {testimonial.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {testimonial.course}
                          </Typography>
                        </Box>
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
