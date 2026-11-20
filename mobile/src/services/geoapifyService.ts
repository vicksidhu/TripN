export type GeoapifyPlace = {
    place_id: string;
    formatted: string;
    lat: number;
    lon: number;
    city?: string;
    country?: string;
    result_type?: string;
};

type GeoapifyResponse = {
    results: GeoapifyPlace[];
};

export async function searchPlaces(
    query: string
): Promise<GeoapifyPlace[]> {
    const apiKey =
        process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;

    if (!apiKey) {
        throw new Error(
            'Geoapify API key is not configured.'
        );
    }

    const url =
        'https://api.geoapify.com/v1/geocode/autocomplete' +
        `?text=${encodeURIComponent(query)}` +
        '&format=json' +
        '&limit=5' +
        `&apiKey=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            'Unable to search for places.'
        );
    }

    const data =
        (await response.json()) as GeoapifyResponse;

    return data.results ?? [];
}