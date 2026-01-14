import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

export const lightTheme = {
    // TROPICAL BEACH THEME - Bright, sunny, vacation vibes
    background: '#fffbeb',
    backgroundSecondary: '#fef3c7',
    backgroundTertiary: '#fde68a',
    backgroundGradient: ['#fef3c7', '#fed7aa', '#fecaca'],

    // Text colors - Warm and inviting
    text: '#78350f',
    textSecondary: '#92400e',
    textTertiary: '#d97706',

    // Primary - Tropical sunset
    primary: '#f59e0b',
    primaryDark: '#d97706',
    primaryLight: '#fbbf24',
    primaryGradient: ['#fbbf24', '#f97316', '#ec4899'],

    // Accent - Ocean breeze
    accent: '#06b6d4',
    accentGradient: ['#22d3ee', '#06b6d4', '#0284c7'],

    // Status colors - Tropical
    success: '#10b981',
    successGradient: ['#34d399', '#10b981', '#059669'],
    warning: '#f59e0b',
    warningGradient: ['#fbbf24', '#f59e0b', '#d97706'],
    danger: '#dc2626',
    dangerGradient: ['#ef4444', '#dc2626', '#b91c1c'],

    // Borders - Warm gold
    border: '#fed7aa',
    borderLight: '#fef3c7',
    borderDark: '#fbbf24',

    // Cards - Sunny
    card: '#ffffff',
    cardSecondary: '#fffbeb',
    cardShadow: 'rgba(251, 191, 36, 0.3)',
    cardShadowLarge: 'rgba(251, 191, 36, 0.5)',

    // Header - Sunset gradient
    headerBackground: '#f97316',
    headerGradient: ['#fbbf24', '#f97316', '#ec4899'],
    headerText: '#ffffff',

    // Special - Beach paradise
    heroGradient: ['#fbbf24', '#f97316', '#ec4899', '#a855f7'],
    featureGradient: ['#fef3c7', '#fed7aa', '#fbbf24'],

    // Icons - Filled style for light mode
    iconStyle: 'default', // use default filled icons

    // Other
    overlay: 'rgba(251, 146, 60, 0.6)',
    overlayLight: 'rgba(251, 146, 60, 0.3)',
    gold: '#fbbf24',
    shimmer: '#fde68a',
};

export const darkTheme = {
    // MIDNIGHT GALAXY THEME - Deep space, neon stars
    background: '#0c0a09',
    backgroundSecondary: '#1c1917',
    backgroundTertiary: '#292524',
    backgroundGradient: ['#0c0a09', '#1c1917', '#292524'],

    // Text colors - Neon glow
    text: '#fafaf9',
    textSecondary: '#e7e5e4',
    textTertiary: '#a8a29e',

    // Primary - Electric purple
    primary: '#a855f7',
    primaryDark: '#9333ea',
    primaryLight: '#c084fc',
    primaryGradient: ['#a855f7', '#ec4899', '#f43f5e'],

    // Accent - Neon cyan
    accent: '#22d3ee',
    accentGradient: ['#67e8f9', '#22d3ee', '#06b6d4'],

    // Status - Neon signs
    success: '#4ade80',
    successGradient: ['#86efac', '#4ade80', '#22c55e'],
    warning: '#fde047',
    warningGradient: ['#fef08a', '#fde047', '#facc15'],
    danger: '#f87171',
    dangerGradient: ['#fca5a5', '#f87171', '#ef4444'],

    // Borders - Glowing
    border: '#44403c',
    borderLight: '#57534e',
    borderDark: '#292524',

    // Cards - Floating in space
    card: '#1c1917',
    cardSecondary: '#292524',
    cardShadow: 'rgba(168, 85, 247, 0.4)',
    cardShadowLarge: 'rgba(168, 85, 247, 0.6)',

    // Header - Galaxy gradient
    headerBackground: '#1c1917',
    headerGradient: ['#a855f7', '#ec4899', '#f43f5e'],
    headerText: '#fafaf9',

    // Special - Cosmic
    heroGradient: ['#a855f7', '#ec4899', '#f43f5e', '#fb923c'],
    featureGradient: ['#1c1917', '#292524', '#44403c'],

    // Icons - Outline style for dark mode
    iconStyle: 'outline', // use outline icons for dark mode

    // Other
    overlay: 'rgba(168, 85, 247, 0.7)',
    overlayLight: 'rgba(168, 85, 247, 0.5)',
    gold: '#fde047',
    shimmer: '#c084fc',
};

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTheme();
    }, []);

    const loadTheme = async () => {
        try {
            const savedTheme = localStorage.getItem('travelease_theme');
            if (savedTheme !== null) {
                setIsDarkMode(savedTheme === 'dark');
            }
        } catch (error) {
            console.error('Error loading theme:', error);
        } finally {
            setLoading(false);
        }
    };

    const toggleTheme = async () => {
        try {
            const newTheme = !isDarkMode;
            setIsDarkMode(newTheme);
            localStorage.setItem('travelease_theme', newTheme ? 'dark' : 'light');
        } catch (error) {
            console.error('Error saving theme:', error);
        }
    };

    const theme = isDarkMode ? darkTheme : lightTheme;

    const value = {
        isDarkMode,
        theme,
        toggleTheme,
        loading,
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};
