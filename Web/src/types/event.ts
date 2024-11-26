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
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  publish: boolean;
  eventImageUrl: string | null;
  status: string;
  packages: Package[];
  capacity: number;
}
