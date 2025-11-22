// Tipos principais da aplicação 3 Momentos

export type MoodType = 'tired' | 'ok' | 'motivated' | 'down';
export type PriorityType = 'work' | 'family' | 'money' | 'health' | 'relationship';
export type ConcernType = 'dinner' | 'movie' | 'create' | 'advice';
export type DayRatingType = 'better' | 'same' | 'worse';
export type MomentType = 'morning' | 'afternoon' | 'night';

export interface UserProfile {
  id?: string;
  name: string;
  age: number;
  country: string;
  timezone: string;
  zodiacSign: string;
  gender?: string;
  foodPreferences: string[];
  movieGenres: string[];
  musicStyles: string[];
  wantsSunoPrompts: boolean;
  mainGoal: string[];
  morningTime: string;
  afternoonTime: string;
  nightTime: string;
  createdAt?: Date;
}

export interface MorningResponse {
  mood: MoodType;
  priority: PriorityType;
  timestamp: Date;
}

export interface AfternoonResponse {
  dayRating: number; // 0-10
  concern: ConcernType;
  timestamp: Date;
}

export interface NightResponse {
  dayComparison: DayRatingType;
  didSomethingGood: boolean;
  positiveThings?: string[];
  timestamp: Date;
}

export interface DailyInteraction {
  id?: string;
  userId: string;
  date: string;
  morning?: MorningResponse;
  afternoon?: AfternoonResponse;
  night?: NightResponse;
}

export interface AIResponse {
  advice: string;
  action?: string;
  suggestion?: string;
  sunoPrompt?: string;
}
