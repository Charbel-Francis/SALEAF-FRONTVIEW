import { useEffect, useState } from 'react';
import axios from 'utils/axios';
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  CircularProgress,
  Pagination,
  Button,
  Stack,
} from '@mui/material';
import { format } from 'date-fns';
import { saveAs } from 'file-saver';

// Define types
interface Donation {
  id: number;
  userName: string;
  firstName: string;
  lastName: string;
  paymentId: string;
  amount: number;
  currency: string;
  createdAt: string; // ISO 8601 date format
  isPaid: boolean;
  isAnonymous: boolean;
}

const ListDonations: React.FC = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [filteredDonations, setFilteredDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const pageSize = 20;

  const fetchDonations = async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await axios.get('/api/Donation', {
        params: { pageNumber, pageSize },
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
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

  // Filter donations by search query
  useEffect(() => {
    let filtered = donations;

    // Filter by search query
    if (searchQuery.trim()) {
      const lowercasedQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (donation) =>
          donation.id.toString().includes(lowercasedQuery) ||
          donation.paymentId.toLowerCase().includes(lowercasedQuery) ||
          (donation.firstName + ' ' + donation.lastName)
            .toLowerCase()
            .includes(lowercasedQuery)
      );
    }

    // Filter by date range
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

  // Generate CSV file
  const handleDownloadCSV = () => {
    const csvData = filteredDonations.map((donation) => ({
      id: donation.id,
      userName: donation.userName,
      fullName: donation.isAnonymous
        ? 'Anonymous'
        : `${donation.firstName} ${donation.lastName}`,
      paymentId: donation.paymentId,
      amount: donation.amount,
      currency: donation.currency,
      date: format(new Date(donation.createdAt), 'yyyy-MM-dd'),
      isPaid: donation.isPaid ? 'Yes' : 'No',
      isAnonymous: donation.isAnonymous ? 'Yes' : 'No',
    }));

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'ID,Username,Full Name,Payment ID,Amount,Currency,Date,Paid,Anonymous',
        ...csvData.map((row) =>
          [
            row.id,
            row.userName,
            row.fullName,
            row.paymentId,
            row.amount,
            row.currency,
            row.date,
            row.isPaid,
            row.isAnonymous,
          ].join(',')
        ),
      ].join('\n');

    const blob = new Blob([decodeURIComponent(encodeURI(csvContent))], {
      type: 'text/csv;charset=utf-8;',
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
        Donations
      </Typography>

      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          placeholder="Search by reference, payment ID, or donor name"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          variant="outlined"
          fullWidth
        />
        <TextField
          label="Start Date"
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          label="End Date"
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
        />
        <Button
          variant="contained"
          onClick={handleDownloadCSV}
          sx={{ textTransform: 'none' }}
        >
          Download CSV
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Reference No</TableCell>
              <TableCell>Payment ID</TableCell>
              <TableCell>Donor Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Currency</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>Anonymous</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredDonations.length > 0 ? (
              filteredDonations.map((donation) => (
                <TableRow key={donation.paymentId}>
                  <TableCell>{donation.id}</TableCell>
                  <TableCell>{donation.paymentId}</TableCell>
                  <TableCell>
                    {donation.isAnonymous
                      ? 'Anonymous'
                      : `${donation.firstName} ${donation.lastName}`}
                  </TableCell>
                  <TableCell>{donation.amount}</TableCell>
                  <TableCell>{donation.currency}</TableCell>
                  <TableCell>
                    {new Date(donation.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={donation.isPaid ? 'Yes' : 'No'}
                      color={donation.isPaid ? 'success' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={donation.isAnonymous ? 'Yes' : 'No'}
                      color={donation.isAnonymous ? 'info' : 'default'}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  No donations found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={handlePageChange}
          color="primary"
        />
      </Box>
    </Box>
  );
};

export default ListDonations;
