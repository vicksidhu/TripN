import { useRouter } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing } from '@/constants/theme';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.logo}>TripN</Text>

          <Text style={styles.title}>Plan your next adventure</Text>

          <Text style={styles.subtitle}>
            Plan trips, organize your itinerary, track your budget, and keep
            everything in one place.
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.navigate('/register')}
          >
            <Text style={styles.primaryButtonText}>Create Account</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.secondaryButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.navigate('/login')}
          >
            <Text style={styles.secondaryButtonText}>Log In</Text>
          </Pressable>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
  },

  header: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    marginBottom: Spacing.five,
  },

  logo: {
    fontFamily: Fonts.headingBold,
    fontSize: 52,
    color: Colors.light.primary,
    marginBottom: Spacing.three,
  },

  title: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 30,
    color: Colors.light.text,
    textAlign: 'center',
    marginBottom: Spacing.two,
  },

  subtitle: {
    fontFamily: Fonts.body,
    fontSize: 16,
    lineHeight: 24,
    color: Colors.light.textSecondary,
    textAlign: 'center',
  },

  actions: {
    width: '100%',
    maxWidth: 400,
    gap: Spacing.three,
  },

  primaryButton: {
    width: '100%',
    minHeight: 54,
    backgroundColor: Colors.light.primary,
    borderWidth: 1,
    borderColor: Colors.light.primary,
    borderRadius: 12,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },

  primaryButtonText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.light.white,
    textAlign: 'center',
  },

secondaryButton: {
  width: '100%',
  minHeight: 54,
  backgroundColor: Colors.light.accentPinkLight,
  borderWidth: 1,
  borderColor: Colors.light.accentPink,
  borderRadius: 12,
  paddingHorizontal: Spacing.four,
  alignItems: 'center',
  justifyContent: 'center',
},

  secondaryButtonText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.light.primary,
    textAlign: 'center',
  },

  buttonPressed: {
    opacity: 0.8,
  },
});