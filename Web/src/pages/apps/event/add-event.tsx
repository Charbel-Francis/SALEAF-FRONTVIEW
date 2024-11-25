import { useState, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'utils/axios'; // Ensure axios is configured with baseURL and headers

// material-ui
import { useTheme } from '@mui/material/styles';
import { Grid, Stack, Button, TextField, InputLabel, InputAdornment, FormHelperText, Typography } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

// icons from iconsax-react (same as AddEventForm)
import { Calendar, DocumentUpload } from 'iconsax-react';

// auth hook
import useAuth from 'hooks/useAuth'; // To fetch the token

// types
import { Event, Package } from 'types/event';

interface AddEventProps {
  isEdit?: boolean;
  eventData?: Event;
}

interface AddEventProps {
  isEdit?: boolean;
  eventData?: Event;
}

const AddEvent = ({ isEdit = false, eventData }: AddEventProps) => {
  const theme = useTheme();
  const { token } = useAuth();
  const navigate = useNavigate();

  // Initialize state with eventData if in edit mode
  const [eventName, setEventName] = useState(isEdit ? eventData?.eventName || '' : '');
  const [eventDescription, setEventDescription] = useState(isEdit ? eventData?.eventDescription || '' : '');
  const [location, setLocation] = useState(isEdit ? eventData?.location || '' : '');
  const [startDateTime, setStartDateTime] = useState(isEdit ? eventData?.startDateTime || '' : '');
  const [endDateTime, setEndDateTime] = useState(isEdit ? eventData?.endDateTime || '' : '');
  const [publish, setPublish] = useState(isEdit ? eventData?.publish || true : true);
  const [status, setStatus] = useState<Event['status']>(isEdit ? eventData?.status || 'upcoming' : 'upcoming');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [packages, setPackages] = useState<Package[]>(
    isEdit
      ? eventData?.packages || [{ packageName: '', packagePrice: 1, packageDescription: null }]
      : [{ packageName: '', packagePrice: 1, packageDescription: null }]
  );
  const [capacity, setCapacity] = useState<number>(isEdit ? eventData?.capacity || 0 : 0);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImageFile(event.target.files[0]);
    }
  };

  const handlePackageChange = (index: number, field: string, value: string | number) => {
    const updatedPackages = [...packages];
    updatedPackages[index] = { ...updatedPackages[index], [field]: value };
    setPackages(updatedPackages);
  };

  const addPackage = () => {
    setPackages([...packages, { packageName: '', packagePrice: 1, packageDescription: null }]);
  };

  const removePackage = (index: number) => {
    const updatedPackages = packages.filter((_, i) => i !== index);
    setPackages(updatedPackages);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append('EventName', eventName);
      formData.append('EventDescription', eventDescription);
      formData.append('Location', location);
      formData.append('StartDateTime', startDateTime);
      formData.append('EndDateTime', endDateTime);
      formData.append('Publish', publish.toString());
      formData.append('Capacity', capacity.toString());

      if (imageFile) {
        formData.append('EventImageFile', imageFile);
      }

      packages.forEach((pkg, index) => {
        formData.append(`Packages[${index}].packageName`, pkg.packageName);
        formData.append(`Packages[${index}].packagePrice`, pkg.packagePrice.toString());
        formData.append(`Packages[${index}].packageDescription`, pkg.packageDescription || '');
      });

      let response;
      if (isEdit && eventData) {
        // Ensure eventId is a number
        const eventId = typeof eventData.eventId === 'string' ? parseInt(eventData.eventId, 10) : eventData.eventId;

        console.log('Updating event with ID:', eventId); // Debug log

        response = await axios.put(`/api/Event/${eventId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        response = await axios.post('/api/Event', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`
          }
        });
      }

      if (response.status === 200) {
        navigate('/apps/event/event-list');
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Stack spacing={1}>
            <InputLabel htmlFor="event-name">Event Name</InputLabel>
            <TextField
              fullWidth
              id="event-name"
              placeholder="Enter event name"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
            />
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <InputLabel htmlFor="event-description">Description</InputLabel>
            <TextField
              fullWidth
              id="event-description"
              multiline
              rows={3}
              placeholder="Enter event description"
              value={eventDescription}
              onChange={(e) => setEventDescription(e.target.value)}
            />
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <InputLabel htmlFor="event-location">Location</InputLabel>
            <TextField
              fullWidth
              id="event-location"
              placeholder="Enter location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <InputLabel htmlFor="start-date">Start Date/Time</InputLabel>
            <MobileDateTimePicker
              value={startDateTime ? new Date(startDateTime) : null}
              format="dd/MM/yyyy hh:mm a"
              onChange={(date) => setStartDateTime(date ? date.toISOString() : '')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                        <Calendar />
                      </InputAdornment>
                    )
                  }
                }
              }}
            />
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <InputLabel htmlFor="end-date">End Date/Time</InputLabel>
            <MobileDateTimePicker
              value={endDateTime ? new Date(endDateTime) : null}
              format="dd/MM/yyyy hh:mm a"
              onChange={(date) => setEndDateTime(date ? date.toISOString() : '')}
              slotProps={{
                textField: {
                  fullWidth: true,
                  InputProps: {
                    endAdornment: (
                      <InputAdornment position="end" sx={{ cursor: 'pointer' }}>
                        <Calendar />
                      </InputAdornment>
                    )
                  }
                }
              }}
            />
          </Stack>

          <Stack spacing={1} sx={{ mt: 2 }}>
            <InputLabel htmlFor="capacity">Capacity</InputLabel>
            <TextField
              fullWidth
              id="capacity"
              type="number"
              placeholder="Enter event capacity"
              value={capacity}
              onChange={(e) => setCapacity(Number(e.target.value))}
            />
          </Stack>
        </Grid>

        <Grid item xs={12} sm={6}>
          <Stack spacing={1}>
            <InputLabel>Event Image</InputLabel>
            <Button variant="outlined" component="label" startIcon={<DocumentUpload />} sx={{ textTransform: 'none' }}>
              Upload Image
              <input type="file" accept="image/*" hidden onChange={handleFileChange} />
            </Button>
            {imageFile && (
              <Typography variant="subtitle2" sx={{ mt: 1 }}>
                {imageFile.name}
              </Typography>
            )}
          </Stack>
        </Grid>

        <Grid item xs={12}>
          <InputLabel>Packages</InputLabel>
          {packages.map((pkg, index) => (
            <Grid container key={index} spacing={1}>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  value={pkg.packageName}
                  onChange={(e) => handlePackageChange(index, 'packageName', e.target.value)}
                  placeholder="Package Name"
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  fullWidth
                  type="number"
                  value={pkg.packagePrice}
                  onChange={(e) => handlePackageChange(index, 'packagePrice', Number(e.target.value))}
                  placeholder="Package Price"
                />
              </Grid>
              <Grid item xs={12}>
                <Button variant="outlined" style={{ marginBottom: '10px' }} color="error" onClick={() => removePackage(index)}>
                  Remove Package
                </Button>
              </Grid>
            </Grid>
          ))}
          <Button variant="contained" style={{ marginTop: '10px' }} onClick={addPackage}>
            Add Package
          </Button>
        </Grid>

        <Grid item xs={12}>
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button color="error" onClick={() => navigate('/apps/event/event-list')}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              {isEdit ? 'Update Event' : 'Submit Event'}
            </Button>
          </Stack>
        </Grid>
      </Grid>
    </LocalizationProvider>
  );
};

export default AddEvent;
