import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeProvider as StyledThemeProvider } from 'styled-components';

const ThemeContext = createContext();

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

const lightTheme = {
    background: '#F8FAFC',
    backgroundSecondary: '#FFFFFF',
    backgroundTertiary: '#F1F5F9',
    backgroundGradient: ['#F8FAFC', '#F1F5F9', '#E2E8F0'],

    text: '#0F172A',
    textSecondary: '#475569',
    textTertiary: '#94A3B8',

    primary: '#006AFF',
    primaryDark: '#0056D2',
    primaryLight: '#3388FF',
    primaryGradient: ['#006AFF', '#0056D2'],

    accent: '#FF4D6D',
    accentGradient: ['#FF4D6D', '#FF8E53'],

    success: '#10B981',
    successGradient: ['#10B981', '#059669'],
    warning: '#F59E0B',
    warningGradient: ['#F59E0B', '#D97706'],
    danger: '#EF4444',
    dangerGradient: ['#EF4444', '#DC2626'],

    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    borderDark: '#CBD5E1',

    card: '#FFFFFF',
    cardSecondary: '#F8FAFC',
    cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    cardShadowLarge: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',

    headerBackground: '#FFFFFF',
    headerGradient: ['#FFFFFF', '#F8FAFC'],
    headerText: '#0F172A',

    heroGradient: ['#003580', '#006AFF'],
    featureGradient: ['#F1F5F9', '#E2E8F0', '#CBD5E1'],

    iconStyle: 'outline',
    overlay: 'rgba(15, 23, 42, 0.5)',
    overlayLight: 'rgba(15, 23, 42, 0.1)',
    gold: '#F59E0B',
    shimmer: '#E2E8F0',
    shadows: {
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    }
};

const darkTheme = {
    background: '#0F172A',
    backgroundSecondary: '#1E293B',
    backgroundTertiary: '#334155',
    backgroundGradient: ['#0F172A', '#1E293B', '#334155'],

    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textTertiary: '#64748B',

    primary: '#3388FF',
    primaryDark: '#006AFF',
    primaryLight: '#66AAFF',
    primaryGradient: ['#3388FF', '#006AFF'],

    accent: '#FF4D6D',
    accentGradient: ['#FF4D6D', '#FF8E53'],

    success: '#34D399',
    successGradient: ['#34D399', '#10B981'],
    warning: '#FBBF24',
    warningGradient: ['#FBBF24', '#F59E0B'],
    danger: '#F87171',
    dangerGradient: ['#F87171', '#EF4444'],

    border: '#1E293B',
    borderLight: '#334155',
    borderDark: '#0F172A',

    card: '#1E293B',
    cardSecondary: '#334155',
    cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
    cardShadowLarge: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',

    headerBackground: '#0F172A',
    headerGradient: ['#0F172A', '#1E293B'],
    headerText: '#F8FAFC',

    heroGradient: ['#001E4D', '#003580'],
    featureGradient: ['#1E293B', '#334155', '#475569'],

    iconStyle: 'outline',
    overlay: 'rgba(0, 0, 0, 0.7)',
    overlayLight: 'rgba(0, 0, 0, 0.4)',
    gold: '#FBBF24',
    shimmer: '#1E293B',
    shadows: {
        sm: '0 1px 3px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.2)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 10px 10px -5px rgba(0, 0, 0, 0.4)',
    }
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
            <StyledThemeProvider theme={theme}>
                {children}
            </StyledThemeProvider>
        </ThemeContext.Provider>
    );
};
