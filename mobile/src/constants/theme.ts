import '@/global.css';

export const Colors = {
  light: {
    primary: '#A65D3F',
    primaryMuted: '#F0DFD2',

    text: '#563A2D',
    textSecondary: '#897365',

    background: '#F5EFE6',
    backgroundElement: '#E8D8C5',
    backgroundSelected: '#D8C3AA',

    card: '#FFFCF7',
    border: '#E5D8CA',

    accentPink: '#DDAFAF',
    accentPinkLight: '#F3E3E1',

    white: '#FFFFFF',
  },

  dark: {
    primary: '#D18A67',
    primaryMuted: '#493329',

    text: '#F5EDE3',
    textSecondary: '#C1AA98',

    background: '#211A16',
    backgroundElement: '#332720',
    backgroundSelected: '#49372B',

    card: '#2B211B',
    border: '#49372B',

    accentPink: '#DDAFAF',
    accentPinkLight: '#493333',

    white: '#FFFFFF',
  },
} as const;

export type ThemeColor =
  keyof typeof Colors.light &
  keyof typeof Colors.dark;

// Font family names are registered when the app loads.
export const Fonts = {
  heading: 'CormorantGaramond_400Regular',
  headingMedium: 'CormorantGaramond_500Medium',
  headingSemiBold: 'CormorantGaramond_600SemiBold',
  headingBold: 'CormorantGaramond_700Bold',

  body: 'DMSans_400Regular',
  bodyMedium: 'DMSans_500Medium',
  bodySemiBold: 'DMSans_600SemiBold',
  bodyBold: 'DMSans_700Bold',
} as const;

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = {
  ios: 50,
  android: 80,
} as const;

export const MaxContentWidth = 800;
