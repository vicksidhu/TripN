import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FormInput from '@/components/common/FormInput';
import PasswordInput from '@/components/common/PasswordInput';
import PrimaryButton from '@/components/common/PrimaryButton';
import { Colors, Fonts, Spacing } from '@/constants/theme';
import { isValidEmail } from '@/utils/validation';

import { login } from '@/services/authService';

import { useAuth } from '@/context/AuthContext';

export default function LoginScreen() {
    const router = useRouter();
    const { signIn } = useAuth();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setError('');

        if (!email.trim() || !password) {
            setError('Please enter your email and password.');
            return;
        }

        if (!isValidEmail(email)) {
            setError('Please enter a valid email address.');
            return;
        }

        try {
            setIsLoading(true);

            const response = await login({
                email: email.trim().toLowerCase(),
                password,
            });

            await signIn(response.token, response.user);

        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Unable to log in.');
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
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.logo}>TripN</Text>

                        <Text style={styles.title}>Welcome back</Text>

                        <Text style={styles.subtitle}>
                            Sign in to continue planning your next adventure.
                        </Text>
                    </View>

                    <View style={styles.form}>
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
                            placeholder="Enter your password"
                            value={password}
                            onChangeText={setPassword}
                        />

                        {error ? (
                            <Text style={styles.errorText}>{error}</Text>
                        ) : null}

                        <PrimaryButton
                            title={isLoading ? 'Logging In...' : 'Log In'}
                            onPress={handleLogin}
                            disabled={isLoading}
                            style={styles.loginButton}
                        />
                    </View>

                    <View style={styles.registerRow}>
                        <Text style={styles.registerText}>New to TripN? </Text>

                        <Pressable onPress={() => router.navigate('/register')}>
                            <Text style={styles.registerLink}>Create an account</Text>
                        </Pressable>
                    </View>
                </View>
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

    content: {
        flex: 1,
        justifyContent: 'center',
        width: '100%',
        maxWidth: 450,
        alignSelf: 'center',
        paddingHorizontal: Spacing.four,
    },

    header: {
        alignItems: 'center',
        marginBottom: Spacing.five,
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

    loginButton: {
        marginTop: Spacing.two,
    },

    registerRow: {
        flexDirection: 'row',
        justifyContent: 'center',
        flexWrap: 'wrap',
        marginTop: Spacing.four,
    },

    registerText: {
        fontFamily: Fonts.body,
        fontSize: 15,
        color: Colors.light.textSecondary,
    },

    registerLink: {
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