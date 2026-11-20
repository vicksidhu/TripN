import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import {
  getTrips,
  type Trip,
} from '@/services/tripService';

export default function TripsScreen() {
  const router = useRouter();
  const { user, token } = useAuth();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTrips = useCallback(async () => {
    if (!token) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const data = await getTrips(token);
      setTrips(data);
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load trips.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useFocusEffect(
    useCallback(() => {
      void loadTrips();
    }, [loadTrips])
  );

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Welcome, {user?.name}
            </Text>

            <Text style={styles.title}>My Trips</Text>
          </View>

          <Pressable
            style={styles.addButton}
            onPress={() =>
              router.push({
                pathname: '/trips/create',
              })
            }
          >
            <Text style={styles.addButtonText}>+ Trip</Text>
          </Pressable>
        </View>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            color={Colors.light.primary}
          />
        ) : error ? (
          <Text style={styles.error}>{error}</Text>
        ) : (
          <FlatList
            data={trips}
            keyExtractor={(trip) => trip._id}
            contentContainerStyle={
              trips.length === 0
                ? styles.emptyContainer
                : styles.list
            }
            ListEmptyComponent={
              <View style={styles.emptyContent}>
                <Text style={styles.emptyTitle}>
                  No trips yet
                </Text>

                <Text style={styles.emptyText}>
                  Create your first trip and start planning
                  your next adventure.
                </Text>
              </View>
            }
            renderItem={({ item }) => (
              <Pressable
                style={({ pressed }) => [
                  styles.tripCard,
                  pressed && styles.cardPressed,
                ]}
                onPress={() =>
                  router.push({
                    pathname: '/trips/[id]',
                    params: {
                      id: item._id,
                    },
                  })
                }
              >
                <Text style={styles.tripName}>
                  {item.name}
                </Text>

                <Text style={styles.destination}>
                  {item.destination}
                </Text>

                <Text style={styles.dates}>
                  {formatDate(item.startDate)} -{' '}
                  {formatDate(item.endDate)}
                </Text>
              </Pressable>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },

  content: {
    flex: 1,
    padding: Spacing.four,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.four,
  },

  greeting: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    color: Colors.light.textSecondary,
  },

  title: {
    fontFamily: Fonts.headingBold,
    fontSize: 36,
    color: Colors.light.text,
  },

  addButton: {
    backgroundColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },

  addButtonText: {
    fontFamily: Fonts.bodySemiBold,
    color: Colors.light.white,
    fontSize: 15,
  },

  list: {
    gap: Spacing.three,
    paddingBottom: Spacing.four,
  },

  tripCard: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 16,
    padding: Spacing.four,
  },

  cardPressed: {
    opacity: 0.8,
  },

  tripName: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 26,
    color: Colors.light.text,
  },

  destination: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 16,
    color: Colors.light.primary,
    marginTop: Spacing.one,
  },

  dates: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: Spacing.two,
  },

  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },

  emptyContent: {
    alignItems: 'center',
  },

  emptyTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 28,
    color: Colors.light.text,
  },

  emptyText: {
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.light.textSecondary,
    textAlign: 'center',
    marginTop: Spacing.two,
  },

  error: {
    fontFamily: Fonts.bodyMedium,
    color: Colors.light.primary,
    textAlign: 'center',
  },
});