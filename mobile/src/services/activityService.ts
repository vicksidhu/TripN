import {
  get,
  post,
  put,
  remove,
} from './api';

export type Activity = {
  _id: string;
  user: string;
  trip: string;

  title: string;
  date: string;
  time: string;
  location: string;
  notes: string;

  createdAt: string;
  updatedAt: string;
};

export type ActivityData = {
  title: string;
  date: string;
  time?: string;
  location?: string;
  notes?: string;
};

export async function getActivities(
  tripId: string,
  token: string
): Promise<Activity[]> {
  return get<Activity[]>(
    `/api/trips/${tripId}/activities`,
    token
  );
}

export async function createActivity(
  tripId: string,
  data: ActivityData,
  token: string
): Promise<Activity> {
  return post<Activity>(
    `/api/trips/${tripId}/activities`,
    data,
    token
  );
}

export async function deleteActivity(
  tripId: string,
  activityId: string,
  token: string
): Promise<{ message: string }> {
  return remove<{ message: string }>(
    `/api/trips/${tripId}/activities/${activityId}`,
    token
  );
}

export async function updateActivity(
  tripId: string,
  activityId: string,
  data: Partial<ActivityData>,
  token: string
): Promise<Activity> {
  return put<Activity>(
    `/api/trips/${tripId}/activities/${activityId}`,
    data,
    token
  );
}