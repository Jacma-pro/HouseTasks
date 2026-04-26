import { useState } from 'react';
import Overlay from './Overlay';
import Avatar from './Avatar';

const EMOJIS = [
  '🐶','🐱','🦊','🐻','🐼','🐨','🦁','🐯',
  '🦄','🐸','🐙','🦋','🌟','🌈','🌺','🍀',
  '🎸','🚀','⚡','🔥','💎','🎯','🌙','☀️','🎉',
];

const COLORS = [
  '#6366f1','#3b82f6','#8b5cf6','#ec4899',
  '#ef4444','#f97316','#f59e0b','#10b981',
  '#14b8a6','#64748b',
];

interface AvatarPickerProps {
  name: string;
  currentAvatarUrl?: string;
  onSave: (avatarUrl: string) => void;
  onClose: () => void;
  isSaving?: boolean;
}

export default function AvatarPicker({ name, currentAvatarUrl, onSave, onClose, isSaving }: AvatarPickerProps) {
  const parsed = currentAvatarUrl?.startsWith('emoji:')
    ? { emoji: currentAvatarUrl.split(':')[1], color: currentAvatarUrl.split(':')[2] }
    : null;

  const [emoji, setEmoji] = useState(parsed?.emoji ?? '🐶');
  const [color, setColor] = useState(parsed?.color ?? '#6366f1');

  return (
    <Overlay onClose={onClose}>
      <h2 className="mb-4 text-lg font-bold text-gray-900">Choisir un avatar</h2>

      {/* Prévisualisation */}
      <div className="flex justify-center mb-5">
        <div
          className="h-20 w-20 rounded-full flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          <span className="text-4xl" style={{ lineHeight: 1 }}>{emoji}</span>
        </div>
      </div>

      {/* Grille d'emojis */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Emoji</p>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {EMOJIS.map(e => (
          <button
            key={e}
            onClick={() => setEmoji(e)}
            className={`h-11 rounded-xl text-2xl flex items-center justify-center transition-all cursor-pointer ${
              emoji === e
                ? 'bg-primary-100 ring-2 ring-primary-500 scale-105'
                : 'bg-gray-50 hover:bg-gray-100 active:scale-95'
            }`}
          >
            {e}
          </button>
        ))}
      </div>

      {/* Palette de couleurs */}
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Couleur de fond</p>
      <div className="flex gap-2 flex-wrap mb-5">
        {COLORS.map(c => (
          <button
            key={c}
            onClick={() => setColor(c)}
            className={`h-9 w-9 rounded-full transition-all cursor-pointer ${
              color === c ? 'ring-2 ring-offset-2 ring-gray-500 scale-110' : 'hover:scale-105 active:scale-95'
            }`}
            style={{ backgroundColor: c }}
            aria-label={c}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={onClose}
          className="flex-1 h-11 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          Annuler
        </button>
        <button
          onClick={() => onSave(`emoji:${emoji}:${color}`)}
          disabled={isSaving}
          className="flex-1 h-11 rounded-xl bg-primary-600 text-sm font-semibold text-white hover:bg-primary-700 disabled:opacity-60 transition-colors cursor-pointer"
        >
          {isSaving ? 'Enregistrement…' : 'Enregistrer'}
        </button>
      </div>
    </Overlay>
  );
}
