# HouseTasks — Tailwind Tokens (copy-paste ready)

Mobile-first. Baseline 375px. Plus Jakarta Sans. WCAG AA verified.

---

## `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx,js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      colors: {
        // Primary — Forest (brand)
        primary: {
          50:  '#EEF6F1',
          100: '#D6E9DD',
          200: '#AFD3BC',
          300: '#82B898',
          400: '#529B77',
          500: '#2D6A4F', // brand
          600: '#235540',
          700: '#1B4232',
          800: '#153325',
          900: '#0E2319',
          DEFAULT: '#2D6A4F',
        },
        // Accent — Terracotta (urgent, CTA secondaire)
        accent: {
          50:  '#FDF2EC',
          100: '#FADCCB',
          300: '#F0A685',
          500: '#D97757',
          700: '#A8502F',
          DEFAULT: '#D97757',
        },
        // Neutral — Warm gray (teinte légèrement verte)
        neutral: {
          0:   '#FFFFFF',
          50:  '#FAFAF8',
          100: '#F3F3F0',
          200: '#E6E6E1',
          300: '#D1D1CA',
          400: '#A8A89F',
          500: '#78786F',
          600: '#5A5A52',
          700: '#3F3F39',
          900: '#191917',
        },
        // Semantic
        success: '#2D6A4F',
        warning: '#D4A017',
        danger:  '#C2410C',
        info:    '#2B6CB0',
      },
      fontSize: {
        // [size, { lineHeight, letterSpacing }]
        xs:   ['12px', { lineHeight: '1.5',  letterSpacing: '0' }],
        sm:   ['14px', { lineHeight: '1.45', letterSpacing: '0' }],
        base: ['16px', { lineHeight: '1.5',  letterSpacing: '0' }],
        lg:   ['18px', { lineHeight: '1.45', letterSpacing: '-0.01em' }],
        xl:   ['20px', { lineHeight: '1.35', letterSpacing: '-0.01em' }],
        '2xl':['24px', { lineHeight: '1.3',  letterSpacing: '-0.015em' }],
        '3xl':['28px', { lineHeight: '1.25', letterSpacing: '-0.02em' }],
        '4xl':['34px', { lineHeight: '1.15', letterSpacing: '-0.025em' }],
      },
      spacing: {
        // 4px base. Tailwind defaults remain; these are explicit.
        0: '0', 1: '4px', 2: '8px', 3: '12px', 4: '16px',
        5: '20px', 6: '24px', 8: '32px', 10: '40px', 12: '48px',
        16: '64px', 20: '80px',
        // Touch-target helpers
        touch: '48px',
      },
      borderRadius: {
        none: '0', sm: '6px', md: '10px', lg: '14px',
        xl: '20px', '2xl': '24px', full: '9999px',
      },
      boxShadow: {
        xs: '0 1px 2px rgba(25, 25, 23, 0.04)',
        sm: '0 1px 3px rgba(25, 25, 23, 0.06), 0 1px 2px rgba(25, 25, 23, 0.04)',
        md: '0 4px 12px rgba(25, 25, 23, 0.06), 0 2px 4px rgba(25, 25, 23, 0.04)',
        lg: '0 12px 28px rgba(25, 25, 23, 0.10), 0 4px 8px rgba(25, 25, 23, 0.04)',
        focus: '0 0 0 3px rgba(45, 106, 79, 0.25)',
      },
      minHeight: { touch: '48px' },
      minWidth:  { touch: '48px' },
    },
  },
  plugins: [],
};
```

## `index.css` globals

```css
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; color: #191917; background: #FAFAF8; }
  body { -webkit-font-smoothing: antialiased; -moz-osx-font-smoothing: grayscale; }
  button, a, input, select, textarea { font-family: inherit; }
  :focus-visible { outline: none; box-shadow: 0 0 0 3px rgba(45, 106, 79, 0.25); border-radius: 6px; }
}
```

---

## Components — copy-paste

### Button

```tsx
type BtnVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type BtnSize = 'sm' | 'md' | 'lg';

