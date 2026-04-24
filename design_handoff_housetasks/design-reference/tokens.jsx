// HouseTasks — Design tokens
// Central source of truth. Values mirrored in tailwind-tokens.md for dev handoff.

const HT = {
  color: {
    // Primary — deep forest green. Calm, familial, "completed/grown".
    primary: {
      50:  '#EEF6F1',
      100: '#D6E9DD',
      200: '#AFD3BC',
      300: '#82B898',
      400: '#529B77',
      500: '#2D6A4F', // ← brand
      600: '#235540',
      700: '#1B4232',
      800: '#153325',
      900: '#0E2319',
    },
    // Accent — warm terracotta. Urgent, due-soon, CTAs secondaires.
    accent: {
      50:  '#FDF2EC',
      100: '#FADCCB',
      300: '#F0A685',
      500: '#D97757', // ← accent
      700: '#A8502F',
    },
    // Neutrals — warm gray (slightly green-tinted to sit w/ primary)
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
      800: '#27272380',  // hairline
      900: '#191917',
    },
    // Semantic
    success: '#2D6A4F',
    warning: '#D4A017',
    danger:  '#C2410C',
    info:    '#2B6CB0',
  },
  font: {
    family: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
    // Mobile-first scale — all sizes in px, line-heights unitless
    size: {
      xs:   { size: 12, lh: 1.5,  tr: 0.0 },   // meta, captions
      sm:   { size: 14, lh: 1.45, tr: 0.0 },   // body small, labels
      base: { size: 16, lh: 1.5,  tr: 0.0 },   // body
      lg:   { size: 18, lh: 1.45, tr: -0.01 }, // emphasized body
      xl:   { size: 20, lh: 1.35, tr: -0.01 }, // card titles
      '2xl':{ size: 24, lh: 1.3,  tr: -0.015 },// section titles
      '3xl':{ size: 28, lh: 1.25, tr: -0.02 }, // page titles
      '4xl':{ size: 34, lh: 1.15, tr: -0.025 },// display
    },
    weight: { regular: 400, medium: 500, semibold: 600, bold: 700 },
  },
  space: { 0:0, 1:4, 2:8, 3:12, 4:16, 5:20, 6:24, 8:32, 10:40, 12:48, 16:64, 20:80 },
  radius: { none:0, sm:6, md:10, lg:14, xl:20, '2xl':24, full:999 },
  shadow: {
    xs: '0 1px 2px rgba(25, 25, 23, 0.04)',
    sm: '0 1px 3px rgba(25, 25, 23, 0.06), 0 1px 2px rgba(25, 25, 23, 0.04)',
    md: '0 4px 12px rgba(25, 25, 23, 0.06), 0 2px 4px rgba(25, 25, 23, 0.04)',
    lg: '0 12px 28px rgba(25, 25, 23, 0.10), 0 4px 8px rgba(25, 25, 23, 0.04)',
    focus: '0 0 0 3px rgba(45, 106, 79, 0.25)',
  },
  // Touch target minimum — WCAG 2.2 AAA target is 44px, we use 48.
  touchMin: 48,
};

window.HT = HT;
