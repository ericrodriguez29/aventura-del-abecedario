import React, { useState } from 'react';
import { ALPHABET_DATA } from '../data/alphabetData';
import { AlphabetItem, User } from '../types';
import { soundManager } from '../utils/audio';
import { Volume2, PlayCircle, Sparkles, CheckCircle2, X, HelpCircle } from 'lucide-react';

interface ExplorerModeProps {
  user: User;
  onExploreLetter: (letter: string) => void;
}

export const ExplorerMode: React.FC<ExplorerModeProps> = ({ user, onExploreLetter }) => {
  const [selectedLetter, setSelectedLetter] = useState<AlphabetItem | null>(null);
  const [isPlayingSong, setIsPlayingSong] = useState(false);

  const handleOpenLetter = (item: AlphabetItem) => {
    soundManager.playPop();
    setSelectedLetter(item);
    onExploreLetter(item.letter);
    speakLetterDetails(item);
  };

  const speakLetterDetails = (item: AlphabetItem) => {
    soundManager.speak(
      `Letra ${item.letter} mayúscula, y ${item.lower} minúscula. ${item.phonicHint}. ${item.word}. ${item.sentence}.`
    );
  };

  const handlePlayFullAlphabet = () => {
    if (isPlayingSong) return;
    setIsPlayingSong(true);
    soundManager.playCorrect();

    let i = 0;
    const interval = setInterval(() => {
      if (i < ALPHABET_DATA.length) {
        const item = ALPHABET_DATA[i];
        soundManager.speak(item.letter);
        onExploreLetter(item.letter);
        i++;
      } else {
        clearInterval(interval);
        setIsPlayingSong(false);
        soundManager.speak(`¡Excelente! ¡${user.name} cantó todo el abecedario!`);
      }
    }, 850);
  };

  const exploredCount = user.stats.lettersExplored.length;
  const progressPercent = Math.min(100, Math.round((exploredCount / 27) * 100));

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Banner with Rainbow Palette & Progress */}
      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 rounded-3xl p-5 sm:p-7 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              Modo 1: Explorar el Abecedario
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight">
              ¡Toca cada letra y descubre su magia, <span className="text-yellow-300">{user.name}</span>!
            </h2>
            <p className="text-blue-100 text-xs sm:text-sm font-medium mt-1 max-w-xl">
              Aprende el nombre, sonido fonético, su pareja minúscula y palabras divertidas en español.
            </p>
          </div>

          {/* Action Buttons */}
          <button
            onClick={handlePlayFullAlphabet}
            disabled={isPlayingSong}
            className={`flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-300 hover:to-amber-400 text-amber-950 font-black px-5 py-3.5 rounded-2xl shadow-lg border-b-4 border-amber-700 transition-all active:scale-95 text-xs sm:text-sm cursor-pointer ${
              isPlayingSong ? 'opacity-75 cursor-not-allowed animate-pulse' : ''
            }`}
          >
            <PlayCircle className="w-5 h-5 text-amber-950" />
            <span>{isPlayingSong ? 'Cantando...' : 'Cantar Abecedario 🎵'}</span>
          </button>
        </div>

        {/* Exploration Progress Bar */}
        <div className="mt-4 pt-3 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold text-blue-100">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span>Progreso de Exploración:</span>
            <div className="w-full sm:w-48 bg-white/30 rounded-full h-3.5 p-0.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-yellow-300 to-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
          </div>
          <span>
            {exploredCount} de 27 letras exploradas ({progressPercent}%)
          </span>
        </div>
      </div>

      {/* 27 Colorful Letters Grid */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-4 sm:p-6 shadow-xl border-4 border-slate-200">
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-3 sm:gap-4">
          {ALPHABET_DATA.map((item) => {
            const isExplored = user.stats.lettersExplored.includes(item.letter);

            return (
              <button
                key={item.letter}
                onClick={() => handleOpenLetter(item)}
                className={`relative rounded-3xl p-3 sm:p-4 flex flex-col items-center justify-between border-3 ${item.color.border} ${item.color.bg} transition-all duration-200 transform hover:-translate-y-1.5 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg group text-center cursor-pointer`}
              >
                {/* Explored checkmark badge */}
                {isExplored && (
                  <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white p-0.5 rounded-full shadow">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}

                {/* Letters Pair (Upper + Lower) */}
                <div className="flex items-baseline justify-center gap-1 my-1">
                  <span className={`text-3xl sm:text-4xl font-black ${item.color.text} group-hover:scale-110 transition-transform`}>
                    {item.letter}
                  </span>
                  <span className="text-2xl sm:text-3xl font-bold text-pink-600">
                    {item.lower}
                  </span>
                </div>

                {/* Emoji Illustration */}
                <div className="text-3xl sm:text-4xl my-1 transform group-hover:scale-125 transition-transform">
                  {item.emoji}
                </div>

                {/* Word Label */}
                <div className="w-full">
                  <span className="inline-block text-[11px] sm:text-xs font-extrabold text-slate-700 bg-white/70 px-2 py-0.5 rounded-xl truncate max-w-full">
                    {item.word}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Letter Detail Modal */}
      {selectedLetter && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-blue-400 p-6 text-center">
            <button
              onClick={() => {
                soundManager.playPop();
                setSelectedLetter(null);
              }}
              className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center font-black shadow cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Modal Title */}
            <div className="inline-block bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mb-3">
              ✨ Ficha Mágica de Aprendizaje
            </div>

            {/* Big Dual Letter Presentation */}
            <div className="flex justify-center items-center gap-4 mb-3">
              <div className="w-24 h-24 bg-blue-50 border-4 border-blue-400 rounded-3xl flex items-center justify-center text-6xl font-black text-blue-600 shadow-md">
                {selectedLetter.letter}
              </div>
              <div className="w-24 h-24 bg-pink-50 border-4 border-pink-400 rounded-3xl flex items-center justify-center text-6xl font-black text-pink-500 shadow-md">
                {selectedLetter.lower}
              </div>
            </div>

            <div className="text-xs font-bold text-slate-500 mb-2">
              <span className="text-blue-600">Mayúscula ({selectedLetter.letter})</span> y{' '}
              <span className="text-pink-600">Minúscula ({selectedLetter.lower})</span>
            </div>

            {/* Phonic Hint */}
            <div className="bg-amber-50 border-2 border-amber-300 text-amber-900 rounded-2xl py-2 px-4 mb-4 text-sm font-black flex items-center justify-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-600" />
              Sonido fonético: <span className="text-lg text-amber-700">{selectedLetter.phonicHint}</span>
            </div>

            {/* Word & Sentence */}
            <div className="bg-slate-50 border-2 border-slate-200 rounded-2xl p-4 mb-5">
              <div className="text-6xl mb-2 hover:scale-110 transition-transform">{selectedLetter.emoji}</div>
              <h3 className="text-3xl font-black text-slate-800 tracking-wide">
                {selectedLetter.word}
              </h3>
              <p className="text-slate-600 font-semibold text-sm mt-1">
                « {selectedLetter.sentence} »
              </p>
            </div>

            {/* Audio Button */}
            <button
              onClick={() => {
                soundManager.playPop();
                speakLetterDetails(selectedLetter);
              }}
              className="w-full py-3.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-lg rounded-2xl shadow-lg border-b-4 border-blue-900 flex items-center justify-center gap-3 transition-all active:scale-95 cursor-pointer"
            >
              <Volume2 className="w-6 h-6" />
              <span>Escuchar Pronunciación</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
