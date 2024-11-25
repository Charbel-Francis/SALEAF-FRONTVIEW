import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import axiosServices from 'utils/axios';
import { ArrowLeft, Security, Trash, Warning2 } from 'iconsax-react';
import { redirect, useNavigate } from 'react-router';

const DeleteAccountPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  interface DeleteAccountFormData {
    email: string;
    password: string;
  }

  const handleDelete = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data: DeleteAccountFormData = { email, password };
      await axiosServices.delete(`/api/Account/1`, { data });
      window.location.href = '/login';
    } catch (error) {
      const err = error as any;
      setError(err.response?.data?.message || 'Failed to delete account');
      setLoading(false);
    }
  };

  const isFormValid = email && password && deleteConfirm === 'DELETE';

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Red warning bar at top */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            bgcolor: 'error.main'
          }}
        />

        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 2 }}>
          <Warning2 color="error" style={{ fontSize: 48, marginBottom: 16 }} />
          <Typography variant="h4" component="h1" color="error" gutterBottom>
            Delete Account
          </Typography>
          <Typography variant="body1" color="text.secondary">
            This action cannot be undone. Please be certain.
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Delete Account Form */}
        <form onSubmit={handleDelete}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              label="Email Address"
              type="email"
              fullWidth
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              variant="outlined"
            />

            <TextField
              label="Password"
              type="password"
              fullWidth
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              variant="outlined"
            />

            <TextField
              label='Type "DELETE" to confirm'
              fullWidth
              required
              value={deleteConfirm}
              onChange={(e) => setDeleteConfirm(e.target.value)}
              variant="outlined"
              helperText='Please type "DELETE" in capitals to confirm'
            />

            <Divider sx={{ my: 2 }} />

            {/* Consequences Section */}
            <Box sx={{ bgcolor: 'grey.50', p: 2, borderRadius: 1 }}>
              <Typography variant="subtitle2" color="error" gutterBottom>
                What happens when you delete your account:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemIcon>
                    <Trash color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Permanent Data Deletion" secondary="All your data will be permanently removed" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Security color="error" />
                  </ListItemIcon>
                  <ListItemText primary="Access Revoked" secondary="You will lose access to all services and features" />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Warning2 color="error" />
                  </ListItemIcon>
                  <ListItemText primary="No Recovery" secondary="This action cannot be reversed" />
                </ListItem>
              </List>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button variant="outlined" startIcon={<ArrowLeft />} fullWidth onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                color="error"
                fullWidth
                disabled={!isFormValid || loading}
                startIcon={loading ? <CircularProgress size={20} /> : <Trash />}
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default DeleteAccountPage;
