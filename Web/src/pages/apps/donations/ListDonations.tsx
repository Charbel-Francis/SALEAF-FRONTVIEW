import { useEffect, useState } from 'react';
import axios from 'utils/axios';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  CircularProgress,
  Pagination,
  Button,
  Stack,
  InputAdornment,
  Card,
  CardContent,
  Tooltip,
  useTheme,
  Divider
} from '@mui/material';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';
import SearchIcon from '@mui/icons-material/Search';
import DownloadIcon from '@mui/icons-material/Download';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';

// Define types
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

// Format number with commas and fixed decimals
const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

const ListDonations: React.FC = () => {
  const theme = useTheme();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const pageSize = 20;

  // ... (keeping all the existing functions unchanged)
  const fetchDonations = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/Donation', {
        params: { pageNumber, pageSize },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      setDonations(response.data.data || []);
      setFilteredDonations(response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
    } catch (error) {
      console.error('Error fetching donations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations(page);
  }, [page]);

  useEffect(() => {
    let filtered = donations;

    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (donation) =>
          donation.id.toString().includes(lowercasedQuery) ||
          donation.paymentId.toLowerCase().includes(lowercasedQuery) ||
          (donation.firstName + ' ' + donation.lastName).toLowerCase().includes(lowercasedQuery)
      );
    }

    if (startDate && endDate) {
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      filtered = filtered.filter((donation) => {
        const donationDate = new Date(donation.createdAt).getTime();
        return donationDate >= start && donationDate <= end;
      });
    }

    setFilteredDonations(filtered);
  }, [searchQuery, startDate, endDate, donations]);

  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  const handleDownloadCSV = () => {
    const csvData = filteredDonations.map((donation) => ({
      id: donation.id,
      userName: donation.userName,
      fullName: donation.isAnonymous ? 'Anonymous' : `${donation.firstName} ${donation.lastName}`,
      paymentId: donation.paymentId,
      amount: donation.amount,
      currency: donation.currency,
      date: format(new Date(donation.createdAt), 'yyyy-MM-dd'),
      isPaid: donation.isPaid ? 'Yes' : 'No',
      isAnonymous: donation.isAnonymous ? 'Yes' : 'No'
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'ID,Username,Full Name,Payment ID,Amount,Currency,Date,Paid,Anonymous',
        ...csvData.map((row) =>
          [row.id, row.userName, row.fullName, row.paymentId, row.amount, row.currency, row.date, row.isPaid, row.isAnonymous].join(',')
        )
      ].join('\n');

    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: 'text/csv;charset=utf-8;'
    });
    saveAs(blob, `donations_${Date.now()}.csv`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  // Styles object for reusable styles
  const styles = {
    tableCell: {
      padding: '16px',
      '&:first-of-type': {
        paddingLeft: '24px'
      },
      '&:last-of-type': {
        paddingRight: '24px'
      }
    },
    headerCell: {
      backgroundColor: theme.palette.background.default,
      fontWeight: 600,
      color: theme.palette.text.primary,
      padding: '16px',
      '&:first-of-type': {
        paddingLeft: '24px'
      },
      '&:last-of-type': {
        paddingRight: '24px'
      }
    },
    card: {
      backgroundColor: theme.palette.background.paper,
      boxShadow: theme.shadows[2],
      borderRadius: '12px',
      overflow: 'hidden'
    },
    filterInput: {
      backgroundColor: theme.palette.background.paper,
      borderRadius: '8px',
      '& .MuiOutlinedInput-root': {
        '& fieldset': {
          borderColor: theme.palette.divider
        },
        '&:hover fieldset': {
          borderColor: theme.palette.primary.main
        }
      }
    }
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <CircularProgress size={60} thickness={4} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: '100%' }}>
      <Card sx={styles.card}>
        <CardContent sx={{ p: { xs: 2, md: 4 } }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Box>
              <Typography variant="h4" sx={{ fontWeight: 700, color: theme.palette.text.primary }}>
                Donations
              </Typography>
              <Typography variant="subtitle1" sx={{ color: theme.palette.text.secondary, mt: 1 }}>
                Track and manage all donation transactions
              </Typography>
            </Box>
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              onClick={handleDownloadCSV}
              sx={{
                textTransform: 'none',
                px: 3,
                py: 1.5,
                borderRadius: '8px',
                backgroundColor: theme.palette.primary.main,
                '&:hover': {
                  backgroundColor: theme.palette.primary.dark
                }
              }}
            >
              Export CSV
            </Button>
          </Box>

          <Stack direction={{ xs: 'column', md: 'row' }} spacing={3} sx={{ mb: 4 }}>
            <TextField
              fullWidth
              placeholder="Search by reference, payment ID, or donor name"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={styles.filterInput}
            />
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{ ...styles.filterInput, minWidth: 200 }}
            />
            <TextField
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayIcon color="action" />
                  </InputAdornment>
                )
              }}
              sx={{ ...styles.filterInput, minWidth: 200 }}
            />
          </Stack>
        </CardContent>

        <TableContainer sx={{ borderRadius: 0 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={styles.headerCell}>Reference No</TableCell>
                <TableCell sx={styles.headerCell}>Payment ID</TableCell>
                <TableCell sx={styles.headerCell}>Donor Name</TableCell>
                <TableCell sx={styles.headerCell}>Amount</TableCell>
                <TableCell sx={styles.headerCell}>Currency</TableCell>
                <TableCell sx={styles.headerCell}>Date</TableCell>
                <TableCell sx={styles.headerCell}>Status</TableCell>
                <TableCell sx={styles.headerCell}>Type</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredDonations.length > 0 ? (
                filteredDonations.map((donation) => (
                  <TableRow
                    key={donation.paymentId}
                    sx={{
                      '&:hover': {
                        backgroundColor: `${theme.palette.action.hover} !important`
                      },
                      transition: 'background-color 0.2s ease'
                    }}
                  >
                    <TableCell sx={styles.tableCell}>{donation.id}</TableCell>
                    <TableCell sx={styles.tableCell}>
                      <Tooltip title={donation.paymentId} arrow>
                        <span>{donation.paymentId}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell sx={styles.tableCell}>
                      {donation.isAnonymous ? 'Anonymous' : `${donation.firstName} ${donation.lastName}`}
                    </TableCell>
                    <TableCell
                      sx={{
                        ...styles.tableCell,
                        fontWeight: 600,
                        color: theme.palette.success.main
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>R{formatAmount(donation.amount)}</Box>
                    </TableCell>
                    <TableCell sx={styles.tableCell}>{donation.currency}</TableCell>
                    <TableCell sx={styles.tableCell}>{format(new Date(donation.createdAt), 'MMM dd, yyyy')}</TableCell>
                    <TableCell sx={styles.tableCell}>
                      <Chip
                        label={donation.isPaid ? 'Paid' : 'Pending'}
                        color={donation.isPaid ? 'success' : 'error'}
                        size="small"
                        sx={{
                          minWidth: 85,
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={styles.tableCell}>
                      <Chip
                        label={donation.isAnonymous ? 'Anonymous' : 'Named'}
                        color={donation.isAnonymous ? 'info' : 'default'}
                        size="small"
                        sx={{
                          minWidth: 85,
                          borderRadius: '6px',
                          fontWeight: 600,
                          fontSize: '0.75rem'
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center" sx={{ py: 8 }}>
                    <Typography variant="body1" color="text.secondary">
                      No donations found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
            sx={{
              '& .MuiPaginationItem-root': {
                borderRadius: '8px',
                margin: '0 4px'
              }
            }}
          />
        </Box>
      </Card>
    </Box>
  );
};

export default ListDonations;
