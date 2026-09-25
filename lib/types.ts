// Chapter content types matching the JSON schema from brainstorm

export interface FlashCard {
  front: string;
  back: string;
  illustration?: string;
}

export interface ComicPanelData {
  image?: string;
  dialogue: string;
  character?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface Section {
  id: string;
  type: 'flashcard_stack' | 'interactive' | 'comic_panel' | 'fun_fact' | 'quiz' | 'text';
  // flashcard_stack
  cards?: FlashCard[];
  // interactive
  component?: string;
  props?: Record<string, unknown>;
  // comic_panel
  panels?: ComicPanelData[];
  // fun_fact
  text?: string;
  emoji?: string;
  // quiz
  questions?: QuizQuestion[];
  // text
  title?: string;
  content?: string;
}

export interface ChapterContent {
  character: string;
  chapter: number;
  title: string;
  isFree: boolean;
  estimatedTimeMinutes: number;
  sections: Section[];
}
