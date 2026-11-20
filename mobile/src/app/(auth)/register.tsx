import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormInput from '@/components/common/FormInput';
import PasswordInput from '@/components/common/PasswordInput';
import PrimaryButton from '@/components/common/PrimaryButton';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import {
    isValidEmail,
    isValidPassword,
} from '@/utils/validation';

import { register } from '@/services/authService';


export default function RegisterScreen() {
    const router = useRouter();

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        setError('');

        if (!name.trim() || !email.trim() || !password || !confirmPassword) {
            setError('Please complete all fields.');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        if (!isValidPassword(password)) {
            setError('Password must be at least 8 characters.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setIsLoading(true);

            const response = await register({
                name: name.trim(),
                email: email.trim().toLowerCase(),
                password,
            });

            console.log('Registered user:', response.user);

            router.replace('/login');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Unable to create account.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.safeArea}>
            <KeyboardAvoidingView
                style={styles.container}
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.scrollContent}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={styles.content}>
                        <View style={styles.header}>
                            <Text style={styles.logo}>TripN</Text>

                            <Text style={styles.title}>Create your account</Text>

                            <Text style={styles.subtitle}>
                                Start planning, organizing, and saving your adventures.
                            </Text>
                        </View>

                        <View style={styles.form}>
                            <FormInput
                                label="Name"
                                placeholder="Your name"
                                value={name}
                                onChangeText={setName}
                                autoCapitalize="words"
                            />

                            <FormInput
                                label="Email"
                                placeholder="you@example.com"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />

                            <PasswordInput
                                label="Password"
                                placeholder="Create a password"
                                value={password}
                                onChangeText={setPassword}
                            />

                            <PasswordInput
                                label="Confirm Password"
                                placeholder="Enter your password again"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                            />
                            {error ? (
                                <Text style={styles.errorText}>{error}</Text>
                            ) : null}
                            <PrimaryButton
                                title={isLoading ? 'Creating Account...' : 'Create Account'}
                                onPress={handleRegister}
                                disabled={isLoading}
                                style={styles.registerButton}
                            />
                        </View>

                        <View style={styles.loginRow}>
                            <Text style={styles.loginText}>
                                Already have an account?{' '}
                            </Text>

                            <Pressable onPress={() => router.navigate('/login')}>
                                <Text style={styles.loginLink}>Log In</Text>
                            </Pressable>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },

    container: {
        flex: 1,
    },

    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },

    content: {
        width: '100%',
        maxWidth: 450,
        alignSelf: 'center',
        paddingHorizontal: Spacing.four,
        paddingVertical: Spacing.four,
    },

    header: {
        alignItems: 'center',
        marginBottom: Spacing.four,
    },

    logo: {
        fontFamily: Fonts.headingBold,
        fontSize: 48,
        color: Colors.light.primary,
        marginBottom: Spacing.two,
    },

    title: {
        fontFamily: Fonts.headingSemiBold,
        fontSize: 32,
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

    form: {
        width: '100%',
        gap: Spacing.three,
    },

    registerButton: {
        marginTop: Spacing.two,
    },

    loginRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: Spacing.four,
    },

    loginText: {
        fontFamily: Fonts.body,
        fontSize: 15,
        color: Colors.light.textSecondary,
    },

    loginLink: {
        fontFamily: Fonts.bodySemiBold,
        fontSize: 15,
        color: Colors.light.primary,
    },
    errorText: {
        fontFamily: Fonts.bodyMedium,
        fontSize: 14,
        color: Colors.light.primary,
        textAlign: 'center',
    },
});