import useSWR from 'swr';
import axios from 'axios';

export const endpoints = {
  getEvents: '/api/Event/adminevents'
};

export const fetcher = (url: string) =>
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}` // Ensure the token is set in localStorage
      }
    })
    .then((res) => res.data);

export function useGetEvents() {
  const { data, error, isValidating } = useSWR(endpoints.getEvents, fetcher);

  const formattedEvents = data?.map((event: any) => ({
    id: event.eventId,
    title: event.eventName,
    start: `${event.startDate}T${event.startTime}`,
    end: `${event.endDate}T${event.endTime}`,
    allDay: false,
    extendedProps: {
      description: event.eventDescription,
      location: event.location,
      packages: event.packages
    }
  }));

  return {
    events: formattedEvents || [],
    isLoading: !data && !error,
    isError: !!error,
    isValidating
  };
}
