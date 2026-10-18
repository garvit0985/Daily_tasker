// DUO OS — Theme & Appearance Context
import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemePreference } from '../lib/types';
import { getCurrentUser, updateUserProfile, subscribeToStore } from '../lib/store';

interface ThemeContextType {
  theme: ThemePreference;
  setMode: (mode: 'dark' | 'light' | 'system') => void;
  setAccent: (accent: 'violet' | 'indigo' | 'mint' | 'sky' | 'coral') => void;
  setReducedMotion: (val: boolean) => void;
  effectiveMode: 'dark' | 'light';
}

const defaultTheme: ThemePreference = {
  mode: 'dark',
  accent: 'violet',
  reducedMotion: false,
  backgroundPattern: 'mesh'
};

const ThemeContext = createContext<ThemeContextType>({
  theme: defaultTheme,
  setMode: () => {},
  setAccent: () => {},
  setReducedMotion: () => {},
  effectiveMode: 'dark'
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUserState] = useState(getCurrentUser());

  useEffect(() => {
    return subscribeToStore(() => {
      setCurrentUserState(getCurrentUser());
    });
  }, []);

  const theme = currentUser?.themePreference || defaultTheme;

  // Compute effective dark/light mode
  const [effectiveMode, setEffectiveMode] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    if (theme.mode === 'system') {
      const isSystemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setEffectiveMode(isSystemDark ? 'dark' : 'light');
    } else {
      setEffectiveMode(theme.mode);
    }
  }, [theme.mode]);

  // Apply to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (effectiveMode === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }

    // Apply accent color class
    root.setAttribute('data-accent', theme.accent);
  }, [effectiveMode, theme.accent]);

  const updateTheme = (updates: Partial<ThemePreference>) => {
    if (!currentUser) return;
    const newTheme: ThemePreference = {
      ...theme,
      ...updates
    };
    updateUserProfile({
      ...currentUser,
      themePreference: newTheme
    });
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setMode: (mode) => updateTheme({ mode }),
        setAccent: (accent) => updateTheme({ accent }),
        setReducedMotion: (reducedMotion) => updateTheme({ reducedMotion }),
        effectiveMode
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
