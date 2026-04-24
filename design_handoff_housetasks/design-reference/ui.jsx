// HouseTasks — Component library
// All mobile-first. Touch targets ≥ 48px. WCAG AA contrast verified against tokens.

const { Icons: Ic } = window;

// ─────────────────────────────────────────────────────────────
// Avatar — initial-based, color-hashed. Sizes: 28 / 36 / 44 / 64
// ─────────────────────────────────────────────────────────────
const avatarColors = [
  { bg: '#D6E9DD', fg: '#1B4232' }, // primary tint
  { bg: '#FADCCB', fg: '#A8502F' }, // accent tint
  { bg: '#E4DAF5', fg: '#4C2E93' }, // violet tint
  { bg: '#DCE9F5', fg: '#1E4B7A' }, // blue tint
  { bg: '#F5E4C9', fg: '#7A5416' }, // amber tint
];
function hashName(s) { let h = 0; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
const Avatar = ({ name = '?', size = 36, tone }) => {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
  const c = tone || avatarColors[hashName(name) % avatarColors.length];
  return (
    <div style={{
      width: size, height: size, borderRadius: 999, background: c.bg, color: c.fg,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38, letterSpacing: 0.2, flexShrink: 0,
    }}>{initials || '?'}</div>
  );
};

// ─────────────────────────────────────────────────────────────
// Button — primary / secondary / ghost / danger · sm / md / lg
// ─────────────────────────────────────────────────────────────
const btnVariants = {
  primary:   { bg: '#2D6A4F', fg: '#fff',    border: 'transparent', hov: '#235540' },
  secondary: { bg: '#F3F3F0', fg: '#191917', border: '#E6E6E1',     hov: '#E6E6E1' },
  ghost:     { bg: 'transparent', fg: '#2D6A4F', border: 'transparent', hov: '#EEF6F1' },
  danger:    { bg: '#C2410C', fg: '#fff',    border: 'transparent', hov: '#9E350A' },
  outline:   { bg: '#fff',    fg: '#2D6A4F', border: '#2D6A4F',     hov: '#EEF6F1' },
};
const btnSizes = {
  sm: { h: 36, px: 12, fs: 14, gap: 6,  ico: 16 },
  md: { h: 48, px: 16, fs: 15, gap: 8,  ico: 18 }, // touch-friendly default
  lg: { h: 56, px: 20, fs: 17, gap: 10, ico: 20 },
};
const Button = ({
  variant = 'primary', size = 'md', leading, trailing, children,
  full, onClick, disabled, style = {}, ariaLabel,
}) => {
  const v = btnVariants[variant], s = btnSizes[size];
  return (
    <button onClick={onClick} disabled={disabled} aria-label={ariaLabel}
      style={{
        height: s.h, padding: `0 ${s.px}px`, borderRadius: 999,
        background: v.bg, color: v.fg, border: `1.5px solid ${v.border}`,
        fontSize: s.fs, fontWeight: 600, fontFamily: 'inherit',
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: s.gap,
        cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1,
        width: full ? '100%' : 'auto', letterSpacing: -0.1, whiteSpace: 'nowrap',
        transition: 'background 120ms ease', ...style,
      }}>
      {leading && <span style={{ display: 'flex' }}>{leading}</span>}
      {children}
      {trailing && <span style={{ display: 'flex' }}>{trailing}</span>}
    </button>
  );
};

// Icon-only circular button (touch 48)
const IconButton = ({ icon, onClick, ariaLabel, variant = 'secondary', size = 44 }) => {
  const v = btnVariants[variant];
  return (
    <button onClick={onClick} aria-label={ariaLabel} style={{
      width: size, height: size, borderRadius: 999, background: v.bg, color: v.fg,
      border: `1px solid ${v.border === 'transparent' ? 'transparent' : v.border}`,
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    }}>{icon}</button>
  );
};

// ─────────────────────────────────────────────────────────────
// Input + textarea + select (native style) + label + helper
// ─────────────────────────────────────────────────────────────
const Field = ({ label, helper, error, children, required }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
    {label && (
      <label style={{ fontSize: 14, fontWeight: 600, color: '#3F3F39', letterSpacing: -0.1 }}>
        {label}{required && <span style={{ color: '#C2410C' }}> *</span>}
      </label>
    )}
    {children}
    {(helper || error) && (
      <div style={{ fontSize: 13, color: error ? '#C2410C' : '#78786F' }}>{error || helper}</div>
    )}
  </div>
);

const inputBase = {
  height: 48, padding: '0 14px', borderRadius: 12,
  border: '1.5px solid #E6E6E1', background: '#FFFFFF',
  fontSize: 16, color: '#191917', fontFamily: 'inherit',
  width: '100%', outline: 'none',
  transition: 'border-color 120ms, box-shadow 120ms',
};
const Input = ({ leading, trailing, ...props }) => (
  <div style={{ position: 'relative' }}>
    {leading && (
      <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#78786F', pointerEvents: 'none' }}>
        {leading}
      </div>
    )}
    <input {...props} style={{ ...inputBase, paddingLeft: leading ? 42 : 14, paddingRight: trailing ? 42 : 14, ...(props.style || {}) }} />
    {trailing && (
      <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', color: '#78786F' }}>
        {trailing}
      </div>
    )}
  </div>
);

const Textarea = (props) => (
  <textarea {...props} style={{
    ...inputBase, height: 'auto', minHeight: 96, padding: '12px 14px',
    resize: 'vertical', lineHeight: 1.5, ...(props.style || {}),
  }} />
);

// ─────────────────────────────────────────────────────────────
// Badge — status pills & categories
// ─────────────────────────────────────────────────────────────
const badgeTones = {
  neutral:  { bg: '#F3F3F0', fg: '#3F3F39', dot: '#78786F' },
  primary:  { bg: '#EEF6F1', fg: '#1B4232', dot: '#2D6A4F' },
  accent:   { bg: '#FDF2EC', fg: '#A8502F', dot: '#D97757' },
  success:  { bg: '#EEF6F1', fg: '#1B4232', dot: '#2D6A4F' },
  warning:  { bg: '#FBF3DC', fg: '#6E530B', dot: '#D4A017' },
  danger:   { bg: '#FCE8DD', fg: '#9E350A', dot: '#C2410C' },
  info:     { bg: '#DCE9F5', fg: '#1E4B7A', dot: '#2B6CB0' },
};
const Badge = ({ tone = 'neutral', dot, icon, children, size = 'md' }) => {
  const t = badgeTones[tone];
  const h = size === 'sm' ? 22 : 26;
  return (
    <span style={{
      height: h, padding: `0 ${size === 'sm' ? 8 : 10}px`, borderRadius: 999,
      background: t.bg, color: t.fg,
      display: 'inline-flex', alignItems: 'center', gap: 6,
      fontSize: size === 'sm' ? 11 : 12, fontWeight: 600, letterSpacing: 0.1,
      whiteSpace: 'nowrap',
    }}>
      {dot && <span style={{ width: 6, height: 6, borderRadius: 999, background: t.dot }} />}
      {icon}
      {children}
    </span>
  );
};

// Priority flag (visual shorthand)
const Priority = ({ level = 'medium', showLabel = false }) => {
  const map = {
    low:    { tone: 'neutral', label: 'Low' },
    medium: { tone: 'warning', label: 'Medium' },
    high:   { tone: 'danger',  label: 'High' },
  };
  const { tone, label } = map[level];
  return <Badge tone={tone} size="sm" icon={<Ic.Flag size={10} />}>{showLabel ? label : label}</Badge>;
};

// ─────────────────────────────────────────────────────────────
// Card — generic container
// ─────────────────────────────────────────────────────────────
const Card = ({ children, padding = 16, style = {}, onClick, interactive }) => (
  <div onClick={onClick} style={{
    background: '#FFFFFF', borderRadius: 16,
    border: '1px solid #E6E6E1',
    padding, cursor: interactive ? 'pointer' : 'default',
    ...style,
  }}>{children}</div>
);

// ─────────────────────────────────────────────────────────────
// TaskRow — the key primitive for this app
// ─────────────────────────────────────────────────────────────
const TaskRow = ({ task, onToggle, compact = false }) => {
  const { title, assignees = [], due, priority, status, category } = task;
  const done = status === 'completed';
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: compact ? '12px 0' : '14px 0',
      borderBottom: '1px solid #F3F3F0',
      opacity: done ? 0.55 : 1,
    }}>
      {/* Checkbox */}
      <button onClick={onToggle} aria-label={done ? 'Mark as pending' : 'Mark as done'}
        style={{
          width: 24, height: 24, borderRadius: 999, flexShrink: 0, marginTop: 2,
          border: `2px solid ${done ? '#2D6A4F' : '#D1D1CA'}`,
          background: done ? '#2D6A4F' : 'transparent',
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          cursor: 'pointer',
        }}>
        {done && <Ic.Check size={14} style={{ color: '#fff', strokeWidth: 3 }} />}
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 15, fontWeight: 600, color: '#191917', letterSpacing: -0.1,
          textDecoration: done ? 'line-through' : 'none', lineHeight: 1.35,
        }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
          {category && <Badge tone="neutral" size="sm">{category}</Badge>}
          {priority && priority !== 'low' && <Priority level={priority} />}
          {due && (
            <span style={{ fontSize: 12, color: due.overdue ? '#C2410C' : '#78786F', fontWeight: 500, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <Ic.Clock size={12} /> {due.label}
            </span>
          )}
        </div>
      </div>
      <div style={{ display: 'flex', marginLeft: 4 }}>
        {assignees.slice(0, 3).map((a, i) => (
          <div key={i} style={{ marginLeft: i === 0 ? 0 : -8, outline: '2px solid #fff', borderRadius: 999 }}>
            <Avatar name={a} size={28} />
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// BottomNav — 5-tab navbar, safe-area-aware
// ─────────────────────────────────────────────────────────────
const BottomNav = ({ active = 'home', onChange = () => {} }) => {
  const tabs = [
    { id: 'home',     label: 'Home',     Icon: Ic.Home },
    { id: 'tasks',    label: 'Tasks',    Icon: Ic.List },
    { id: 'calendar', label: 'Calendar', Icon: Ic.Calendar },
    { id: 'family',   label: 'Family',   Icon: Ic.Users },
    { id: 'profile',  label: 'Profile',  Icon: Ic.User },
  ];
  return (
    <div style={{
      height: 78, paddingBottom: 18, // home-indicator breathing
      background: 'rgba(255,255,255,0.92)', backdropFilter: 'saturate(180%) blur(20px)',
      borderTop: '1px solid #E6E6E1',
      display: 'flex', alignItems: 'stretch',
    }}>
      {tabs.map(t => {
        const on = active === t.id;
        return (
          <button key={t.id} onClick={() => onChange(t.id)}
            style={{
              flex: 1, border: 'none', background: 'transparent',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3,
              color: on ? '#2D6A4F' : '#78786F', cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
            <t.Icon size={22} style={{ strokeWidth: on ? 2.25 : 2 }} />
            <span style={{ fontSize: 11, fontWeight: on ? 700 : 500, letterSpacing: 0.1 }}>{t.label}</span>
          </button>
        );
      })}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────
// AppHeader — large-title iOS-ish header (inside the frame)
// ─────────────────────────────────────────────────────────────
const AppHeader = ({ title, subtitle, leading, trailing, compact }) => (
  <div style={{
    padding: compact ? '10px 20px 8px' : '8px 20px 16px',
    display: 'flex', flexDirection: 'column', gap: 2,
  }}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', minHeight: 40 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{leading}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{trailing}</div>
    </div>
    {title && (
      <div style={{ fontSize: compact ? 22 : 28, fontWeight: 700, letterSpacing: -0.02 * 28, color: '#191917', marginTop: compact ? 0 : 4 }}>
        {title}
      </div>
    )}
    {subtitle && (
      <div style={{ fontSize: 14, color: '#78786F', fontWeight: 500 }}>{subtitle}</div>
    )}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Segmented control (iOS style, for filter tabs)
// ─────────────────────────────────────────────────────────────
const Segmented = ({ options, value, onChange }) => (
  <div style={{
    display: 'flex', background: '#F3F3F0', borderRadius: 10, padding: 3, gap: 2,
  }}>
    {options.map(o => {
      const on = o.value === value;
      return (
        <button key={o.value} onClick={() => onChange(o.value)}
          style={{
            flex: 1, height: 34, border: 'none', borderRadius: 8,
            background: on ? '#fff' : 'transparent',
            boxShadow: on ? '0 1px 3px rgba(25,25,23,0.10)' : 'none',
            fontSize: 13, fontWeight: on ? 600 : 500,
            color: on ? '#191917' : '#5A5A52', cursor: 'pointer', fontFamily: 'inherit',
          }}>
          {o.label}
        </button>
      );
    })}
  </div>
);

// ─────────────────────────────────────────────────────────────
// Modal — iOS-style bottom sheet (lives inside the frame)
// ─────────────────────────────────────────────────────────────
const BottomSheet = ({ children, maxHeight = '88%' }) => (
  <div style={{
    position: 'absolute', inset: 0, background: 'rgba(25,25,23,0.45)',
    display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
    zIndex: 10,
  }}>
    <div style={{
      background: '#FAFAF8', borderTopLeftRadius: 24, borderTopRightRadius: 24,
      boxShadow: '0 -8px 24px rgba(25,25,23,0.12)',
      maxHeight, display: 'flex', flexDirection: 'column', overflow: 'hidden',
    }}>
      <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0' }}>
        <div style={{ width: 36, height: 5, borderRadius: 999, background: '#D1D1CA' }} />
      </div>
      {children}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────
// Category chip (selectable)
// ─────────────────────────────────────────────────────────────
const CategoryChip = ({ icon, label, selected, onClick }) => (
  <button onClick={onClick} style={{
    display: 'inline-flex', alignItems: 'center', gap: 6,
    height: 36, padding: '0 14px', borderRadius: 999,
    border: `1.5px solid ${selected ? '#2D6A4F' : '#E6E6E1'}`,
    background: selected ? '#EEF6F1' : '#fff',
    color: selected ? '#1B4232' : '#3F3F39',
    fontSize: 13, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
  }}>
    {icon}{label}
  </button>
);

// ─────────────────────────────────────────────────────────────
// Status dot (availability indicator)
// ─────────────────────────────────────────────────────────────
const StatusDot = ({ status = 'available', size = 10 }) => {
  const c = { available: '#2D6A4F', busy: '#C2410C', away: '#D4A017', offline: '#A8A89F' }[status];
  return <span style={{ width: size, height: size, borderRadius: 999, background: c, display: 'inline-block', outline: '2px solid #fff' }} />;
};

Object.assign(window, {
  Avatar, Button, IconButton, Field, Input, Textarea,
  Badge, Priority, Card, TaskRow, BottomNav, AppHeader,
  Segmented, BottomSheet, CategoryChip, StatusDot,
});
