import { useState, useEffect } from 'react';
import axios from 'utils/axios';
import {
  Grid,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  Backdrop,
  Button,
  Alert
} from '@mui/material';

// Define Admin interface
interface Admin {
  id: string;
  email: string;
}

const ListAdmin = () => {
  const [admins, setAdmins] = useState<Admin[]>([]); // Correctly typed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchAdmins = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get<Admin[]>('/api/Account', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          Accept: 'application/json'
        }
      });
      setAdmins(response.data);
    } catch (err) {
      console.error('Error fetching admins:', err);
      setError('Failed to load admin data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

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
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Admin List
          </Typography>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        {!loading && admins.length > 0 && (
          <Grid item xs={12}>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {admins.map((admin: Admin) => (
                    <TableRow key={admin.id}>
                      <TableCell>{admin.email}</TableCell>
                      <TableCell>Admin</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        )}

        {!loading && admins.length === 0 && !error && (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary">
              No admins found.
            </Typography>
          </Grid>
        )}

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="contained" color="primary" onClick={fetchAdmins} disabled={loading}>
              Refresh
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default ListAdmin;
