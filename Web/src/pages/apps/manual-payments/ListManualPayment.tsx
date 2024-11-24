import React, { useEffect, useState } from 'react';
import axios from 'utils/axios'; // Ensure axios is configured with baseURL and headers
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Alert,
} from '@mui/material';

// Define types
interface ManualPaymentDoc {
  id: number;
  referenceNumber: number;
  docUrl: string;
  amount: number;
  checked: boolean;
}

interface Donation {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  paymentId: string;
  amount: number;
  currency: string;
  createdAt: string;
  isPaid: boolean;
  isAnonymous: boolean;
}

const ListManualPayment: React.FC = () => {
  const [manualPayments, setManualPayments] = useState<ManualPaymentDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [donationDialogOpen, setDonationDialogOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchManualPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ManualPaymentDoc[]>('/api/ManualPaymentDoc', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setManualPayments(response.data);
    } catch (error) {
      console.error('Error fetching manual payments:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDonationById = async (id: number) => {
    try {
      const response = await axios.get<Donation>(`/api/Donation/get-donation-by-id/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      setSelectedDonation(response.data);
      setDonationDialogOpen(true);
    } catch (error) {
      console.error('Error fetching donation details:', error);
    }
  };

  const handleAction = async (referenceNumber: number, statusCode: number) => {
    try {
      const response = await axios.post(
        `/api/ManualPaymentDoc/accept-reject-manual-payment`,
        {},
        {
          params: { referenceNo: referenceNumber, statusCode },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        }
      );
      setSnackbar({
        open: true,
        message: `Payment ${statusCode === 1 ? 'accepted' : 'rejected'} successfully.`,
        severity: 'success',
      });
      fetchManualPayments(); // Refresh the list after action
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to ${statusCode === 1 ? 'accept' : 'reject'} payment.`,
        severity: 'error',
      });
      console.error(`Error during payment ${statusCode === 1 ? 'accept' : 'reject'}:`, error);
    }
  };

  useEffect(() => {
    fetchManualPayments();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" mb={3}>
        Manual Payments
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Reference Number</TableCell>
              <TableCell>Document</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Checked</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {manualPayments.map((payment) => (
              <TableRow key={payment.id}>
                <TableCell>{payment.id}</TableCell>
                <TableCell>{payment.referenceNumber}</TableCell>
                <TableCell>
                  <a href={payment.docUrl} target="_blank" rel="noopener noreferrer">
                    View Document
                  </a>
                </TableCell>
                <TableCell>{payment.amount}</TableCell>
                <TableCell>
                  <Chip
                    label={payment.checked ? 'Checked' : 'Unchecked'}
                    color={payment.checked ? 'success' : 'warning'}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="success"
                      size="small"
                      onClick={() => handleAction(payment.referenceNumber, 1)}
                    >
                      Accept
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      size="small"
                      onClick={() => handleAction(payment.referenceNumber, 0)}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="outlined"
                      color="info"
                      size="small"
                      onClick={() => fetchDonationById(payment.referenceNumber)}
                    >
                      View Donation
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Donation Details Dialog */}
      <Dialog open={donationDialogOpen} onClose={() => setDonationDialogOpen(false)}>
        <DialogTitle>Donation Details</DialogTitle>
        <DialogContent>
          {selectedDonation ? (
            <Box>
              <Typography variant="subtitle1">Donation ID: {selectedDonation.id}</Typography>
              <Typography variant="subtitle1">Donor: {selectedDonation.firstName} {selectedDonation.lastName}</Typography>
              <Typography variant="subtitle1">Amount: {selectedDonation.amount}</Typography>
              <Typography variant="subtitle1">Currency: {selectedDonation.currency}</Typography>
              <Typography variant="subtitle1">Payment ID: {selectedDonation.paymentId}</Typography>
              <Typography variant="subtitle1">Date: {new Date(selectedDonation.createdAt).toLocaleDateString()}</Typography>
              <Typography variant="subtitle1">Paid: {selectedDonation.isPaid ? 'Yes' : 'No'}</Typography>
              <Typography variant="subtitle1">Anonymous: {selectedDonation.isAnonymous ? 'Yes' : 'No'}</Typography>
            </Box>
          ) : (
            <Typography>Loading donation details...</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDonationDialogOpen(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ListManualPayment;
