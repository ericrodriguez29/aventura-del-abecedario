import React, { useState } from 'react';
import { User } from '../types';
import { soundManager } from '../utils/audio';
import { X, UserPlus, Users, Trash2, Check, Sparkles, Star, Trophy } from 'lucide-react';

interface UserModalProps {
  users: User[];
  activeUser: User;
  onSelectUser: (user: User) => void;
  onCreateUser: (name: string, avatar: string, colorTheme: string) => void;
  onDeleteUser: (userId: string) => void;
  onClose: () => void;
}

const AVATAR_OPTIONS = [
  '🦁', '🦄', '🚀', '🐱', '🐶', '🦖', '🐼', '🦊',
  '👑', '🦸‍♂️', '🎨', '⚽', '🌸', '⚡', '🍓', '🐬',
  '🐻', '🐧', '🤖', '🎪'
];

const THEME_OPTIONS = [
  { id: 'blue', label: 'Azul Espacial', bg: 'bg-blue-500', text: 'text-blue-600', ring: 'ring-blue-400' },
  { id: 'pink', label: 'Rosa Mágico', bg: 'bg-pink-500', text: 'text-pink-600', ring: 'ring-pink-400' },
  { id: 'green', label: 'Verde Aventura', bg: 'bg-emerald-500', text: 'text-emerald-600', ring: 'ring-emerald-400' },
  { id: 'purple', label: 'Púrpura Galaxia', bg: 'bg-purple-500', text: 'text-purple-600', ring: 'ring-purple-400' },
  { id: 'amber', label: 'Amarillo Sol', bg: 'bg-amber-500', text: 'text-amber-600', ring: 'ring-amber-400' },
  { id: 'orange', label: 'Naranja Fuego', bg: 'bg-orange-500', text: 'text-orange-600', ring: 'ring-orange-400' },
];

const NAME_SUGGESTIONS = ['Mateo', 'Sofía', 'Lucas', 'Valentina', 'Santiago', 'Emma', 'Thiago', 'Camila'];

