export interface Character {
  slug: string;
  name: string;
  emoji: string;
  color: string;
  colorLight: string;
  glowClass: string;
  tagline: string;
  role: string;
  arcTheme: string;
  chapters: ChapterMeta[];
}

export interface ChapterMeta {
  number: number;
  title: string;
  isFree: boolean;
  estimatedMinutes: number;
}

export const characters: Character[] = [
  {
    slug: 'moneta',
    name: 'MONETA',
    emoji: '🪙',
    color: '#f5a623',
    colorLight: '#ffd700',
    glowClass: 'glow-gold',
    tagline: "I've been around for 10,000 years. Time you understood me.",
    role: 'The Guide',
    arcTheme: 'The Origin & Evolution of Money — From Barter to Bitcoin',
    chapters: [
      { number: 1, title: 'The Trade', isFree: true, estimatedMinutes: 12 },
      { number: 2, title: 'The Metal', isFree: false, estimatedMinutes: 15 },
      { number: 3, title: 'The Paper Promise', isFree: false, estimatedMinutes: 14 },
      { number: 4, title: 'The Invisible Money', isFree: false, estimatedMinutes: 16 },
      { number: 5, title: 'The New Frontier', isFree: false, estimatedMinutes: 18 },
    ],
  },
  {
    slug: 'inflare',
    name: 'INFLARE',
    emoji: '🔥',
    color: '#e74c3c',
    colorLight: '#ff6b4a',
    glowClass: 'glow-red',
    tagline: "I don't steal your money. I make it worthless.",
    role: 'The Villain',
    arcTheme: 'Inflation — The Silent Wealth Destroyer',
    chapters: [
      { number: 1, title: 'The Invisible Thief', isFree: true, estimatedMinutes: 12 },
      { number: 2, title: 'The History of Fire', isFree: false, estimatedMinutes: 15 },
      { number: 3, title: 'The Trap', isFree: false, estimatedMinutes: 14 },
      { number: 4, title: 'Fighting Back', isFree: false, estimatedMinutes: 16 },
    ],
  },
  {
    slug: 'mr-weal',
    name: 'MR. WEAL',
    emoji: '💚',
    color: '#2ecc71',
    colorLight: '#4ade80',
    glowClass: 'glow-emerald',
    tagline: 'Being rich is having money. Being wealthy is knowing what to do with it.',
    role: 'The Mentor',
    arcTheme: 'Financial Literacy Fundamentals — Goals, Savings, Assets, Taxes',
    chapters: [
      { number: 1, title: 'The Blueprint', isFree: true, estimatedMinutes: 12 },
      { number: 2, title: 'Income & Expenses', isFree: false, estimatedMinutes: 15 },
      { number: 3, title: 'Assets vs Liabilities', isFree: false, estimatedMinutes: 14 },
      { number: 4, title: 'The Tax Game', isFree: false, estimatedMinutes: 16 },
      { number: 5, title: 'Emergency & Insurance', isFree: false, estimatedMinutes: 15 },
    ],
  },
  {
    slug: 'recsus',
    name: 'RECSUS',
    emoji: '💜',
    color: '#8e44ad',
    colorLight: '#a855f7',
    glowClass: 'glow-purple',
    tagline: "I don't just take your money. I take your job, your home, your hope.",
    role: 'The Apocalypse Villain',
    arcTheme: 'Economics — How Economies Form, Function, and Collapse',
    chapters: [
      { number: 1, title: 'The Machine', isFree: true, estimatedMinutes: 12 },
      { number: 2, title: 'The Cracks', isFree: false, estimatedMinutes: 15 },
      { number: 3, title: 'The Collapse', isFree: false, estimatedMinutes: 16 },
      { number: 4, title: 'The Survivors', isFree: false, estimatedMinutes: 15 },
    ],
  },
  {
    slug: 'captain-interest',
    name: 'CAPTAIN INTEREST',
    emoji: '💙',
    color: '#00d4ff',
    colorLight: '#22d3ee',
    glowClass: 'glow-cyan',
    tagline: "Einstein called me the eighth wonder of the world. He wasn't exaggerating.",
    role: 'The Hero',
    arcTheme: 'Investing — From Zero to Portfolio',
    chapters: [
      { number: 1, title: 'The Eighth Wonder', isFree: true, estimatedMinutes: 12 },
      { number: 2, title: 'The Instruments', isFree: false, estimatedMinutes: 15 },
      { number: 3, title: 'The Mutual Fund Universe', isFree: false, estimatedMinutes: 16 },
      { number: 4, title: 'Stocks & The Market', isFree: false, estimatedMinutes: 18 },
      { number: 5, title: 'The Portfolio', isFree: false, estimatedMinutes: 17 },
    ],
  },
];

export function getCharacter(slug: string): Character | undefined {
  return characters.find((c) => c.slug === slug);
}
