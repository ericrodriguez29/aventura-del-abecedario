import React, { useState, useEffect, useCallback } from 'react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { AlphabetItem, User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Volume2, Sparkles, Flame, CheckCircle2, RotateCcw, Award } from 'lucide-react';

interface FindGameProps {
  user: User;
  onSuccess: () => void;
  onMistake: () => void;
}

export const FindGame: React.FC<FindGameProps> = ({ user, onSuccess, onMistake }) => {
  const [target, setTarget] = useState<AlphabetItem | null>(null);
  const [choices, setChoices] = useState<AlphabetItem[]>([]);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'correct' | 'wrong' | null }>({ msg: '', type: null });
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const startNewRound = useCallback(() => {
    setFeedback({ msg: '', type: null });
    setSelectedLetter(null);

    // Pick random target
    const randomTarget = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    setTarget(randomTarget);

    // Pick 3 random distinct distractors
    const roundChoices = [randomTarget];
    while (roundChoices.length < 4) {
      const candidate = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      if (!roundChoices.some((c) => c.letter === candidate.letter)) {
        roundChoices.push(candidate);
      }
    }

    // Shuffle
    roundChoices.sort(() => Math.random() - 0.5);
    setChoices(roundChoices);

    // Speak prompt
    setTimeout(() => {
      soundManager.speak(`¿Dónde está la letra ${randomTarget.letter}? ¡Encuéntrala, ${user.name}!`);
    }, 250);
  }, [user.name]);

  useEffect(() => {
    startNewRound();
  }, [startNewRound]);

  const handleSpeakPrompt = () => {
    if (target) {
      soundManager.playPop();
      soundManager.speak(`¿Dónde está la letra ${target.letter}?`);
    }
  };

  const handleChoice = (item: AlphabetItem) => {
    if (!target || selectedLetter) return;
    setSelectedLetter(item.letter);

    if (item.letter === target.letter) {
      soundManager.playCorrect();
      setFeedback({ msg: `¡Increíble, ${user.name}! ¡Es la letra ${item.letter}! ⭐`, type: 'correct' });
      
      try {
        confetti({
          particleCount: 40,
          spread: 50,
          origin: { y: 0.6 }
        });
      } catch {
        // Confetti fallback
      }

      soundManager.speak(`¡Muy bien, ${user.name}! ¡Acertaste la letra ${item.letter}!`);
      onSuccess();

      setTimeout(() => {
        startNewRound();
      }, 1600);
    } else {
      soundManager.playIncorrect();
      setFeedback({ msg: `Esa es la letra ${item.letter}. ¡Busca la letra ${target.letter}!`, type: 'wrong' });
      soundManager.speak(`Esa es la letra ${item.letter}. ¡Intenta encontrar la letra ${target.letter}!`);
      onMistake();

      setTimeout(() => {
        setSelectedLetter(null);
      }, 900);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header card with streak */}
      <div className="bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-1.5">
            <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
            Juego 2: Busca la Letra
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            ¿Dónde está la letra?
          </h2>
          <p className="text-pink-100 text-xs sm:text-sm font-medium">
            Escucha con atención y presiona la opción correcta.
          </p>
        </div>

        {/* Streak indicator */}
        <div className="bg-white/25 backdrop-blur-md border border-white/40 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-inner">
          <Flame className={`w-6 h-6 ${user.stats.currentStreak > 0 ? 'text-yellow-300 animate-bounce' : 'text-white/60'}`} />
          <div className="text-left">
            <div className="text-[10px] uppercase font-bold text-pink-100">Racha actual:</div>
            <div className="text-lg font-black leading-none">{user.stats.currentStreak} aciertos</div>
          </div>
        </div>
      </div>

      {/* Main Game Arena */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-rose-200 text-center">
        {/* Big Audio Callout Button */}
        <div className="mb-6 flex flex-col items-center">
          <button
            onClick={handleSpeakPrompt}
            className="group relative bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-5 rounded-3xl shadow-xl border-b-4 border-blue-900 flex items-center justify-center gap-4 text-xl sm:text-2xl font-black transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center animate-pulse">
              <Volume2 className="w-8 h-8 text-yellow-300" />
            </div>
            <span>¡Escuchar Letra!</span>
          </button>
          <span className="text-xs font-bold text-slate-400 mt-2">
            (Toca el botón azul si quieres escuchar la letra otra vez)
          </span>
        </div>

        {/* 4 Multi-Color Option Cards */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          {choices.map((item) => {
            const isSelected = selectedLetter === item.letter;
            const isCorrect = isSelected && target && item.letter === target.letter;
            const isWrong = isSelected && target && item.letter !== target.letter;

            return (
              <button
                key={item.letter}
                onClick={() => handleChoice(item)}
                disabled={Boolean(selectedLetter && isCorrect)}
                className={`p-6 sm:p-8 rounded-3xl border-4 flex flex-col items-center justify-center gap-2 shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer ${
                  isCorrect
                    ? 'bg-emerald-100 border-emerald-500 ring-4 ring-emerald-300 scale-105'
                    : isWrong
                    ? 'bg-red-100 border-red-500 animate-shake'
                    : `${item.color.bg} ${item.color.border} hover:shadow-xl`
                }`}
              >
                <div className="flex items-baseline gap-1">
                  <span className={`text-5xl sm:text-6xl font-black ${item.color.text}`}>
                    {item.letter}
                  </span>
                  <span className="text-3xl sm:text-4xl font-extrabold text-pink-600">
                    {item.lower}
                  </span>
                </div>
                <span className="text-2xl">{item.emoji}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {feedback.msg && (
          <div
            className={`mt-6 py-3 px-4 rounded-2xl text-base sm:text-lg font-black inline-block animate-bounce ${
              feedback.type === 'correct'
                ? 'bg-emerald-100 text-emerald-800 border-2 border-emerald-400'
                : 'bg-red-100 text-red-800 border-2 border-red-400'
            }`}
          >
            {feedback.msg}
          </div>
        )}
      </div>
    </div>
  );
};
