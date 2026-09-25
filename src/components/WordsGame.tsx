import React, { useState, useEffect, useCallback } from 'react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { AlphabetItem, User } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Shapes, Volume2, Sparkles, Star } from 'lucide-react';

interface WordsGameProps {
  user: User;
  onSuccess: () => void;
  onMistake: () => void;
}

export const WordsGame: React.FC<WordsGameProps> = ({ user, onSuccess, onMistake }) => {
  const [target, setTarget] = useState<AlphabetItem | null>(null);
  const [choices, setChoices] = useState<AlphabetItem[]>([]);
  const [feedback, setFeedback] = useState<{ msg: string; type: 'correct' | 'wrong' | null }>({ msg: '', type: null });
  const [revealed, setRevealed] = useState(false);
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);

  const initRound = useCallback(() => {
    setFeedback({ msg: '', type: null });
    setRevealed(false);
    setSelectedLetter(null);

    const randomItem = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
    setTarget(randomItem);

    const roundChoices = [randomItem];
    while (roundChoices.length < 3) {
      const candidate = ALPHABET_DATA[Math.floor(Math.random() * ALPHABET_DATA.length)];
      if (!roundChoices.some((c) => c.letter === candidate.letter)) {
        roundChoices.push(candidate);
      }
    }
    roundChoices.sort(() => Math.random() - 0.5);
    setChoices(roundChoices);

    setTimeout(() => {
      soundManager.speak(`${randomItem.word}. ¿Con qué letra empieza la palabra ${randomItem.word}?`);
    }, 250);
  }, []);

  useEffect(() => {
    initRound();
  }, [initRound]);

  const speakWord = () => {
    if (target) {
      soundManager.playPop();
      soundManager.speak(`${target.word}. ¿Con qué letra empieza?`);
    }
  };

  const handleChoice = (item: AlphabetItem) => {
    if (!target || selectedLetter) return;
    setSelectedLetter(item.letter);

    if (item.letter === target.letter) {
      soundManager.playCorrect();
      setRevealed(true);
      setFeedback({
        msg: `¡Siii! ¡${target.word} empieza con la letra ${item.letter}! ⭐`,
        type: 'correct'
      });

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // fallback
      }

      soundManager.speak(`¡Excelente, ${user.name}! ${target.word} empieza con la letra ${item.letter}.`);
      onSuccess();

      setTimeout(() => {
        initRound();
      }, 2000);
    } else {
      soundManager.playIncorrect();
      setFeedback({
        msg: `No es la ${item.letter}. ¡Escucha bien: "${target.word}"!`,
        type: 'wrong'
      });
      soundManager.speak(`No es la ${item.letter}. ¿Con qué letra empieza ${target.word}?`);
      onMistake();

      setTimeout(() => {
        setSelectedLetter(null);
      }, 900);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-500 via-purple-500 to-pink-500 rounded-3xl p-5 sm:p-6 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5 mb-1.5">
            <Shapes className="w-3.5 h-3.5 text-yellow-300" />
            Juego 4: ¿Con qué letra empieza?
          </span>
          <h2 className="text-2xl sm:text-3xl font-black">
            Mago de las Palabras
          </h2>
          <p className="text-purple-100 text-xs sm:text-sm font-medium">
            Mira la imagen o escucha la palabra y elige la letra inicial correcta.
          </p>
        </div>

        <div className="bg-white/25 backdrop-blur-md border border-white/40 px-3.5 py-1.5 rounded-2xl flex items-center gap-1.5 text-yellow-300 font-bold text-sm">
          <Star className="w-4 h-4 fill-yellow-300" />
          <span>Aciertos: {user.stats.wordsCorrect}</span>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 sm:p-8 shadow-2xl border-4 border-purple-200 text-center">
        {target && (
          <div className="bg-gradient-to-b from-amber-50 to-orange-50 border-3 border-amber-300 rounded-3xl p-6 mb-6 flex flex-col items-center shadow-inner">
            {/* Big Emoji */}
            <div
              onClick={speakWord}
              className="text-8xl sm:text-9xl mb-3 cursor-pointer transform hover:scale-110 active:scale-95 transition-transform drop-shadow"
              title="Toca para escuchar la palabra"
            >
              {target.emoji}
            </div>

            {/* Masked Word */}
            <div className="text-3xl sm:text-4xl font-black tracking-wider text-slate-800 my-2">
              {revealed ? (
                <span className="text-purple-700 animate-bounce">{target.word}</span>
              ) : (
                <>
                  <span className="text-pink-600 underline decoration-4 decoration-amber-400">_ </span>
                  <span>{target.word.slice(1)}</span>
                </>
              )}
            </div>

            <button
              onClick={speakWord}
              className="mt-2 bg-amber-200 hover:bg-amber-300 text-amber-950 font-black px-4 py-2 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 text-amber-800" />
              <span>Escuchar Palabra</span>
            </button>
          </div>
        )}

        {/* 3 Letter Choices */}
        <div className="grid grid-cols-3 gap-3 sm:gap-4 max-w-md mx-auto">
          {choices.map((item) => {
            const isSelected = selectedLetter === item.letter;
            const isCorrect = isSelected && target && item.letter === target.letter;
            const isWrong = isSelected && target && item.letter !== target.letter;

            return (
              <button
                key={item.letter}
                onClick={() => handleChoice(item)}
                disabled={Boolean(selectedLetter && isCorrect)}
                className={`h-24 sm:h-28 rounded-3xl border-4 flex items-center justify-center text-4xl sm:text-5xl font-black shadow-lg transition-all transform hover:-translate-y-1 active:scale-95 cursor-pointer ${
                  isCorrect
                    ? 'bg-emerald-100 border-emerald-500 text-emerald-700 ring-4 ring-emerald-300 scale-105'
                    : isWrong
                    ? 'bg-red-100 border-red-500 text-red-600'
                    : `${item.color.bg} ${item.color.border} ${item.color.text}`
                }`}
              >
                {item.letter}
              </button>
            );
          })}
        </div>

        {/* Feedback Area */}
        {feedback.msg && (
          <div
            className={`mt-6 py-3 px-6 rounded-2xl text-base sm:text-lg font-black inline-block animate-bounce ${
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
