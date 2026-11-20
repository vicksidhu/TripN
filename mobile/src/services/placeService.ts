import {
    get,
    post,
    remove,
} from './api';

export type SavedPlace = {
    _id: string;
    user: string;
    trip: string | null;

    placeId: string;
    name: string;

    latitude: number;
    longitude: number;

    createdAt: string;
    updatedAt: string;
};

export type SavePlaceData = {
    placeId: string;
    name: string;
    latitude: number;
    longitude: number;
    trip?: string;
};

export async function getSavedPlaces(
    token: string
): Promise<SavedPlace[]> {
    return get<SavedPlace[]>(
        '/api/places',
        token
    );
}

export async function savePlace(
    data: SavePlaceData,
    token: string
): Promise<SavedPlace> {
    return post<SavedPlace>(
        '/api/places',
        data,
        token
    );
}

export async function removeSavedPlace(
    id: string,
    token: string
): Promise<{ message: string }> {
    return remove<{ message: string }>(
        `/api/places/${id}`,
        token
    );
}