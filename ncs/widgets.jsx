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
        <div className="flex gap-2">
          <button onClick={() => onAction?.(gap, 'campaign')} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-crimson-500 hover:bg-crimson-600 text-white text-[11px] font-semibold rounded transition-colors whitespace-nowrap">
            <Icon name="Megaphone" size={12} strokeWidth={2.4} />
            Launch Campaign
          </button>
          <button onClick={() => onAction?.(gap, 'invite')} className="flex-1 flex items-center justify-center gap-1.5 px-2 py-1.5 bg-ink-600 hover:bg-ink-500 border border-ink-400 text-ink-50 text-[11px] font-semibold rounded transition-colors whitespace-nowrap">
            <Icon name="UserPlus" size={12} strokeWidth={2.4} />
            Invite Top Teams
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

window.__W = { KpiTile, RegistrationGapCard, TopTeamsTable, InsightsBriefing, LiveTicker };
