export interface Package {
  packageName: string;
  packagePrice: number;
  packageDescription: string | null;
}

export interface Event {
  eventId: number;
  eventName: string;
  eventDescription: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  publish: boolean;
  eventImageUrl: string | null;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  packages: Package[];
  capacity: number;
} 