import React from 'react';
import { TrophyDefinition, UserTrophy } from '../types';
import { Sparkles, Award, Star, CheckCircle2, Lock } from 'lucide-react';

interface TrophyItemProps {
  trophy: TrophyDefinition;
  userTrophy?: UserTrophy;
  currentUserName: string;
  onSelect: (trophy: TrophyDefinition, userTrophy?: UserTrophy) => void;
  onAwardNow?: (trophy: TrophyDefinition) => void;
}

export const TrophyItem: React.FC<TrophyItemProps> = ({
  trophy,
  userTrophy,
  currentUserName,
  onSelect,
  onAwardNow
}) => {
  const isUnlocked = !!userTrophy;
  const winnerName = userTrophy?.winnerName || currentUserName;

  // Colors & styles based on trophy tier
  const tierConfig = {
    bronze: {
      border: 'border-amber-700/60',
      bg: 'from-amber-100 via-amber-50 to-orange-100',
      badge: 'bg-amber-700 text-amber-100',
      plaqueStyle: 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-700 text-amber-950',
      glow: 'shadow-amber-500/20',
      label: 'Bronce'
    },
    silver: {
      border: 'border-slate-400',
      bg: 'from-slate-100 via-white to-blue-50',
      badge: 'bg-slate-600 text-white',
      plaqueStyle: 'trophy-plaque-silver text-slate-800',
      glow: 'shadow-blue-400/20',
      label: 'Plata'
    },
    gold: {
      border: 'border-yellow-500',
      bg: 'from-amber-100 via-yellow-50 to-amber-200',
      badge: 'bg-yellow-500 text-yellow-950 font-bold',
      plaqueStyle: 'trophy-plaque text-amber-950',
      glow: 'shadow-yellow-500/40',
      label: 'Oro Real'
    },
    diamond: {
      border: 'border-cyan-400',
      bg: 'from-cyan-100 via-blue-50 to-indigo-100',
      badge: 'bg-cyan-500 text-cyan-950 font-bold',
      plaqueStyle: 'trophy-plaque-diamond text-cyan-950',
      glow: 'shadow-cyan-400/40',
      label: 'Diamante'
    },
    rainbow: {
      border: 'border-fuchsia-400',
      bg: 'from-pink-100 via-purple-50 to-emerald-100',
      badge: 'bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-bold',
      plaqueStyle: 'bg-gradient-to-r from-pink-300 via-amber-200 to-cyan-300 text-purple-950 font-bold',
      glow: 'shadow-fuchsia-500/30',
      label: 'Arcoíris Mágico'
    },
    crown: {
      border: 'border-amber-500',
      bg: 'from-yellow-200 via-amber-100 to-rose-100',
      badge: 'bg-gradient-to-r from-amber-600 to-yellow-500 text-white font-black',
      plaqueStyle: 'trophy-plaque text-amber-950',
      glow: 'shadow-amber-500/50',
      label: 'Corona Real'
    }
  }[trophy.tier];

  return (
    <div
      onClick={() => onSelect(trophy, userTrophy)}
      className={`relative rounded-3xl p-4 transition-all duration-300 transform hover:-translate-y-1.5 cursor-pointer border-4 ${
        isUnlocked
          ? `bg-gradient-to-b ${tierConfig.bg} ${tierConfig.border} shadow-xl ${tierConfig.glow} hover:shadow-2xl`
          : 'bg-slate-100/90 border-slate-300 opacity-80 hover:opacity-100 shadow-md'
      }`}
    >
      {/* Tier Badge */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={`text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${tierConfig.badge}`}>
          {tierConfig.label}
        </span>
        {isUnlocked ? (
          <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> ¡Ganado!
          </span>
        ) : (
          <span className="flex items-center gap-1 text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
            <Lock className="w-3 h-3" /> Bloqueado
          </span>
        )}
      </div>

      {/* Trophy Visual Podium & Cup */}
      <div className="flex flex-col items-center my-3 relative">
        {/* Floating Sparkles for unlocked trophies */}
        {isUnlocked && (
          <div className="absolute -top-2 -right-2 text-amber-500 animate-bounce">
            <Sparkles className="w-6 h-6" />
          </div>
        )}

        {/* Big Icon / Cup */}
        <div
          className={`w-24 h-24 sm:w-28 sm:h-28 rounded-3xl flex items-center justify-center text-6xl sm:text-7xl shadow-inner transition-transform duration-300 hover:scale-110 ${
            isUnlocked
              ? 'bg-white/80 ring-4 ring-white/60 animate-float'
              : 'bg-slate-200 grayscale text-slate-400'
          }`}
        >
          {trophy.icon}
        </div>

        {/* Title */}
        <h4 className="font-extrabold text-slate-800 text-lg sm:text-xl text-center mt-3 leading-tight">
          {trophy.title}
        </h4>
        <p className="text-xs text-slate-600 text-center font-medium mt-1 line-clamp-2">
          {trophy.description}
        </p>

        {/* Pedestal / Base with Engraved Winner Name */}
        <div className="w-full mt-4 flex flex-col items-center">
          <div className="w-4/5 h-2 bg-slate-400 rounded-t-sm"></div>
          
          {/* Engraved Plaque */}
          <div
            className={`w-full py-2 px-3 rounded-xl border-2 border-yellow-700/40 text-center shadow-md relative overflow-hidden ${
              isUnlocked ? tierConfig.plaqueStyle : 'bg-slate-300 text-slate-500'
            }`}
          >
            <div className="text-[10px] font-bold tracking-widest uppercase opacity-85 flex items-center justify-center gap-1">
              <Award className="w-3 h-3 inline" />
              {isUnlocked ? 'GANADOR / CAMPEÓN' : 'PARA EL GANADOR'}
            </div>
            {/* The user's name prominently engraved */}
            <div className="text-sm sm:text-base font-black tracking-wide truncate mt-0.5">
              {isUnlocked ? winnerName : currentUserName}
            </div>
            {isUnlocked && userTrophy?.earnedAt && (
              <div className="text-[9px] opacity-75 font-semibold mt-0.5">
                {new Date(userTrophy.earnedAt).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer action */}
      <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-semibold flex items-center gap-1">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
          {trophy.targetCount} {trophy.category === 'stars' ? 'Estrellas' : 'Puntos'}
        </span>

        {isUnlocked ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(trophy, userTrophy);
            }}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline flex items-center gap-1"
          >
            Ver Diploma ✨
          </button>
        ) : (
          onAwardNow && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onAwardNow(trophy);
              }}
              className="font-bold bg-amber-400 hover:bg-amber-500 text-amber-950 px-2 py-1 rounded-lg shadow-sm transition-all text-[11px] active:scale-95"
            >
              ¡Premiar Ya! 🎁
            </button>
          )
        )}
      </div>
    </div>
  );
};
