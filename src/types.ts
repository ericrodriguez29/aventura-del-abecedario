export interface User {
  id: string;
  name: string;
  avatar: string;
  colorTheme: string; // e.g. 'pink', 'blue', 'purple', 'green', 'amber', 'orange'
  stars: number;
  dateCreated: string;
  trophies: UserTrophy[];
  stats: {
    lettersExplored: string[];
    findCorrect: number;
    matchRoundsWon: number;
    wordsCorrect: number;
    currentStreak: number;
    bestStreak: number;
    totalGamesPlayed: number;
  };
}

export type TrophyTier = 'bronze' | 'silver' | 'gold' | 'diamond' | 'rainbow' | 'crown';

export interface TrophyDefinition {
  id: string;
  title: string;
  description: string;
  icon: string;
  tier: TrophyTier;
  category: 'stars' | 'explorer' | 'find' | 'match' | 'words' | 'streak' | 'master' | 'special';
  targetCount: number;
  quote: string;
}

export interface UserTrophy {
  trophyId: string;
  earnedAt: string;
  winnerName: string; // The exact winner's name engraved
  starsAtAward: number;
  customNote?: string;
}

export interface AlphabetItem {
  letter: string;
  lower: string;
  word: string;
  emoji: string;
  sentence: string;
  phonicHint: string;
  color: {
    bg: string;
    border: string;
    text: string;
    badge: string;
    shadow: string;
  };
}
