
export interface BibleVerse {
  chapter: number;
  verse: number;
  text: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: BibleVerse[];
}

export interface ReadingPlanDay {
  day: number;
  label: string;
  passages: string[]; // e.g. ["Genesis 1-3"]
  completed: boolean;
  date?: string; // e.g. "Jan 01"
}

export interface UserNote {
  id?: number;
  reference: string;
  content: string;
  createdAt: string;
}

export interface ReadingProgress {
  day: number;
  completed_at: string;
}

export enum AppTab {
  READER = 'reader',
  PLAN = 'plan',
  LEARN = 'learn',
  NOTES = 'notes',
  DASHBOARD = 'dashboard'
}
