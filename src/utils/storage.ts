import { User, UserTrophy, TrophyDefinition } from '../types';
import { TROPHIES_LIST } from '../data/trophiesData';

const USERS_STORAGE_KEY = 'magico_abecedario_users_v2';
const ACTIVE_USER_ID_KEY = 'magico_abecedario_active_user_v2';

const DEFAULT_USERS: User[] = [
  {
    id: 'user-default-1',
    name: 'Mateo',
    avatar: '🦁',
    colorTheme: 'blue',
    stars: 8,
    dateCreated: new Date().toISOString(),
    trophies: [
      {
        trophyId: 'first_steps',
        earnedAt: new Date().toISOString(),
        winnerName: 'Mateo',
        starsAtAward: 5,
        customNote: '¡Gran inicio en la aventura!'
      }
    ],
    stats: {
      lettersExplored: ['A', 'B', 'C', 'M', 'P', 'S'],
      findCorrect: 4,
      matchRoundsWon: 2,
      wordsCorrect: 3,
      currentStreak: 2,
      bestStreak: 4,
      totalGamesPlayed: 9
    }
  },
  {
    id: 'user-default-2',
    name: 'Sofía',
    avatar: '🦄',
    colorTheme: 'pink',
    stars: 18,
    dateCreated: new Date().toISOString(),
    trophies: [
      {
        trophyId: 'first_steps',
        earnedAt: new Date().toISOString(),
        winnerName: 'Sofía',
        starsAtAward: 5
      },
      {
        trophyId: 'star_collector_15',
        earnedAt: new Date().toISOString(),
        winnerName: 'Sofía',
        starsAtAward: 15,
        customNote: '¡Súper coleccionista brillante!'
      }
    ],
    stats: {
      lettersExplored: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'L', 'M', 'O', 'P', 'S', 'T'],
      findCorrect: 8,
      matchRoundsWon: 4,
      wordsCorrect: 6,
      currentStreak: 4,
      bestStreak: 6,
      totalGamesPlayed: 18
    }
  }
];

export function getStoredUsers(): User[] {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(DEFAULT_USERS));
      return DEFAULT_USERS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return DEFAULT_USERS;
  } catch {
    return DEFAULT_USERS;
  }
}

export function saveStoredUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users to localStorage', err);
  }
}

export function getActiveUserId(): string {
  try {
    const stored = localStorage.getItem(ACTIVE_USER_ID_KEY);
    const users = getStoredUsers();
    if (stored && users.some(u => u.id === stored)) {
      return stored;
    }
    return users[0]?.id || 'user-default-1';
  } catch {
    return 'user-default-1';
  }
}

export function setActiveUserId(id: string): void {
  try {
    localStorage.setItem(ACTIVE_USER_ID_KEY, id);
  } catch (err) {
    console.error('Failed to set active user ID', err);
  }
}

export function createNewUser(name: string, avatar: string, colorTheme: string): User {
  const users = getStoredUsers();
  const trimmedName = name.trim() || 'Campeón';
  const newUser: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    name: trimmedName,
    avatar: avatar || '⭐',
    colorTheme: colorTheme || 'blue',
    stars: 0,
    dateCreated: new Date().toISOString(),
    trophies: [],
    stats: {
      lettersExplored: [],
      findCorrect: 0,
      matchRoundsWon: 0,
      wordsCorrect: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalGamesPlayed: 0
    }
  };

  const updated = [...users, newUser];
  saveStoredUsers(updated);
  setActiveUserId(newUser.id);
  return newUser;
}

export function deleteUser(id: string): User[] {
  const users = getStoredUsers();
  const filtered = users.filter(u => u.id !== id);
  const remaining = filtered.length > 0 ? filtered : DEFAULT_USERS;
  saveStoredUsers(remaining);
  
  if (getActiveUserId() === id) {
    setActiveUserId(remaining[0].id);
  }
  return remaining;
}

export function checkAndAwardTrophies(user: User): { updatedUser: User; newlyUnlocked: TrophyDefinition[] } {
  const newlyUnlocked: TrophyDefinition[] = [];
  const currentTrophyIds = new Set(user.trophies.map(t => t.trophyId));
  const updatedTrophies = [...user.trophies];

  TROPHIES_LIST.forEach(trophy => {
    if (currentTrophyIds.has(trophy.id)) return;

    let qualifies = false;
    switch (trophy.id) {
      case 'first_steps':
        qualifies = user.stars >= 5;
        break;
      case 'star_collector_15':
        qualifies = user.stars >= 15;
        break;
      case 'star_master_30':
        qualifies = user.stars >= 30;
        break;
      case 'explorer_all_letters':
        qualifies = user.stats.lettersExplored.length >= 27;
        break;
      case 'find_letter_hero':
        qualifies = user.stats.findCorrect >= 10;
        break;
      case 'match_master':
        qualifies = user.stats.matchRoundsWon >= 5;
        break;
      case 'word_wizard':
        qualifies = user.stats.wordsCorrect >= 10;
        break;
      case 'streak_fire':
        qualifies = user.stats.bestStreak >= 5;
        break;
      case 'grand_champion_crown':
        qualifies = user.stars >= 50 || (user.stats.findCorrect >= 10 && user.stats.matchRoundsWon >= 5 && user.stats.wordsCorrect >= 10);
        break;
      case 'special_effort_award':
        qualifies = user.stats.totalGamesPlayed >= 15;
        break;
    }

    if (qualifies) {
      const newTrophy: UserTrophy = {
        trophyId: trophy.id,
        earnedAt: new Date().toISOString(),
        winnerName: user.name, // Engrave winner's name!
        starsAtAward: user.stars
      };
      updatedTrophies.push(newTrophy);
      newlyUnlocked.push(trophy);
    }
  });

  const updatedUser: User = {
    ...user,
    trophies: updatedTrophies
  };

  return { updatedUser, newlyUnlocked };
}

export function awardCustomTrophy(user: User, trophyId: string, customNote?: string): { updatedUser: User; trophy: TrophyDefinition } {
  const trophy = TROPHIES_LIST.find(t => t.id === trophyId) || TROPHIES_LIST[0];
  const existingIdx = user.trophies.findIndex(t => t.trophyId === trophyId);
  
  const trophyRecord: UserTrophy = {
    trophyId: trophy.id,
    earnedAt: new Date().toISOString(),
    winnerName: user.name,
    starsAtAward: user.stars,
    customNote: customNote || '¡Premio de honor entregado en ceremonia especial!'
  };

  let newTrophies: UserTrophy[];
  if (existingIdx >= 0) {
    newTrophies = [...user.trophies];
    newTrophies[existingIdx] = trophyRecord;
  } else {
    newTrophies = [...user.trophies, trophyRecord];
  }

  const updatedUser: User = {
    ...user,
    trophies: newTrophies
  };

  return { updatedUser, trophy };
}