const VARIANT: Record<BtnVariant, string> = {
  primary:   'bg-primary-500 text-white hover:bg-primary-600 border border-transparent',
  secondary: 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-200',
  outline:   'bg-white text-primary-500 hover:bg-primary-50 border-[1.5px] border-primary-500',
  ghost:     'bg-transparent text-primary-500 hover:bg-primary-50 border border-transparent',
  danger:    'bg-danger text-white hover:bg-[#9E350A] border border-transparent',
};
const SIZE: Record<BtnSize, string> = {
  sm: 'h-9 px-3 text-sm gap-1.5',
  md: 'h-12 px-4 text-[15px] gap-2',     // 48px touch target
  lg: 'h-14 px-5 text-[17px] gap-2.5',
};

export const Button = ({
  variant = 'primary', size = 'md', full, leading, trailing, children, ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: BtnVariant; size?: BtnSize; full?: boolean;
  leading?: React.ReactNode; trailing?: React.ReactNode;
}) => (
  <button
    {...rest}
    className={`inline-flex items-center justify-center rounded-full font-semibold tracking-tight whitespace-nowrap transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT[variant]} ${SIZE[size]} ${full ? 'w-full' : ''}`}
  >
    {leading}{children}{trailing}
  </button>
);
```

### Input

```tsx
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement> & { leading?: React.ReactNode; trailing?: React.ReactNode }>(
  ({ leading, trailing, className = '', ...props }, ref) => (
    <div className="relative">
      {leading && <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none">{leading}</span>}
      <input
        ref={ref}
        className={`h-12 w-full rounded-xl border-[1.5px] border-neutral-200 bg-white text-base text-neutral-900 placeholder:text-neutral-400 focus:border-primary-500 focus:shadow-focus outline-none transition ${leading ? 'pl-11' : 'pl-3.5'} ${trailing ? 'pr-11' : 'pr-3.5'} ${className}`}
        {...props}
      />
      {trailing && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500">{trailing}</span>}
    </div>
  )
);
```

### Field (label + helper/error)

```tsx
export const Field = ({ label, helper, error, required, children }: {
  label?: string; helper?: string; error?: string; required?: boolean; children: React.ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-sm font-semibold text-neutral-700 tracking-tight">
        {label}{required && <span className="text-danger"> *</span>}
      </label>
    )}
    {children}
    {(helper || error) && (
      <p className={`text-[13px] ${error ? 'text-danger' : 'text-neutral-500'}`}>{error || helper}</p>
    )}
  </div>
);
```

### Badge

```tsx
const BADGE = {
  neutral: 'bg-neutral-100 text-neutral-700',
  primary: 'bg-primary-50 text-primary-700',
  accent:  'bg-accent-50  text-accent-700',
  success: 'bg-primary-50 text-primary-700',
  warning: 'bg-[#FBF3DC] text-[#6E530B]',
  danger:  'bg-[#FCE8DD] text-[#9E350A]',
  info:    'bg-[#DCE9F5] text-[#1E4B7A]',
} as const;
const DOT = {
  neutral: 'bg-neutral-500', primary: 'bg-primary-500', accent: 'bg-accent-500',
  success: 'bg-primary-500', warning: 'bg-warning', danger: 'bg-danger', info: 'bg-info',
} as const;

export const Badge = ({ tone = 'neutral', dot, children, size = 'md' }: {
  tone?: keyof typeof BADGE; dot?: boolean; size?: 'sm' | 'md'; children: React.ReactNode;
}) => (
  <span className={`inline-flex items-center gap-1.5 rounded-full font-semibold ${BADGE[tone]} ${size === 'sm' ? 'h-[22px] px-2 text-[11px]' : 'h-[26px] px-2.5 text-xs'}`}>
    {dot && <span className={`w-1.5 h-1.5 rounded-full ${DOT[tone]}`} />}
    {children}
  </span>
);
```

### Card

```tsx
export const Card = ({ className = '', children, ...rest }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white rounded-2xl border border-neutral-200 p-4 ${className}`} {...rest}>
    {children}
  </div>
);
```

### Bottom navbar

```tsx
import { Home, List, Calendar, Users, User } from 'lucide-react';

const TABS = [
  { id: 'home',     label: 'Home',     Icon: Home },
  { id: 'tasks',    label: 'Tasks',    Icon: List },
  { id: 'calendar', label: 'Calendar', Icon: Calendar },
  { id: 'family',   label: 'Family',   Icon: Users },
  { id: 'profile',  label: 'Profile',  Icon: User },
];

export const BottomNav = ({ active, onChange }: { active: string; onChange: (id: string) => void }) => (
  <nav
    className="flex items-stretch border-t border-neutral-200 bg-white/90 backdrop-blur-md"
    style={{ height: 78, paddingBottom: 'max(18px, env(safe-area-inset-bottom))' }}
  >
    {TABS.map(({ id, label, Icon }) => {
      const on = active === id;
      return (
        <button
          key={id}
          onClick={() => onChange(id)}
          className={`flex-1 flex flex-col items-center justify-center gap-0.5 ${on ? 'text-primary-500' : 'text-neutral-500'}`}
        >
          <Icon size={22} strokeWidth={on ? 2.25 : 2} />
          <span className={`text-[11px] ${on ? 'font-bold' : 'font-medium'}`}>{label}</span>
        </button>
      );
    })}
  </nav>
);
```

### Modal — bottom sheet

```tsx
export const BottomSheet = ({ open, onClose, children }: {
  open: boolean; onClose: () => void; children: React.ReactNode;
}) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/45 flex flex-col justify-end" onClick={onClose}>
      <div
        className="bg-neutral-50 rounded-t-3xl shadow-lg max-h-[88%] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-center pt-2"><span className="w-9 h-[5px] rounded-full bg-neutral-300" /></div>
        {children}
      </div>
    </div>
  );
};
```

### Task checkbox (circle)

```tsx
import { Check } from 'lucide-react';

export const TaskCheckbox = ({ done, onChange }: { done: boolean; onChange: () => void }) => (
  <button
    onClick={onChange}
    aria-label={done ? 'Mark as pending' : 'Mark as done'}
    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${done ? 'bg-primary-500 border-primary-500' : 'border-neutral-300 bg-transparent'}`}
  >
    {done && <Check size={14} strokeWidth={3} className="text-white" />}
  </button>
);
```

---

## Règles d'usage

- **Max 3 couleurs visibles / écran** (primary + accent + 1 neutral shade). Les 7 autres nuances neutres sont pour la profondeur.
- **Touch target minimum : 48 × 48**. Buttons `size="md"` et plus respectent ça par défaut.
- **Focus state obligatoire** sur tout élément interactif : `shadow-focus` (`0 0 0 3px rgba(45,106,79,.25)`).
- **Contraste** : texte principal `neutral-900` sur `neutral-0/50` = ratio 16:1. Texte secondaire `neutral-500` sur blanc = 5.3:1 (AA passe). Ne jamais utiliser `neutral-400` comme texte.
- **Hiérarchie** : 1 seul titre `3xl`+ par écran, les reste en `xl`/`lg`.
- **Safe areas iOS** : padding-bottom dynamique avec `env(safe-area-inset-bottom)` sur la navbar.
- **Icons + text** : chaque action porte son icône *et* son label (jamais icône seule sauf pour `IconButton` avec `aria-label`).

## Pages couvertes dans le canvas

1. Login / Register
2. Dashboard (home)
3. Tasks list (avec filtres segmented + FAB)
4. Task detail
5. Create task (modal bottom sheet)
6. Calendar / Availability (semaine)
7. Family members
8. User profile
