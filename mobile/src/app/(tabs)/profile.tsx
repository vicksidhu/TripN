import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Profile</Text>

        <View style={styles.card}>
          <Text style={styles.name}>{user?.name}</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={signOut}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
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

  title: {
    fontFamily: Fonts.headingBold,
    fontSize: 36,
    color: Colors.light.text,
    marginBottom: Spacing.four,
  },

  card: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: Spacing.four,
    marginBottom: Spacing.four,
  },

  name: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 26,
    color: Colors.light.text,
    marginBottom: Spacing.one,
  },

  email: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.light.textSecondary,
  },

  logoutButton: {
    backgroundColor: Colors.light.accentPinkLight,
    borderWidth: 1,
    borderColor: Colors.light.accentPink,
    borderRadius: 12,
    minHeight: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.light.primary,
  },

  buttonPressed: {
    opacity: 0.8,
  },
});