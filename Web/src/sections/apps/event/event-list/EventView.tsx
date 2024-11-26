import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Stack, Typography, Grid, Chip } from '@mui/material';
import { Event } from 'types/event';
import axios from 'utils/axios';
import MainCard from 'components/MainCard';
import { format } from 'date-fns';

interface EventViewProps {
  id: number;
}

const EventView = ({ id }: EventViewProps) => {
  const [event, setEvent] = useState<Event | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/Event/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setEvent(response.data);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    if (id) fetchEvent();
  }, [id]);

  if (!event) return null;

  return (
    <MainCard>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Stack spacing={2}>
            <Typography variant="h3">{event.eventName}</Typography>
            <Chip
              label={event.status}
              color={
                event.status === 'upcoming'
                  ? 'primary'
                  : event.status === 'ongoing'
                    ? 'success'
                    : event.status === 'completed'
                      ? 'default'
                      : 'error'
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Typography variant="body1">{event.eventDescription}</Typography>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Start Date</Typography>
            <Typography>{format(new Date(event.startDate), 'PPP')}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={6}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">End Date</Typography>
            <Typography>{format(new Date(event.endDate), 'PPP')}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12}>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Location</Typography>
            <Typography>{event.location}</Typography>
          </Stack>
        </Grid>
        {event.eventImageUrl && (
          <Grid item xs={12}>
            <img src={event.eventImageUrl} alt={event.eventName} style={{ maxWidth: '100%', height: 'auto' }} />
          </Grid>
        )}
      </Grid>
    </MainCard>
  );
};

export default EventView;
