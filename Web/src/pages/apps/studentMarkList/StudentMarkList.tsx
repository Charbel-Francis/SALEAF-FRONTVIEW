// StudentMarkUploadList.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios'; // Corrected import
import { SelectChangeEvent } from '@mui/material'; // Import SelectChangeEvent

// Material-UI Components
import {
  Grid,
  Stack,
  Button,
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
  InputLabel
} from '@mui/material';

// Icons
import { Visibility } from '@mui/icons-material';

// Auth Hook
import useAuth from 'hooks/useAuth';

// Define interface for StudentMarkUpload
interface StudentMarkUpload {
  id: number;
  name: string;
  type: string;
  uploadDate: string; // ISO date string
  fileUrl: string;
}

const StudentMarkUploadList: React.FC = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  // State variables with explicit types
  const [uploads, setUploads] = useState<StudentMarkUpload[]>([]);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const fetchUploads = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`/api/StudentMarksUpload/uploads/paginated?page=${pageNumber}&pageSize=${pageSize}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          const data = response.data;
          setUploads(data.uploads as StudentMarkUpload[]);
          setTotalRecords(data.totalRecords as number);
          setTotalPages(data.totalPages as number);
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err: unknown) {
        console.error('Error fetching student mark uploads:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUploads();
  }, [pageNumber, pageSize, token]);

  // Handler for page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPageNumber(value);
  };

  // Handler for page size change
  const handlePageSizeChange = (event: SelectChangeEvent<string>) => {
    // Corrected type
    setPageSize(Number(event.target.value)); // Parse string to number
    setPageNumber(1);
  };

  // Handler to view file
  const handleViewFile = (fileUrl: string) => {
    window.open(fileUrl, '_blank');
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
            <Typography variant="h4">Student Mark Uploads</Typography>
            {/* You can add an "Add" button here if needed */}
          </Stack>
        </Grid>

        {/* Uploads Table */}
        <Grid item xs={12}>
          {error ? (
            <Typography color="error" variant="h6">
              {error}
            </Typography>
          ) : uploads.length > 0 ? (
            <TableContainer component={Paper}>
              <Table aria-label="student mark uploads table">
                <TableHead>
                  <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Upload Date</TableCell>
                    <TableCell>File</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {uploads.map((upload: StudentMarkUpload) => (
                    <TableRow key={upload.id}>
                      <TableCell>{upload.id}</TableCell>
                      <TableCell>{upload.name}</TableCell>
                      <TableCell>{upload.type}</TableCell>
                      <TableCell>{new Date(upload.uploadDate).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <Button variant="outlined" size="small" onClick={() => handleViewFile(upload.fileUrl)} startIcon={<Visibility />}>
                          View File
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <Typography variant="h6">No student mark uploads found.</Typography>
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

export default StudentMarkUploadList;
