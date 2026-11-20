import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Colors, Fonts, Spacing } from '@/constants/theme';

type PasswordInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
};

export default function PasswordInput({
  label,
  value,
  onChangeText,
  placeholder,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.light.textSecondary}
          secureTextEntry={!isVisible}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Pressable
          style={styles.visibilityButton}
          onPressIn={() => setIsVisible(true)}
          onPressOut={() => setIsVisible(false)}
        >
          <Text style={styles.visibilityText}>
            {isVisible ? 'Hide' : 'Show'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  field: {
    gap: Spacing.two,
  },

  label: {
    fontFamily: Fonts.bodyMedium,
    fontSize: 15,
    color: Colors.light.text,
  },

  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.card,
    borderWidth: 1,
    borderColor: Colors.light.border,
    borderRadius: 12,
  },

  input: {
    flex: 1,
    fontFamily: Fonts.body,
    fontSize: 16,
    color: Colors.light.text,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
  },

  visibilityButton: {
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    justifyContent: 'center',
  },

  visibilityText: {
    fontFamily: Fonts.bodySemiBold,
    fontSize: 14,
    color: Colors.light.primary,
  },
});