import {
  get,
  post,
  put,
  remove,
} from './api';

export type Trip = {
  _id: string;
  user: string;

  name: string;
  destination: string;

  startDate: string;
  endDate: string;

  description: string;
  budget: number;

  createdAt: string;
  updatedAt: string;
};

export type TripData = {
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  description?: string;
  budget?: number;
};

export async function getTrips(
  token: string
): Promise<Trip[]> {
  return get<Trip[]>('/api/trips', token);
}

export async function getTrip(
  id: string,
  token: string
): Promise<Trip> {
  return get<Trip>(`/api/trips/${id}`, token);
}

export async function createTrip(
  data: TripData,
  token: string
): Promise<Trip> {
  return post<Trip>(
    '/api/trips',
    data,
    token
  );
}

export async function updateTrip(
  id: string,
  data: Partial<TripData>,
  token: string
): Promise<Trip> {
  return put<Trip>(
    `/api/trips/${id}`,
    data,
    token
  );
}

export async function deleteTrip(
  id: string,
  token: string
): Promise<{ message: string }> {
  return remove<{ message: string }>(
    `/api/trips/${id}`,
    token
  );
}