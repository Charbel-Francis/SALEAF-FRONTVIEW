// EventRegistration.tsx

import React, { useEffect, useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios'; // Corrected import
import { SelectChangeEvent } from '@mui/material'; // Import SelectChangeEvent

// Material-UI Components
import {
  Grid,
  Stack,
  Button,
  TextField,
  InputLabel,
  Typography,
  CircularProgress,
  Backdrop,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Pagination,
  Select,
  MenuItem,
  FormControl,
  InputAdornment
} from '@mui/material';

// Icons
import { Search } from '@mui/icons-material';

// Auth Hook
import useAuth from 'hooks/useAuth';

// Types (Assuming TypeScript)
interface EventRegistration {
  id: string; // Ensure your API provides a unique 'id' for each registration
  userName: string;
  firstName: string;
  lastName: string;
  paymentId: string;
  eventName: string;
  registrationDate: string;
  pacakageName: string; // Corrected typo from 'pacakageName' to 'packageName'
  amount: number;
  isPaid: boolean;
}

interface ApiResponse {
  totalItems: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  data: EventRegistration[];
}

const EventRegistrationList: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  // State variables with explicit types
  const [registrations, setRegistrations] = useState<EventRegistration[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState<string>('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get<ApiResponse>(`/EventRegistration?pageNumber=${pageNumber}&pageSize=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log(response.data);
        if (response.status === 200) {
          setRegistrations(response.data.data);
          setTotalItems(response.data.totalItems);
          setTotalPages(response.data.totalPages);
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err: unknown) {
        console.error('Error fetching event registrations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRegistrations();
  }, [pageNumber, pageSize, searchQuery, token]);

  // Handler for page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  // Handler for page size change
  const handlePageSizeChange = (event: SelectChangeEvent<string>) => {
    // Corrected type
    setPageSize(Number(event.target.value)); // Convert string to number
    setPageNumber(1); // Reset to first page when page size changes
  };

  // Handler for search input change
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
    setPageNumber(1); // Reset to first page on new search
  };

  // Handler to view registration details
  const handleViewDetails = (id: string) => {
    navigate(`/event-registration/details/${id}`);
  };

  return (
    <>
      {/* Loading Backdrop */}
      <Backdrop
        open={loading}
        sx={{
          color: '#fff',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={3} sx={{ padding: '20px' }}>
        {/* Header and Add Button */}
        <Grid item xs={12}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4">Event Registrations</Typography>
            {/* You can add an "Add" button here if needed */}
          </Stack>
        </Grid>

        {/* Search Bar */}
        <Grid item xs={12}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Search by name, email, or event"
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              )
            }}
          />
        </Grid>

        {/* Registrations Table */}
        <Grid item xs={12}>
          {error ? (
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          ) : registrations.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="event registrations table">
                <TableHead>
                  <TableRow>
                    <TableCell>Registrant Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Event Name</TableCell>
                    <TableCell>Registration Date</TableCell>
                    <TableCell>Package Name</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Payment Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {registrations.map((registration) => (
                    <TableRow key={registration.id}>
                      <TableCell>{`${registration.firstName} ${registration.lastName}`}</TableCell>
                      <TableCell>{registration.userName}</TableCell>
                      <TableCell>{registration.eventName}</TableCell>
                      <TableCell>{new Date(registration.registrationDate).toLocaleDateString()}</TableCell>
                      <TableCell>{registration.pacakageName}</TableCell>
                      <TableCell>{`R ${registration.amount.toFixed(2)}`}</TableCell>
                      <TableCell>
                        {registration.isPaid ? <Typography color="green">Paid</Typography> : <Typography color="red">Unpaid</Typography>}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6">No event registrations found.</Typography>
          )}
        </Grid>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <Grid item xs={12}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormControl variant="outlined" size="small">
                <InputLabel id="page-size-label">Items per page</InputLabel>
                <Select
                  labelId="page-size-label"
                  id="page-size-select"
                  value={pageSize.toString()} // Ensure the value is a string
                  onChange={handlePageSizeChange}
                  label="Items per page"
                >
                  <MenuItem value="5">5</MenuItem>
                  <MenuItem value="10">10</MenuItem>
                  <MenuItem value="20">20</MenuItem>
                  <MenuItem value="50">50</MenuItem>
                </Select>
              </FormControl>

              <Pagination count={totalPages} page={pageNumber} onChange={handlePageChange} color="primary" />
            </Stack>
          </Grid>
        )}
      </Grid>
    </>
  );
};

export default EventRegistrationList;
