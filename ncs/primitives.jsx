// Primitives: Icon (lucide wrapper), Pill, Stat, etc.
const { useEffect, useRef, useState, useMemo, useCallback } = React;

function Icon({ name, size = 16, strokeWidth = 1.75, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current || !window.lucide) return;
    ref.current.innerHTML = '';
    const svg = window.lucide.createElement(window.lucide.icons[name] || window.lucide.icons.Square);
    svg.setAttribute('width', String(size));
    svg.setAttribute('height', String(size));
    svg.setAttribute('stroke-width', String(strokeWidth));
    ref.current.appendChild(svg);
  }, [name, size, strokeWidth]);
  return <span ref={ref} className={`inline-flex items-center justify-center ${className}`} style={{lineHeight:0}} />;
}

function Pill({ children, tone = 'ink', icon, className = '' }) {
  const tones = {
    ink:     'bg-ink-600 text-ink-100 border-ink-500',
    crimson: 'bg-crimson-900 text-crimson-400 border-crimson-900',
    sky:     'bg-sky2-900 text-sky2-400 border-sky2-900',
    win:     'bg-win-900 text-win-500 border-win-900',
    warn:    'bg-warn-900 text-warn-500 border-warn-900',
    ghost:   'bg-transparent text-ink-200 border-ink-500',
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10.5px] font-semibold tracking-wider uppercase rounded border ${tones[tone]} ${className}`}>
      {icon && <Icon name={icon} size={11} strokeWidth={2.2} />}
      {children}
    </span>
  );
}

// Section header — caps eyebrow with red rule
function SectionTitle({ kicker, title, right, accent = 'crimson' }) {
  const accentColor = accent === 'crimson' ? 'bg-crimson-500' : accent === 'sky' ? 'bg-sky2-500' : 'bg-win-500';
  return (
    <div className="flex items-end justify-between mb-3">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`h-[3px] w-7 ${accentColor}`}></span>
          <span className="label-eyebrow">{kicker}</span>
        </div>
        <h2 className="font-display font-bold text-[17px] text-ink-50 tracking-tight">{title}</h2>
      </div>
      {right}
    </div>
  );
}

// Delta chip
function Delta({ value, dir }) {
  const isUp = dir === 'up';
  return (
    <span className={`inline-flex items-center gap-1 text-[11.5px] font-semibold tabnum ${isUp ? 'text-win-500' : 'text-crimson-400'}`}>
      <Icon name={isUp ? 'ArrowUpRight' : 'ArrowDownRight'} size={12} strokeWidth={2.4} />
      {value}
    </span>
  );
}

// progress bar
function Bar({ value, max = 100, tone = 'crimson', height = 6 }) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const colors = {
    crimson: 'bg-crimson-500',
    sky:     'bg-sky2-500',
    win:     'bg-win-500',
    warn:    'bg-warn-500',
    ink:     'bg-ink-400',
  };
  return (
    <div className="w-full rounded-full bg-ink-500/60" style={{ height }}>
      <div className={`${colors[tone]} rounded-full transition-all duration-500`} style={{ width: pct + '%', height }} />
    </div>
  );
}

window.__P = { Icon, Pill, SectionTitle, Delta, Bar };
