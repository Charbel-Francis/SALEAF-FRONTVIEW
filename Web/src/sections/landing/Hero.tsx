import { MouseEvent, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import HeroCard from '../../assets/images/landing/saleaf-1024x535.jpg';
import { motion } from 'framer-motion';
import AnimateButton from 'components/@extended/AnimateButton';

export default function HeroPage() {
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    window.location.href = 'https://saleaffrontend-production.up.railway.app/donate';
  };

  const handleClickApplyFunding = (event: MouseEvent<HTMLButtonElement>) => {
    window.location.href = 'https://saleaffrontend-production.up.railway.app/application_form';
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Container>
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4} justifyContent="center">
            {/* Image Section */}
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
                <Box
                  sx={{
                    position: 'relative',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      bgcolor: '#14783D',
                      borderRadius: '0 0 8px 8px'
                    }
                  }}
                >
                  <img
                    src={HeroCard}
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                      borderRadius: '8px'
                    }}
                    alt="SALEAF Hero"
                  />
                </Box>
              </motion.div>
            </Grid>

            {/* Hero Text Section */}
            <Grid item xs={12} md={10} lg={8}>
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
                <Box
                  sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    p: { xs: 3, sm: 4, md: 5 },
                    boxShadow: theme.customShadows?.z1,
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: 0,
                      top: 0,
                      bottom: 0,
                      width: 4,
                      bgcolor: '#14783D',
                      borderRadius: '4px 0 0 4px'
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                    <Typography
                      variant="h5"
                      sx={{
                        fontSize: { xs: '1.125rem', md: '1.25rem' },
                        fontWeight: 500,
                        lineHeight: 1.8,
                        color: '#14783D',
                        textAlign: { xs: 'left', sm: 'center' }
                      }}
                    >
                      There's nothing greater than young minds achieving their full potential as intelligent, self-sufficient and productive
                      members of society.
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontSize: { xs: '1rem', md: '1.125rem' },
                        lineHeight: 1.8,
                        textAlign: { xs: 'left', sm: 'center' }
                      }}
                    >
                      The South African Lebanese Education Advancement Foundation (SALEAF) shares former President Nelson Mandela's
                      conviction that education can change the world. This is why we've made it our mission to raise funds to educate young
                      South Africans of Lebanese descent.
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>

            {/* CTA Buttons */}
            <Grid item xs={12}>
              <motion.div
                initial={{ opacity: 0, translateY: 550 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{
                  type: 'spring',
                  stiffness: 150,
                  damping: 30,
                  delay: 0.4
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                  <AnimateButton>
                    <Button
                      size="large"
                      variant="outlined"
                      onClick={handleClickApplyFunding}
                      sx={{
                        borderColor: '#14783D',
                        color: '#14783D',
                        '&:hover': {
                          borderColor: '#14783D',
                          bgcolor: 'rgba(20, 120, 61, 0.08)'
                        }
                      }}
                    >
                      Apply for funding
                    </Button>
                  </AnimateButton>
                  <AnimateButton>
                    <Button
                      size="large"
                      variant="contained"
                      onClick={handleClick}
                      sx={{
                        bgcolor: '#14783D',
                        '&:hover': {
                          bgcolor: '#0f5c2f'
                        }
                      }}
                    >
                      Donate Now
                    </Button>
                  </AnimateButton>
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        {/* About Section */}
        <Box sx={{ py: { xs: 6, md: 10 } }}>
          <Grid container spacing={4} justifyContent="center">
            {/* Section Header */}
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
                <Typography variant="h2" sx={{ mb: 1, color: '#14783D' }}>
                  About SALEAF
                </Typography>
                <Typography variant="subtitle1" color="text.secondary">
                  Empowering Education Since 1970
                </Typography>
              </Box>
            </Grid>

            {/* Main Content */}
            <Grid item xs={12}>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: { xs: 3, sm: 4, md: 5 },
                  boxShadow: theme.customShadows?.z1,
                  mb: 4
                }}
              >
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: { xs: '1rem', md: '1.125rem' },
                    lineHeight: 1.8,
                    textAlign: { xs: 'left', sm: 'center' },
                    maxWidth: '900px',
                    mx: 'auto'
                  }}
                >
                  SALEAF is a registered NPO and owes its origin to a body of the same name founded in the 1970's by a group of South
                  African Lebanese businessmen who identified the need to raise funds to assist in the education of members of their
                  community.
                </Typography>
              </Box>
            </Grid>

            {/* Info Cards */}
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: { xs: 3, sm: 4, md: 5 },
                  height: '100%',
                  boxShadow: theme.customShadows?.z1,
                  position: 'relative',
                  overflow: 'hidden',
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(20, 120, 61, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <Typography variant="h4" sx={{ color: '#14783D' }}>
                      1
                    </Typography>
                  </Box>
                  <Typography variant="h4">Our Legacy</Typography>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  Over the past three decades many have benefited from their efforts. There are scores of successful professionals and
                  businessmen and women today whose achievements were made possible through the education they received which was either
                  partially or fully funded by the original SALEAF.
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  p: { xs: 3, sm: 4, md: 5 },
                  height: '100%',
                  boxShadow: theme.customShadows?.z1,
                  position: 'relative',
                  overflow: 'hidden',
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
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: '50%',
                      bgcolor: 'rgba(20, 120, 61, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mr: 2
                    }}
                  >
                    <Typography variant="h4" sx={{ color: '#14783D' }}>
                      2
                    </Typography>
                  </Box>
                  <Typography variant="h4">Our Revival</Typography>
                </Box>
                <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                  They say that charity begins at home, and on that basis a group of like-minded South Africans of Lebanese descent
                  re-launched SALEAF in 2006 to take the legacy of the original organisation forward with renewed vigour and determination.
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
}
