// Widgets: KPI tiles, Registration Gap action center, Top Teams, Insights, Ticker
const { Icon, Pill, SectionTitle, Delta, Bar } = window.__P;
const { Sparkline } = window.__C;

// ---------- KPI HERO TILE ----------
function KpiTile({ kpi, sparkline, accentOverride }) {
  const accents = {
    crimson: { bg: 'bg-crimson-500', text: 'text-crimson-400', border: 'border-crimson-500/30', color: '#E63946' },
    sky:     { bg: 'bg-sky2-500',    text: 'text-sky2-400',    border: 'border-sky2-500/30',    color: '#3B82F6' },
    win:     { bg: 'bg-win-500',     text: 'text-win-500',     border: 'border-win-500/30',     color: '#22C55E' },
    warn:    { bg: 'bg-warn-500',    text: 'text-warn-500',    border: 'border-warn-500/30',    color: '#F59E0B' },
  };
  const a = accents[accentOverride || kpi.accent];
  return (
    <div className={`relative bg-ink-700 border border-ink-500 hover:${a.border} hover:shadow-tile-hover transition-all duration-300 p-4 rounded overflow-hidden group field-stripes`}>
      <div className={`absolute top-0 left-0 h-[3px] ${a.bg} transition-all duration-500`} style={{ width: '32px' }}></div>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-7 h-7 rounded flex items-center justify-center bg-ink-600 border border-ink-500 ${a.text}`}>
            <Icon name={kpi.icon} size={14} strokeWidth={2} />
          </div>
          <div className="label-eyebrow text-[10px]">{kpi.label}</div>
        </div>
        <Delta value={kpi.delta} dir={kpi.dir} />
      </div>
      <div className="num-in" key={kpi.value}>
        <div className="scorenum text-[42px] text-ink-50 leading-none mb-1">{kpi.value}</div>
        <div className="text-[11px] text-ink-200 tabnum">{kpi.sub}</div>
      </div>
      {sparkline && (
        <div className="absolute bottom-0 right-0 w-[120px] h-[36px] opacity-50 group-hover:opacity-90 transition-opacity pointer-events-none">
          <Sparkline data={sparkline} color={a.color} height={36} />
        </div>
      )}
    </div>
  );
}

// ---------- REGISTRATION GAP ACTION CENTER ----------
function RegistrationGapCard({ gap, onAction }) {
  const fillPct = (gap.filled / gap.total) * 100;
  const riskTones = {
    high: { pill: 'crimson', label: 'CRITICAL' },
    med:  { pill: 'warn',    label: 'WATCH' },
    low:  { pill: 'win',     label: 'HEALTHY' },
  };
  const tone = riskTones[gap.risk];
  return (
    <div className="bg-ink-700 border border-ink-500 rounded p-4 hover:border-crimson-500/40 transition-all group">
      {/* Top row: risk pill left · right-aligned column with date / need / ratio */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <Pill tone={tone.pill}>{tone.label}</Pill>
        <div className="flex flex-col items-end text-right">
          <span className="text-[11px] text-ink-300 font-mono">{gap.when} · {gap.region}</span>
          <span className="scorenum text-[26px] leading-none mt-1 text-ink-50">
            {gap.need > 0 ? gap.need : <Icon name="Check" size={20} className="text-win-500" />}
          </span>
          <span className="text-[10.5px] text-ink-200 font-mono mt-0.5">
            {gap.need > 0 ? "need" : ""}
          </span>
          <span className="text-[10.5px] text-ink-300 font-mono mt-0.5">
            {gap.filled}/{gap.total} teams
          </span>
        </div>
      </div>

      {/* Tournament + division */}
      <div className="mb-3">
        <div className="font-display font-bold text-[14px] text-ink-50 truncate">{gap.tourn}</div>
        <div className="text-[11px] tabnum text-ink-200 mt-0.5">{gap.div}</div>
      </div>

      <div className="mb-3">
        <Bar value={fillPct} tone={gap.risk === 'high' ? 'crimson' : gap.risk === 'med' ? 'warn' : 'win'} />
      </div>

      {gap.need > 0 ? (
        <div className="flex gap-2 min-w-0">
          <button onClick={() => onAction?.(gap, 'campaign')} className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-crimson-500 hover:bg-crimson-600 text-white text-[11px] font-semibold rounded transition-colors whitespace-nowrap">
            <Icon name="Megaphone" size={12} strokeWidth={2.4} />
            Launch
          </button>
          <button onClick={() => onAction?.(gap, 'invite')} className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-ink-600 hover:bg-ink-500 border border-ink-400 text-ink-50 text-[11px] font-semibold rounded transition-colors whitespace-nowrap">
            <Icon name="UserPlus" size={12} strokeWidth={2.4} />
            Invite Teams
          </button>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-win-900 border border-win-500/30 text-win-500 text-[11px] font-semibold rounded whitespace-nowrap">
          <Icon name="CheckCircle2" size={12} strokeWidth={2.4} />
          Bracket full — locked in
        </div>
      )}
    </div>
  );
}

// ---------- PACE BAR (universal primitive) ----------
// Shows actual progress + an "expected here" tick mark. Color flips
// green when ahead of pace, red when meaningfully behind.
function PaceBar({ value, expected, max = 100, height = 6, label, valueLabel, neutralAhead }) {
  const valPct = Math.max(0, Math.min(100, (value / max) * 100));
  const expPct = Math.max(0, Math.min(100, (expected / max) * 100));
  const delta = valPct - expPct;
  // Tone selection — neutralAhead is for things like spend where being "ahead" isn't necessarily good
  const tone = delta >= 0
    ? (neutralAhead ? 'sky' : 'win')
    : (delta <= -10 ? 'crimson' : 'warn');
  const toneBg = { win: 'bg-win-500', warn: 'bg-warn-500', crimson: 'bg-crimson-500', sky: 'bg-sky2-500' }[tone];
  const toneText = { win: 'text-win-500', warn: 'text-warn-500', crimson: 'text-crimson-400', sky: 'text-sky2-400' }[tone];
  const verb = delta >= 5 ? 'ahead' : delta <= -5 ? 'behind' : 'on pace';
  return (
    <div className="w-full">
      {(label || valueLabel) && (
        <div className="flex items-baseline justify-between mb-1 gap-2">
          {label && <span className="label-eyebrow text-[9px]">{label}</span>}
          {valueLabel && (
            <span className="text-[10.5px] tabnum text-ink-300">
              {valueLabel} · <span className={`font-bold ${toneText}`}>{Math.abs(delta).toFixed(0)}pt {verb}</span>
            </span>
          )}
        </div>
      )}
      <div className="relative w-full bg-ink-600 rounded-sm overflow-visible" style={{ height }}>
        {/* Actual progress */}
        <div className={`absolute inset-y-0 left-0 rounded-sm ${toneBg} transition-all duration-500`} style={{ width: `${valPct}%` }}></div>
        {/* Expected-by-now tick mark */}
        <div
          title={`Expected: ${expected.toFixed(0)} / ${max}`}
          className="absolute bg-ink-50 border border-ink-900 rounded-sm shadow-md"
          style={{ left: `calc(${expPct}% - 1px)`, top: -2, bottom: -2, width: 2 }}
        ></div>
      </div>
    </div>
  );
}

// ---------- TOURNAMENT REGISTRATION CARD (TO tier — multi-event season view) ----------
function TournamentRegistrationCard({ tournament, onAction }) {
  const t = tournament;
  const fillPct = (t.filled / t.capacity) * 100;
  const closed = t.status === 'closed';
  const statusTones = {
    closed:   { pill: 'sky',     label: 'CLOSED',    bar: 'sky'     },
    healthy:  { pill: 'win',     label: 'ON TRACK',  bar: 'win'     },
    warn:     { pill: 'warn',    label: 'WATCH',     bar: 'warn'    },
    critical: { pill: 'crimson', label: 'CRITICAL',  bar: 'crimson' },
  };
  const tone = statusTones[t.status] || statusTones.healthy;

  // Age-group chip color
  const ageStatusBar = {
    full:     'win',
    healthy:  'win',
    warn:     'warn',
    critical: 'crimson',
  };

  return (
    <div className={`bg-ink-700 border border-ink-500 rounded p-4 hover:border-crimson-500/40 transition-all group ${closed ? 'opacity-70' : ''}`}>
      {/* Header: status pill · date / days out */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <Pill tone={tone.pill}>{tone.label}</Pill>
        <div className="flex flex-col items-end text-right">
          <span className="text-[11px] text-ink-300 font-mono">{t.dates}</span>
          <span className="text-[10.5px] text-ink-300 font-mono mt-0.5">
            {closed
              ? `${Math.abs(t.daysOut)}d ago`
              : `${t.daysOut}d out`}
          </span>
        </div>
      </div>

      {/* Tournament name + city */}
      <div className="mb-2.5">
        <div className="font-display font-bold text-[14px] text-ink-50 truncate">{t.name}</div>
        <div className="text-[11px] tabnum text-ink-200 mt-0.5 flex items-center gap-1.5">
          <Icon name="MapPin" size={10} className="text-ink-300" />
          {t.city}
        </div>
      </div>

      {/* Fill bar + headline + pace */}
      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-[11px] text-ink-200 tabnum">
            <span className="scorenum text-[18px] text-ink-50">{t.filled}</span>
            <span className="text-ink-300"> / {t.capacity} teams</span>
          </span>
          <span className="text-[11px] tabnum text-ink-100 font-semibold">{fillPct.toFixed(0)}%</span>
        </div>
        {closed || typeof t.expectedFillPct !== 'number' ? (
          <Bar value={fillPct} tone={tone.bar} />
        ) : (
          <PaceBar
            value={fillPct}
            expected={t.expectedFillPct}
            valueLabel={`expected ${t.expectedFillPct}% by D${t.daysOut > 0 ? '-' : '+'}${Math.abs(t.daysOut)}`}
          />
        )}
        <div className="text-[10.5px] text-ink-300 tabnum mt-1.5">{t.revenue}</div>
      </div>

      {/* Age-group grid */}
      <div className="mb-3 pt-3 border-t border-ink-500/60">
        <div className="label-eyebrow text-[9px] mb-2">By Age Group</div>
        <div className="space-y-1.5">
          {t.ageGroups.map((g, i) => {
            const gPct = (g.filled / g.cap) * 100;
            const gStatus = closed
              ? (g.filled >= g.cap ? 'full' : 'warn')
              : (g.status || 'healthy');
            const barTone = ageStatusBar[gStatus] || 'sky';
            return (
              <div key={i} className="flex items-center gap-2">
                <div className="w-9 shrink-0">
                  <span className="text-[11px] tabnum font-bold text-ink-100">{g.age}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <Bar value={gPct} tone={barTone} height={4} />
                </div>
                <div className="w-14 shrink-0 text-right">
                  <span className="text-[10.5px] tabnum text-ink-200">
                    <span className="text-ink-50 font-semibold">{g.filled}</span>/{g.cap}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Footer action */}
      {closed ? (
        <div className="flex items-center justify-center gap-1.5 px-2 py-1.5 bg-sky2-900 border border-sky2-500/30 text-sky2-400 text-[11px] font-semibold rounded">
          <Icon name="CheckCircle2" size={12} strokeWidth={2.4} />
          Event closed — {fillPct.toFixed(0)}% fill
        </div>
      ) : t.status === 'critical' || t.status === 'warn' ? (
        <div className="flex gap-2 min-w-0">
          <button onClick={() => onAction?.(t, 'campaign')} className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-crimson-500 hover:bg-crimson-600 text-white text-[11px] font-semibold rounded transition-colors whitespace-nowrap">
            <Icon name="Megaphone" size={12} strokeWidth={2.4} />
            Launch
          </button>
          <button onClick={() => onAction?.(t, 'invite')} className="flex-1 min-w-0 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-ink-600 hover:bg-ink-500 border border-ink-400 text-ink-50 text-[11px] font-semibold rounded transition-colors whitespace-nowrap">
            <Icon name="UserPlus" size={12} strokeWidth={2.4} />
            Invite Teams
          </button>
        </div>
      ) : (
        <button onClick={() => onAction?.(t, 'manage')} className="w-full flex items-center justify-center gap-1.5 px-2 py-1.5 bg-ink-600 hover:bg-ink-500 border border-ink-400 text-ink-100 text-[11px] font-semibold rounded transition-colors">
          <Icon name="ArrowRight" size={12} strokeWidth={2.4} />
          Manage Event
        </button>
      )}
    </div>
  );
}

// ---------- TOP TEAMS LEADERBOARD ----------
function TopTeamsTable({ teams }) {
  return (
    <div className="bg-ink-700 border border-ink-500 rounded overflow-hidden">
      {/* table head */}
      <div className="grid grid-cols-12 gap-2 px-4 py-2.5 bg-ink-800 border-b border-ink-500">
        <div className="col-span-1 label-eyebrow text-[9.5px]">Rank</div>
        <div className="col-span-4 label-eyebrow text-[9.5px]">Team</div>
        <div className="col-span-1 label-eyebrow text-[9.5px]">Div</div>
        <div className="col-span-2 label-eyebrow text-[9.5px]">Record</div>
        <div className="col-span-2 label-eyebrow text-[9.5px] text-right">NCS Rating</div>
        <div className="col-span-2 label-eyebrow text-[9.5px] text-right">Status</div>
      </div>
      {teams.map((t, i) => (
        <div key={t.rank} className={`grid grid-cols-12 gap-2 px-4 py-2.5 items-center hover:bg-ink-600/40 transition-colors ${i < teams.length - 1 ? 'border-b border-ink-500/40' : ''}`}>
          <div className="col-span-1 flex items-center gap-2">
            <div className={`scorenum text-[18px] leading-none ${t.rank === 1 ? 'text-crimson-500' : t.rank <= 3 ? 'text-ink-50' : 'text-ink-200'}`}>
              {String(t.rank).padStart(2,'0')}
            </div>
          </div>
          <div className="col-span-4 min-w-0">
            <div className="text-[13px] font-semibold text-ink-50 truncate">{t.name}</div>
            <div className="text-[10px] text-ink-300 tabnum">{t.region}</div>
          </div>
          <div className="col-span-1">
            <span className="inline-flex px-1.5 py-0.5 bg-ink-600 border border-ink-500 rounded text-[10px] font-mono font-semibold text-ink-100">{t.div}</span>
          </div>
          <div className="col-span-2 tabnum text-[12px] text-ink-100">{t.record}</div>
          <div className="col-span-2 text-right">
            <span className="scorenum text-[16px] tabnum text-ink-50">{t.rating}</span>
          </div>
          <div className="col-span-2 flex justify-end">
            {t.returning ? (
              <Pill tone="win" icon="Repeat">Returning</Pill>
            ) : (
              <Pill tone="sky" icon="Sparkle">New</Pill>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------- INSIGHTS PANEL (AI BRIEFING) ----------
function InsightsBriefing({ insights, tier }) {
  const tones = {
    opportunity: { tag: 'OPPORTUNITY', bg: 'bg-win-900',    text: 'text-win-500',     border: 'border-win-500/30' },
    risk:        { tag: 'RISK',        bg: 'bg-warn-900',   text: 'text-warn-500',    border: 'border-warn-500/30' },
    win:         { tag: 'MOMENTUM',    bg: 'bg-sky2-900',   text: 'text-sky2-400',    border: 'border-sky2-500/30' },
  };
  return (
    <div className="bg-gradient-to-br from-ink-700 via-ink-700 to-ink-800 border border-ink-500 rounded overflow-hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-ink-500 bg-ink-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-crimson-900 border border-crimson-500/30 flex items-center justify-center">
            <Icon name="Sparkles" size={14} strokeWidth={2} className="text-crimson-400" />
          </div>
          <div>
            <div className="font-display font-bold text-[14px] text-ink-50 tracking-tight">Executive Briefing</div>
            <div className="text-[10px] text-ink-300 tabnum">Generated 04:12 ET · {tier.scope}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson-500 pulse-dot"></span>
          <span className="label-eyebrow text-[9.5px] text-crimson-400">Live AI</span>
        </div>
      </div>
      <div className="divide-y divide-ink-500">
        {insights.map((ins, i) => {
          const tone = tones[ins.tone];
          return (
            <div key={i} className="px-4 py-3.5 hover:bg-ink-600/30 transition-colors group">
              <div className="flex items-start gap-3">
                <div className={`shrink-0 w-9 h-9 rounded flex items-center justify-center ${tone.bg} ${tone.text} border ${tone.border}`}>
                  <Icon name={ins.icon} size={16} strokeWidth={2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`label-eyebrow text-[9.5px] ${tone.text}`}>{tone.tag}</span>
                    <span className="w-1 h-1 rounded-full bg-ink-400"></span>
                    <span className="text-[10px] text-ink-300 tabnum">Confidence 92%</span>
                  </div>
                  <div className="text-[13.5px] font-semibold text-ink-50 leading-snug mb-1 text-wrap-pretty">{ins.title}</div>
                  <div className="text-[12px] text-ink-200 leading-relaxed">{ins.body}</div>
                  <div className="mt-2 flex items-center gap-3 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button className="text-[11px] font-semibold text-crimson-400 hover:text-crimson-500 flex items-center gap-1">
                      <Icon name="Zap" size={11} strokeWidth={2.4} /> Take action
                    </button>
                    <button className="text-[11px] text-ink-200 hover:text-ink-100 flex items-center gap-1">
                      <Icon name="ChevronRight" size={11} strokeWidth={2.4} /> Drill down
                    </button>
                    <button className="text-[11px] text-ink-200 hover:text-ink-100 flex items-center gap-1">
                      <Icon name="Bookmark" size={11} strokeWidth={2.4} /> Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- LIVE TICKER ----------
function LiveTicker({ items }) {
  const tagTones = {
    LIVE:  'bg-crimson-500 text-white',
    REG:   'bg-sky2-500 text-white',
    ALERT: 'bg-warn-500 text-ink-900',
    WIN:   'bg-win-500 text-ink-900',
    'P&L': 'bg-ink-500 text-ink-50',
    WX:    'bg-sky2-900 text-sky2-400 border border-sky2-500/40',
    OPS:   'bg-ink-500 text-ink-50',
  };
  const doubled = [...items, ...items, ...items];
  return (
    <div className="relative h-8 bg-ink-800 border-y border-ink-500 overflow-hidden">
      <div className="absolute inset-y-0 left-0 w-24 z-10 flex items-center justify-center bg-crimson-500 text-white">
        <span className="w-1.5 h-1.5 rounded-full bg-white pulse-dot mr-1.5"></span>
        <span className="label-eyebrow text-white text-[10px]">NCS Live</span>
      </div>
      <div className="absolute inset-0 pl-28 flex items-center overflow-hidden">
        <div className="flex ticker-track shrink-0" style={{ animationDuration: '60s' }}>
          {doubled.map((item, i) => (
            <div key={i} className="flex items-center gap-2 px-5 whitespace-nowrap">
              <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider ${tagTones[item.tag] || 'bg-ink-500 text-ink-50'}`}>{item.tag}</span>
              <span className="text-[11.5px] text-ink-100 tabnum">{item.text}</span>
              <span className="w-1 h-1 rounded-full bg-ink-400 ml-3"></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ---------- DAILY 5 — ACTION QUEUE ----------
// Top-of-overview ranked todo list. Each item is a one-click action.
function DailyFive({ actions, onRun }) {
  if (!actions || actions.length === 0) {
    return (
      <div className="bg-ink-700 border border-ink-500 rounded p-4 text-center">
        <div className="text-[12px] text-ink-300">No urgent actions for this tier today.</div>
      </div>
    );
  }
  const priorityTones = {
    P0: { bg: 'bg-crimson-500', text: 'text-white', label: 'P0' },
    P1: { bg: 'bg-warn-500',    text: 'text-ink-900', label: 'P1' },
    P2: { bg: 'bg-sky2-500',    text: 'text-white', label: 'P2' },
  };
  const kindIcons = {
    marketing: 'Megaphone', crm: 'Users', social: 'Sparkles', ops: 'Calendar', finance: 'DollarSign',
  };
  return (
    <div className="bg-gradient-to-br from-ink-800 via-ink-700 to-ink-800 border border-crimson-500/30 rounded overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-500 bg-ink-800/80 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-crimson-500 flex items-center justify-center text-white">
            <Icon name="ListChecks" size={14} strokeWidth={2.2} />
          </div>
          <div>
            <div className="font-display font-bold text-[14px] text-ink-50 tracking-tight">Today · Daily 5</div>
            <div className="text-[10.5px] text-ink-300 tabnum">Ranked by ROI · {actions.filter(a => a.priority === 'P0').length} urgent · refreshed 04:12 ET</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson-500 pulse-dot"></span>
          <span className="label-eyebrow text-[9.5px] text-crimson-400">AI-prioritized</span>
        </div>
      </div>
      <div className="divide-y divide-ink-500/40">
        {actions.map((a) => {
          const p = priorityTones[a.priority] || priorityTones.P2;
          const valClass = a.valueTone === 'crimson' ? 'text-crimson-400' :
                           a.valueTone === 'warn'    ? 'text-warn-500' :
                           a.valueTone === 'sky'     ? 'text-sky2-400' :
                           a.valueTone === 'win'     ? 'text-win-500' : 'text-ink-300';
          return (
            <div key={a.id} className="px-5 py-3 hover:bg-ink-600/40 transition-colors group">
              <div className="flex items-center gap-3">
                <div className="shrink-0 scorenum text-[16px] tabnum text-ink-300 w-5 text-center">{a.rank}</div>
                <div className={`shrink-0 w-9 h-9 rounded ${p.bg} ${p.text} flex items-center justify-center`}>
                  <Icon name={a.icon || kindIcons[a.kind] || 'Zap'} size={14} strokeWidth={2.2} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${p.bg} ${p.text}`}>{p.label}</span>
                    <span className="label-eyebrow text-[9px] text-ink-300">{a.kind}</span>
                  </div>
                  <div className="text-[13px] font-semibold text-ink-50 truncate">{a.title}</div>
                  <div className="text-[11px] text-ink-300 truncate mt-0.5">{a.context}</div>
                </div>
                <div className="shrink-0 text-right hidden md:block">
                  <div className={`scorenum text-[16px] tabnum leading-none ${valClass}`}>{a.value}</div>
                  <div className="label-eyebrow text-[9px] mt-1">at stake</div>
                </div>
                <button onClick={() => onRun?.(a)} className="shrink-0 px-3 py-1.5 text-[11.5px] font-bold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5 transition-colors">
                  {a.cta} <Icon name="ArrowRight" size={11} strokeWidth={2.4} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="px-5 py-2 border-t border-ink-500 bg-ink-800/60 flex items-center justify-between">
        <span className="text-[10.5px] text-ink-300">Items scored by revenue at risk × urgency × probability of impact</span>
        <button className="text-[11px] font-semibold text-crimson-400 hover:text-crimson-500">Show all 14 →</button>
      </div>
    </div>
  );
}

window.__W = { KpiTile, PaceBar, DailyFive, RegistrationGapCard, TournamentRegistrationCard, TopTeamsTable, InsightsBriefing, LiveTicker };
