interface AvatarProps {
  name: string;
  avatar_url?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizes = {
  xs: { container: 'h-5 w-5 text-[10px]',  emoji: 'text-[10px]' },
  sm: { container: 'h-8 w-8 text-xs',       emoji: 'text-base' },
  md: { container: 'h-10 w-10 text-sm',     emoji: 'text-xl' },
  lg: { container: 'h-12 w-12 text-base',   emoji: 'text-2xl' },
};

const fallbackColors = [
  '#6366f1', '#f59e0b', '#10b981', '#ef4444',
  '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6',
];

function getFallbackColor(name: string) {
  return fallbackColors[name.charCodeAt(0) % fallbackColors.length];
}

export default function Avatar({ name, avatar_url, size = 'md' }: AvatarProps) {
  const s = sizes[size];

  if (avatar_url?.startsWith('emoji:')) {
    const [, emoji, color] = avatar_url.split(':');
    return (
      <div
        className={`${s.container} rounded-full flex items-center justify-center select-none shrink-0`}
        style={{ backgroundColor: color ?? '#6366f1' }}
      >
        <span className={s.emoji} style={{ lineHeight: 1 }}>{emoji}</span>
      </div>
    );
  }

  if (avatar_url) {
    return (
      <img
        src={avatar_url}
        alt={name}
        className={`${s.container} rounded-full object-cover shrink-0`}
      />
    );
  }

  return (
    <div
      className={`${s.container} rounded-full flex items-center justify-center text-white font-semibold select-none shrink-0`}
      style={{ backgroundColor: getFallbackColor(name) }}
    >
      {name[0]?.toUpperCase()}
    </div>
  );
}
