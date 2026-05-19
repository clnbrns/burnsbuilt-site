// Charts: PnL stacked bars, velocity, marketing attribution donut/bars
const { Icon, Pill } = window.__P;

// ---------- P&L STACKED BARS WITH MARGIN LINE ----------
function PnLChart({ data, height = 220 }) {
  const W = 720, H = height, PADL = 44, PADR = 16, PADT = 16, PADB = 32;
  const innerW = W - PADL - PADR;
  const innerH = H - PADT - PADB;
  const max = Math.max(...data.map(d => d.rev)) * 1.15;

  const barW = innerW / data.length * 0.62;
  const slot = innerW / data.length;

  // margin line points
  const points = data.map((d, i) => {
    const x = PADL + i * slot + slot / 2;
    const margin = d.rev - d.cost;
    const y = PADT + innerH - (margin / max) * innerH;
    return [x, y];
  });

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <linearGradient id="revGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#E63946" stopOpacity="0.95" />
          <stop offset="100%" stopColor="#E63946" stopOpacity="0.55" />
        </linearGradient>
        <linearGradient id="costGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#252F54" stopOpacity="1" />
          <stop offset="100%" stopColor="#252F54" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="marginArea" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#22C55E" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#22C55E" stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* gridlines */}
      {[0, 0.25, 0.5, 0.75, 1].map((g, i) => {
        const y = PADT + innerH * (1 - g);
        return (
          <g key={i}>
            <line x1={PADL} x2={W - PADR} y1={y} y2={y} stroke="#1B2444" strokeDasharray={g === 0 ? '0' : '2 4'} />
            <text x={PADL - 8} y={y + 3} fontSize="9.5" textAnchor="end" fill="#3A4571" fontFamily="JetBrains Mono">${(max * g).toFixed(1)}M</text>
          </g>
        );
      })}

      {/* bars */}
      {data.map((d, i) => {
        const x = PADL + i * slot + (slot - barW) / 2;
        const revH = (d.rev / max) * innerH;
        const costH = (d.cost / max) * innerH;
        return (
          <g key={i}>
            {/* revenue bar (full) */}
            <rect x={x} y={PADT + innerH - revH} width={barW} height={revH} fill="url(#revGrad)" rx="1" />
            {/* cost overlay */}
            <rect x={x} y={PADT + innerH - costH} width={barW} height={costH} fill="url(#costGrad)" rx="1" opacity="0.85" />
            {/* month */}
            <text x={x + barW / 2} y={H - 12} fontSize="9.5" textAnchor="middle" fill="#8893BD" fontFamily="JetBrains Mono">{d.m}</text>
          </g>
        );
      })}

      {/* margin area + line */}
      <path
        d={`M ${points[0][0]},${PADT + innerH} L ${points.map(p => p.join(',')).join(' L ')} L ${points[points.length - 1][0]},${PADT + innerH} Z`}
        fill="url(#marginArea)"
      />
      <polyline points={points.map(p => p.join(',')).join(' ')} fill="none" stroke="#22C55E" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
      {points.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="2.6" fill="#0A1024" stroke="#22C55E" strokeWidth="1.5" />
      ))}
    </svg>
  );
}

// ---------- REGISTRATION VELOCITY SPARKBAR ----------
function VelocityChart({ bars, height = 80 }) {
  const W = 480, H = height, PAD = 4;
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;
  const max = Math.max(...bars);
  const slot = innerW / bars.length;
  const barW = slot * 0.7;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full">
      <defs>
        <linearGradient id="velGrad" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      {bars.map((v, i) => {
        const h = (v / max) * innerH;
        const x = PAD + i * slot + (slot - barW) / 2;
        const y = PAD + innerH - h;
        // highlight last 3 bars in crimson
        const isHot = i >= bars.length - 3;
        return <rect key={i} x={x} y={y} width={barW} height={Math.max(2, h)} fill={isHot ? '#E63946' : 'url(#velGrad)'} rx="1" />;
      })}
    </svg>
  );
}

