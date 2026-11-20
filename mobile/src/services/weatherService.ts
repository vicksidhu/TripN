export type WeatherData = {
    location: string;
    temperature: number;
    feelsLike: number;
    description: string;
    humidity: number;
    windSpeed: number;
};

type OpenWeatherResponse = {
    name: string;

    main: {
        temp: number;
        feels_like: number;
        humidity: number;
    };

    weather: {
        description: string;
    }[];

    wind: {
        speed: number;
    };
};

export async function getWeather(
    latitude: number,
    longitude: number
): Promise<WeatherData> {
    const apiKey =
        process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY;

    if (!apiKey) {
        throw new Error(
            'OpenWeather API key is not configured.'
        );
    }

    const url =
        'https://api.openweathermap.org/data/2.5/weather' +
        `?lat=${latitude}` +
        `&lon=${longitude}` +
        '&units=metric' +
        `&appid=${encodeURIComponent(apiKey)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            'Unable to load weather information.'
        );
    }

    const data =
        (await response.json()) as OpenWeatherResponse;

    return {
        location: data.name,
        temperature: data.main.temp,
        feelsLike: data.main.feels_like,
        description:
            data.weather[0]?.description ?? 'Unknown',
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
    };
}
