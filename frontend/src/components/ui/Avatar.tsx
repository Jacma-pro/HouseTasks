interface AvatarProps {
  name: string;
  avatar_url?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

const sizes = { xs: 'h-5 w-5 text-[10px]', sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-12 w-12 text-base' };

const colors = [
  'bg-primary-500', 'bg-accent-500', 'bg-purple-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-amber-500',
];

function getColor(name: string) {
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export default function Avatar({ name, avatar_url, size = 'md' }: AvatarProps) {
  if (avatar_url) {
    return (
      <img
        src={avatar_url}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover`}
      />
    );
  }
  return (
    <div className={`${sizes[size]} ${getColor(name)} rounded-full flex items-center justify-center text-white font-semibold select-none`}>
      {name[0]?.toUpperCase()}
    </div>
  );
}
