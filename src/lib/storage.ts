// Sistema de armazenamento local para a app
import { UserProfile, DailyInteraction } from './types';

const STORAGE_KEYS = {
  USER_PROFILE: '3momentos_user_profile',
  DAILY_INTERACTIONS: '3momentos_daily_interactions',
  ONBOARDING_COMPLETE: '3momentos_onboarding_complete',
};

// User Profile
export const saveUserProfile = (profile: UserProfile): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETE, 'true');
  }
};

export const getUserProfile = (): UserProfile | null => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    return data ? JSON.parse(data) : null;
  }
  return null;
};

export const isOnboardingComplete = (): boolean => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETE) === 'true';
  }
  return false;
};

// Daily Interactions
export const saveDailyInteraction = (interaction: DailyInteraction): void => {
  if (typeof window !== 'undefined') {
    const interactions = getDailyInteractions();
    const existingIndex = interactions.findIndex(
      (i) => i.date === interaction.date && i.userId === interaction.userId
    );

    if (existingIndex >= 0) {
      interactions[existingIndex] = { ...interactions[existingIndex], ...interaction };
    } else {
      interactions.push(interaction);
    }

    localStorage.setItem(STORAGE_KEYS.DAILY_INTERACTIONS, JSON.stringify(interactions));
  }
};

export const getDailyInteractions = (): DailyInteraction[] => {
  if (typeof window !== 'undefined') {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY_INTERACTIONS);
    return data ? JSON.parse(data) : [];
  }
  return [];
};

export const getTodayInteraction = (userId: string): DailyInteraction | null => {
  const today = new Date().toISOString().split('T')[0];
  const interactions = getDailyInteractions();
  return interactions.find((i) => i.date === today && i.userId === userId) || null;
};

// Clear all data (for testing or reset)
export const clearAllData = (): void => {
  if (typeof window !== 'undefined') {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  }
};
