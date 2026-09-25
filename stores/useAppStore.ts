import { create } from 'zustand';

interface UserProgress {
  characterSlug: string;
  chapterNumber: number;
  sectionsCompleted: string[];
  quizScore: number | null;
}

interface AppState {
  // User
  xp: number;
  level: number;
  streakCount: number;
  isPro: boolean;

  // Progress
  progress: UserProgress[];
  currentCharacter: string | null;
  currentChapter: number | null;

  // Actions
  setXP: (xp: number) => void;
  addXP: (amount: number) => void;
  setLevel: (level: number) => void;
  setStreak: (count: number) => void;
  setIsPro: (isPro: boolean) => void;
  setProgress: (progress: UserProgress[]) => void;
  setCurrentLearning: (character: string | null, chapter: number | null) => void;
  markSectionComplete: (characterSlug: string, chapterNumber: number, sectionId: string) => void;
  setQuizScore: (characterSlug: string, chapterNumber: number, score: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  xp: 0,
  level: 1,
  streakCount: 0,
  isPro: false,
  progress: [],
  currentCharacter: null,
  currentChapter: null,

  setXP: (xp) => set({ xp }),
  addXP: (amount) => set((state) => ({ xp: state.xp + amount })),
  setLevel: (level) => set({ level }),
  setStreak: (count) => set({ streakCount: count }),
  setIsPro: (isPro) => set({ isPro }),
  setProgress: (progress) => set({ progress }),
  setCurrentLearning: (character, chapter) =>
    set({ currentCharacter: character, currentChapter: chapter }),

  markSectionComplete: (characterSlug, chapterNumber, sectionId) =>
    set((state) => {
      const existing = state.progress.find(
        (p) => p.characterSlug === characterSlug && p.chapterNumber === chapterNumber
      );
      if (existing) {
        return {
          progress: state.progress.map((p) =>
            p.characterSlug === characterSlug && p.chapterNumber === chapterNumber
              ? { ...p, sectionsCompleted: [...new Set([...p.sectionsCompleted, sectionId])] }
              : p
          ),
        };
      }
      return {
        progress: [
          ...state.progress,
          { characterSlug, chapterNumber, sectionsCompleted: [sectionId], quizScore: null },
        ],
      };
    }),

  setQuizScore: (characterSlug, chapterNumber, score) =>
    set((state) => ({
      progress: state.progress.map((p) =>
        p.characterSlug === characterSlug && p.chapterNumber === chapterNumber
          ? { ...p, quizScore: score }
          : p
      ),
    })),
}));
