import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios';

// material-ui
import { Grid, Stack, Button, TextField, InputLabel, Typography, CircularProgress, Backdrop } from '@mui/material';

const CreateAdmin = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const adminData = { firstName, lastName, email, password };

      const response = await axios.post('/api/Account/register-admin', adminData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert('Admin registered successfully!');
        navigate('/SALEAF/dashboard/default'); // Redirect to admin list or another relevant page
      } else {
        alert('Failed to register admin. Please try again.');
      }
    } catch (error) {
      console.error('Error registering admin:', error);
      alert('An error occurred. Please check the details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Backdrop
        open={loading}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={1}>
            <InputLabel htmlFor="first-name">First Name</InputLabel>
            <TextField
              fullWidth
              id="first-name"
              placeholder="Enter admin's first name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <InputLabel htmlFor="last-name">Last Name</InputLabel>
            <TextField
              fullWidth
              id="last-name"
              placeholder="Enter admin's last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack spacing={1}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <TextField
              fullWidth
              id="email"
              type="email"
              placeholder="Enter admin's email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <InputLabel htmlFor="password">Password</InputLabel>
            <TextField
              fullWidth
              id="password"
              type="password"
              placeholder="Enter admin's password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button color="error" onClick={() => navigate('/apps/admins/list-admins')} disabled={loading}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading ? 'Submitting...' : 'Register Admin'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateAdmin;
