import React, { useState, useEffect, useCallback } from 'react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { AlphabetItem, User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, CheckCircle2, RotateCcw, Puzzle, Heart } from 'lucide-react';

interface MatchGameProps {
  user: User;
  onRoundComplete: () => void;
  onAddStar: () => void;
}

export const MatchGame: React.FC<MatchGameProps> = ({ user, onRoundComplete, onAddStar }) => {
  const [roundItems, setRoundItems] = useState<AlphabetItem[]>([]);
  const [upperCards, setUpperCards] = useState<AlphabetItem[]>([]);
  const [lowerCards, setLowerCards] = useState<AlphabetItem[]>([]);

  const [selectedUpper, setSelectedUpper] = useState<string | null>(null);
  const [selectedLower, setSelectedLower] = useState<string | null>(null);
  const [matchedLetters, setMatchedLetters] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'correct' | 'wrong' | null }>({ msg: '', type: null });

  const initRound = useCallback(() => {
    setMatchedLetters([]);
    setSelectedUpper(null);
    setSelectedLower(null);
    setFeedback({ msg: '', type: null });

    // Pick 4 random letters
    const shuffled = [...ALPHABET_DATA].sort(() => Math.random() - 0.5);
    const chosen = shuffled.slice(0, 4);
    setRoundItems(chosen);

    // Shuffle separately for columns
    const uShuffled = [...chosen].sort(() => Math.random() - 0.5);
    const lShuffled = [...chosen].sort(() => Math.random() - 0.5);

    setUpperCards(uShuffled);
    setLowerCards(lShuffled);

    setTimeout(() => {
      soundManager.speak(`¡Une cada mayúscula azul con su minúscula rosa, ${user.name}!`);
    }, 200);
  }, [user.name]);

  useEffect(() => {
    initRound();
  }, [initRound]);

  // Handle upper card click
  const handleUpperClick = (letter: string) => {
    if (matchedLetters.includes(letter)) return;
    soundManager.playPop();
    soundManager.speak(letter);
    setSelectedUpper(letter);
  };

  // Handle lower card click
  const handleLowerClick = (letter: string) => {
    if (matchedLetters.includes(letter)) return;
    soundManager.playPop();
    soundManager.speak(letter.toLowerCase());
    setSelectedLower(letter);
  };

  // Check matching whenever both are selected
  useEffect(() => {
    if (selectedUpper && selectedLower) {
      if (selectedUpper === selectedLower) {
        // Correct pair!
        soundManager.playCorrect();
        const letter = selectedUpper;
        setMatchedLetters((prev) => [...prev, letter]);
        setFeedback({ msg: `¡Pareja perfecta para la letra ${letter}! 🌟`, type: 'correct' });
        onAddStar();

        setSelectedUpper(null);
        setSelectedLower(null);

        // Check if round is finished
        if (matchedLetters.length + 1 >= 4) {
          setTimeout(() => {
            soundManager.playTrophyFanfare();
            try {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.6 }
              });
            } catch {
              // fallback
            }
            setFeedback({ msg: `¡Completaste todas las parejas, ${user.name}! 🎉`, type: 'correct' });
            soundManager.speak(`¡Increíble, ${user.name}! ¡Todas las parejas son correctas!`);
            onRoundComplete();

            setTimeout(() => {
              initRound();
            }, 2000);
          }, 400);
        }
      } else {
        // Wrong pair
        soundManager.playIncorrect();
        setFeedback({ msg: 'Esas dos no son pareja. ¡Sigue buscando!', type: 'wrong' });
        const timer = setTimeout(() => {
          setSelectedUpper(null);
          setSelectedLower(null);
        }, 700);
        return () => clearTimeout(timer);
      }
    }
  }, [selectedUpper, selectedLower, matchedLetters, onAddStar, onRoundComplete, initRound, user.name]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-1.5">
            <Puzzle className="w-3.5 h-3.5 text-yellow-300" />
            Juego 3: Emparejar Letras
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Une Mayúsculas y Minúsculas
          </h2>
          <p className="text-emerald-100 text-xs sm:text-sm font-medium">
            Toca una letra grande (Mayúscula) y luego su compañera pequeña (Minúscula).
          </p>
        </div>

        <button
          onClick={() => {
            soundManager.playPop();
            initRound();
          }}
          className="bg-white/25 hover:bg-white/35 backdrop-blur-md border border-white/40 text-white font-black px-4 py-2 rounded-2xl flex items-center gap-2 text-sm shadow transition-all active:scale-95 cursor-pointer"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Nuevas Letras</span>
        </button>
      </div>

      {/* Matching Board */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-emerald-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8">
          {/* Column 1: Uppercase */}
          <div className="bg-blue-50/80 rounded-3xl p-4 sm:p-5 border-3 border-blue-200">
            <h3 className="text-center font-black text-blue-900 text-lg mb-3 flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span>
              Mayúsculas (Grandes)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {upperCards.map((item) => {
                const isMatched = matchedLetters.includes(item.letter);
                const isSelected = selectedUpper === item.letter;

                return (
                  <button
                    key={item.letter}
                    onClick={() => handleUpperClick(item.letter)}
                    disabled={isMatched}
                    className={`h-24 sm:h-28 rounded-2xl border-4 text-5xl sm:text-6xl font-black flex items-center justify-center shadow-md transition-all cursor-pointer ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-600 opacity-60 pointer-events-none'
                        : isSelected
                        ? 'bg-blue-500 border-blue-700 text-white scale-105 shadow-xl ring-4 ring-blue-300'
                        : 'bg-white hover:bg-blue-100 border-blue-300 text-blue-600 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isMatched ? <CheckCircle2 className="w-10 h-10 text-emerald-600" /> : item.letter}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Column 2: Lowercase */}
          <div className="bg-pink-50/80 rounded-3xl p-4 sm:p-5 border-3 border-pink-200">
            <h3 className="text-center font-black text-pink-900 text-lg mb-3 flex items-center justify-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500"></span>
              Minúsculas (Pequeñas)
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {lowerCards.map((item) => {
                const isMatched = matchedLetters.includes(item.letter);
                const isSelected = selectedLower === item.letter;

                return (
                  <button
                    key={item.letter}
                    onClick={() => handleLowerClick(item.letter)}
                    disabled={isMatched}
                    className={`h-24 sm:h-28 rounded-2xl border-4 text-5xl sm:text-6xl font-black flex items-center justify-center shadow-md transition-all cursor-pointer ${
                      isMatched
                        ? 'bg-emerald-100 border-emerald-400 text-emerald-600 opacity-60 pointer-events-none'
                        : isSelected
                        ? 'bg-pink-500 border-pink-700 text-white scale-105 shadow-xl ring-4 ring-pink-300'
                        : 'bg-white hover:bg-pink-100 border-pink-300 text-pink-600 hover:scale-105 active:scale-95'
                    }`}
                  >
                    {isMatched ? <CheckCircle2 className="w-10 h-10 text-emerald-600" /> : item.lower}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Feedback Area */}
        <div className="text-center mt-6 min-h-[44px] flex items-center justify-center">
          {feedback.msg ? (
            <div
              className={`py-2.5 px-6 rounded-2xl text-base sm:text-lg font-black animate-bounce shadow-md ${
                feedback.type === 'correct'
                  ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400'
                  : 'bg-red-100 text-red-800 border-2 border-red-400'
              }`}
            >
              {feedback.msg}
            </div>
          ) : (
            <span className="text-xs sm:text-sm font-bold text-slate-400">
              Parejas completadas: {matchedLetters.length} de 4
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
