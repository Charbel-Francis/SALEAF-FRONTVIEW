import { useState, ChangeEvent, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'utils/axios';

// material-ui
import {
  Grid,
  Stack,
  Button,
  TextField,
  InputLabel,
  Typography,
  CircularProgress,
  Backdrop,
} from '@mui/material';

// icons
import { DocumentUpload } from 'iconsax-react';

// auth hook
import useAuth from 'hooks/useAuth';

const AddOrUpdateDirector = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [directorName, setDirectorName] = useState('');
  const [directorLastName, setDirectorLastName] = useState('');
  const [directorDescription, setDirectorDescription] = useState('');
  const [directorImage, setDirectorImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch existing director data if ID is provided (for update)
  useEffect(() => {
    if (id) {
      const fetchDirector = async () => {
        setLoading(true);
        try {
          const response = await axios.get(`/api/Director/get-director-by-id/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.data) {
            setDirectorName(response.data.directorName);
            setDirectorLastName(response.data.directorLastName);
            setDirectorDescription(response.data.directorDescription);
          }
        } catch (error) {
          console.error('Error fetching director:', error);
          alert('Failed to fetch director data.');
        } finally {
          setLoading(false);
        }
      };

      fetchDirector();
    }
  }, [id, token]);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setDirectorImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      formData.append('DirectorName', directorName);
      formData.append('DirectorLastName', directorLastName);
      formData.append('DirectorDescription', directorDescription);

      if (directorImage) {
        formData.append('DirectorImage', directorImage);
      }

      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };

      let response;
      if (id) {
        // Use POST method with method override
        formData.append('_method', 'PUT');
        response = await axios.post(`/api/Director/update-director/${id}`, formData, config);
      } else {
        response = await axios.post('/api/Director/add-director', formData, config);
      }

      if (response.status === 200) {
        navigate('/apps/directors/list-directors');
      } else {
        console.error('Unexpected response:', response);
        alert('An unexpected error occurred.');
      }
    } catch (error) {
      console.error(`Error ${id ? 'updating' : 'adding'} director:`, error);
      alert(`Failed to ${id ? 'update' : 'add'} director. Please try again.`);
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
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={1}>
            <InputLabel htmlFor="director-name">Director Name</InputLabel>
            <TextField
              fullWidth
              id="director-name"
              placeholder="Enter director's first name"
              value={directorName}
              onChange={(e) => setDirectorName(e.target.value)}
            />
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <InputLabel htmlFor="director-lastname">Director Last Name</InputLabel>
            <TextField
              fullWidth
              id="director-lastname"
              placeholder="Enter director's last name"
              value={directorLastName}
              onChange={(e) => setDirectorLastName(e.target.value)}
            />
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <InputLabel htmlFor="director-description">Director Description</InputLabel>
            <TextField
              fullWidth
              id="director-description"
              multiline
              rows={3}
              placeholder="Enter director's description"
              value={directorDescription}
              onChange={(e) => setDirectorDescription(e.target.value)}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack spacing={1}>
            <InputLabel>Director Image</InputLabel>
            <Button
              variant="outlined"
              component="label"
              startIcon={<DocumentUpload />}
              sx={{ textTransform: 'none' }}
            >
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            {directorImage && (
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                {directorImage.name}
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              color="error"
              onClick={() => navigate('/apps/directors/list-directors')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} disabled={loading}>
              {loading
                ? id
                  ? 'Updating...'
                  : 'Submitting...'
                : id
                ? 'Update Director'
                : 'Submit Director'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </>
  );
};

export default AddOrUpdateDirector;