// ---------- AREA SPARKLINE ----------
function Sparkline({ data, height = 36, color = '#3B82F6', fill = true }) {
  const W = 160, H = height, PAD = 2;
  const innerW = W - PAD * 2;
  const innerH = H - PAD * 2;
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = (max - min) || 1;
  const pts = data.map((v, i) => {
    const x = PAD + (i / Math.max(1, data.length - 1)) * innerW;
    const y = PAD + innerH - ((v - min) / range) * innerH;
    return [x, y];
  });
  const id = `sp-${Math.random().toString(36).slice(2)}`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="none">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.4" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {fill && (
        <path d={`M ${pts[0][0]},${H - PAD} L ${pts.map(p => p.join(',')).join(' L ')} L ${pts[pts.length - 1][0]},${H - PAD} Z`} fill={`url(#${id})`} />
      )}
      <polyline points={pts.map(p => p.join(',')).join(' ')} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ---------- MARKETING ATTRIBUTION (horizontal bars w/ROAS) ----------
function MarketingAttribution({ rows }) {
  const maxSpend = Math.max(...rows.map(r => r.spend || 1));
  const maxRegs = Math.max(...rows.map(r => r.regs));
  const colors = {
    crimson: '#E63946',
    sky:     '#3B82F6',
    win:     '#22C55E',
    warn:    '#F59E0B',
    ink:     '#3A4571',
  };
  return (
    <div className="space-y-3.5">
      {rows.map((r, i) => (
        <div key={i} className="grid grid-cols-12 items-center gap-3">
          <div className="col-span-3">
            <div className="text-[12.5px] font-semibold text-ink-50 truncate">{r.ch}</div>
            <div className="text-[10.5px] text-ink-200 tabnum mt-0.5">
              {r.organic ? 'Organic — no spend' : `$${(r.spend/1000).toFixed(0)}K spend`}
            </div>
          </div>
          <div className="col-span-6 space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-ink-500/60 rounded">
                <div className="h-2 rounded transition-all" style={{ width: ((r.regs/maxRegs)*100)+'%', background: colors[r.color] }} />
              </div>
              <div className="text-[11.5px] tabnum text-ink-100 font-semibold w-16 text-right">{r.regs.toLocaleString()} regs</div>
            </div>
            {!r.organic && (
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-ink-500/40 rounded">
                  <div className="h-1 rounded" style={{ width: ((r.spend/maxSpend)*100)+'%', background: colors[r.color], opacity: 0.35 }} />
                </div>
                <div className="text-[10px] tabnum text-ink-300 w-16 text-right">CPA ${r.cpa}</div>
              </div>
            )}
          </div>
          <div className="col-span-3 flex items-center justify-end gap-2">
            {!r.organic ? (
              <>
                <div className="scorenum text-[22px] text-ink-50 tabnum leading-none">{r.roas.toFixed(1)}<span className="text-[12px] text-ink-200 font-medium ml-0.5">x</span></div>
                <div className="text-[9.5px] label-eyebrow leading-tight text-right">ROAS</div>
              </>
            ) : (
              <div className="text-[10.5px] label-eyebrow text-ink-300">— Organic —</div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- PIPELINE FUNNEL ----------
function Funnel({ stages }) {
  const max = Math.max(...stages.map(s => s.count));
  const colors = {
    crimson: 'from-crimson-500 to-crimson-600',
    sky:     'from-sky2-500 to-sky2-500',
    win:     'from-win-500 to-win-500',
    warn:    'from-warn-500 to-warn-500',
    ink:     'from-ink-400 to-ink-400',
  };
  const borders = {
    crimson: 'border-crimson-500/40',
    sky:     'border-sky2-500/40',
    win:     'border-win-500/40',
    warn:    'border-warn-500/40',
    ink:     'border-ink-400/40',
  };
  return (
    <div className="grid grid-cols-5 gap-2">
      {stages.map((s, i) => (
        <div key={s.id} className={`relative bg-ink-700 border ${borders[s.color]} p-3 rounded overflow-hidden`}>
          <div className="label-eyebrow text-[9.5px]">{`${i+1}. ${s.label}`}</div>
          <div className="scorenum text-[28px] text-ink-50 mt-1 leading-none">{s.count.toLocaleString()}</div>
          <div className="text-[11px] text-ink-200 mt-1.5 tabnum">{s.value}</div>
          {/* mini bar */}
          <div className="mt-2 h-1 bg-ink-500/60 rounded">
            <div className={`h-1 rounded bg-gradient-to-r ${colors[s.color]}`} style={{ width: ((s.count/max)*100)+'%' }} />
          </div>
        </div>
      ))}
    </div>
  );
}

window.__C = { PnLChart, VelocityChart, Sparkline, MarketingAttribution, Funnel };
