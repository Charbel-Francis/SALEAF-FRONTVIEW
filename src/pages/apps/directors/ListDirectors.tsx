import { useEffect, useState, ChangeEvent } from 'react';
import axios from 'utils/axios'; // Ensure axios is configured with baseURL and headers

// material-ui
import {
  Box,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  CircularProgress,
  Stack,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

// Define types
interface Director {
  directorId: number;
  directorName: string;
  directorLastName: string;
  directorImage: string;
  directorDescription: string;
}

const ListDirectors: React.FC = () => {
  const [directors, setDirectors] = useState<Director[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [updateLoading, setUpdateLoading] = useState<boolean>(false); // Loading state for update
  const [editingDirector, setEditingDirector] = useState<Director | null>(null);
  const [deleteDirectorId, setDeleteDirectorId] = useState<number | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    const fetchDirectors = async () => {
      try {
        const response = await axios.get<Director[]>('/api/Director/get-all-director');
        setDirectors(response.data);
      } catch (error) {
        console.error('Error fetching directors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDirectors();
  }, []);

  const handleDelete = async () => {
    if (deleteDirectorId === null) return;

    try {
      const response = await axios.delete(`/api/Director/${deleteDirectorId}`);
      if (response.status === 200) {
        setDirectors((prev) => prev.filter((dir) => dir.directorId !== deleteDirectorId));
        setDeleteDirectorId(null);
      }
    } catch (error) {
      console.error('Error deleting director:', error);
    }
  };

  const handleSaveChanges = async () => {
    if (!editingDirector) return;

    setUpdateLoading(true); // Start loading for update
    try {
      const formData = new FormData();
      formData.append('DirectorName', editingDirector.directorName);
      formData.append('DirectorLastName', editingDirector.directorLastName);
      formData.append('DirectorDescription', editingDirector.directorDescription);

      if (imageFile) {
        formData.append('DirectorImage', imageFile);
      }

      const response = await axios.put(
        `/api/Director/update-director/${editingDirector.directorId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.status === 200) {
        // Update the directors list with the new data
        setDirectors((prev) =>
          prev.map((dir) =>
            dir.directorId === editingDirector.directorId ? { ...editingDirector } : dir
          )
        );
        setEditingDirector(null); // Close the editing form
        setImageFile(null); // Clear the file input
      }
    } catch (error) {
      console.error('Error updating director:', error);
    } finally {
      setUpdateLoading(false); // Stop loading for update
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFile(event.target.files[0]);
    }
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
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, p: 3 }}>
      {directors.map((director) => (
        <Card
          key={director.directorId}
          sx={{
            display: 'flex',
            alignItems: 'center',
            padding: 2,
            gap: 3,
          }}
        >
          <CardMedia
            component="img"
            image={director.directorImage}
            alt={`${director.directorName} ${director.directorLastName}`}
            sx={{
              width: 150,
              height: 150,
              borderRadius: '50%',
              objectFit: 'cover',
            }}
          />
          <CardContent>
            <Typography variant="h6" component="div">
              {director.directorName} {director.directorLastName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {director.directorDescription}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
              <Button variant="outlined" onClick={() => setEditingDirector(director)}>
                Edit
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => setDeleteDirectorId(director.directorId)}
              >
                Remove
              </Button>
            </Box>
          </CardContent>
        </Card>
      ))}

      {editingDirector && (
        <Box sx={{ p: 3, mt: 5, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6" mb={2}>
            Edit Director
          </Typography>
          <Stack spacing={2}>
            <TextField
              label="Director Name"
              fullWidth
              value={editingDirector.directorName}
              onChange={(e) =>
                setEditingDirector({ ...editingDirector, directorName: e.target.value })
              }
            />
            <TextField
              label="Director Last Name"
              fullWidth
              value={editingDirector.directorLastName}
              onChange={(e) =>
                setEditingDirector({ ...editingDirector, directorLastName: e.target.value })
              }
            />
            <TextField
              label="Director Description"
              fullWidth
              multiline
              rows={3}
              value={editingDirector.directorDescription}
              onChange={(e) =>
                setEditingDirector({ ...editingDirector, directorDescription: e.target.value })
              }
            />
            <Button variant="outlined" component="label">
              Upload New Image
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button color="error" onClick={() => setEditingDirector(null)}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSaveChanges} disabled={updateLoading}>
                {updateLoading ? <CircularProgress size={24} /> : 'Save Changes'}
              </Button>
            </Box>
          </Stack>
        </Box>
      )}

      <Dialog open={deleteDirectorId !== null} onClose={() => setDeleteDirectorId(null)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this director? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDirectorId(null)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleDelete} color="error">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ListDirectors;