export const UserModal: React.FC<UserModalProps> = ({
  users,
  activeUser,
  onSelectUser,
  onCreateUser,
  onDeleteUser,
  onClose
}) => {
  const [tab, setTab] = useState<'switch' | 'create'>('switch');
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState('🦁');
  const [colorTheme, setColorTheme] = useState('blue');
  const [error, setError] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('¡Por favor escribe el nombre del estudiante!');
      soundManager.playIncorrect();
      return;
    }
    soundManager.playCorrect();
    soundManager.speak(`¡Bienvenido al mágico abecedario, ${name.trim()}!`);
    onCreateUser(name.trim(), avatar, colorTheme);
    setName('');
    onClose();
  };

  const handleSelect = (u: User) => {
    soundManager.playPop();
    soundManager.speak(`¡Hola de nuevo, ${u.name}!`);
    onSelectUser(u);
    onClose();
  };

  const handleDelete = (e: React.MouseEvent, id: string, userName: string) => {
    e.stopPropagation();
    if (users.length <= 1) {
      soundManager.playIncorrect();
      alert('Debes mantener al menos un usuario activo.');
      return;
    }
    if (confirm(`¿Seguro que deseas eliminar el perfil de ${userName}?`)) {
      soundManager.playPop();
      onDeleteUser(id);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-blue-300 p-5 sm:p-7 overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-slate-100 hover:bg-slate-200 text-slate-700 w-9 h-9 rounded-full flex items-center justify-center font-bold shadow-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-5">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl mb-2">
            <Users className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black text-slate-800">
            Perfiles de Jugadores
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Crea usuarios para guardar las estrellas y trofeos con sus nombres.
          </p>
        </div>

        {/* Tabs: Cambiar Usuario / Crear Nuevo */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-5 gap-1">
          <button
            onClick={() => {
              soundManager.playPop();
              setTab('switch');
            }}
            className={`flex-1 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              tab === 'switch'
                ? 'bg-white text-blue-600 shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-4 h-4" />
            Elegir Jugador ({users.length})
          </button>
          <button
            onClick={() => {
              soundManager.playPop();
              setTab('create');
            }}
            className={`flex-1 py-2 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all ${
              tab === 'create'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            Crear Nuevo Usuario
          </button>
        </div>

        {/* TAB 1: SWITCH USER */}
        {tab === 'switch' && (
          <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
            {users.map((u) => {
              const isActive = u.id === activeUser.id;
              return (
                <div
                  key={u.id}
                  onClick={() => handleSelect(u)}
                  className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center justify-between gap-3 group ${
                    isActive
                      ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300 shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 shadow-inner flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                      {u.avatar}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-800 text-base">
                          {u.name}
                        </h4>
                        {isActive && (
                          <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Activo
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-0.5">
                        <span className="flex items-center gap-1 text-amber-600 font-bold">
                          <Star className="w-3.5 h-3.5 fill-amber-400" /> {u.stars} Estrellas
                        </span>
                        <span className="flex items-center gap-1 text-yellow-700 font-bold">
                          <Trophy className="w-3.5 h-3.5 text-yellow-600" /> {u.trophies.length} Trofeos
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {isActive ? (
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
                        <Check className="w-4 h-4" />
                      </div>
                    ) : (
                      <button
                        onClick={(e) => handleDelete(e, u.id, u.name)}
                        className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 p-2 rounded-xl transition-all"
                        title="Eliminar perfil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => {
                soundManager.playPop();
                setTab('create');
              }}
              className="w-full py-3 border-2 border-dashed border-blue-300 hover:border-blue-500 text-blue-600 hover:bg-blue-50 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <UserPlus className="w-4 h-4" />
              + Agregar otro estudiante / niño
            </button>
          </div>
        )}

        {/* TAB 2: CREATE USER */}
        {tab === 'create' && (
          <form onSubmit={handleCreate} className="space-y-4">
            {/* Name Input */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre del Estudiante / Niño:
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setError('');
                }}
                placeholder="Ej: Mateo, Sofía, Lucas..."
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-2xl border-2 border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none font-bold text-slate-800 text-base"
                autoFocus
              />
              {error && <p className="text-red-500 text-xs font-bold mt-1">{error}</p>}

              {/* Name suggestions */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[11px] font-bold text-slate-400 self-center mr-1">Sugerencias:</span>
                {NAME_SUGGESTIONS.map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => {
                      setName(sug);
                      soundManager.playPop();
                    }}
                    className="text-xs font-semibold bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 px-2 py-0.5 rounded-lg transition-colors"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Picker */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Elige un Avatar Favorito:
              </label>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 bg-slate-50 p-2.5 rounded-2xl border border-slate-200 max-h-32 overflow-y-auto">
                {AVATAR_OPTIONS.map((av) => (
                  <button
                    key={av}
                    type="button"
                    onClick={() => {
                      setAvatar(av);
                      soundManager.playPop();
                    }}
                    className={`w-10 h-10 rounded-xl text-2xl flex items-center justify-center transition-all ${
                      avatar === av
                        ? 'bg-blue-500 shadow-md ring-2 ring-blue-300 scale-110'
                        : 'hover:bg-slate-200'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            {/* Theme Color */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Color Favorito:
              </label>
              <div className="flex flex-wrap gap-2">
                {THEME_OPTIONS.map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      setColorTheme(th.id);
                      soundManager.playPop();
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border-2 transition-all ${
                      colorTheme === th.id
                        ? `bg-slate-900 text-white border-slate-900 shadow-md ring-2 ${th.ring}`
                        : 'bg-white text-slate-700 border-slate-200 hover:border-slate-400'
                    }`}
                  >
                    <span className={`w-3 h-3 rounded-full ${th.bg}`}></span>
                    {th.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white rounded-2xl font-black text-base shadow-lg border-b-4 border-blue-900 flex items-center justify-center gap-2 active:scale-95 transition-all"
              >
                <Sparkles className="w-5 h-5" />
                ¡Guardar y Comenzar a Jugar!
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
