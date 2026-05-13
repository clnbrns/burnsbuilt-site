// BurnsBuilt — Tailwind theme extension
// Drop this into your tailwind.config.js or merge with your existing theme.

module.exports = {
  theme: {
    extend: {
      colors: {
        bb: {
          navy:      '#142640',
          'navy-2':  '#1E3A5F',
          'navy-deep':'#0D1A2D',
          tan:       '#D9B382',
          'tan-2':   '#C49A62',
          'tan-3':   '#B88850',
          'tan-soft':'#EAD9BE',
          cream:     '#F5ECE0',
          paper:     '#FBF7F0',
          steel:     '#3D5A80',
          ink:       '#0E1A2E',
          bone:      '#F0EEE9',
        },
      },
      fontFamily: {
        display: ['Archivo', 'system-ui', 'sans-serif'],
        body:    ['Inter', 'system-ui', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'bb-display': ['84px', { lineHeight: '88px', letterSpacing: '-0.025em' }],
        'bb-h1':      ['56px', { lineHeight: '60px', letterSpacing: '-0.022em' }],
        'bb-h2':      ['36px', { lineHeight: '42px', letterSpacing: '-0.02em' }],
        'bb-h3':      ['24px', { lineHeight: '30px', letterSpacing: '-0.015em' }],
        'bb-body-l':  ['18px', { lineHeight: '27px' }],
        'bb-body':    ['15px', { lineHeight: '23px' }],
        'bb-caption': ['12px', { lineHeight: '1.4', letterSpacing: '0.18em' }],
        'bb-stamp':   ['10px', { lineHeight: '1.4', letterSpacing: '0.22em' }],
      },
      borderRadius: {
        'bb-sm': '4px',
        'bb-md': '6px',
        'bb-lg': '10px',
        'bb-xl': '12px',
      },
      backgroundImage: {
        'bb-hero': 'radial-gradient(120% 90% at 20% 20%, #1E3555 0%, #142640 40%, #0D1A2D 100%)',
      },
      borderColor: {
        'bb-rule': 'rgba(20, 38, 64, 0.12)',
      },
    },
  },
  plugins: [],
};
