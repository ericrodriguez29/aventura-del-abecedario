import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { TrophyDefinition, UserTrophy } from '../types';
import { soundManager } from '../utils/audio';
import { X, Trophy, Sparkles, Printer, Share2, Award, Star, Volume2 } from 'lucide-react';

interface AwardCeremonyModalProps {
  trophy: TrophyDefinition;
  userTrophy?: UserTrophy;
  winnerName: string;
  avatar: string;
  stars: number;
  onClose: () => void;
  isNewAward?: boolean;
}

export const AwardCeremonyModal: React.FC<AwardCeremonyModalProps> = ({
  trophy,
  userTrophy,
  winnerName,
  avatar,
  stars,
  onClose,
  isNewAward = false
}) => {
  useEffect(() => {
    // Launch celebratory confetti
    soundManager.playTrophyFanfare();

    try {
      const duration = 2.5 * 1000;
      const animationEnd = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 7,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 }
        });
        confetti({
          particleCount: 7,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 }
        });

        if (Date.now() < animationEnd) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    } catch {
      // Confetti fallback
    }

    // Speak announcement
    setTimeout(() => {
      soundManager.speak(
        `¡Atención todos! ¡Felicidades, ${winnerName}! Has ganado el trofeo: ${trophy.title}. ¡Eres un gran campeón del abecedario!`,
        0.95
      );
    }, 400);

    return () => {
      soundManager.stopSpeech();
    };
  }, [trophy, winnerName]);

  const printDiploma = () => {
    window.print();
  };

  const handleSpeakAgain = () => {
    soundManager.playPop();
    soundManager.speak(`¡Trofeo para ${winnerName}! ${trophy.title}. ${trophy.description}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      {/* Modal Container */}
      <div className="relative w-full max-w-xl bg-gradient-to-b from-amber-50 via-white to-amber-100 rounded-3xl shadow-2xl border-4 border-amber-400 p-6 sm:p-8 text-center my-auto overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 w-10 h-10 rounded-full flex items-center justify-center text-xl font-black transition-transform active:scale-90 z-20 shadow"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Header Ribbon / Banner */}
        <div className="inline-block bg-gradient-to-r from-red-500 via-amber-500 to-red-500 text-white font-extrabold text-sm sm:text-base px-6 py-2 rounded-full shadow-lg border-2 border-amber-300 uppercase tracking-wider mb-3 animate-pulse">
          🎉 ¡CEREMONIA DE PREMIACIÓN! 🎉
        </div>

        {/* User Winner Callout */}
        <div className="flex items-center justify-center gap-2 mb-2">
          <span className="text-3xl">{avatar}</span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-800">
            ¡Felicitaciones, <span className="text-blue-600 underline decoration-amber-400 decoration-wavy">{winnerName}</span>!
          </h2>
        </div>

        <p className="text-slate-600 text-sm font-medium mb-4 max-w-md mx-auto">
          {isNewAward
            ? '¡Has desbloqueado un nuevo trofeo oficial con tu nombre grabado!'
            : 'Trofeo oficial otorgado y exhibido en tu vitrina de campeones.'}
        </p>

        {/* Centerpiece Trophy Display */}
        <div className="my-4 relative flex flex-col items-center justify-center">
          {/* Animated Background Rays */}
          <div className="absolute w-64 h-64 bg-amber-300/30 rounded-full blur-2xl animate-pulse pointer-events-none"></div>

          {/* Trophy Icon */}
          <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 bg-gradient-to-tr from-yellow-300 via-amber-100 to-yellow-400 rounded-full border-4 border-amber-400 shadow-2xl flex items-center justify-center text-8xl sm:text-9xl transform hover:scale-105 transition-transform">
            {trophy.icon}
            <div className="absolute -top-1 -right-1 text-amber-500 animate-spin" style={{ animationDuration: '6s' }}>
              <Sparkles className="w-8 h-8" />
            </div>
          </div>

          {/* Trophy Title */}
          <h3 className="mt-4 text-xl sm:text-2xl font-black text-amber-900 tracking-wide">
            {trophy.title}
          </h3>

          <p className="text-sm font-semibold text-amber-800 mt-1 max-w-sm">
            « {trophy.description} »
          </p>

          {/* THE ENGRAVED GOLDEN PLAQUE WITH WINNER NAME */}
          <div className="w-full max-w-md mt-5">
            <div className="mx-auto w-4/5 h-2 bg-yellow-700/60 rounded-t-sm"></div>
            <div className="trophy-plaque py-3 px-4 rounded-2xl border-3 border-yellow-700/60 shadow-xl text-center relative shine-effect">
              <div className="text-[11px] sm:text-xs font-black tracking-widest text-amber-950 uppercase flex items-center justify-center gap-1.5">
                <Trophy className="w-4 h-4 text-yellow-800" />
                TROFEO OFICIAL DE HONOR
                <Trophy className="w-4 h-4 text-yellow-800" />
              </div>

              {/* The Winner Name */}
              <div className="text-xl sm:text-3xl font-black text-amber-950 my-1 tracking-wider drop-shadow-sm">
                ⭐ {winnerName} ⭐
              </div>

              <div className="text-xs font-bold text-amber-900 italic">
                "{trophy.quote}"
              </div>

              <div className="flex items-center justify-between text-[11px] font-semibold text-amber-900 border-t border-amber-700/30 mt-2 pt-1 px-2">
                <span className="flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-700 fill-amber-500" /> {stars} Estrellas
                </span>
                <span>
                  Fecha: {new Date(userTrophy?.earnedAt || Date.now()).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
          <button
            onClick={handleSpeakAgain}
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 px-4 rounded-2xl shadow-md transition-all active:scale-95 text-sm"
          >
            <Volume2 className="w-4 h-4" />
            Escuchar Anuncio
          </button>

          <button
            onClick={printDiploma}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-2xl shadow-md transition-all active:scale-95 text-sm"
            title="Imprimir o Guardar como PDF"
          >
            <Printer className="w-4 h-4" />
            Imprimir Diploma
          </button>

          <button
            onClick={onClose}
            className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black py-2.5 px-6 rounded-2xl shadow-lg transition-all active:scale-95 text-base border-b-4 border-amber-700"
          >
            <Award className="w-5 h-5" />
            ¡Continuar Jugando!
          </button>
        </div>
      </div>
    </div>
  );
};
