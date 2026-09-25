import React from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { Star, Trophy, Volume2, VolumeX, Users, Sparkles, Award } from 'lucide-react';

interface NavbarProps {
  activeUser: User;
  onOpenUserModal: () => void;
  onOpenTrophies: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenCelebrateModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeUser,
  onOpenUserModal,
  onOpenTrophies,
  soundEnabled,
  onToggleSound,
  onOpenCelebrateModal
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md shadow-md border-b-4 border-blue-400 px-3 sm:px-6 py-2.5 transition-all">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2.5">
        {/* Logo & Title */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => soundManager.playPop()}>
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-2xl sm:text-3xl shadow-md transform hover:rotate-3 transition-transform">
            <span>A</span>
            <span className="text-yellow-300 text-lg sm:text-xl">a</span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg sm:text-2xl font-black tracking-tight leading-none bg-gradient-to-r from-blue-700 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Aventura del Abecedario
              </h1>
              <Sparkles className="w-4 h-4 text-amber-500 hidden sm:inline animate-pulse" />
            </div>
            <p className="text-[11px] sm:text-xs font-bold text-slate-500 flex items-center gap-1.5 mt-0.5">
              <span className="text-blue-600">Mayúsculas</span> • <span className="text-pink-600">Minúsculas</span> • <span className="text-amber-600">¡Trofeos de Oro!</span>
            </p>
          </div>
        </div>

        {/* Right Side: Active User, Stars, Trophy Room, Sound */}
        <div className="flex items-center flex-wrap gap-2">
          {/* Active User Switcher Pill */}
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenUserModal();
            }}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-2 border-blue-300 px-2.5 py-1.5 rounded-2xl shadow-sm transition-all active:scale-95 group cursor-pointer"
            title="Cambiar o crear perfil de estudiante"
          >
            <span className="text-xl sm:text-2xl group-hover:scale-125 transition-transform">{activeUser.avatar}</span>
            <div className="text-left leading-tight hidden xs:block">
              <div className="text-[10px] uppercase tracking-wider font-bold text-slate-400">Jugador:</div>
              <div className="text-xs sm:text-sm font-black text-blue-900 truncate max-w-[90px] sm:max-w-[120px]">
                {activeUser.name}
              </div>
            </div>
            <Users className="w-3.5 h-3.5 text-blue-500 ml-0.5" />
          </button>

          {/* Stars Counter */}
          <div
            className="bg-amber-100 border-2 border-amber-400 text-amber-900 px-3 py-1.5 rounded-2xl font-black text-sm sm:text-base flex items-center gap-1.5 shadow-sm hover:scale-105 transition-transform cursor-pointer"
            onClick={() => {
              soundManager.playStarDing();
              soundManager.speak(`${activeUser.name} tiene ${activeUser.stars} estrellas mágicas.`);
            }}
            title="Estrellas Mágicas acumuladas"
          >
            <Star className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500 fill-amber-400 animate-spin" style={{ animationDuration: '8s' }} />
            <span>{activeUser.stars}</span>
          </div>

          {/* Trophy Room Button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenTrophies();
            }}
            className="relative bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-amber-950 font-black px-3 py-1.5 rounded-2xl shadow-md border-b-3 border-amber-700 flex items-center gap-1.5 text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
            title="Ver Sala de Trofeos y Premiación"
          >
            <Trophy className="w-4 h-4 text-amber-950" />
            <span className="hidden sm:inline">Trofeos</span>
            <span className="bg-amber-950 text-yellow-300 text-xs px-1.5 py-0.2 rounded-full font-bold">
              {activeUser.trophies.length}
            </span>
          </button>

          {/* Instant Award/Celebrate button */}
          <button
            onClick={() => {
              soundManager.playPop();
              onOpenCelebrateModal();
            }}
            className="hidden md:flex items-center gap-1 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-extrabold px-2.5 py-1.5 rounded-2xl shadow-md text-xs transition-all active:scale-95 border-b-2 border-pink-700 cursor-pointer"
            title="Premiar a este alumno ahora"
          >
            <Award className="w-3.5 h-3.5" />
            <span>¡Premiar!</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-2xl flex items-center justify-center shadow-sm transition-all active:scale-90 border-2 cursor-pointer ${
              soundEnabled
                ? 'bg-blue-100 border-blue-300 text-blue-600 hover:bg-blue-200'
                : 'bg-slate-100 border-slate-300 text-slate-400 hover:bg-slate-200'
            }`}
            title={soundEnabled ? 'Silenciar sonidos' : 'Activar sonidos'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 sm:w-5 sm:h-5" /> : <VolumeX className="w-4 h-4 sm:w-5 sm:h-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};
