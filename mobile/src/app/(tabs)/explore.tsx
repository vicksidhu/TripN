import { useEffect, useState } from 'react';

import { useAuth } from '@/context/AuthContext';

import {
  getSavedPlaces,
  removeSavedPlace,
  savePlace,
  type SavedPlace,
} from '@/services/placeService';

import {
  getWeather,
  type WeatherData,
} from '@/services/weatherService';

import {
  ActivityIndicator,
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import {
  searchPlaces,
  type GeoapifyPlace,
} from '@/services/geoapifyService';

export default function ExploreScreen() {
  const [query, setQuery] = useState('');
  const [results, setResults] =
    useState<GeoapifyPlace[]>([]);
  const [selectedPlace, setSelectedPlace] =
    useState<GeoapifyPlace | null>(null);

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] =
    useState(false);

  const [weather, setWeather] =
    useState<WeatherData | null>(null);

  const [weatherError, setWeatherError] =
    useState('');

  const [isLoadingWeather, setIsLoadingWeather] =
    useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');
      setSaveError('');
      setSelectedPlace(null);
      setWeather(null);
      setWeatherError('');
      setResults([]);

      const places = await searchPlaces(
        query.trim()
      );

      setResults(places);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to search for places.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPlace = (
    place: GeoapifyPlace
  ) => {
    setSelectedPlace(place);
    setResults([]);
    setQuery(place.formatted);

    setWeather(null);
    setWeatherError('');
    setSaveError('');
  };

  const { token } = useAuth();

  const [savedPlaces, setSavedPlaces] =
    useState<SavedPlace[]>([]);

  const [saveError, setSaveError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    const loadSavedPlaces = async () => {
      try {
        const places = await getSavedPlaces(token);
        setSavedPlaces(places);
      } catch (error) {
        setSaveError(
          error instanceof Error
            ? error.message
            : 'Unable to load saved places.'
        );
      }
    };

    void loadSavedPlaces();
  }, [token]);

  const handleSavePlace = async () => {
    if (!selectedPlace || !token) {
      return;
    }

    try {
      setIsSaving(true);
      setSaveError('');

      const saved = await savePlace(
        {
          placeId: selectedPlace.place_id,
          name: selectedPlace.formatted,
          latitude: selectedPlace.lat,
          longitude: selectedPlace.lon,
        },
        token
      );

      setSavedPlaces((current) => [
        saved,
        ...current,
      ]);
      setSelectedPlace(null);

      setQuery('');
      setResults([]);
      setWeather(null);
      setWeatherError('');
      setSaveError('');

    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Unable to save place.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemovePlace = async (
    placeId: string
  ) => {
    if (!token) {
      return;
    }

    try {
      setSaveError('');

      await removeSavedPlace(placeId, token);

      setSavedPlaces((current) =>
        current.filter(
          (place) => place._id !== placeId
        )
      );
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : 'Unable to remove saved place.'
      );
    }
  };

  const handleWeather = async () => {
    if (!selectedPlace) {
      return;
    }

    try {
      setIsLoadingWeather(true);
      setWeatherError('');

      const data = await getWeather(
        selectedPlace.lat,
        selectedPlace.lon
      );

      setWeather(data);
    } catch (error) {
      setWeatherError(
        error instanceof Error
          ? error.message
          : 'Unable to load weather.'
      );
    } finally {
      setIsLoadingWeather(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Explore</Text>

        <Text style={styles.subtitle}>
          Search for places and destinations for
          your next trip.
        </Text>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search a city or place"
            placeholderTextColor={
              Colors.light.textSecondary
            }
            returnKeyType="search"
            onSubmitEditing={handleSearch}
          />

          <Pressable
            style={({ pressed }) => [
              styles.searchButton,
              pressed && styles.pressed,
            ]}
            onPress={handleSearch}
          >
            <Text style={styles.searchButtonText}>
              Search
            </Text>
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator
            color={Colors.light.primary}
            style={styles.loader}
          />
        ) : null}

        {error ? (
          <Text style={styles.error}>
            {error}
          </Text>
        ) : null}

        {results.length > 0 ? (
          <View style={styles.results}>
            {results.map((item) => (
              <Pressable
                key={item.place_id}
                style={({ pressed }) => [
                  styles.resultCard,
                  pressed && styles.pressed,
                ]}
                onPress={() =>
                  handleSelectPlace(item)
                }
              >
                <Text style={styles.placeName}>
                  {item.formatted}
                </Text>

                <Text style={styles.coordinates}>
                  {item.lat.toFixed(4)},{' '}
                  {item.lon.toFixed(4)}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : null}

        {selectedPlace ? (
          <View style={styles.selectedCard}>
            <Text style={styles.selectedLabel}>
              Selected Place
            </Text>

            <Text style={styles.selectedName}>
              {selectedPlace.formatted}
            </Text>

            <Text style={styles.coordinates}>
              {selectedPlace.lat.toFixed(4)},{' '}
              {selectedPlace.lon.toFixed(4)}
            </Text>
            <Pressable
              style={({ pressed }) => [
                styles.saveButton,
                pressed && styles.pressed,
              ]}
              onPress={handleSavePlace}
              disabled={isSaving}
            >
              <Text style={styles.saveButtonText}>
                {isSaving ? 'Saving...' : 'Save Place'}
              </Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                styles.weatherButton,
                pressed && styles.pressed,
              ]}
              onPress={handleWeather}
              disabled={isLoadingWeather}
            >
              <Text style={styles.weatherButtonText}>
                {isLoadingWeather
                  ? 'Loading Weather...'
                  : 'View Weather'}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {weatherError ? (
          <Text style={styles.error}>
            {weatherError}
          </Text>
        ) : null}

        {weather ? (
          <View style={styles.weatherCard}>
            <Text style={styles.weatherTitle}>
              Weather in {weather.location}
            </Text>

            <Text style={styles.temperature}>
              {Math.round(weather.temperature)}°C
            </Text>

            <Text style={styles.weatherDescription}>
              {weather.description}
            </Text>

            <View style={styles.weatherDetails}>
              <Text style={styles.weatherDetail}>
                Feels like{' '}
                {Math.round(weather.feelsLike)}°C
              </Text>

              <Text style={styles.weatherDetail}>
                Humidity {weather.humidity}%
              </Text>

              <Text style={styles.weatherDetail}>
                Wind {weather.windSpeed.toFixed(1)} m/s
              </Text>
            </View>
          </View>
        ) : null}

        {saveError ? (
          <Text style={styles.error}>{saveError}</Text>
        ) : null}

        <View style={styles.savedSection}>
          <Text style={styles.savedTitle}>
            Saved Places
          </Text>

          {savedPlaces.length === 0 ? (
            <Text style={styles.emptyText}>
              No saved places yet.
            </Text>
          ) : (
            <View style={styles.savedList}>
              {savedPlaces.map((place) => (
                <View
                  key={place._id}
                  style={styles.savedCard}
                >
                  <View style={styles.savedInfo}>
                    <Text style={styles.savedName}>
                      {place.name}
                    </Text>

                    <Text style={styles.coordinates}>
                      {place.latitude.toFixed(4)},{' '}
                      {place.longitude.toFixed(4)}
                    </Text>
                  </View>

                  <Pressable
                    onPress={() =>
                      void handleRemovePlace(place._id)
                    }
                  >
                    <Text style={styles.removeText}>
                      Remove
                    </Text>
                  </Pressable>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  content: {
    width: '100%',
    maxWidth: 700,
    alignSelf: 'center',
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },

  title: {
    fontFamily: Fonts.headingBold,
    fontSize: 36,
    color: Colors.light.text,
  },

  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.light.textSecondary,
    marginTop: Spacing.one,
    marginBottom: Spacing.four,
  },

  searchRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },

  searchInput: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.light.text,
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
  },

  searchButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
  },

  searchButtonText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: Colors.light.white,
  },

  loader: {
    marginTop: Spacing.four,
  },

  error: {
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.primary,
    marginTop: Spacing.three,
  },

  results: {
    gap: Spacing.two,
    paddingTop: Spacing.three,
  },

  resultCard: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: Spacing.three,
  },

  placeName: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    color: Colors.light.text,
  },

  coordinates: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: Spacing.one,
  },

  selectedCard: {
    backgroundColor:
      Colors.light.accentPinkLight,
    borderWidth: 1,
    borderColor: Colors.light.accentPink,
    borderRadius: 12,
    padding: Spacing.four,
    marginTop: Spacing.four,
  },

  selectedLabel: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.light.primary,
    marginBottom: Spacing.one,
  },

  selectedName: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 24,
    color: Colors.light.text,
  },

  pressed: {
    opacity: 0.8,
  },

  saveButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.three,
  },

  saveButtonText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: Colors.light.white,
  },

  savedSection: {
    marginTop: Spacing.five,
  },

  savedTitle: {
    fontFamily: Fonts.headingBold,
    fontSize: 30,
    color: Colors.light.text,
    marginBottom: Spacing.three,
  },

  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.light.textSecondary,
  },

  savedList: {
    gap: Spacing.two,
  },

  savedCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.two,
  },

  savedInfo: {
    flex: 1,
  },

  savedName: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    color: Colors.light.text,
  },

  removeText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.light.primary,
  },

  weatherButton: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: Spacing.two,
  },

  weatherButtonText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 15,
    color: Colors.light.primary,
  },

  weatherCard: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: Spacing.four,
    marginTop: Spacing.four,
  },

  weatherTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 24,
    color: Colors.light.text,
  },

  temperature: {
    fontFamily: Fonts.headingBold,
    fontSize: 42,
    color: Colors.light.primary,
    marginTop: Spacing.two,
  },

  weatherDescription: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    color: Colors.light.text,
    textTransform: 'capitalize',
  },

  weatherDetails: {
    marginTop: Spacing.three,
    gap: Spacing.one,
  },

  weatherDetail: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.light.textSecondary,
  },

});