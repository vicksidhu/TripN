import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormInput from '@/components/common/FormInput';
import PrimaryButton from '@/components/common/PrimaryButton';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';
import { createTrip } from '@/services/tripService';

export default function CreateTripScreen() {
  const router = useRouter();
  const { token } = useAuth();

  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    setError('');

    if (
      !name.trim() ||
      !destination.trim() ||
      !startDate ||
      !endDate
    ) {
      setError(
        'Name, destination, start date, and end date are required.'
      );
      return;
    }

    if (!token) {
      setError('Authentication required.');
      return;
    }

    try {
      setIsLoading(true);

      await createTrip(
        {
          name: name.trim(),
          destination: destination.trim(),
          startDate,
          endDate,
          description: description.trim(),
          budget: budget ? Number(budget) : 0,
        },
        token
      );

      router.navigate('/(tabs)/trips');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to create trip.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <Text
            style={styles.back}
            onPress={() => {
              router.navigate('/(tabs)/trips');
            }}
          >
            ‹ Back
          </Text>

          <Text style={styles.title}>Create Trip</Text>

          <View style={styles.form}>
            <FormInput
              label="Trip Name"
              placeholder="Japan 2027"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <FormInput
              label="Destination"
              placeholder="Tokyo, Japan"
              value={destination}
              onChangeText={setDestination}
              autoCapitalize="words"
            />

            <FormInput
              label="Start Date"
              placeholder="2027-03-10"
              value={startDate}
              onChangeText={setStartDate}
            />

            <FormInput
              label="End Date"
              placeholder="2027-03-20"
              value={endDate}
              onChangeText={setEndDate}
            />

            <View style={styles.field}>
              <Text style={styles.label}>
                Description
              </Text>

              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Notes about your trip"
                placeholderTextColor={
                  Colors.light.textSecondary
                }
                value={description}
                onChangeText={setDescription}
                multiline
              />
            </View>

            <FormInput
              label="Planned Budget"
              placeholder="3000"
              value={budget}
              onChangeText={setBudget}
              keyboardType="numeric"
            />

            {error ? (
              <Text style={styles.error}>{error}</Text>
            ) : null}

            <PrimaryButton
              title={
                isLoading
                  ? 'Creating Trip...'
                  : 'Create Trip'
              }
              onPress={handleCreate}
              disabled={isLoading}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
    maxWidth: 600,
    alignSelf: 'center',
    padding: Spacing.four,
  },

  back: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.light.primary,
    marginBottom: Spacing.three,
  },

  title: {
    fontFamily: Fonts.headingBold,
    fontSize: 36,
    color: Colors.light.text,
    marginBottom: Spacing.four,
  },

  form: {
    gap: Spacing.three,
  },

  field: {
    gap: Spacing.two,
  },

  label: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    color: Colors.light.text,
  },

  input: {
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

  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },

  error: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.light.primary,
    textAlign: 'center',
  },
});