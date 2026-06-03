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
    background: '#f8fafc',
    backgroundSecondary: '#eef6ff',
    backgroundTertiary: '#e2e8f0',
    backgroundGradient: ['#f8fafc', '#eef6ff', '#fff7ed'],

    text: '#0f172a',
    textSecondary: '#475569',
    textTertiary: '#94a3b8',

    primary: '#f97316',
    primaryDark: '#ea580c',
    primaryLight: '#fb923c',
    primaryGradient: ['#f97316', '#f59e0b', '#2563eb'],

    accent: '#2563eb',
    accentGradient: ['#38bdf8', '#2563eb', '#0f172a'],

    // Status colors - Tropical
    success: '#10b981',
    successGradient: ['#34d399', '#10b981', '#059669'],
    warning: '#f59e0b',
    warningGradient: ['#fbbf24', '#f59e0b', '#d97706'],
    danger: '#dc2626',
    dangerGradient: ['#ef4444', '#dc2626', '#b91c1c'],

    border: '#dbe3ef',
    borderLight: '#eef2f7',
    borderDark: '#cbd5e1',

    card: '#ffffff',
    cardSecondary: '#f8fafc',
    cardShadow: 'rgba(15, 23, 42, 0.1)',
    cardShadowLarge: 'rgba(15, 23, 42, 0.16)',

    headerBackground: '#0f172a',
    headerGradient: ['#0f172a', '#1e293b', '#f97316'],
    headerText: '#ffffff',

    heroGradient: ['#0f172a', '#2563eb', '#f97316', '#f59e0b'],
    featureGradient: ['#ffffff', '#eef6ff', '#fff7ed'],

    // Icons - Filled style for light mode
    iconStyle: 'default', // use default filled icons

    overlay: 'rgba(15, 23, 42, 0.58)',
    overlayLight: 'rgba(37, 99, 235, 0.12)',
    gold: '#f59e0b',
    shimmer: '#bfdbfe',
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
