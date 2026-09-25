/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { User, TrophyDefinition, UserTrophy } from './types';
import {
  getStoredUsers,
  saveStoredUsers,
  getActiveUserId,
  setActiveUserId,
  createNewUser,
  deleteUser,
  checkAndAwardTrophies,
  awardCustomTrophy
} from './utils/storage';
import { soundManager } from './utils/audio';
import { Navbar } from './components/Navbar';
import { UserModal } from './components/UserModal';
import { AwardCeremonyModal } from './components/AwardCeremonyModal';
import { ExplorerMode } from './components/ExplorerMode';
import { FindGame } from './components/FindGame';
import { MatchGame } from './components/MatchGame';
import { WordsGame } from './components/WordsGame';
import { DrawingMode } from './components/DrawingMode';
import { TrophyRoom } from './components/TrophyRoom';
import { BookOpen, Search, Puzzle, Shapes, Palette, Trophy } from 'lucide-react';

type TabType = 'explorer' | 'find' | 'match' | 'words' | 'draw' | 'trophies';

export default function App() {
  const [users, setUsers] = useState<User[]>(() => getStoredUsers());
  const [activeUserId, setActiveId] = useState<string>(() => getActiveUserId());
  const [currentTab, setCurrentTab] = useState<TabType>('explorer');
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Award Ceremony Modal state
  const [awardCeremony, setAwardCeremony] = useState<{
    open: boolean;
    trophy: TrophyDefinition | null;
    userTrophy?: UserTrophy;
    isNew: boolean;
  }>({
    open: false,
    trophy: null,
    userTrophy: undefined,
    isNew: false
  });

  const activeUser = users.find((u) => u.id === activeUserId) || users[0];

  // Keep storage in sync
  const updateUserState = (updatedUser: User) => {
    const nextUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(nextUsers);
    saveStoredUsers(nextUsers);

    // Evaluate trophy unlock
    const { updatedUser: finalUser, newlyUnlocked } = checkAndAwardTrophies(updatedUser);
    if (newlyUnlocked.length > 0) {
      const updatedList = nextUsers.map((u) => (u.id === finalUser.id ? finalUser : u));
      setUsers(updatedList);
      saveStoredUsers(updatedList);

      // Trigger award ceremony for the first new trophy
      const earnedRecord = finalUser.trophies.find((t) => t.trophyId === newlyUnlocked[0].id);
      setAwardCeremony({
        open: true,
        trophy: newlyUnlocked[0],
        userTrophy: earnedRecord,
        isNew: true
      });
    }
  };

  const handleSelectUser = (user: User) => {
    setActiveId(user.id);
    setActiveUserId(user.id);
  };

  const handleCreateUser = (name: string, avatar: string, colorTheme: string) => {
    const newUser = createNewUser(name, avatar, colorTheme);
    const updated = getStoredUsers();
    setUsers(updated);
    setActiveId(newUser.id);
  };

  const handleDeleteUser = (userId: string) => {
    const updated = deleteUser(userId);
    setUsers(updated);
    setActiveId(getActiveUserId());
  };

  const handleToggleSound = () => {
    soundManager.enabled = !soundEnabled;
    setSoundEnabled(!soundEnabled);
  };

  // Game action triggers
  const handleAddStar = (count = 1) => {
    if (!activeUser) return;
    const updated: User = {
      ...activeUser,
      stars: activeUser.stars + count
    };
    updateUserState(updated);
  };

  const handleExploreLetter = (letter: string) => {
    if (!activeUser) return;
    const explored = new Set(activeUser.stats.lettersExplored);
    const wasNew = !explored.has(letter);
    explored.add(letter);

    const updated: User = {
      ...activeUser,
      stars: wasNew ? activeUser.stars + 1 : activeUser.stars,
      stats: {
        ...activeUser.stats,
        lettersExplored: Array.from(explored)
      }
    };
    updateUserState(updated);
  };

  const handleFindSuccess = () => {
    if (!activeUser) return;
    const streak = activeUser.stats.currentStreak + 1;
    const bestStreak = Math.max(activeUser.stats.bestStreak, streak);
    const updated: User = {
      ...activeUser,
      stars: activeUser.stars + 1,
      stats: {
        ...activeUser.stats,
        findCorrect: activeUser.stats.findCorrect + 1,
        currentStreak: streak,
        bestStreak: bestStreak,
        totalGamesPlayed: activeUser.stats.totalGamesPlayed + 1
      }
    };
    updateUserState(updated);
  };

  const handleFindMistake = () => {
    if (!activeUser) return;
    const updated: User = {
      ...activeUser,
      stats: {
        ...activeUser.stats,
        currentStreak: 0,
        totalGamesPlayed: activeUser.stats.totalGamesPlayed + 1
      }
    };
    updateUserState(updated);
  };

  const handleMatchRoundWon = () => {
    if (!activeUser) return;
    const updated: User = {
      ...activeUser,
      stars: activeUser.stars + 2,
      stats: {
        ...activeUser.stats,
        matchRoundsWon: activeUser.stats.matchRoundsWon + 1,
        totalGamesPlayed: activeUser.stats.totalGamesPlayed + 1
      }
    };
    updateUserState(updated);
  };

  const handleWordSuccess = () => {
    if (!activeUser) return;
    const updated: User = {
      ...activeUser,
      stars: activeUser.stars + 1,
      stats: {
        ...activeUser.stats,
        wordsCorrect: activeUser.stats.wordsCorrect + 1,
        totalGamesPlayed: activeUser.stats.totalGamesPlayed + 1
      }
    };
    updateUserState(updated);
  };

  const handleWordMistake = () => {
    if (!activeUser) return;
    const updated: User = {
      ...activeUser,
      stats: {
        ...activeUser.stats,
        totalGamesPlayed: activeUser.stats.totalGamesPlayed + 1
      }
    };
    updateUserState(updated);
  };

  const handleLetterDrawn = () => {
    if (!activeUser) return;
    const updated: User = {
      ...activeUser,
      stars: activeUser.stars + 1,
      stats: {
        ...activeUser.stats,
        totalGamesPlayed: activeUser.stats.totalGamesPlayed + 1
      }
    };
    updateUserState(updated);
  };

  const handleManualAward = (trophyId: string, customNote?: string) => {
    if (!activeUser) return;
    const { updatedUser, trophy } = awardCustomTrophy(activeUser, trophyId, customNote);
    const nextUsers = users.map((u) => (u.id === updatedUser.id ? updatedUser : u));
    setUsers(nextUsers);
    saveStoredUsers(nextUsers);

    const userTrophy = updatedUser.trophies.find((t) => t.trophyId === trophyId);
    setAwardCeremony({
      open: true,
      trophy,
      userTrophy,
      isNew: true
    });
  };

  const handleInspectTrophy = (trophy: TrophyDefinition, userTrophy?: UserTrophy) => {
    soundManager.playPop();
    setAwardCeremony({
      open: true,
      trophy,
      userTrophy,
      isNew: false
    });
  };

  // User Theme Background Gradients
  const themeBg = {
    blue: 'from-blue-100 via-indigo-50 to-pink-100',
    pink: 'from-pink-100 via-rose-50 to-purple-100',
    green: 'from-emerald-100 via-teal-50 to-yellow-100',
    purple: 'from-purple-100 via-fuchsia-50 to-blue-100',
    amber: 'from-amber-100 via-yellow-50 to-orange-100',
    orange: 'from-orange-100 via-amber-50 to-red-100'
  }[activeUser?.colorTheme || 'blue'];

  return (
    <div className={`min-h-screen bg-gradient-to-b ${themeBg} flex flex-col justify-between transition-colors duration-500`}>
      {/* Navigation Header */}
      <Navbar
        activeUser={activeUser}
        onOpenUserModal={() => setUserModalOpen(true)}
        onOpenTrophies={() => setCurrentTab('trophies')}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenCelebrateModal={() => setCurrentTab('trophies')}
      />

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto w-full px-3 sm:px-6 py-4 flex-grow">
        {/* Navigation Tabs (Colorful 3D buttons) */}
        <nav className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-2.5 mb-6">
          <button
            onClick={() => {
              soundManager.playPop();
              setCurrentTab('explorer');
            }}
            className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'explorer'
                ? 'bg-blue-600 text-white shadow-lg border-b-4 border-blue-900 scale-102'
                : 'bg-white hover:bg-blue-50 text-slate-700 shadow-sm border-2 border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4 text-blue-500" />
            <span>1. Explorar</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setCurrentTab('find');
            }}
            className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'find'
                ? 'bg-rose-500 text-white shadow-lg border-b-4 border-rose-800 scale-102'
                : 'bg-white hover:bg-rose-50 text-slate-700 shadow-sm border-2 border-slate-200'
            }`}
          >
            <Search className="w-4 h-4 text-rose-500" />
            <span>2. Busca la Letra</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setCurrentTab('match');
            }}
            className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'match'
                ? 'bg-emerald-600 text-white shadow-lg border-b-4 border-emerald-900 scale-102'
                : 'bg-white hover:bg-emerald-50 text-slate-700 shadow-sm border-2 border-slate-200'
            }`}
          >
            <Puzzle className="w-4 h-4 text-emerald-500" />
            <span>3. Emparejar</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setCurrentTab('words');
            }}
            className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'words'
                ? 'bg-purple-600 text-white shadow-lg border-b-4 border-purple-900 scale-102'
                : 'bg-white hover:bg-purple-50 text-slate-700 shadow-sm border-2 border-slate-200'
            }`}
          >
            <Shapes className="w-4 h-4 text-purple-500" />
            <span>4. ¿Qué empieza?</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setCurrentTab('draw');
            }}
            className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'draw'
                ? 'bg-teal-600 text-white shadow-lg border-b-4 border-teal-900 scale-102'
                : 'bg-white hover:bg-teal-50 text-slate-700 shadow-sm border-2 border-slate-200'
            }`}
          >
            <Palette className="w-4 h-4 text-teal-500" />
            <span>5. Trazar y Pintar</span>
          </button>

          <button
            onClick={() => {
              soundManager.playPop();
              setCurrentTab('trophies');
            }}
            className={`py-3 px-2 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              currentTab === 'trophies'
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 shadow-lg border-b-4 border-amber-700 scale-102 ring-2 ring-yellow-300'
                : 'bg-white hover:bg-yellow-50 text-amber-900 shadow-sm border-2 border-amber-300'
            }`}
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>🏆 Trofeos ({activeUser.trophies.length})</span>
          </button>
        </nav>

        {/* Tab Content Display */}
        {currentTab === 'explorer' && (
          <ExplorerMode user={activeUser} onExploreLetter={handleExploreLetter} />
        )}

        {currentTab === 'find' && (
          <FindGame user={activeUser} onSuccess={handleFindSuccess} onMistake={handleFindMistake} />
        )}

        {currentTab === 'match' && (
          <MatchGame
            user={activeUser}
            onRoundComplete={handleMatchRoundWon}
            onAddStar={handleAddStar}
          />
        )}

        {currentTab === 'words' && (
          <WordsGame user={activeUser} onSuccess={handleWordSuccess} onMistake={handleWordMistake} />
        )}

        {currentTab === 'draw' && (
          <DrawingMode user={activeUser} onLetterDrawn={handleLetterDrawn} />
        )}

        {currentTab === 'trophies' && (
          <TrophyRoom
            user={activeUser}
            onSelectTrophy={handleInspectTrophy}
            onAwardTrophy={handleManualAward}
          />
        )}
      </main>

      {/* User Manager / Switcher Modal */}
      {userModalOpen && (
        <UserModal
          users={users}
          activeUser={activeUser}
          onSelectUser={handleSelectUser}
          onCreateUser={handleCreateUser}
          onDeleteUser={handleDeleteUser}
          onClose={() => setUserModalOpen(false)}
        />
      )}

      {/* Award Ceremony Celebration Modal (with engraved name) */}
      {awardCeremony.open && awardCeremony.trophy && (
        <AwardCeremonyModal
          trophy={awardCeremony.trophy}
          userTrophy={awardCeremony.userTrophy}
          winnerName={awardCeremony.userTrophy?.winnerName || activeUser.name}
          avatar={activeUser.avatar}
          stars={activeUser.stars}
          isNewAward={awardCeremony.isNew}
          onClose={() => setAwardCeremony((prev) => ({ ...prev, open: false }))}
        />
      )}

      {/* Footer */}
      <footer className="text-center py-4 px-4 text-slate-500 text-xs sm:text-sm font-semibold">
        <p className="flex items-center justify-center gap-1 flex-wrap">
          <span>¡El Mágico Abecedario! 🌟 Diseñado con amor para aprender las letras, sumar estrellas y ganar trofeos dorados.</span>
        </p>
      </footer>
    </div>
  );
}
