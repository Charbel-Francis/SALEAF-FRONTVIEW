import { useLocation, useNavigate } from 'react-router-dom';
import { Stack, Typography, Button } from '@mui/material';
import AddEvent from './add-event';
import { Event } from 'types/event';

const EditEvent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const eventData = location.state?.eventData as Event;

  if (!eventData) {
    return (
      <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ minHeight: 200 }}>
        <Typography color="error">Event not found</Typography>
        <Button color="primary" onClick={() => navigate('/apps/event/event-list')}>
          Return to Event List
        </Button>
      </Stack>
    );
  }

  return <AddEvent isEdit={true} eventData={eventData} />;
};

export default EditEvent;
