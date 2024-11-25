import React, { useEffect, useState } from 'react';
import axios from 'utils/axios';
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
  Stack,
  Grid,
  Card,
  alpha,
  Avatar,
  useTheme
} from '@mui/material';
import { Calendar, CloseCircle, DollarCircle, Eye, Key, Receipt, DocumentText, TickCircle, CloseSquare, InfoCircle } from 'iconsax-react';

// Types
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

// Detail Item Component
const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => {
  const theme = useTheme();
  return (
    <Stack
      direction="row"
      spacing={1.5}
      alignItems="center"
      sx={{
        p: 1.5,
        borderRadius: 1,
        border: `1px solid ${theme.palette.divider}`,
        bgcolor: alpha(theme.palette.background.paper, 0.7),
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          bgcolor: alpha(theme.palette.primary.main, 0.05)
        }
      }}
    >
      <Box
        sx={{
          p: 1,
          borderRadius: 0.5,
          bgcolor: alpha(theme.palette.primary.main, 0.1),
          color: 'primary.main',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {icon}
      </Box>
      <Box>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body2" sx={{ mt: 0.25, fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Stack>
  );
};

const ListManualPayment: React.FC = () => {
  const theme = useTheme();
  const [manualPayments, setManualPayments] = useState<ManualPaymentDoc[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [donationDialogOpen, setDonationDialogOpen] = useState<boolean>(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success'
  });

  const fetchManualPayments = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ManualPaymentDoc[]>('/api/ManualPaymentDoc', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setManualPayments(response.data);
      console.log('Manual Payments:', response.data);
    } catch (error) {
      console.error('Error fetching manual payments:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch manual payments',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const [isLoadingDetails, setIsLoadingDetails] = useState<boolean>(false);

  const fetchDonationById = async (id: number) => {
    setIsLoadingDetails(true);
    setDonationDialogOpen(true);

    try {
      const response = await axios.get<Donation>(`/api/Donation/get-donation-by-id/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setSelectedDonation(response.data);
    } catch (error) {
      console.error('Error fetching donation details:', error);
      setSnackbar({
        open: true,
        message: 'Failed to fetch donation details',
        severity: 'error'
      });
    } finally {
      setIsLoadingDetails(false);
    }
  };

  const handleAction = async (referenceNumber: number, statusCode: number) => {
    try {
      await axios.post(
        `/api/ManualPaymentDoc/accept-reject-manual-payment`,
        {},
        {
          params: { referenceNo: referenceNumber, statusCode },
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        }
      );
      setSnackbar({
        open: true,
        message: `Payment ${statusCode === 1 ? 'accepted' : 'rejected'} successfully.`,
        severity: 'success'
      });
      fetchManualPayments();
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to ${statusCode === 1 ? 'accept' : 'reject'} payment.`,
        severity: 'error'
      });
      console.error(`Error during payment ${statusCode === 1 ? 'accept' : 'reject'}:`, error);
    }
  };
  const formatAmount = (amount: number) => {
    // If number is >= 1 million, use scientific notation
    if (Math.abs(amount) >= 1000000) {
      return `R${amount.toExponential(2)}`; // 2 decimal places in scientific notation
    }

    // For smaller numbers, use regular formatting
    return `R${amount.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  useEffect(() => {
    fetchManualPayments();
  }, []);

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        bgcolor: alpha(theme.palette.background.default, 0.8),
        minHeight: '100vh'
      }}
    >
      {/* Header Section */}
      <Card
        elevation={0}
        sx={{
          mb: 4,
          p: 3,
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.light, 0.1)} 100%)`,
          borderRadius: 3,
          border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: 'primary.main',
              color: 'primary.contrastText'
            }}
          >
            <Receipt variant="Bold" size={24} />
          </Box>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600, mb: 0.5 }}>
              Manual Payments
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Manage and verify manual payment submissions
            </Typography>
          </Box>
        </Stack>
      </Card>

      {loading ? (
        <Card
          sx={{
            height: 400,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Stack spacing={2} alignItems="center">
            <CircularProgress />
            <Typography color="text.secondary">Loading payments...</Typography>
          </Stack>
        </Card>
      ) : (
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`,
            overflow: 'hidden',
            '& .MuiTableCell-root': {
              borderColor: alpha(theme.palette.divider, 0.5)
            }
          }}
        >
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha(theme.palette.primary.main, 0.02) }}>
                  <TableCell sx={{ py: 2, fontWeight: 600 }}>ID</TableCell>
                  <TableCell sx={{ py: 2, fontWeight: 600 }}>Reference Number</TableCell>
                  <TableCell sx={{ py: 2, fontWeight: 600 }}>Document</TableCell>
                  <TableCell sx={{ py: 2, fontWeight: 600 }}>Amount</TableCell>
                  <TableCell sx={{ py: 2, fontWeight: 600 }}>Status</TableCell>
                  <TableCell sx={{ py: 2, fontWeight: 600 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {manualPayments.map((payment) => (
                  <TableRow
                    key={payment.id}
                    sx={{
                      '&:hover': {
                        bgcolor: alpha(theme.palette.primary.main, 0.02)
                      }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={500}>
                        #{payment.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{payment.referenceNumber}</Typography>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<DocumentText size={16} />}
                        href={payment.docUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          borderRadius: 1,
                          textTransform: 'none',
                          px: 2
                        }}
                      >
                        View Document
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          fontWeight: 600,
                          color: 'primary.main'
                        }}
                      >
                        {formatAmount(payment.amount)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={payment.checked ? 'Checked' : 'Unchecked'}
                        color={payment.checked ? 'success' : 'warning'}
                        size="small"
                        sx={{
                          borderRadius: 1,
                          '& .MuiChip-label': {
                            px: 2,
                            fontWeight: 500
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          color="success"
                          startIcon={<TickCircle size={16} />}
                          onClick={() => handleAction(payment.referenceNumber, 1)}
                          sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            minWidth: 100
                          }}
                        >
                          Accept
                        </Button>
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          startIcon={<CloseSquare size={16} />}
                          onClick={() => handleAction(payment.referenceNumber, 0)}
                          sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            minWidth: 100
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<InfoCircle size={16} />}
                          onClick={() => fetchDonationById(payment.referenceNumber)}
                          sx={{
                            borderRadius: 1,
                            textTransform: 'none',
                            bgcolor: theme.palette.primary.main,
                            '&:hover': {
                              bgcolor: theme.palette.primary.dark
                            },
                            minWidth: 120
                          }}
                        >
                          View Details
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      )}

      {/* Donation Details Dialog */}
      <Dialog
        open={donationDialogOpen}
        onClose={() => {
          if (!isLoadingDetails) {
            setDonationDialogOpen(false);
            setSelectedDonation(null);
          }
        }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            minWidth: { xs: '90%', sm: 400, md: 500 },
            maxWidth: 600
          }
        }}
      >
        <DialogTitle
          sx={{
            borderBottom: '1px solid',
            borderColor: 'divider',
            pb: 2,
            px: 3
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
                color: 'primary.main'
              }}
            >
              <Receipt variant="Bold" size={24} />
            </Box>
            <Typography variant="h5">{isLoadingDetails ? 'Loading Details...' : 'Donation Details'}</Typography>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ px: 3, py: 3 }}>
          {isLoadingDetails ? (
            <Stack
              alignItems="center"
              spacing={3}
              sx={{
                py: 8,
                px: 2,
                minHeight: 300,
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <CircularProgress size={40} />
              <Box textAlign="center">
                <Typography variant="h6" gutterBottom>
                  Fetching Details
                </Typography>
                <Typography color="text.secondary">Please wait while we load the donation information</Typography>
              </Box>
            </Stack>
          ) : selectedDonation ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Card
                  sx={{
                    p: 2,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.05),
                    border: '1px solid',
                    borderColor: 'divider',
                    borderRadius: 2
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" color="primary.main">
                      Amount: {formatAmount(selectedDonation.amount)}
                    </Typography>
                    <Chip
                      label={selectedDonation.isPaid ? 'Paid' : 'Pending'}
                      color={selectedDonation.isPaid ? 'success' : 'warning'}
                      size="small"
                      variant="outlined"
                      sx={{ borderRadius: 1 }}
                    />
                  </Stack>
                </Card>
              </Grid>

              <Grid item xs={12}>
                <Stack spacing={2}>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <DetailItem
                        icon={<Calendar size={18} />}
                        label="Donation Date"
                        value={new Date(selectedDonation.createdAt).toLocaleDateString()}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailItem icon={<Key size={18} />} label="Payment ID" value={selectedDonation.paymentId} />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailItem
                        icon={<Eye size={18} />}
                        label="Visibility"
                        value={selectedDonation.isAnonymous ? 'Anonymous' : 'Public'}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <DetailItem icon={<DollarCircle size={18} />} label="Currency" value={selectedDonation.currency} />
                    </Grid>
                  </Grid>
                </Stack>
              </Grid>
            </Grid>
          ) : (
            <Stack alignItems="center" spacing={2} sx={{ py: 3 }}>
              <Typography color="error">No donation details available</Typography>
            </Stack>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            py: 2,
            borderTop: '1px solid',
            borderColor: 'divider'
          }}
        >
          <Button
            variant="contained"
            onClick={() => {
              if (!isLoadingDetails) {
                setDonationDialogOpen(false);
                setSelectedDonation(null);
              }
            }}
            startIcon={<CloseCircle />}
            disabled={isLoadingDetails}
            sx={{
              borderRadius: 1,
              textTransform: 'none'
            }}
          >
            {isLoadingDetails ? 'Please wait...' : 'Close'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Enhanced Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 2,
            boxShadow: theme.shadows[3],
            '& .MuiAlert-icon': {
              fontSize: 24
            },
            '& .MuiAlert-message': {
              fontSize: '0.875rem',
              fontWeight: 500
            },
            '& .MuiAlert-action': {
              paddingTop: 0.5,
              paddingBottom: 0.5
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* No Data State */}
      {!loading && manualPayments.length === 0 && (
        <Card
          sx={{
            p: 4,
            textAlign: 'center',
            borderRadius: 3,
            border: `1px solid ${theme.palette.divider}`
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: 2,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto',
              mb: 2
            }}
          >
            <Receipt variant="Bulk" size={32} />
          </Box>
          <Typography variant="h6" gutterBottom>
            No Manual Payments
          </Typography>
          <Typography variant="body2" color="text.secondary">
            There are no manual payments to review at this time.
          </Typography>
        </Card>
      )}
    </Box>
  );
};

export default ListManualPayment;
