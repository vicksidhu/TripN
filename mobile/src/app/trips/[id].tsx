import {
  useFocusEffect,
  useLocalSearchParams,
  useRouter,
} from 'expo-router';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
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

import {
  createActivity,
  deleteActivity,
  getActivities,
  updateActivity,
  type Activity,
} from '@/services/activityService';

import {
  deleteTrip,
  getTrip,
  updateTrip,
} from '@/services/tripService';

import {
  createExpense,
  deleteExpense,
  getExpenses,
  type Expense,
} from '@/services/expenseService';

export default function TripDetailsScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();

  // Trip state
  const [name, setName] = useState('');
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Itinerary state
  const [activities, setActivities] = useState<Activity[]>([]);

  const [activityTitle, setActivityTitle] = useState('');
  const [activityDate, setActivityDate] = useState('');
  const [activityTime, setActivityTime] = useState('');
  const [activityLocation, setActivityLocation] = useState('');
  const [activityNotes, setActivityNotes] = useState('');

  const [editingActivityId, setEditingActivityId] =
    useState<string | null>(null);

  const [activityError, setActivityError] = useState('');
  const [isAddingActivity, setIsAddingActivity] =
    useState(false);

  // Budget state
  const [expenses, setExpenses] = useState<Expense[]>([]);

  const [expenseDescription, setExpenseDescription] =
    useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('');
  const [expenseDate, setExpenseDate] = useState('');

  const [expenseError, setExpenseError] = useState('');
  const [isAddingExpense, setIsAddingExpense] =
    useState(false);

  // Load trip
  const loadTrip = useCallback(async () => {
    if (!token || !id) {
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      const trip = await getTrip(id, token);

      setName(trip.name);
      setDestination(trip.destination);
      setStartDate(trip.startDate.slice(0, 10));
      setEndDate(trip.endDate.slice(0, 10));
      setDescription(trip.description || '');
      setBudget(String(trip.budget || ''));
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to load trip.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, token]);

  // Load itinerary
  const loadActivities = useCallback(async () => {
    if (!token || !id) {
      return;
    }

    try {
      setActivityError('');

      const data = await getActivities(id, token);

      setActivities(data);
    } catch (error) {
      setActivityError(
        error instanceof Error
          ? error.message
          : 'Unable to load itinerary.'
      );
    }
  }, [id, token]);

  // Load expenses
  const loadExpenses = useCallback(async () => {
    if (!token || !id) {
      return;
    }

    try {
      setExpenseError('');

      const data = await getExpenses(id, token);

      setExpenses(data);
    } catch (error) {
      setExpenseError(
        error instanceof Error
          ? error.message
          : 'Unable to load expenses.'
      );
    }
  }, [id, token]);

  useFocusEffect(
    useCallback(() => {
      void loadTrip();
      void loadActivities();
      void loadExpenses();
    }, [loadTrip, loadActivities, loadExpenses])
  );


  // Keep calendar dates consistent across timezones
  const formatActivityDate = (date: string) => {
    const dateOnly = date.slice(0, 10);
    const [year, month, day] = dateOnly.split('-');

    return `${month}/${day}/${year}`;
  };

  // Save trip
  const handleSave = async () => {
    if (!token || !id) {
      return;
    }

    if (
      !name.trim() ||
      !destination.trim() ||
      !startDate ||
      !endDate
    ) {
      setError('Please complete the required fields.');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      await updateTrip(
        id,
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
          : 'Unable to update trip.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Delete trip
  const performDelete = async () => {
    if (!token || !id) {
      return;
    }

    try {
      await deleteTrip(id, token);
      router.navigate('/(tabs)/trips');
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : 'Unable to delete trip.'
      );
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      const confirmed = window.confirm(
        'Delete this trip? This cannot be undone.'
      );

      if (confirmed) {
        void performDelete();
      }

      return;
    }

    Alert.alert(
      'Delete Trip',
      'This cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => void performDelete(),
        },
      ]
    );
  };

  // Edit activity
  const handleEditActivity = (activity: Activity) => {
    setEditingActivityId(activity._id);

    setActivityTitle(activity.title);
    setActivityDate(activity.date.slice(0, 10));
    setActivityTime(activity.time);
    setActivityLocation(activity.location);
    setActivityNotes(activity.notes);

    setActivityError('');
  };

  // Add or update activity
  const handleAddActivity = async () => {
    setActivityError('');

    if (!activityTitle.trim() || !activityDate) {
      setActivityError(
        'Activity title and date are required.'
      );
      return;
    }

    if (!token || !id) {
      return;
    }

    try {
      setIsAddingActivity(true);

      const data = {
        title: activityTitle.trim(),
        date: activityDate,
        time: activityTime.trim(),
        location: activityLocation.trim(),
        notes: activityNotes.trim(),
      };

      if (editingActivityId) {
        await updateActivity(
          id,
          editingActivityId,
          data,
          token
        );
      } else {
        await createActivity(
          id,
          data,
          token
        );
      }

      setEditingActivityId(null);

      setActivityTitle('');
      setActivityDate('');
      setActivityTime('');
      setActivityLocation('');
      setActivityNotes('');

      await loadActivities();
    } catch (error) {
      setActivityError(
        error instanceof Error
          ? error.message
          : 'Unable to save activity.'
      );
    } finally {
      setIsAddingActivity(false);
    }
  };

  // Delete activity
  const handleDeleteActivity = async (
    activityId: string
  ) => {
    if (!token || !id) {
      return;
    }

    try {
      setActivityError('');

      await deleteActivity(
        id,
        activityId,
        token
      );

      setActivities((current) =>
        current.filter(
          (activity) => activity._id !== activityId
        )
      );

      if (editingActivityId === activityId) {
        setEditingActivityId(null);
        setActivityTitle('');
        setActivityDate('');
        setActivityTime('');
        setActivityLocation('');
        setActivityNotes('');
      }
    } catch (error) {
      setActivityError(
        error instanceof Error
          ? error.message
          : 'Unable to delete activity.'
      );
    }
  };

  const totalSpent = expenses.reduce(
    (total, expense) => total + expense.amount,
    0
  );

  const plannedBudget = Number(budget) || 0;

  const remainingBudget =
    plannedBudget - totalSpent;

  const handleAddExpense = async () => {
    setExpenseError('');

    if (
      !expenseDescription.trim() ||
      !expenseAmount ||
      !expenseCategory.trim() ||
      !expenseDate
    ) {
      setExpenseError(
        'Description, amount, category, and date are required.'
      );
      return;
    }

    const numericAmount = Number(expenseAmount);

    if (
      Number.isNaN(numericAmount) ||
      numericAmount < 0
    ) {
      setExpenseError(
        'Please enter a valid expense amount.'
      );
      return;
    }

    if (!token || !id) {
      return;
    }

    try {
      setIsAddingExpense(true);

      await createExpense(
        id,
        {
          description: expenseDescription.trim(),
          amount: numericAmount,
          category: expenseCategory.trim(),
          date: expenseDate,
        },
        token
      );

      setExpenseDescription('');
      setExpenseAmount('');
      setExpenseCategory('');
      setExpenseDate('');

      await loadExpenses();
    } catch (error) {
      setExpenseError(
        error instanceof Error
          ? error.message
          : 'Unable to add expense.'
      );
    } finally {
      setIsAddingExpense(false);
    }
  };

  const handleDeleteExpense = async (
    expenseId: string
  ) => {
    if (!token || !id) {
      return;
    }

    try {
      setExpenseError('');

      await deleteExpense(
        id,
        expenseId,
        token
      );

      setExpenses((current) =>
        current.filter(
          (expense) => expense._id !== expenseId
        )
      );
    } catch (error) {
      setExpenseError(
        error instanceof Error
          ? error.message
          : 'Unable to delete expense.'
      );
    }
  };

  const formatExpenseDate = (date: string) => {
    const dateOnly = date.slice(0, 10);
    const [year, month, day] = dateOnly.split('-');

    return `${month}/${day}/${year}`;
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color={Colors.light.primary}
        />
      </SafeAreaView>
    );
  }

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
              router.navigate('/trips');
            }}
          >
            ‹ Back to Trips
          </Text>

          <Text style={styles.title}>Trip Details</Text>

          {/* Trip Details */}
          <View style={styles.form}>
            <FormInput
              label="Trip Name"
              placeholder="Trip name"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
            />

            <FormInput
              label="Destination"
              placeholder="Destination"
              value={destination}
              onChangeText={setDestination}
              autoCapitalize="words"
            />

            <FormInput
              label="Start Date"
              placeholder="YYYY-MM-DD"
              value={startDate}
              onChangeText={setStartDate}
            />

            <FormInput
              label="End Date"
              placeholder="YYYY-MM-DD"
              value={endDate}
              onChangeText={setEndDate}
            />

            <View style={styles.field}>
              <Text style={styles.label}>
                Description
              </Text>

              <TextInput
                style={[styles.input, styles.textArea]}
                value={description}
                onChangeText={setDescription}
                placeholder="Trip notes"
                placeholderTextColor={
                  Colors.light.textSecondary
                }
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
                isSaving
                  ? 'Saving...'
                  : 'Save Changes'
              }
              onPress={handleSave}
              disabled={isSaving}
            />

            <Pressable
              style={({ pressed }) => [
                styles.deleteButton,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleDelete}
            >
              <Text style={styles.deleteText}>
                Delete Trip
              </Text>
            </Pressable>
          </View>

          {/* Itinerary */}
          <View style={styles.itinerarySection}>
            <Text style={styles.sectionTitle}>
              Itinerary
            </Text>

            {activities.length === 0 ? (
              <Text style={styles.emptyItinerary}>
                No activities planned yet.
              </Text>
            ) : (
              <View style={styles.activityList}>
                {activities.map((activity) => (
                  <View
                    key={activity._id}
                    style={styles.activityCard}
                  >
                    <View style={styles.activityHeader}>
                      <View style={styles.activityInfo}>
                        <Text style={styles.activityTitle}>
                          {activity.title}
                        </Text>

                        <Text style={styles.activityDate}>
                          {formatActivityDate(
                            activity.date
                          )}
                          {activity.time
                            ? ` at ${activity.time}`
                            : ''}
                        </Text>
                      </View>

                      <View style={styles.activityActions}>
                        <Pressable
                          onPress={() =>
                            handleEditActivity(activity)
                          }
                        >
                          <Text style={styles.editActivity}>
                            Edit
                          </Text>
                        </Pressable>

                        <Pressable
                          onPress={() =>
                            void handleDeleteActivity(
                              activity._id
                            )
                          }
                        >
                          <Text
                            style={styles.removeActivity}
                          >
                            Remove
                          </Text>
                        </Pressable>
                      </View>
                    </View>

                    {activity.location ? (
                      <Text
                        style={styles.activityLocation}
                      >
                        {activity.location}
                      </Text>
                    ) : null}

                    {activity.notes ? (
                      <Text style={styles.activityNotes}>
                        {activity.notes}
                      </Text>
                    ) : null}
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.addActivityTitle}>
              {editingActivityId
                ? 'Edit Activity'
                : 'Add Activity'}
            </Text>

            <View style={styles.activityForm}>
              <FormInput
                label="Activity"
                placeholder="Visit Senso-ji"
                value={activityTitle}
                onChangeText={setActivityTitle}
                autoCapitalize="words"
              />

              <FormInput
                label="Date"
                placeholder="2027-03-12"
                value={activityDate}
                onChangeText={setActivityDate}
              />

              <FormInput
                label="Time"
                placeholder="10:00 AM"
                value={activityTime}
                onChangeText={setActivityTime}
              />

              <FormInput
                label="Location"
                placeholder="Asakusa, Tokyo"
                value={activityLocation}
                onChangeText={setActivityLocation}
                autoCapitalize="words"
              />

              <View style={styles.field}>
                <Text style={styles.label}>
                  Notes
                </Text>

                <TextInput
                  style={[
                    styles.input,
                    styles.notesInput,
                  ]}
                  value={activityNotes}
                  onChangeText={setActivityNotes}
                  placeholder="Optional notes"
                  placeholderTextColor={
                    Colors.light.textSecondary
                  }
                  multiline
                />
              </View>

              {activityError ? (
                <Text style={styles.error}>
                  {activityError}
                </Text>
              ) : null}

              <PrimaryButton
                title={
                  isAddingActivity
                    ? 'Saving Activity...'
                    : editingActivityId
                      ? 'Save Activity'
                      : 'Add Activity'
                }
                onPress={handleAddActivity}
                disabled={isAddingActivity}
              />
            </View>
          </View>

          {/* Budget */}
          <View style={styles.budgetSection}>
            <Text style={styles.sectionTitle}>
              Budget
            </Text>

            <View style={styles.budgetSummary}>
              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>
                  Planned
                </Text>

                <Text style={styles.budgetValue}>
                  ${plannedBudget.toFixed(2)}
                </Text>
              </View>

              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>
                  Spent
                </Text>

                <Text style={styles.budgetValue}>
                  ${totalSpent.toFixed(2)}
                </Text>
              </View>

              <View style={styles.budgetRow}>
                <Text style={styles.budgetLabel}>
                  Remaining
                </Text>

                <Text
                  style={[
                    styles.budgetValue,
                    remainingBudget < 0 &&
                    styles.overBudget,
                  ]}
                >
                  ${remainingBudget.toFixed(2)}
                </Text>
              </View>
            </View>

            <Text style={styles.expensesTitle}>
              Expenses
            </Text>

            {expenses.length === 0 ? (
              <Text style={styles.emptyItinerary}>
                No expenses recorded yet.
              </Text>
            ) : (
              <View style={styles.expenseList}>
                {expenses.map((expense) => (
                  <View
                    key={expense._id}
                    style={styles.expenseCard}
                  >
                    <View style={styles.expenseHeader}>
                      <View style={styles.expenseInfo}>
                        <Text style={styles.expenseDescription}>
                          {expense.description}
                        </Text>

                        <Text style={styles.expenseCategory}>
                          {expense.category} ·{' '}
                          {formatExpenseDate(expense.date)}
                        </Text>
                      </View>

                      <Text style={styles.expenseAmount}>
                        ${expense.amount.toFixed(2)}
                      </Text>
                    </View>

                    <Pressable
                      onPress={() =>
                        void handleDeleteExpense(expense._id)
                      }
                    >
                      <Text style={styles.removeExpense}>
                        Remove
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            )}

            <Text style={styles.addExpenseTitle}>
              Add Expense
            </Text>

            <View style={styles.expenseForm}>
              <FormInput
                label="Description"
                placeholder="Hotel"
                value={expenseDescription}
                onChangeText={setExpenseDescription}
                autoCapitalize="words"
              />

              <FormInput
                label="Amount"
                placeholder="600"
                value={expenseAmount}
                onChangeText={setExpenseAmount}
                keyboardType="numeric"
              />

              <FormInput
                label="Category"
                placeholder="Accommodation"
                value={expenseCategory}
                onChangeText={setExpenseCategory}
                autoCapitalize="words"
              />

              <FormInput
                label="Date"
                placeholder="2027-03-10"
                value={expenseDate}
                onChangeText={setExpenseDate}
              />

              {expenseError ? (
                <Text style={styles.error}>
                  {expenseError}
                </Text>
              ) : null}

              <PrimaryButton
                title={
                  isAddingExpense
                    ? 'Adding Expense...'
                    : 'Add Expense'
                }
                onPress={handleAddExpense}
                disabled={isAddingExpense}
              />
            </View>
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

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
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

  deleteButton: {
    minHeight: 52,
    backgroundColor: Colors.light.accentPinkLight,
    borderWidth: 1,
    borderColor: Colors.light.accentPink,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },

  deleteText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.light.primary,
  },

  buttonPressed: {
    opacity: 0.8,
  },

  itinerarySection: {
    marginTop: Spacing.six,
    paddingTop: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },

  sectionTitle: {
    fontFamily: Fonts.headingBold,
    fontSize: 32,
    color: Colors.light.text,
    marginBottom: Spacing.three,
  },

  emptyItinerary: {
    fontFamily: Fonts.body,
    fontSize: 15,
    color: Colors.light.textSecondary,
    marginBottom: Spacing.four,
  },

  activityList: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },

  activityCard: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: Spacing.three,
  },

  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },

  activityInfo: {
    flex: 1,
  },

  activityActions: {
    flexDirection: 'row',
    gap: Spacing.two,
  },

  activityTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 22,
    color: Colors.light.text,
  },

  activityDate: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 14,
    color: Colors.light.primary,
    marginTop: Spacing.one,
  },

  activityLocation: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.light.textSecondary,
    marginTop: Spacing.two,
  },

  activityNotes: {
    fontFamily: Fonts.body,
    fontSize: 14,
    color: Colors.light.text,
    marginTop: Spacing.two,
  },

  editActivity: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.light.textSecondary,
  },

  removeActivity: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.light.primary,
  },

  addActivityTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 26,
    color: Colors.light.text,
    marginBottom: Spacing.three,
  },

  activityForm: {
    gap: Spacing.three,
  },

  notesInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },

  budgetSection: {
    marginTop: Spacing.six,
    paddingTop: Spacing.four,
    borderTopWidth: 1,
    borderTopColor: Colors.light.border,
  },

  budgetSummary: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: Spacing.three,
    gap: Spacing.two,
    marginBottom: Spacing.four,
  },

  budgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  budgetLabel: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    color: Colors.light.textSecondary,
  },

  budgetValue: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.light.text,
  },

  overBudget: {
    color: Colors.light.primary,
  },

  expensesTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 26,
    color: Colors.light.text,
    marginBottom: Spacing.three,
  },

  expenseList: {
    gap: Spacing.three,
    marginBottom: Spacing.four,
  },

  expenseCard: {
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
    padding: Spacing.three,
  },

  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: Spacing.two,
  },

  expenseInfo: {
    flex: 1,
  },

  expenseDescription: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 20,
    color: Colors.light.text,
  },

  expenseCategory: {
    fontFamily: Fonts.body,
    fontSize: 13,
    color: Colors.light.textSecondary,
    marginTop: Spacing.one,
  },

  expenseAmount: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 16,
    color: Colors.light.primary,
  },

  removeExpense: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 13,
    color: Colors.light.primary,
    marginTop: Spacing.two,
  },

  addExpenseTitle: {
    fontFamily: Fonts.headingSemiBold,
    fontSize: 26,
    color: Colors.light.text,
    marginBottom: Spacing.three,
  },

  expenseForm: {
    gap: Spacing.three,
  },

});