import React, { useState } from 'react';
import { User, TrophyDefinition, UserTrophy } from '../types';
import { TROPHIES_LIST } from '../data/trophiesData';
import { TrophyItem } from './TrophyItem';
import { soundManager } from '../utils/audio';
import { Trophy, Award, Star, Sparkles, Printer, Gift, CheckCircle2, ChevronRight, Crown } from 'lucide-react';

interface TrophyRoomProps {
  user: User;
  onSelectTrophy: (trophy: TrophyDefinition, userTrophy?: UserTrophy) => void;
  onAwardTrophy: (trophyId: string, customNote?: string) => void;
}

export const TrophyRoom: React.FC<TrophyRoomProps> = ({
  user,
  onSelectTrophy,
  onAwardTrophy
}) => {
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all');
  const [showAwardModal, setShowAwardModal] = useState(false);
  const [selectedToAward, setSelectedToAward] = useState(TROPHIES_LIST[0].id);
  const [customNote, setCustomNote] = useState('');

  const unlockedCount = user.trophies.length;
  const totalTrophies = TROPHIES_LIST.length;

  const filteredTrophies = TROPHIES_LIST.filter((t) => {
    const isUnlocked = user.trophies.some((ut) => ut.trophyId === t.id);
    if (filter === 'unlocked') return isUnlocked;
    if (filter === 'locked') return !isUnlocked;
    return true;
  });

  const handleManualAward = (e: React.FormEvent) => {
    e.preventDefault();
    onAwardTrophy(selectedToAward, customNote);
    setShowAwardModal(false);
    setCustomNote('');
  };

  const handlePrintDiploma = () => {
    soundManager.playPop();
    window.print();
  };

  return (
    <div className="space-y-8 animate-fadeIn max-w-5xl mx-auto">
      {/* Top Banner / Hero */}
      <div className="bg-gradient-to-r from-yellow-500 via-amber-500 to-orange-500 rounded-3xl p-6 sm:p-8 text-amber-950 shadow-2xl relative overflow-hidden border-4 border-yellow-300">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-yellow-300/80 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2 text-amber-950 shadow-sm">
              <Trophy className="w-4 h-4 text-amber-900" />
              SALA REAL DE TROFEOS Y PREMIACIÓN
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white drop-shadow-md">
              Vitrina de <span className="text-yellow-200 underline decoration-white decoration-wavy">{user.name}</span> {user.avatar}
            </h2>
            <p className="text-amber-100 text-sm sm:text-base font-semibold mt-1 max-w-xl">
              ¡Cada trofeo ganado lleva tu nombre grabado en su placa de oro! Acumula estrellas y supera los desafíos del abecedario.
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2.5">
            <button
              onClick={() => {
                soundManager.playPop();
                setShowAwardModal(true);
              }}
              className="bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white font-black px-4 py-3 rounded-2xl shadow-lg border-b-4 border-pink-900 flex items-center gap-2 text-sm transition-all active:scale-95 cursor-pointer"
            >
              <Gift className="w-5 h-5" />
              <span>¡Premiar a {user.name}! 🎁</span>
            </button>

            <button
              onClick={handlePrintDiploma}
              className="bg-white hover:bg-yellow-50 text-amber-950 font-black px-4 py-3 rounded-2xl shadow-lg border-2 border-yellow-400 flex items-center gap-2 text-sm transition-all active:scale-95 cursor-pointer"
            >
              <Printer className="w-5 h-5 text-amber-700" />
              <span>Imprimir Diploma 📜</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="mt-6 pt-4 border-t border-amber-400/50 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm font-black text-white">
          <div className="flex items-center gap-3">
            <div className="bg-amber-900/40 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Trophy className="w-4 h-4 text-yellow-300" />
              <span>{unlockedCount} de {totalTrophies} Trofeos Grabados</span>
            </div>
            <div className="bg-amber-900/40 backdrop-blur-md px-3 py-1.5 rounded-xl flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
              <span>{user.stars} Estrellas Ganadas</span>
            </div>
          </div>

          <div className="text-yellow-100 font-bold">
            {unlockedCount === totalTrophies ? '🌟 ¡Colección Completa de Campeón!' : `Faltan ${totalTrophies - unlockedCount} trofeos por desbloquear`}
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex bg-white p-1.5 rounded-2xl shadow-md border-2 border-slate-200 gap-1">
          <button
            onClick={() => {
              soundManager.playPop();
              setFilter('all');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              filter === 'all'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Todos ({totalTrophies})
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setFilter('unlocked');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              filter === 'unlocked'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Ganados ({unlockedCount}) 🏆
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setFilter('locked');
            }}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
              filter === 'locked'
                ? 'bg-slate-700 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Por Desbloquear ({totalTrophies - unlockedCount})
          </button>
        </div>

        <span className="text-xs text-slate-500 font-bold">
          * Toca cualquier trofeo para ver su ceremonia y placa grabada
        </span>
      </div>

      {/* Trophy Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTrophies.map((trophy) => {
          const userTrophy = user.trophies.find((ut) => ut.trophyId === trophy.id);
          return (
            <TrophyItem
              key={trophy.id}
              trophy={trophy}
              userTrophy={userTrophy}
              currentUserName={user.name}
              onSelect={(t, ut) => onSelectTrophy(t, ut)}
              onAwardNow={(t) => {
                setSelectedToAward(t.id);
                setShowAwardModal(true);
              }}
            />
          );
        })}
      </div>

      {/* PRINTABLE DIPLOMA CARD / VIEW */}
      <div className="bg-gradient-to-b from-amber-50 to-white rounded-3xl p-6 sm:p-10 border-8 border-yellow-400 shadow-2xl text-center relative overflow-hidden">
        {/* Certificate Decorative Corners */}
        <div className="absolute top-2 left-2 text-yellow-600 text-2xl font-serif">✦</div>
        <div className="absolute top-2 right-2 text-yellow-600 text-2xl font-serif">✦</div>
        <div className="absolute bottom-2 left-2 text-yellow-600 text-2xl font-serif">✦</div>
        <div className="absolute bottom-2 right-2 text-yellow-600 text-2xl font-serif">✦</div>

        <div className="inline-flex items-center gap-2 bg-amber-200 text-amber-900 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest mb-3">
          <Crown className="w-4 h-4 text-amber-700" />
          DIPLOMA OFICIAL DE HONOR Y EXCELENCIA
        </div>

        <h3 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-wide my-2">
          ¡CAMPEÓN DEL ABECEDARIO!
        </h3>

        <p className="text-sm sm:text-base text-slate-600 font-semibold max-w-lg mx-auto mb-4">
          Este reconocimiento se otorga con gran orgullo y felicitaciones a:
        </p>

        {/* Winner Name Banner on Diploma */}
        <div className="inline-block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white font-black text-3xl sm:text-5xl px-8 py-3.5 rounded-3xl shadow-xl border-4 border-yellow-300 my-2 transform hover:scale-105 transition-transform">
          {user.avatar} {user.name} {user.avatar}
        </div>

        <p className="text-slate-700 font-bold text-sm sm:text-base mt-4 max-w-md mx-auto">
          Por su sobresaliente entusiasmo, dedicación y alegría al aprender las 27 letras del alfabeto español, acumulando <span className="text-amber-600 font-black">{user.stars} Estrellas Mágicas</span> y conquistando <span className="text-yellow-700 font-black">{user.trophies.length} Trofeos Oficiales</span>.
        </p>

        <div className="flex items-center justify-around mt-8 pt-6 border-t-2 border-dashed border-amber-300 text-xs sm:text-sm font-bold text-slate-600">
          <div>
            <div className="font-extrabold text-slate-900">Fecha de Graduación:</div>
            <div>{new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-yellow-400 border-4 border-yellow-600 flex items-center justify-center text-2xl shadow-inner mb-1">
              🏆
            </div>
            <span className="text-[11px] font-black text-yellow-900 uppercase">Sello de Oro</span>
          </div>
          <div>
            <div className="font-extrabold text-slate-900">Aventura Educativa:</div>
            <div>¡El Mágico Abecedario!</div>
          </div>
        </div>
      </div>

      {/* Manual Award Modal (For Teachers / Parents / Self celebrations) */}
      {showAwardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-pink-400 p-6 sm:p-7">
            <div className="text-center mb-5">
              <div className="w-12 h-12 bg-pink-100 text-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-2 text-2xl">
                🎁
              </div>
              <h3 className="text-2xl font-black text-slate-800">
                ¡Otorgar Trofeo a {user.name}!
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 font-semibold">
                Selecciona el trofeo que deseas concederle con su nombre grabado.
              </p>
            </div>

            <form onSubmit={handleManualAward} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Elige el Trofeo:
                </label>
                <select
                  value={selectedToAward}
                  onChange={(e) => setSelectedToAward(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 font-extrabold text-slate-800 text-sm focus:border-pink-500 outline-none"
                >
                  {TROPHIES_LIST.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.icon} {t.title} ({t.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Dedicatoria o Mensaje Especial (Opcional):
                </label>
                <input
                  type="text"
                  value={customNote}
                  onChange={(e) => setCustomNote(e.target.value)}
                  placeholder="Ej: ¡Excelente lectura hoy! / ¡Felicidades por tu esfuerzo!"
                  maxLength={50}
                  className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 font-bold text-slate-800 text-sm focus:border-pink-500 outline-none"
                />
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAwardModal(false)}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-black text-sm transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 text-white rounded-2xl font-black text-sm shadow-lg border-b-4 border-pink-900 transition-all active:scale-95"
                >
                  ¡Entregar Trofeo! 🏆
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
