// Main app — sidebar + header + tier switching + view composition
const { useState, useEffect, useRef, useMemo, useCallback } = React;
const { TIERS, NAV } = window.__NCS;
const { Icon, Pill, SectionTitle, Delta, Bar } = window.__P;
const { PnLChart, VelocityChart, Sparkline, MarketingAttribution, Funnel } = window.__C;
const { KpiTile, RegistrationGapCard, TournamentRegistrationCard, TopTeamsTable, InsightsBriefing, LiveTicker } = window.__W;

// --- TIER SWITCHER ---------------------------------------------------
function TierSwitcher({ tierId, setTierId }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);
  const current = TIERS[tierId];
  const items = [
    { id:'national', label:'National Command', desc:'Country-wide BI · 8 regions', icon:'Globe' },
    { id:'regional', label:'Regional Director', desc:'Region P&L · Multi-event ops', icon:'Map' },
    { id:'to',       label:'Tournament Organizer', desc:'Season-wide event portfolio (20–25/yr)', icon:'Flag' },
  ];
  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(v => !v)} className="flex items-center gap-2.5 px-3 py-2 bg-ink-700 border border-ink-500 hover:border-crimson-500/50 rounded transition-colors group">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson-500 pulse-dot"></span>
          <div className="text-left leading-tight">
            <div className="label-eyebrow text-[9.5px] text-ink-300">Viewing as</div>
            <div className="text-[12.5px] font-bold text-ink-50">{current.label} Tier</div>
          </div>
        </div>
        <Icon name="ChevronDown" size={14} className={`text-ink-200 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1.5 w-[300px] bg-ink-700 border border-ink-400 rounded shadow-2xl z-50 overflow-hidden tier-fade">
          <div className="px-3 py-2 bg-ink-800 border-b border-ink-500">
            <div className="label-eyebrow text-[9.5px]">Switch tier · simulate experience</div>
          </div>
          {items.map(it => (
            <button key={it.id}
              onClick={() => { setTierId(it.id); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-ink-600 transition-colors border-b border-ink-500/40 last:border-0 ${tierId===it.id ? 'bg-ink-600' : ''}`}>
              <div className={`w-8 h-8 rounded flex items-center justify-center ${tierId===it.id ? 'bg-crimson-500 text-white' : 'bg-ink-600 text-ink-200 border border-ink-500'}`}>
                <Icon name={it.icon} size={14} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold text-ink-50">{it.label}</div>
                <div className="text-[10.5px] text-ink-300">{it.desc}</div>
              </div>
              {tierId===it.id && <Icon name="Check" size={14} className="text-crimson-400" />}
            </button>
          ))}
          <div className="px-3 py-2 bg-ink-800 border-t border-ink-500">
            <div className="text-[10px] text-ink-300">Tier permissions inherited from NCS Auth · v4.2.1</div>
          </div>
        </div>
      )}
    </div>
  );
}

// Operations nav (shown below the main NAV section)
const NAV_OPS = [
  { id:'schedule', label:'Schedule', icon:'Calendar' },
  { id:'venues',   label:'Venues',   icon:'MapPin' },
  { id:'reports',  label:'Reports',  icon:'FileBarChart' },
  { id:'settings', label:'Settings', icon:'Settings2' },
];

// --- SIDEBAR ---------------------------------------------------------
function Sidebar({ activeId, setActiveId, operator, tierLabel }) {
  return (
    <aside className="w-[220px] shrink-0 h-screen sticky top-0 bg-ink-800 border-r border-ink-500 flex flex-col">
      {/* Logo lockup */}
      <div className="px-4 py-4 border-b border-ink-500">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="w-9 h-9 bg-crimson-500 rounded flex items-center justify-center font-display font-black text-white text-[15px] tracking-tight">N</div>
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-ink-50 rounded-sm border-2 border-ink-800"></div>
          </div>
          <div className="leading-tight">
            <div className="font-display font-black text-[14px] text-ink-50 tracking-tight">NCS COMMAND</div>
            <div className="text-[9.5px] text-ink-300 tabnum tracking-wider uppercase">Tournament BI · v4.2</div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2.5 py-3 overflow-y-auto">
        <div className="label-eyebrow text-[9.5px] px-2 mb-1.5">Workspace</div>
        <div className="space-y-0.5">
          {NAV.map(n => (
            <button key={n.id}
              onClick={() => setActiveId(n.id)}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded text-left transition-all ${
                activeId === n.id
                  ? 'bg-crimson-500/15 text-crimson-400 border-l-2 border-crimson-500 -ml-[2px] pl-[10px]'
                  : 'text-ink-100 hover:bg-ink-700 hover:text-ink-50'
              }`}>
              <Icon name={n.icon} size={14} strokeWidth={2} />
              <span className="text-[12.5px] font-medium">{n.label}</span>
            </button>
          ))}
        </div>

        <div className="label-eyebrow text-[9.5px] px-2 mt-5 mb-1.5">Operations</div>
        <div className="space-y-0.5">
          {NAV_OPS.map(n => (
            <button key={n.id}
              onClick={() => setActiveId(n.id)}
              className={`w-full flex items-center gap-2.5 px-2 py-2 rounded text-left transition-all ${
                activeId === n.id
                  ? 'bg-crimson-500/15 text-crimson-400 border-l-2 border-crimson-500 -ml-[2px] pl-[10px]'
                  : 'text-ink-100 hover:bg-ink-700 hover:text-ink-50'
              }`}>
              <Icon name={n.icon} size={14} strokeWidth={2} />
              <span className="text-[12.5px] font-medium">{n.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Operator card */}
      <div className="px-2.5 py-3 border-t border-ink-500">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded hover:bg-ink-700 cursor-pointer">
          <div className="w-8 h-8 rounded bg-gradient-to-br from-crimson-500 to-crimson-600 flex items-center justify-center font-display font-black text-white text-[12px]">
            {operator.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[12px] font-semibold text-ink-50 truncate">{operator.name}</div>
            <div className="text-[10px] text-ink-300 truncate">{operator.role}</div>
          </div>
          <Icon name="ChevronUp" size={14} className="text-ink-300" />
        </div>
      </div>
    </aside>
  );
}

// --- HEADER ----------------------------------------------------------
function Header({ tierId, setTierId, tier, period, setPeriod }) {
  const periods = ['7D', '30D', 'QTD', 'YTD', 'YoY'];
  return (
    <header className="bg-ink-800/80 backdrop-blur border-b border-ink-500 sticky top-0 z-40">
      <div className="px-6 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <TierSwitcher tierId={tierId} setTierId={setTierId} />
          <div className="hidden md:block w-px h-8 bg-ink-500"></div>
          <div className="hidden md:block min-w-0">
            <div className="flex items-center gap-1.5 text-[10.5px] text-ink-300">
              <Icon name="MapPin" size={10} strokeWidth={2.2} />
              <span className="label-eyebrow text-[9.5px]">{tier.scope}</span>
            </div>
            <div className="text-[11.5px] text-ink-200 tabnum truncate">{tier.sub}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* search */}
          <div className="hidden lg:flex items-center gap-2 bg-ink-700 border border-ink-500 rounded px-3 py-1.5 w-72 hover:border-ink-400 transition-colors">
            <Icon name="Search" size={13} className="text-ink-300" />
            <input className="bg-transparent outline-none flex-1 text-[12.5px] text-ink-100 placeholder:text-ink-300" placeholder="Search teams, tournaments, regions…" />
            <span className="text-[9.5px] font-mono text-ink-300 bg-ink-500 px-1 rounded">⌘K</span>
          </div>

          {/* period */}
          <div className="flex items-center bg-ink-700 border border-ink-500 rounded overflow-hidden">
            {periods.map(p => (
              <button key={p} onClick={() => setPeriod(p)}
                className={`px-2.5 py-1.5 text-[11px] font-bold tracking-wider tabnum transition-colors ${
                  period === p ? 'bg-crimson-500 text-white' : 'text-ink-200 hover:text-ink-50 hover:bg-ink-600'
                }`}>
                {p}
              </button>
            ))}
          </div>

          <button className="relative w-9 h-9 rounded bg-ink-700 border border-ink-500 hover:border-ink-400 flex items-center justify-center text-ink-200 hover:text-ink-50 transition-colors">
            <Icon name="Bell" size={14} />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-crimson-500"></span>
          </button>
          <button className="w-9 h-9 rounded bg-ink-700 border border-ink-500 hover:border-ink-400 flex items-center justify-center text-ink-200 hover:text-ink-50 transition-colors">
            <Icon name="Download" size={14} />
          </button>
          <button className="hidden xl:flex items-center gap-1.5 px-3 py-2 bg-crimson-500 hover:bg-crimson-600 text-white text-[12px] font-bold rounded transition-colors">
            <Icon name="Plus" size={13} strokeWidth={2.5} />
            New Tournament
          </button>
        </div>
      </div>
    </header>
  );
}

// --- FINANCIAL PANEL --------------------------------------------------
function FinancialPanel({ tier }) {
  const total = tier.pnl.reduce((a, b) => a + b.rev, 0);
  const costs = tier.pnl.reduce((a, b) => a + b.cost, 0);
  const margin = total - costs;
  const marginPct = ((margin / total) * 100).toFixed(1);
  const isSeason = tier.id === 'to';
  return (
    <div className="bg-ink-700 border border-ink-500 rounded p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-[3px] w-7 bg-crimson-500"></span>
            <span className="label-eyebrow">{isSeason ? 'Season P&L · Feb–Jul' : 'P&L Trend · 12 Months'}</span>
          </div>
          <h2 className="font-display font-bold text-[18px] text-ink-50 tracking-tight">Revenue vs Costs vs Margin</h2>
        </div>
        <div className="flex items-center gap-4">
          <Legend swatch="bg-crimson-500" label="Revenue" />
          <Legend swatch="bg-ink-400" label="Costs" />
          <Legend swatch="bg-win-500" label="Margin" line />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4 mb-4 pb-4 border-b border-ink-500">
        <FinKpi label="Gross Revenue" value={`$${total < 1 ? (total*1000).toFixed(0)+'K' : total.toFixed(1)+'M'}`} delta="+18.4%" dir="up" accent="crimson" />
        <FinKpi label="Total Costs"   value={`$${costs < 1 ? (costs*1000).toFixed(0)+'K' : costs.toFixed(1)+'M'}`} delta="+14.2%" dir="up" accent="ink" />
        <FinKpi label="Net Margin"    value={`$${margin < 1 ? (margin*1000).toFixed(0)+'K' : margin.toFixed(1)+'M'}`} sub={`${marginPct}% margin`} delta="+2.1pt" dir="up" accent="win" />
      </div>
      <div className="h-[220px]">
        <PnLChart data={tier.pnl} height={220} />
      </div>
    </div>
  );
}
function Legend({ swatch, label, line }) {
  return (
    <div className="flex items-center gap-1.5">
      {line ? (
        <span className={`w-4 h-0.5 ${swatch} rounded`}></span>
      ) : (
        <span className={`w-2.5 h-2.5 ${swatch} rounded-sm`}></span>
      )}
      <span className="text-[10.5px] text-ink-200 tracking-wider font-semibold">{label}</span>
    </div>
  );
}
function FinKpi({ label, value, sub, delta, dir, accent }) {
  const accents = {
    crimson: 'text-crimson-400',
    win:     'text-win-500',
    ink:     'text-ink-200',
  };
  return (
    <div>
      <div className="label-eyebrow text-[9.5px] mb-1">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className={`scorenum text-[26px] ${accents[accent]} leading-none`}>{value}</span>
        <Delta value={delta} dir={dir} />
      </div>
      {sub && <div className="text-[10.5px] text-ink-300 mt-0.5">{sub}</div>}
    </div>
  );
}

// --- VELOCITY PANEL ---------------------------------------------------
function VelocityPanel({ tier }) {
  return (
    <div className="bg-ink-700 border border-ink-500 rounded p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-[3px] w-7 bg-sky2-500"></span>
            <span className="label-eyebrow">Registration Velocity</span>
          </div>
          <h2 className="font-display font-bold text-[15px] text-ink-50 tracking-tight">Last 28 days</h2>
        </div>
        <Pill tone="sky" icon="Activity">Live</Pill>
      </div>
      <div className="flex items-baseline gap-3 mb-3">
        <span className="scorenum text-[32px] text-ink-50 leading-none">{tier.velocity.headline}</span>
        <Delta value={tier.velocity.delta} dir="up" />
      </div>
      <div className="h-[72px] mb-1">
        <VelocityChart bars={tier.velocity.bars} />
      </div>
      <div className="flex justify-between text-[9.5px] text-ink-300 tabnum mt-1">
        <span>−28d</span>
        <span>−21d</span>
        <span>−14d</span>
        <span>−7d</span>
        <span className="text-crimson-400 font-semibold">TODAY</span>
      </div>
    </div>
  );
}

// --- PIPELINE PANEL (mini) --------------------------------------------
function PipelinePanel({ tier }) {
  const total = tier.pipeline.stages.reduce((a, b) => a + b.count, 0);
  const won = tier.pipeline.stages.find(s => s.id === 'won').count;
  const conv = ((won / total) * 100).toFixed(1);
  return (
    <div className="bg-ink-700 border border-ink-500 rounded p-4">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-[3px] w-7 bg-win-500"></span>
            <span className="label-eyebrow">Recruitment Pipeline</span>
          </div>
          <h2 className="font-display font-bold text-[15px] text-ink-50 tracking-tight">Team CRM — Active Flow</h2>
        </div>
        <div className="text-right">
          <div className="scorenum text-[22px] text-win-500 leading-none">{conv}<span className="text-[11px] text-ink-200 font-medium ml-0.5">%</span></div>
          <div className="label-eyebrow text-[9.5px]">Lead → Reg</div>
        </div>
      </div>
      <Funnel stages={tier.pipeline.stages} />
    </div>
  );
}

// --- REGISTRATION GAP CENTER ------------------------------------------
function RegistrationGapCenter({ tier, onAction }) {
  // TO tier uses tournament-level cards across the season
  if (tier.id === 'to' && Array.isArray(tier.tournaments)) {
    return <SeasonRegistrationCenter tier={tier} onAction={onAction} />;
  }
  const critical = tier.gaps.filter(g => g.risk === 'high').length;
  const filled = tier.gaps.filter(g => g.need === 0).length;
  return (
    <div className="bg-gradient-to-br from-ink-700 to-ink-800 border border-ink-500 rounded p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-[3px] w-7 bg-crimson-500"></span>
            <span className="label-eyebrow">Action Center</span>
          </div>
          <div className="flex items-baseline gap-3">
            <h2 className="font-display font-bold text-[18px] text-ink-50 tracking-tight">Registration Gap Queue</h2>
            <span className="text-[11px] text-ink-200 tabnum">
              <span className="text-crimson-400 font-bold">{critical}</span> critical · <span className="text-win-500 font-bold">{filled}</span> locked
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="px-3 py-1.5 text-[11.5px] font-semibold text-ink-100 bg-ink-600 border border-ink-500 hover:border-ink-400 rounded flex items-center gap-1.5">
            <Icon name="Filter" size={12} /> Filter
          </button>
          <button className="px-3 py-1.5 text-[11.5px] font-semibold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5">
            <Icon name="Zap" size={12} strokeWidth={2.4} /> Batch Action
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {tier.gaps.map(g => <RegistrationGapCard key={g.id} gap={g} onAction={onAction} />)}
      </div>
    </div>
  );
}

// --- SEASON REGISTRATION CENTER (TO tier) -----------------------------
function SeasonRegistrationCenter({ tier, onAction }) {
  const [filter, setFilter] = useState('upcoming'); // upcoming | all | risk
  const tournaments = tier.tournaments;
  const critical = tournaments.filter(t => t.status === 'critical').length;
  const closed = tournaments.filter(t => t.status === 'closed').length;
  const upcoming = tournaments.filter(t => t.status !== 'closed').length;

  let visible = tournaments;
  if (filter === 'upcoming') visible = tournaments.filter(t => t.status !== 'closed');
  if (filter === 'risk')     visible = tournaments.filter(t => t.status === 'critical' || t.status === 'warn');

  // Sort: critical first, then by daysOut ascending (closest upcoming next)
  const order = { critical: 0, warn: 1, healthy: 2, closed: 3 };
  visible = [...visible].sort((a, b) => {
    const oa = order[a.status] ?? 4, ob = order[b.status] ?? 4;
    if (oa !== ob) return oa - ob;
    return a.daysOut - b.daysOut;
  });

  const totalFilled = tournaments.reduce((a,t) => a + t.filled, 0);
  const totalCap    = tournaments.reduce((a,t) => a + t.capacity, 0);
  const seasonPct   = (totalFilled / totalCap) * 100;

  return (
    <div className="bg-gradient-to-br from-ink-700 to-ink-800 border border-ink-500 rounded p-5">
      <div className="flex items-start justify-between mb-4 gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-[3px] w-7 bg-crimson-500"></span>
            <span className="label-eyebrow">Action Center · Spring 2026 Season</span>
          </div>
          <div className="flex items-baseline gap-3 flex-wrap">
            <h2 className="font-display font-bold text-[18px] text-ink-50 tracking-tight">Registration by Tournament</h2>
            <span className="text-[11px] text-ink-200 tabnum">
              <span className="text-crimson-400 font-bold">{critical}</span> at risk ·{' '}
              <span className="text-ink-50 font-bold">{upcoming}</span> upcoming ·{' '}
              <span className="text-sky2-400 font-bold">{closed}</span> closed
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center bg-ink-700 border border-ink-500 rounded overflow-hidden">
            {[{ id:'upcoming', label:'Upcoming' }, { id:'risk', label:'At Risk' }, { id:'all', label:'All' }].map(opt => (
              <button key={opt.id} onClick={() => setFilter(opt.id)}
                className={`px-2.5 py-1.5 text-[11px] font-bold tracking-wider tabnum transition-colors ${
                  filter === opt.id ? 'bg-crimson-500 text-white' : 'text-ink-200 hover:text-ink-50 hover:bg-ink-600'
                }`}>
                {opt.label}
              </button>
            ))}
          </div>
          <button className="px-3 py-1.5 text-[11.5px] font-semibold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5">
            <Icon name="Zap" size={12} strokeWidth={2.4} /> Batch Action
          </button>
        </div>
      </div>

      {/* Season fill summary strip */}
      <div className="bg-ink-800/60 border border-ink-500 rounded p-3 mb-4 flex items-center gap-4">
        <div className="shrink-0">
          <div className="label-eyebrow text-[9.5px]">Season Fill</div>
          <div className="scorenum text-[22px] text-ink-50 leading-none tabnum">{seasonPct.toFixed(0)}<span className="text-[12px] text-ink-200 ml-0.5">%</span></div>
        </div>
        <div className="flex-1">
          <Bar value={seasonPct} tone="crimson" height={8} />
          <div className="text-[10.5px] text-ink-300 tabnum mt-1.5">{totalFilled} of {totalCap} teams across {tournaments.length} tournaments</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {visible.map(t => <TournamentRegistrationCard key={t.id} tournament={t} onAction={onAction} />)}
      </div>
    </div>
  );
}

// --- MARKETING PANEL --------------------------------------------------
function MarketingPanel({ tier }) {
  const totalSpend = tier.marketing.reduce((a, b) => a + (b.spend || 0), 0);
  const totalRegs  = tier.marketing.reduce((a, b) => a + b.regs, 0);
  const blendedCPA = (totalSpend / totalRegs).toFixed(0);
  return (
    <div className="bg-ink-700 border border-ink-500 rounded p-5 h-full">
      <SectionTitle
        kicker="Marketing Engine"
        title="Channel Attribution · Spend → Regs → ROAS"
        right={
          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="label-eyebrow text-[9.5px]">Total Spend</div>
              <div className="scorenum text-[18px] text-ink-50 tabnum">${(totalSpend/1000).toFixed(0)}K</div>
            </div>
            <div>
              <div className="label-eyebrow text-[9.5px]">Blended CPA</div>
              <div className="scorenum text-[18px] text-crimson-400 tabnum">${blendedCPA}</div>
            </div>
            <div>
              <div className="label-eyebrow text-[9.5px]">Attributed Regs</div>
              <div className="scorenum text-[18px] text-win-500 tabnum">{totalRegs.toLocaleString()}</div>
            </div>
          </div>
        }
      />
      <MarketingAttribution rows={tier.marketing} />
      <div className="mt-4 pt-4 border-t border-ink-500 flex items-center justify-between">
        <div className="text-[11px] text-ink-300">Attribution model: last-touch · 7-day lookback · NCS Marketing v3.1</div>
        <button className="text-[11.5px] font-semibold text-crimson-400 hover:text-crimson-500 flex items-center gap-1">
          Open Campaign Builder <Icon name="ArrowRight" size={11} strokeWidth={2.4} />
        </button>
      </div>
    </div>
  );
}

// --- HERO KPIS --------------------------------------------------------
function HeroKpis({ tier }) {
  // synthetic sparkline data tied to each KPI
  const sparkData = {
    gmv:  tier.pnl.map(p => p.rev),
    reg:  tier.velocity.bars.slice(-12),
    roi:  [4.2, 4.6, 4.9, 5.1, 5.5, 5.8, 6.0, 6.2, 6.4, 6.1, 6.3, 6.4],
    lead: [1380, 1342, 1356, 1318, 1334, 1289, 1301, 1284],
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {tier.kpis.map(k => (
        <KpiTile key={k.id} kpi={k} sparkline={sparkData[k.id]} />
      ))}
    </div>
  );
}

// --- DASHBOARD VIEW ---------------------------------------------------
function Dashboard({ tier, onAction }) {
  return (
    <div className="space-y-5 tier-fade" key={tier.id}>
      <HeroKpis tier={tier} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-8 space-y-5">
          <FinancialPanel tier={tier} />
          <RegistrationGapCenter tier={tier} onAction={onAction} />
        </div>
        <div className="xl:col-span-4 space-y-5">
          <VelocityPanel tier={tier} />
          <PipelinePanel tier={tier} />
          <InsightsBriefing insights={tier.insights} tier={tier} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7">
          <MarketingPanel tier={tier} />
        </div>
        <div className="xl:col-span-5">
          <TopTeamsCompact teams={tier.teams.slice(0,6)} tier={tier} />
        </div>
      </div>

      <TopTeamsPanel tier={tier} />
    </div>
  );
}

function TopTeamsCompact({ teams, tier }) {
  // Division strength breakdown
  const divs = useMemo(() => {
    const map = {};
    tier.teams.forEach(t => {
      if (!map[t.div]) map[t.div] = { count: 0, avgRating: 0, sum: 0 };
      map[t.div].count++;
      map[t.div].sum += t.rating;
    });
    return Object.entries(map).map(([div, v]) => ({ div, count: v.count, avg: Math.round(v.sum/v.count) }))
      .sort((a, b) => b.avg - a.avg);
  }, [tier]);
  return (
    <div className="bg-ink-700 border border-ink-500 rounded p-4 h-full">
      <SectionTitle
        kicker="Division Strength"
        title="Talent Density by Age Bracket"
        accent="sky"
        right={<Pill tone="sky" icon="Trophy">{tier.teams.length} elite teams</Pill>}
      />
      <div className="space-y-2.5">
        {divs.map(d => {
          const pct = ((d.avg - 1800) / (2200 - 1800)) * 100;
          return (
            <div key={d.div} className="flex items-center gap-3">
              <div className="w-12 shrink-0">
                <div className="scorenum text-[18px] text-ink-50 tabnum leading-none">{d.div}</div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] text-ink-200 tabnum">{d.count} teams</span>
                  <span className="text-[11px] text-ink-200 tabnum">avg rating <span className="text-ink-50 font-bold">{d.avg}</span></span>
                </div>
                <Bar value={pct} tone="sky" height={6} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-ink-500 grid grid-cols-3 gap-2 text-center">
        <div>
          <div className="scorenum text-[22px] text-ink-50 tabnum leading-none">{tier.teams.filter(t=>t.returning).length}</div>
          <div className="label-eyebrow text-[9.5px] mt-1">Returning</div>
        </div>
        <div>
          <div className="scorenum text-[22px] text-crimson-400 tabnum leading-none">{tier.teams.filter(t=>!t.returning).length}</div>
          <div className="label-eyebrow text-[9.5px] mt-1">New</div>
        </div>
        <div>
          <div className="scorenum text-[22px] text-win-500 tabnum leading-none">78<span className="text-[11px] text-ink-200 ml-0.5">%</span></div>
          <div className="label-eyebrow text-[9.5px] mt-1">Retention</div>
        </div>
      </div>
    </div>
  );
}

function TopTeamsPanel({ tier }) {
  return (
    <div>
      <SectionTitle
        kicker="Teams & Talent Tracker"
        title={`Top NCS Teams · ${tier.label} Leaderboard`}
        right={
          <div className="flex items-center gap-2">
            <button className="px-2.5 py-1 text-[11px] font-semibold text-ink-100 bg-ink-600 border border-ink-500 hover:border-ink-400 rounded">All Divisions</button>
            <button className="px-2.5 py-1 text-[11px] font-semibold text-ink-300 hover:text-ink-100">By Region</button>
            <button className="px-2.5 py-1 text-[11px] font-semibold text-ink-300 hover:text-ink-100">Returning Only</button>
          </div>
        }
      />
      <TopTeamsTable teams={tier.teams} />
    </div>
  );
}

// --- TOAST -----------------------------------------------------------
function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(onClose, 3600);
    return () => clearTimeout(t);
  }, [toast, onClose]);
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm bg-ink-700 border border-crimson-500/40 rounded shadow-2xl p-4 tier-fade">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded bg-crimson-500 flex items-center justify-center shrink-0">
          <Icon name={toast.icon} size={14} strokeWidth={2.4} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-[13px] font-bold text-ink-50">{toast.title}</div>
          <div className="text-[11.5px] text-ink-200 mt-0.5">{toast.body}</div>
        </div>
        <button onClick={onClose} className="text-ink-300 hover:text-ink-50">
          <Icon name="X" size={14} />
        </button>
      </div>
    </div>
  );
}

// =====================================================================
// VIEW ROUTER
// =====================================================================
function ActiveView({ navId, tier, onAction }) {
  switch (navId) {
    case 'finance':       return <FinancialBIView   tier={tier} />;
    case 'registration':  return <RegistrationView  tier={tier} onAction={onAction} />;
    case 'marketing':     return <MarketingView     tier={tier} onAction={onAction} />;
    case 'teams':         return <TeamsView         tier={tier} />;
    case 'crm':           return <CRMView           tier={tier} />;
    case 'insights':      return <InsightsView      tier={tier} />;
    case 'schedule':      return <ScheduleView      tier={tier} />;
    case 'venues':        return <VenuesView        tier={tier} />;
    case 'reports':       return <ReportsView       tier={tier} />;
    case 'settings':      return <SettingsView      tier={tier} />;
    case 'overview':
    default:              return <Dashboard         tier={tier} onAction={onAction} />;
  }
}

// =====================================================================
// MAIN APP
// =====================================================================
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "comfortable",
  "accent": "crimson"
}/*EDITMODE-END*/;

function App() {
  const [tierId, setTierId] = useState('national');
  const [activeNav, setActiveNav] = useState('overview');
  const [period, setPeriod] = useState('YTD');
  const [toast, setToast] = useState(null);
  const tier = TIERS[tierId];

  const { TweaksPanel, useTweaks, TweakSection, TweakRadio } = window;
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  const handleAction = useCallback((target, action) => {
    // target may be a legacy gap (div/tourn) or a tournament (name/city/ageGroups)
    const isTournament = !!target.ageGroups;
    const title = isTournament ? `${target.name} — ${target.city}` : target.tourn;
    const scopeLabel = isTournament
      ? (() => {
          const weak = target.ageGroups.filter(g => g.status === 'critical' || g.status === 'warn');
          return weak.length ? weak.map(g => g.age).join(', ') : 'all age groups';
        })()
      : target.div;
    if (action === 'campaign') {
      setToast({
        icon: 'Megaphone',
        title: `Campaign launched: ${title}`,
        body: `Targeting ${scopeLabel} coaches within 75mi. Est. fill: 3–5 days. Budget $1,800 from season marketing pool.`,
      });
    } else if (action === 'send') {
      // Marketing composer payload: { kind, who, subject, body, platform, prompt, audience }
      const t = target;
      const isSocial = t.kind === 'social';
      const isSMS = t.kind === 'sms';
      const verb = isSocial ? `Generated for ${t.platform}` : isSMS ? `SMS queued` : `Email queued`;
      const aud = typeof t.audience === 'number' ? t.audience.toLocaleString() : t.audience;
      setToast({
        icon: isSocial ? 'Sparkles' : isSMS ? 'MessageSquare' : 'Mail',
        title: `${verb} · ${aud} ${t.who}`,
        body: isSocial
          ? `Nano Banana generated image from prompt. Caption ${t.body ? 'attached' : 'pending'}. Review in Social Drafts before publishing.`
          : `Throttled delivery starting now. Open rate target 55%+. Track results in Recent Sends.`,
      });
    } else if (action === 'manage') {
      setToast({
        icon: 'ArrowRight',
        title: `Opening: ${title}`,
        body: `Loading event ops dashboard — schedule, fields, umpire assignments, registration roster.`,
      });
    } else {
      setToast({
        icon: 'UserPlus',
        title: `Invitations sent: ${title}`,
        body: `12 top-rated ${scopeLabel} teams invited via NCS Coach Network. Avg reply rate 64%.`,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-ink-900 text-ink-50 flex" data-screen-label={`NCS Command — ${tier.label}`}>
      <Sidebar activeId={activeNav} setActiveId={setActiveNav} operator={tier.operator} tierLabel={tier.label} />
      <div className="flex-1 min-w-0 flex flex-col">
        <Header tierId={tierId} setTierId={setTierId} tier={tier} period={period} setPeriod={setPeriod} />
        <LiveTicker items={tier.ticker} />
        <main className="flex-1 px-6 py-5 dot-grid">
          <ActiveView navId={activeNav} tier={tier} onAction={handleAction} />
          <Footer />
        </main>
      </div>

      <TweaksPanel title="Tweaks">
        <TweakSection label="View">
          <TweakRadio
            label="Tier"
            value={tierId}
            onChange={setTierId}
            options={[
              { value: 'national', label: 'National' },
              { value: 'regional', label: 'Regional' },
              { value: 'to',       label: 'TO' },
            ]}
          />
          <TweakRadio
            label="Period"
            value={period}
            onChange={setPeriod}
            options={['30D', 'QTD', 'YTD']}
          />
        </TweakSection>
      </TweaksPanel>

      <Toast toast={toast} onClose={() => setToast(null)} />
    </div>
  );
}

// =====================================================================
// SECTION VIEWS — built primarily for the TO tier
// =====================================================================

function ViewHeader({ kicker, title, sub, right }) {
  return (
    <div className="flex items-start justify-between mb-4 gap-4 border-b border-ink-500 pb-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-[3px] w-7 bg-crimson-500"></span>
          <span className="label-eyebrow">{kicker}</span>
        </div>
        <h1 className="font-display font-bold text-[22px] text-ink-50 tracking-tight leading-tight">{title}</h1>
        {sub && <div className="text-[12px] text-ink-300 tabnum mt-1">{sub}</div>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

function TierGuard({ tier, children }) {
  if (tier.id !== 'to') {
    return (
      <div className="bg-ink-700 border border-ink-500 rounded p-8 text-center">
        <div className="w-12 h-12 mx-auto mb-3 rounded bg-ink-600 border border-ink-500 flex items-center justify-center text-ink-300">
          <Icon name="Flag" size={20} />
        </div>
        <h2 className="font-display font-bold text-[16px] text-ink-50 mb-1">Built for Tournament Organizer tier</h2>
        <p className="text-[12.5px] text-ink-300 max-w-md mx-auto">This view is currently scoped to a single TO's season portfolio. Switch to the <b className="text-ink-100">Tournament Organizer</b> tier in the top-left selector to see the full experience.</p>
      </div>
    );
  }
  return children;
}

// ---- FINANCIAL BI VIEW ----------------------------------------------
function FinancialBIView({ tier }) {
  return (
    <div className="space-y-5 tier-fade">
      <ViewHeader
        kicker={`Financial BI · ${tier.label}`}
        title={tier.id === 'to' ? 'Season P&L · Margin · Cash Flow' : 'Financial Intelligence'}
        sub={tier.scope + ' · ' + tier.sub}
        right={
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-[11.5px] font-semibold text-ink-100 bg-ink-600 border border-ink-500 hover:border-ink-400 rounded flex items-center gap-1.5"><Icon name="Download" size={12}/> Export</button>
            <button className="px-3 py-1.5 text-[11.5px] font-semibold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5"><Icon name="BookOpen" size={12} strokeWidth={2.4}/> Open in QuickBooks</button>
          </div>
        }
      />

      <HeroKpis tier={tier} />

      <FinancialPanel tier={tier} />

      <TierGuard tier={tier}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-6">
            <RevenueMixPanel mix={tier.finance?.revenueMix} title="Revenue Mix · Season YTD" />
          </div>
          <div className="xl:col-span-6">
            <RevenueMixPanel mix={tier.finance?.costMix} title="Cost Categories · Season YTD" cost />
          </div>
        </div>

        <PerEventPnLTable rows={tier.finance?.perEvent} />
      </TierGuard>
    </div>
  );
}

function RevenueMixPanel({ mix, title, cost }) {
  if (!mix) return null;
  const total = mix.reduce((a, b) => a + b.amt, 0);
  const swatch = { crimson:'bg-crimson-500', sky:'bg-sky2-500', warn:'bg-warn-500', win:'bg-win-500', ink:'bg-ink-400' };
  const bar    = { crimson:'crimson',        sky:'sky',         warn:'warn',         win:'win',         ink:'ink'      };
  return (
    <div className="bg-ink-700 border border-ink-500 rounded p-5 h-full">
      <SectionTitle kicker={cost ? 'Where the money goes' : 'Where the money comes from'} title={title} accent={cost ? 'warn' : 'crimson'} />
      <div className="space-y-2.5">
        {mix.map((m, i) => {
          const pct = (m.amt / total) * 100;
          return (
            <div key={i} className="flex items-center gap-3">
              <div className={`w-2.5 h-2.5 rounded-sm ${swatch[m.color] || 'bg-ink-400'}`}></div>
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-[12px] text-ink-100 font-semibold">{m.src}</span>
                  <span className="text-[11px] tabnum text-ink-200">
                    <span className="text-ink-50 font-bold">${(m.amt/1000).toFixed(0)}K</span>
                    <span className="text-ink-300 ml-1.5">{pct.toFixed(1)}%</span>
                  </span>
                </div>
                <Bar value={pct * 1.4} tone={bar[m.color] || 'sky'} height={5} />
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-ink-500 flex items-center justify-between">
        <span className="text-[10.5px] text-ink-300 tabnum">Total {cost ? 'costs' : 'revenue'}</span>
        <span className="scorenum text-[20px] text-ink-50 tabnum">${(total/1000).toFixed(0)}K</span>
      </div>
    </div>
  );
}

function PerEventPnLTable({ rows }) {
  if (!rows) return null;
  return (
    <div className="bg-ink-700 border border-ink-500 rounded overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-500 flex items-center justify-between">
        <SectionTitle kicker="Per-Tournament P&L" title="Margin Health by Event" accent="crimson" />
        <Pill tone="sky" icon="TrendingUp">Live · 11 events</Pill>
      </div>
      <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-ink-800 border-b border-ink-500">
        <div className="col-span-4 label-eyebrow text-[9.5px]">Tournament</div>
        <div className="col-span-2 label-eyebrow text-[9.5px] text-right">Revenue</div>
        <div className="col-span-2 label-eyebrow text-[9.5px] text-right">Costs</div>
        <div className="col-span-2 label-eyebrow text-[9.5px] text-right">Margin</div>
        <div className="col-span-2 label-eyebrow text-[9.5px] text-right">Trend</div>
      </div>
      {rows.map((r, i) => {
        const mg = r.rev - r.cost;
        const mgClass = r.marginPct >= 30 ? 'text-win-500' : r.marginPct >= 15 ? 'text-ink-50' : r.marginPct >= 0 ? 'text-warn-500' : 'text-crimson-400';
        const trendIcon = r.trend === 'up' ? 'TrendingUp' : r.trend === 'down' ? 'TrendingDown' : 'Minus';
        const trendTone = r.trend === 'up' ? 'text-win-500' : r.trend === 'down' ? 'text-crimson-400' : 'text-ink-300';
        return (
          <div key={r.id} className={`grid grid-cols-12 gap-2 px-5 py-2.5 items-center hover:bg-ink-600/40 transition-colors ${i < rows.length - 1 ? 'border-b border-ink-500/40' : ''}`}>
            <div className="col-span-4 min-w-0 flex items-center gap-2">
              <div className="text-[13px] font-semibold text-ink-50 truncate">{r.name}</div>
              {r.projected && <span className="px-1.5 py-0.5 bg-sky2-900 border border-sky2-500/30 text-sky2-400 text-[9px] font-bold rounded tracking-wider">PROJ</span>}
            </div>
            <div className="col-span-2 text-right tabnum text-[13px] text-ink-50">${r.rev}K</div>
            <div className="col-span-2 text-right tabnum text-[13px] text-ink-200">${r.cost}K</div>
            <div className="col-span-2 text-right">
              <div className={`scorenum text-[16px] tabnum ${mgClass}`}>${mg}K</div>
              <div className={`text-[10px] tabnum ${mgClass}`}>{r.marginPct.toFixed(1)}%</div>
            </div>
            <div className="col-span-2 flex justify-end items-center gap-1.5">
              <Icon name={trendIcon} size={13} className={trendTone} />
              <span className={`text-[11px] font-semibold ${trendTone}`}>
                {r.trend === 'up' ? 'Up' : r.trend === 'down' ? 'Down' : 'Flat'}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ---- REGISTRATION VIEW ----------------------------------------------
function RegistrationView({ tier, onAction }) {
  return (
    <div className="space-y-5 tier-fade">
      <ViewHeader
        kicker="Registration"
        title="Tournament Registration · Season View"
        sub={tier.id === 'to' ? `${tier.tournaments.length} tournaments · ${tier.tournaments.reduce((a,t)=>a+t.filled,0)} / ${tier.tournaments.reduce((a,t)=>a+t.capacity,0)} teams` : tier.sub}
        right={
          <div className="flex items-center gap-2">
            <Pill tone="sky" icon="Activity">Live</Pill>
            <button className="px-3 py-1.5 text-[11.5px] font-semibold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5"><Icon name="Plus" size={12} strokeWidth={2.4}/> New Tournament</button>
          </div>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-3">
        {tier.kpis.map(k => <KpiTile key={k.id} kpi={k} />)}
      </div>

      <RegistrationGapCenter tier={tier} onAction={onAction} />

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7">
          <VelocityPanel tier={tier} />
        </div>
        <div className="xl:col-span-5">
          <PipelinePanel tier={tier} />
        </div>
      </div>
    </div>
  );
}

// ---- MARKETING VIEW -------------------------------------------------
function MarketingView({ tier, onAction }) {
  const [composer, setComposer] = useState(null); // null | 'email-coach' | 'sms-coach' | 'email-parent' | 'sms-parent' | 'social'
  const audience = tier.audience;

  const channels = [
    { id:'email-coach',  kind:'email',  who:'Coaches',  icon:'Mail',         tone:'crimson', tagline:'Email coaches',       eyebrow:'Targeted blast', est: audience?.coaches.email,  channel:'Gmail SMTP · 248/hr cap' },
    { id:'sms-coach',    kind:'sms',    who:'Coaches',  icon:'MessageSquare',tone:'sky',     tagline:'SMS coaches',         eyebrow:'Direct text',    est: audience?.coaches.sms,    channel:'Twilio · 1 msg/segment' },
    { id:'email-parent', kind:'email',  who:'Parents',  icon:'Users',        tone:'win',     tagline:'Email all parents',   eyebrow:'Mass send',      est: audience?.parents.email,  channel:'Gmail SMTP · 248/hr cap' },
    { id:'sms-parent',   kind:'sms',    who:'Parents',  icon:'Send',         tone:'warn',    tagline:'SMS all parents',     eyebrow:'Day-of comms',   est: audience?.parents.sms,    channel:'Twilio · use sparingly' },
    { id:'social',       kind:'social', who:'Public',   icon:'Sparkles',     tone:'crimson', tagline:'Draft social content',eyebrow:'Nano Banana · AI',est:'Auto-publish',           channel:'IG · FB · TikTok · X' },
  ];

  return (
    <div className="space-y-5 tier-fade">
      <ViewHeader
        kicker="Marketing Engine"
        title="Compose · Audience · Send"
        sub={tier.id === 'to'
          ? `${audience.coaches.total.toLocaleString()} coaches · ${audience.parents.total.toLocaleString()} parents in your audience`
          : tier.scope + ' · ' + tier.sub}
        right={
          <div className="flex items-center gap-2">
            <Pill tone="win" icon="Check">Gmail · Twilio connected</Pill>
            <button className="px-3 py-1.5 text-[11.5px] font-semibold text-ink-100 bg-ink-600 border border-ink-500 hover:border-ink-400 rounded flex items-center gap-1.5"><Icon name="FileText" size={12}/> Templates</button>
          </div>
        }
      />

      {/* COMPOSE HUB — 5 channel launchers */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
        {channels.map(c => (
          <ChannelLaunchCard key={c.id} ch={c} onLaunch={() => setComposer(c.id)} />
        ))}
      </div>

      <TierGuard tier={tier}>
        {/* AUDIENCE PICKER */}
        <AudiencePicker audience={audience} />

        {/* TWO-COLUMN: Recent sends + Templates */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7">
            <RecentSendsTable sends={tier.marketingSends} />
          </div>
          <div className="xl:col-span-5">
            <TemplatesPanel templates={tier.marketingTemplates} onUse={(tpl) => setComposer(tpl.kind === 'social' ? 'social' : (tpl.kind + '-' + (tpl.audience === 'parents' ? 'parent' : 'coach')))} />
          </div>
        </div>

        {/* SOCIAL DRAFTS — Nano Banana */}
        <SocialDraftsPanel drafts={tier.socialDrafts} onOpen={() => setComposer('social')} />

        {/* ACTIVE CAMPAIGNS — kept from previous, now lower */}
        <CampaignsTable campaigns={tier.campaigns} />
      </TierGuard>

      {/* ATTRIBUTION FOOTER */}
      <MarketingPanel tier={tier} />

      {/* COMPOSER MODAL */}
      {composer && (
        <ComposerModal mode={composer} audience={audience} tier={tier} onClose={() => setComposer(null)} onSend={(payload) => { onAction?.(payload, 'send'); setComposer(null); }} />
      )}
    </div>
  );
}

function ChannelLaunchCard({ ch, onLaunch }) {
  const toneMap = {
    crimson: { bg:'bg-crimson-900', border:'border-crimson-500/40', text:'text-crimson-400', accent:'bg-crimson-500' },
    sky:     { bg:'bg-sky2-900',    border:'border-sky2-500/40',    text:'text-sky2-400',    accent:'bg-sky2-500' },
    win:     { bg:'bg-win-900',     border:'border-win-500/40',     text:'text-win-500',     accent:'bg-win-500' },
    warn:    { bg:'bg-warn-900',    border:'border-warn-500/40',    text:'text-warn-500',    accent:'bg-warn-500' },
  };
  const t = toneMap[ch.tone];
  const isAI = ch.id === 'social';
  return (
    <button onClick={onLaunch} className="text-left bg-ink-700 border border-ink-500 hover:border-crimson-500/50 hover:shadow-tile-hover transition-all p-4 rounded group relative overflow-hidden">
      <div className={`absolute top-0 left-0 h-[3px] ${t.accent}`} style={{ width: '40%' }}></div>
      <div className="flex items-start justify-between mb-3">
        <div className={`w-9 h-9 rounded ${t.bg} ${t.border} border ${t.text} flex items-center justify-center`}>
          <Icon name={ch.icon} size={16} strokeWidth={2} />
        </div>
        {isAI && <span className="px-1.5 py-0.5 bg-gradient-to-r from-crimson-500 to-warn-500 text-white text-[9px] font-bold rounded tracking-wider">NANO BANANA</span>}
      </div>
      <div className="label-eyebrow text-[9.5px] mb-1">{ch.eyebrow}</div>
      <div className="font-display font-bold text-[15px] text-ink-50 mb-1 leading-tight">{ch.tagline}</div>
      <div className="text-[10.5px] text-ink-300 tabnum mb-3">{ch.channel}</div>
      <div className="flex items-center justify-between pt-3 border-t border-ink-500/60">
        <div>
          <div className="label-eyebrow text-[9px]">Audience</div>
          <div className="scorenum text-[16px] tabnum text-ink-50">{typeof ch.est === 'number' ? ch.est.toLocaleString() : ch.est}</div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] font-bold text-crimson-400">
          Compose <Icon name="ArrowRight" size={12} strokeWidth={2.4} />
        </div>
      </div>
    </button>
  );
}

function AudiencePicker({ audience }) {
  const [filter, setFilter] = useState({ who:'coaches', ages: new Set(['10U','11U','12U']), levels: new Set(['Select / Premier','Showcase / Elite']), regions: new Set(['GA Metro']) });
  // Live estimate based on selected slices (approximation)
  const baseAges = audience.ageGroups.filter(a => filter.ages.has(a.age));
  const baseLevels = audience.levels.filter(l => filter.levels.has(l.level));
  const baseRegions = audience.regions.filter(r => filter.regions.has(r.region));
  const ageSum    = baseAges.reduce((a,b) => a + b[filter.who], 0);
  const levelSum  = baseLevels.reduce((a,b) => a + b[filter.who], 0);
  const regionSum = baseRegions.reduce((a,b) => a + b[filter.who], 0);
  // Final = min of 3 axes scaled — simple intersection approximation
  const total = audience[filter.who].total;
  const estimate = Math.min(ageSum, levelSum, regionSum) || 0;
  const pct = (estimate / total) * 100;

  function toggle(key, v) {
    setFilter(f => {
      const s = new Set(f[key]);
      s.has(v) ? s.delete(v) : s.add(v);
      return { ...f, [key]: s };
    });
  }

  const Chip = ({ active, onClick, label, count }) => (
    <button onClick={onClick} className={`px-2.5 py-1.5 rounded text-[11px] font-semibold tabnum transition-colors ${active ? 'bg-crimson-500 text-white' : 'bg-ink-700 border border-ink-500 text-ink-200 hover:border-ink-400 hover:text-ink-50'}`}>
      {label}
      <span className={`ml-1.5 text-[10px] ${active ? 'opacity-80' : 'text-ink-300'}`}>{count.toLocaleString()}</span>
    </button>
  );

  return (
    <div className="bg-gradient-to-br from-ink-700 to-ink-800 border border-ink-500 rounded p-5">
      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
        <div>
          <SectionTitle kicker="Audience Builder" title="Slice your CRM · See live count" accent="sky" />
        </div>
        <div className="flex items-center bg-ink-700 border border-ink-500 rounded overflow-hidden">
          {['coaches','parents'].map(w => (
            <button key={w} onClick={() => setFilter(f => ({...f, who: w}))}
              className={`px-3 py-1.5 text-[11px] font-bold tracking-wider tabnum transition-colors ${
                filter.who === w ? 'bg-crimson-500 text-white' : 'text-ink-200 hover:text-ink-50 hover:bg-ink-600'
              }`}>
              {w.toUpperCase()} · {audience[w].total.toLocaleString()}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-4">
        <div className="xl:col-span-8 space-y-3">
          <div>
            <div className="label-eyebrow text-[9.5px] mb-2">By Age Group</div>
            <div className="flex flex-wrap gap-1.5">
              {audience.ageGroups.map(a => (
                <Chip key={a.age} active={filter.ages.has(a.age)} onClick={() => toggle('ages', a.age)} label={a.age} count={a[filter.who]} />
              ))}
            </div>
          </div>
          <div>
            <div className="label-eyebrow text-[9.5px] mb-2">By Level</div>
            <div className="flex flex-wrap gap-1.5">
              {audience.levels.map(l => (
                <Chip key={l.level} active={filter.levels.has(l.level)} onClick={() => toggle('levels', l.level)} label={l.level} count={l[filter.who]} />
              ))}
            </div>
          </div>
          <div>
            <div className="label-eyebrow text-[9.5px] mb-2">By Region</div>
            <div className="flex flex-wrap gap-1.5">
              {audience.regions.map(r => (
                <Chip key={r.region} active={filter.regions.has(r.region)} onClick={() => toggle('regions', r.region)} label={r.region} count={r[filter.who]} />
              ))}
            </div>
          </div>
        </div>

        <div className="xl:col-span-4">
          <div className="bg-ink-800 border border-ink-500 rounded p-4 h-full flex flex-col">
            <div className="label-eyebrow text-[9.5px] mb-2">Live Estimate</div>
            <div className="scorenum text-[42px] tabnum text-ink-50 leading-none">{estimate.toLocaleString()}</div>
            <div className="text-[11px] text-ink-300 tabnum mt-1">{pct.toFixed(1)}% of {filter.who}</div>
            <div className="mt-3 mb-4"><Bar value={pct} tone="crimson" height={6} /></div>
            <div className="mt-auto space-y-2">
              <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-crimson-500 hover:bg-crimson-600 text-white text-[11.5px] font-bold rounded transition-colors">
                <Icon name="Mail" size={12} strokeWidth={2.4} /> Email this slice
              </button>
              <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-ink-600 hover:bg-ink-500 border border-ink-400 text-ink-50 text-[11.5px] font-semibold rounded transition-colors">
                <Icon name="MessageSquare" size={12} strokeWidth={2.4} /> SMS this slice
              </button>
              <button className="w-full flex items-center justify-center gap-1.5 px-3 py-2 bg-ink-600 hover:bg-ink-500 border border-ink-400 text-ink-50 text-[11px] font-semibold rounded transition-colors">
                <Icon name="Save" size={11} strokeWidth={2.4} /> Save segment
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RecentSendsTable({ sends }) {
  if (!sends) return null;
  const kindIcon = { email:'Mail', sms:'MessageSquare', social:'Sparkles' };
  const kindTone = { email:'crimson', sms:'sky', social:'warn' };
  return (
    <div className="bg-ink-700 border border-ink-500 rounded overflow-hidden h-full">
      <div className="px-5 py-3 border-b border-ink-500 flex items-center justify-between">
        <SectionTitle kicker="Recent Sends" title="Last 14 days · Performance" accent="crimson" />
        <button className="text-[11px] font-semibold text-crimson-400 hover:text-crimson-500">View all →</button>
      </div>
      <div className="grid grid-cols-12 gap-2 px-5 py-2 bg-ink-800 border-b border-ink-500">
        <div className="col-span-1 label-eyebrow text-[9px]">Type</div>
        <div className="col-span-4 label-eyebrow text-[9px]">Send</div>
        <div className="col-span-2 label-eyebrow text-[9px] text-right">Recipients</div>
        <div className="col-span-2 label-eyebrow text-[9px] text-right">Open / Reach</div>
        <div className="col-span-2 label-eyebrow text-[9px] text-right">Click / Saves</div>
        <div className="col-span-1 label-eyebrow text-[9px] text-right">Regs</div>
      </div>
      {sends.map((s, i) => (
        <div key={s.id} className={`grid grid-cols-12 gap-2 px-5 py-2.5 items-center hover:bg-ink-600/40 transition-colors ${i < sends.length - 1 ? 'border-b border-ink-500/40' : ''}`}>
          <div className="col-span-1">
            <div className={`w-7 h-7 rounded bg-ink-600 border border-ink-500 flex items-center justify-center text-${kindTone[s.kind]}-400`}>
              <Icon name={kindIcon[s.kind]} size={12} strokeWidth={2.2} />
            </div>
          </div>
          <div className="col-span-4 min-w-0">
            <div className="text-[12.5px] font-semibold text-ink-50 truncate">{s.name}</div>
            <div className="text-[10.5px] text-ink-300 tabnum truncate">{s.when} · {s.audience}</div>
          </div>
          <div className="col-span-2 text-right tabnum text-[12px] text-ink-100">{typeof s.recipients === 'number' ? s.recipients.toLocaleString() : s.recipients}</div>
          <div className="col-span-2 text-right tabnum text-[11.5px] text-ink-100">{s.opens}</div>
          <div className="col-span-2 text-right tabnum text-[11.5px] text-ink-200">{s.clicks}</div>
          <div className="col-span-1 text-right scorenum text-[14px] tabnum text-win-500">{s.regs}</div>
        </div>
      ))}
    </div>
  );
}

function TemplatesPanel({ templates, onUse }) {
  if (!templates) return null;
  const kindIcon = { email:'Mail', sms:'MessageSquare', social:'Sparkles' };
  const kindTone = { email:'crimson', sms:'sky', social:'warn' };
  return (
    <div className="bg-ink-700 border border-ink-500 rounded overflow-hidden h-full">
      <div className="px-5 py-3 border-b border-ink-500 flex items-center justify-between">
        <SectionTitle kicker="Templates" title="Reusable Messages" accent="sky" />
        <button className="text-[11px] font-semibold text-crimson-400 hover:text-crimson-500">+ New</button>
      </div>
      <div className="divide-y divide-ink-500/40">
        {templates.map(t => (
          <div key={t.id} className="px-5 py-2.5 hover:bg-ink-600/30 transition-colors group">
            <div className="flex items-start gap-3">
              <div className={`shrink-0 w-7 h-7 rounded bg-ink-600 border border-ink-500 flex items-center justify-center text-${kindTone[t.kind]}-400`}>
                <Icon name={kindIcon[t.kind]} size={12} strokeWidth={2.2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[12.5px] font-semibold text-ink-50 truncate">{t.name}</div>
                <div className="text-[10.5px] text-ink-300 truncate">{t.subject}</div>
                <div className="flex items-center gap-3 mt-1 text-[10px] tabnum text-ink-300">
                  {t.opens !== '—' && <span>Open <b className="text-ink-100">{t.opens}</b></span>}
                  {t.clicks !== '—' && <span>Click <b className="text-ink-100">{t.clicks}</b></span>}
                  <span>Last <b className="text-ink-100">{t.lastUsed}</b></span>
                </div>
              </div>
              <button onClick={() => onUse?.(t)} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0 px-2 py-1 text-[10.5px] font-bold text-white bg-crimson-500 hover:bg-crimson-600 rounded">Use</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SocialDraftsPanel({ drafts, onOpen }) {
  if (!drafts) return null;
  const platformIcon = { Instagram:'Camera', Facebook:'Facebook', TikTok:'Music', X:'Twitter' };
  const statusTone = { draft:'warn', review:'sky', queued:'win', posted:'ink' };
  return (
    <div className="bg-gradient-to-br from-ink-700 via-ink-700 to-ink-800 border border-ink-500 rounded p-5">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-gradient-to-br from-crimson-500 to-warn-500 flex items-center justify-center text-white">
            <Icon name="Sparkles" size={16} strokeWidth={2.2} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <SectionTitle kicker="Social Content · Nano Banana" title="AI-Drafted Posts & Imagery" accent="crimson" />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Pill tone="warn" icon="Zap">Gemini 2.5 Flash Image</Pill>
          <button onClick={onOpen} className="px-3 py-1.5 text-[11.5px] font-semibold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5">
            <Icon name="Plus" size={12} strokeWidth={2.4} /> Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
        {drafts.map(d => (
          <div key={d.id} className="bg-ink-800 border border-ink-500 rounded overflow-hidden hover:border-crimson-500/40 transition-all group">
            {/* AI-generated thumb placeholder */}
            <div className="relative aspect-[4/3] bg-gradient-to-br from-crimson-900 via-ink-700 to-sky2-900 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 opacity-30" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent 0 12px, rgba(255,255,255,.04) 12px 13px)'
              }}></div>
              <span className="relative font-display font-black text-[44px] text-ink-50/80 tracking-tight">{d.thumb}</span>
              <span className="absolute top-2 left-2 px-1.5 py-0.5 bg-ink-900/80 backdrop-blur text-white text-[9px] font-bold rounded tracking-wider">{d.platform.toUpperCase()}</span>
              <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-gradient-to-r from-crimson-500 to-warn-500 text-white text-[9px] font-bold rounded">AI · {d.generated}</span>
            </div>
            <div className="p-3">
              <div className="flex items-center justify-between mb-1.5">
                <Pill tone={statusTone[d.status]}>{d.status.toUpperCase()}</Pill>
                <span className="text-[10px] tabnum text-ink-300 truncate">{d.tournament}</span>
              </div>
              <div className="text-[12.5px] font-semibold text-ink-50 leading-tight mb-1.5">{d.headline}</div>
              <div className="text-[10.5px] text-ink-300 italic line-clamp-2">"{d.prompt}"</div>
              <div className="flex items-center gap-2 mt-2.5 pt-2.5 border-t border-ink-500/60">
                <button className="flex-1 px-2 py-1 text-[10.5px] font-semibold text-ink-100 bg-ink-700 border border-ink-500 hover:border-ink-400 rounded flex items-center justify-center gap-1">
                  <Icon name="Edit3" size={10} strokeWidth={2.4} /> Edit
                </button>
                <button className="flex-1 px-2 py-1 text-[10.5px] font-semibold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center justify-center gap-1">
                  <Icon name="Send" size={10} strokeWidth={2.4} /> Publish
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ComposerModal({ mode, audience, tier, onClose, onSend }) {
  const cfg = {
    'email-coach':  { kind:'email', who:'coaches', icon:'Mail',          title:'Email Coaches',     channel:'Gmail SMTP', tone:'crimson', est: audience.coaches.email, fields:['subject','body'] },
    'sms-coach':    { kind:'sms',   who:'coaches', icon:'MessageSquare', title:'SMS Coaches',       channel:'Twilio',     tone:'sky',     est: audience.coaches.sms,   fields:['body'] },
    'email-parent': { kind:'email', who:'parents', icon:'Users',         title:'Email Parents',     channel:'Gmail SMTP', tone:'win',     est: audience.parents.email, fields:['subject','body'] },
    'sms-parent':   { kind:'sms',   who:'parents', icon:'Send',          title:'SMS Parents',       channel:'Twilio',     tone:'warn',    est: audience.parents.sms,   fields:['body'] },
    'social':       { kind:'social',who:'public',  icon:'Sparkles',      title:'Generate Social Post', channel:'Nano Banana · Gemini 2.5 Flash Image', tone:'crimson', est:'Auto-publish', fields:['platform','prompt','caption'] },
  }[mode];
  if (!cfg) return null;

  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [platform, setPlatform] = useState('Instagram');
  const [prompt, setPrompt] = useState('');
  const charCount = body.length;
  const isSocial = cfg.kind === 'social';
  const isSMS = cfg.kind === 'sms';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-900/80 backdrop-blur-sm tier-fade" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-ink-800 border border-ink-500 rounded shadow-2xl">
        <div className="px-5 py-4 border-b border-ink-500 flex items-center justify-between bg-ink-700">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded bg-crimson-900 border border-crimson-500/40 flex items-center justify-center text-crimson-400">
              <Icon name={cfg.icon} size={15} strokeWidth={2.2} />
            </div>
            <div>
              <div className="font-display font-bold text-[15px] text-ink-50">{cfg.title}</div>
              <div className="text-[10.5px] text-ink-300 tabnum">{cfg.channel} · ~{typeof cfg.est === 'number' ? cfg.est.toLocaleString() : cfg.est} recipients</div>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded text-ink-300 hover:text-ink-50 hover:bg-ink-600 flex items-center justify-center"><Icon name="X" size={14} /></button>
        </div>

        <div className="p-5 space-y-4">
          {isSocial ? (
            <>
              <div>
                <label className="label-eyebrow text-[9.5px] mb-1.5 block">Platform</label>
                <div className="flex flex-wrap gap-1.5">
                  {['Instagram','Facebook','TikTok','X','LinkedIn'].map(p => (
                    <button key={p} onClick={() => setPlatform(p)}
                      className={`px-3 py-1.5 rounded text-[11.5px] font-semibold transition-colors ${platform === p ? 'bg-crimson-500 text-white' : 'bg-ink-700 border border-ink-500 text-ink-200 hover:border-ink-400'}`}>{p}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="label-eyebrow text-[9.5px] mb-1.5 block flex items-center gap-2">
                  Image Prompt
                  <span className="px-1.5 py-0.5 bg-gradient-to-r from-crimson-500 to-warn-500 text-white text-[8.5px] font-bold rounded tracking-wider">NANO BANANA</span>
                </label>
                <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} rows={3}
                  placeholder='e.g. "Bracket reveal · Summit Showdown · crimson + white · field outline · Atlanta Jun 14"'
                  className="w-full bg-ink-700 border border-ink-500 rounded px-3 py-2 text-[12.5px] text-ink-50 placeholder:text-ink-400 focus:border-crimson-500/60 focus:outline-none resize-none" />
              </div>
              <div>
                <label className="label-eyebrow text-[9.5px] mb-1.5 block">Caption</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={4}
                  placeholder="Write the post caption…"
                  className="w-full bg-ink-700 border border-ink-500 rounded px-3 py-2 text-[12.5px] text-ink-50 placeholder:text-ink-400 focus:border-crimson-500/60 focus:outline-none resize-none" />
              </div>
            </>
          ) : (
            <>
              {cfg.fields.includes('subject') && (
                <div>
                  <label className="label-eyebrow text-[9.5px] mb-1.5 block">Subject</label>
                  <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={`e.g. "Summit Showdown 10U bracket opening — 4 spots left"`}
                    className="w-full bg-ink-700 border border-ink-500 rounded px-3 py-2 text-[12.5px] text-ink-50 placeholder:text-ink-400 focus:border-crimson-500/60 focus:outline-none" />
                </div>
              )}
              <div>
                <label className="label-eyebrow text-[9.5px] mb-1.5 flex items-center justify-between">
                  <span>{isSMS ? 'Message' : 'Body'}</span>
                  {isSMS && <span className="tabnum text-ink-300 normal-case">{charCount}/160 · {Math.ceil(Math.max(1, charCount) / 160)} segment{Math.ceil(charCount/160) > 1 ? 's' : ''}</span>}
                </label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={isSMS ? 4 : 8}
                  placeholder={isSMS
                    ? 'Hi {{first_name}} — only 4 spots left for Summit Showdown 10U. Reserve: {{link}}'
                    : 'Hi {{first_name}},\n\nWe just opened the 10U bracket for Summit Showdown (Jun 14, Atlanta). 4 spots left as of this morning.\n\nReserve: {{link}}\n\nJordan Vega · Vega Sports'}
                  className="w-full bg-ink-700 border border-ink-500 rounded px-3 py-2 text-[12.5px] text-ink-50 placeholder:text-ink-400 focus:border-crimson-500/60 focus:outline-none resize-none font-mono" />
              </div>
            </>
          )}

          <div className="bg-ink-700 border border-ink-500 rounded p-3 flex items-center gap-3">
            <Icon name="Info" size={14} className="text-sky2-400 shrink-0" />
            <div className="text-[11px] text-ink-200">
              {isSocial && 'Nano Banana will generate the image from your prompt. Caption posts to ' + platform + ' immediately or queues for review.'}
              {!isSocial && isSMS && `Sends via Twilio. Audience opted-in only. ${typeof cfg.est === 'number' ? cfg.est.toLocaleString() : cfg.est} recipients. Charges apply per segment.`}
              {!isSocial && !isSMS && `Sends via Gmail SMTP, 248/hr throttle. ${typeof cfg.est === 'number' ? cfg.est.toLocaleString() : cfg.est} recipients. Estimated 9–14 min to complete delivery.`}
            </div>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-ink-500 bg-ink-700 flex items-center justify-between gap-3">
          <button className="text-[11.5px] font-semibold text-ink-200 hover:text-ink-50 flex items-center gap-1.5"><Icon name="Save" size={12} /> Save as template</button>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-3 py-1.5 text-[11.5px] font-semibold text-ink-200 hover:text-ink-50">Cancel</button>
            <button className="px-3 py-1.5 text-[11.5px] font-semibold text-ink-100 bg-ink-600 border border-ink-500 hover:border-ink-400 rounded">Send test</button>
            <button onClick={() => onSend({ kind: cfg.kind, who: cfg.who, subject, body, platform, prompt, audience: cfg.est })}
              className="px-4 py-1.5 text-[11.5px] font-bold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5">
              <Icon name={isSocial ? 'Send' : isSMS ? 'MessageSquare' : 'Mail'} size={12} strokeWidth={2.4} />
              {isSocial ? `Generate & queue for ${platform}` : `Send to ${typeof cfg.est === 'number' ? cfg.est.toLocaleString() : cfg.est}`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignsTable({ campaigns }) {
  if (!campaigns) return null;
  const statusTones = {
    active: { tone:'crimson', label:'ACTIVE' },
    queued: { tone:'sky',     label:'QUEUED' },
    closed: { tone:'win',     label:'CLOSED' },
  };
  return (
    <div className="bg-ink-700 border border-ink-500 rounded overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-500 flex items-center justify-between">
        <SectionTitle kicker="Campaign Tracker" title="Active & Queued Campaigns" accent="crimson" />
        <div className="flex items-center gap-2">
          <Pill tone="crimson" icon="Zap">{campaigns.filter(c=>c.status==='active').length} active</Pill>
          <Pill tone="sky"     icon="Clock">{campaigns.filter(c=>c.status==='queued').length} queued</Pill>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-ink-800 border-b border-ink-500">
        <div className="col-span-1 label-eyebrow text-[9.5px]">Status</div>
        <div className="col-span-3 label-eyebrow text-[9.5px]">Campaign</div>
        <div className="col-span-2 label-eyebrow text-[9.5px]">Channel</div>
        <div className="col-span-2 label-eyebrow text-[9.5px]">Target</div>
        <div className="col-span-2 label-eyebrow text-[9.5px] text-right">Budget · Spent</div>
        <div className="col-span-1 label-eyebrow text-[9.5px] text-right">Regs</div>
        <div className="col-span-1 label-eyebrow text-[9.5px] text-right">Ends</div>
      </div>
      {campaigns.map((c, i) => {
        const st = statusTones[c.status];
        const burn = c.budget ? (c.spent / c.budget) * 100 : 0;
        return (
          <div key={c.id} className={`grid grid-cols-12 gap-2 px-5 py-2.5 items-center hover:bg-ink-600/40 transition-colors ${i < campaigns.length - 1 ? 'border-b border-ink-500/40' : ''}`}>
            <div className="col-span-1"><Pill tone={st.tone}>{st.label}</Pill></div>
            <div className="col-span-3 min-w-0">
              <div className="text-[13px] font-semibold text-ink-50 truncate">{c.name}</div>
              <div className="text-[10.5px] text-ink-300 tabnum truncate">{c.event}</div>
            </div>
            <div className="col-span-2 text-[11.5px] text-ink-200 truncate">{c.channel}</div>
            <div className="col-span-2 text-[11px] text-ink-300 tabnum truncate">{c.target}</div>
            <div className="col-span-2 text-right tabnum">
              <div className="text-[12px] text-ink-50">${c.spent.toLocaleString()} / ${c.budget.toLocaleString()}</div>
              <div className="mt-1"><Bar value={burn} tone={burn > 80 ? 'crimson' : 'sky'} height={4} /></div>
            </div>
            <div className="col-span-1 text-right scorenum text-[16px] tabnum text-win-500">{c.regs}</div>
            <div className="col-span-1 text-right text-[11px] tabnum text-ink-300">{c.ends}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---- TEAMS & TALENT VIEW --------------------------------------------
function TeamsView({ tier }) {
  const isTO = tier.id === 'to' && tier.teamsByAge;
  const ages = isTO ? Object.keys(tier.teamsByAge) : [];
  const [age, setAge] = useState(isTO ? '11U' : null);

  if (!isTO) {
    // Fallback for National/Regional tiers
    return (
      <div className="space-y-5 tier-fade">
        <ViewHeader
          kicker="Teams & Talent"
          title={`Top NCS Teams · ${tier.label} Leaderboard`}
          sub={tier.scope + ' · ' + tier.sub}
        />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7"><TopTeamsCompact teams={tier.teams.slice(0,6)} tier={tier} /></div>
        </div>
        <TopTeamsPanel tier={tier} />
      </div>
    );
  }

  const teams = tier.teamsByAge[age] || [];
  // Sort by each leaderboard's metric
  const byRevenue = [...teams].sort((a, b) => b.revenue - a.revenue);
  const byNCS     = [...teams].sort((a, b) => a.ncsRank - b.ncsRank);
  const byDD      = [...teams].sort((a, b) => a.dd.rank - b.dd.rank);

  const totalRev = teams.reduce((a, t) => a + t.revenue, 0);
  const returningPct = teams.length ? Math.round((teams.filter(t => t.returning).length / teams.length) * 100) : 0;

  return (
    <div className="space-y-5 tier-fade">
      <ViewHeader
        kicker="Teams & Talent"
        title="Team Rankings by Age Group"
        sub={`${tier.scope} · Revenue contribution · NCS ranking · DugoutData cross-sanctioning`}
        right={
          <div className="flex items-center gap-2">
            <Pill tone="sky" icon="Activity">DugoutData synced 2h ago</Pill>
            <button className="px-3 py-1.5 text-[11.5px] font-semibold text-ink-100 bg-ink-600 border border-ink-500 hover:border-ink-400 rounded flex items-center gap-1.5"><Icon name="Download" size={12}/> Export</button>
          </div>
        }
      />

      {/* Age picker */}
      <div className="bg-ink-700 border border-ink-500 rounded p-3 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="label-eyebrow text-[9.5px] mr-1">Age Group</span>
          {ages.map(a => (
            <button key={a} onClick={() => setAge(a)}
              className={`px-3 py-1.5 rounded text-[12.5px] font-bold tracking-wider tabnum transition-colors ${
                age === a ? 'bg-crimson-500 text-white' : 'bg-ink-800 border border-ink-500 text-ink-200 hover:border-ink-400 hover:text-ink-50'
              }`}>
              {a}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4 text-[11px] tabnum">
          <div><span className="text-ink-300">Teams: </span><span className="text-ink-50 font-bold">{teams.length}</span></div>
          <div><span className="text-ink-300">Revenue: </span><span className="text-crimson-400 font-bold">${(totalRev/1000).toFixed(1)}K</span></div>
          <div><span className="text-ink-300">Returning: </span><span className="text-win-500 font-bold">{returningPct}%</span></div>
        </div>
      </div>

      {/* Three leaderboards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        <RevenueLeaderboard teams={byRevenue} age={age} totalRev={totalRev} />
        <RankingLeaderboard teams={byNCS} age={age} variant="ncs" />
        <RankingLeaderboard teams={byDD} age={age} variant="dd" />
      </div>

      {/* Cross-source rank delta callout */}
      <RankDeltaPanel teams={teams} age={age} />
    </div>
  );
}

// --- Leaderboard: by revenue to this TO ------------------------------
function RevenueLeaderboard({ teams, age, totalRev }) {
  const max = Math.max(...teams.map(t => t.revenue), 1);
  return (
    <div className="bg-ink-700 border border-ink-500 rounded overflow-hidden">
      <div className="px-4 py-3 border-b border-ink-500 bg-gradient-to-r from-crimson-900/40 to-transparent">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="h-[3px] w-7 bg-crimson-500"></span>
          <span className="label-eyebrow">Top {age} · By Revenue</span>
        </div>
        <h2 className="font-display font-bold text-[14px] text-ink-50 tracking-tight">Highest-Paying Teams</h2>
        <div className="text-[10.5px] text-ink-300 tabnum mt-0.5">${(totalRev/1000).toFixed(1)}K total · this season</div>
      </div>
      <div className="divide-y divide-ink-500/40">
        {teams.map((t, i) => {
          const pct = (t.revenue / max) * 100;
          return (
            <div key={t.name} className="px-4 py-2.5 hover:bg-ink-600/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`shrink-0 w-7 text-center scorenum text-[15px] tabnum leading-none ${i === 0 ? 'text-crimson-400' : i < 3 ? 'text-ink-50' : 'text-ink-300'}`}>{String(i+1).padStart(2,'0')}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="text-[12.5px] font-semibold text-ink-50 truncate">{t.name}</div>
                    <div className="text-right shrink-0">
                      <div className="scorenum text-[14px] tabnum text-crimson-400 leading-none">${(t.revenue/1000).toFixed(1)}K</div>
                    </div>
                  </div>
                  <Bar value={pct} tone="crimson" height={4} />
                  <div className="flex items-center justify-between mt-1 text-[10px] tabnum text-ink-300">
                    <span>{t.region} · {t.events} {t.events === 1 ? 'event' : 'events'}</span>
                    {t.returning ? <span className="text-win-500 font-semibold">RETURNING</span> : <span className="text-sky2-400 font-semibold">NEW</span>}
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

// --- Leaderboard: by ranking (NCS or DugoutData) ---------------------
function RankingLeaderboard({ teams, age, variant }) {
  const isNCS = variant === 'ncs';
  const accent = isNCS ? 'sky2' : 'win';
  const headerGradient = isNCS ? 'from-sky2-900/40 to-transparent' : 'from-win-900/40 to-transparent';
  const stripe = isNCS ? 'bg-sky2-500' : 'bg-win-500';
  return (
    <div className="bg-ink-700 border border-ink-500 rounded overflow-hidden">
      <div className={`px-4 py-3 border-b border-ink-500 bg-gradient-to-r ${headerGradient}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <span className={`h-[3px] w-7 ${stripe}`}></span>
          <span className="label-eyebrow">Top {age} · By Ranking</span>
        </div>
        <h2 className="font-display font-bold text-[14px] text-ink-50 tracking-tight flex items-center gap-2">
          {isNCS ? 'NCS Ranking' : 'DugoutData Composite'}
          {!isNCS && <span className="px-1.5 py-0.5 bg-win-500 text-ink-900 text-[8.5px] font-bold rounded tracking-wider">CROSS-BODY</span>}
        </h2>
        <div className="text-[10.5px] text-ink-300 tabnum mt-0.5">
          {isNCS ? 'NCS-internal · Strength of schedule weighted' : 'PG · USSSA · AAU · NCS · AAU composite'}
        </div>
      </div>
      <div className="divide-y divide-ink-500/40">
        {teams.map((t, i) => {
          const rank = isNCS ? t.ncsRank : t.dd.rank;
          const rating = t.ncsRating;
          return (
            <div key={t.name} className="px-4 py-2.5 hover:bg-ink-600/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className={`shrink-0 w-7 text-center scorenum text-[15px] tabnum leading-none ${i === 0 ? `text-${accent}-400` : i < 3 ? 'text-ink-50' : 'text-ink-300'}`}>{String(i+1).padStart(2,'0')}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <div className="text-[12.5px] font-semibold text-ink-50 truncate">{t.name}</div>
                    <div className="text-right shrink-0">
                      {isNCS ? (
                        <div className={`scorenum text-[14px] tabnum text-${accent}-400 leading-none`}>{rating}</div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span className="px-1.5 py-0.5 bg-ink-600 border border-ink-500 rounded text-[9.5px] font-mono font-bold text-ink-100">{t.dd.body}</span>
                          <span className="text-[10px] tabnum text-ink-300">#{t.dd.bodyRank}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] tabnum text-ink-300">
                    <span>{t.region}</span>
                    <span className="w-0.5 h-0.5 rounded-full bg-ink-400"></span>
                    <span>{t.record}</span>
                    {!isNCS && (
                      <>
                        <span className="w-0.5 h-0.5 rounded-full bg-ink-400"></span>
                        <span className="text-ink-200">NCS #{t.ncsRank}</span>
                      </>
                    )}
                    {isNCS && (
                      <>
                        <span className="w-0.5 h-0.5 rounded-full bg-ink-400"></span>
                        <span className="text-ink-200">DD #{t.dd.rank}</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {!isNCS && (
        <div className="px-4 py-2.5 border-t border-ink-500 bg-ink-800/60 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-[10px] text-ink-300">
            <Icon name="ExternalLink" size={10} />
            <span>Source: dugoutdata.co</span>
          </div>
          <button className="text-[10.5px] font-semibold text-win-500 hover:text-win-400">View on DugoutData →</button>
        </div>
      )}
    </div>
  );
}

// --- Cross-source rank delta panel -----------------------------------
function RankDeltaPanel({ teams, age }) {
  // Show biggest NCS vs DugoutData rank discrepancies — useful signal
  const withDelta = teams.map(t => ({ ...t, delta: t.dd.rank - t.ncsRank }));
  const ncsHigh = [...withDelta].sort((a, b) => a.delta - b.delta).slice(0, 3);  // ranked higher by NCS
  const ddHigh  = [...withDelta].sort((a, b) => b.delta - a.delta).slice(0, 3);  // ranked higher by DD

  return (
    <div className="bg-gradient-to-br from-ink-700 to-ink-800 border border-ink-500 rounded p-5">
      <div className="flex items-start justify-between mb-4 gap-3 flex-wrap">
        <div>
          <SectionTitle kicker="Cross-Source Signal" title={`Where NCS and DugoutData disagree · ${age}`} accent="sky" />
          <div className="text-[11px] text-ink-300 tabnum mt-1">Big deltas = either a hidden gem (DD-high) or a team to watch closely (NCS-high)</div>
        </div>
        <Pill tone="warn" icon="GitCompare">{withDelta.filter(t => Math.abs(t.delta) >= 3).length} teams with ±3 delta</Pill>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* NCS-favored */}
        <div className="bg-ink-800 border border-ink-500 rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded bg-sky2-900 border border-sky2-500/40 flex items-center justify-center text-sky2-400">
              <Icon name="TrendingUp" size={13} />
            </div>
            <div>
              <div className="label-eyebrow text-[9.5px]">NCS ranks higher</div>
              <div className="text-[12px] text-ink-50 font-semibold">Strong with us, less proven elsewhere</div>
            </div>
          </div>
          <div className="space-y-1.5">
            {ncsHigh.map(t => (
              <div key={t.name} className="flex items-center justify-between py-1.5 px-2 bg-ink-700/60 rounded">
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-ink-50 truncate">{t.name}</div>
                  <div className="text-[10px] text-ink-300 tabnum">{t.region} · {t.record}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10.5px] tabnum text-sky2-400 font-bold">NCS #{t.ncsRank}</span>
                  <Icon name="ArrowRight" size={10} className="text-ink-400"/>
                  <span className="text-[10.5px] tabnum text-ink-200">DD #{t.dd.rank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* DD-favored */}
        <div className="bg-ink-800 border border-ink-500 rounded p-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded bg-win-900 border border-win-500/40 flex items-center justify-center text-win-500">
              <Icon name="Sparkles" size={13} />
            </div>
            <div>
              <div className="label-eyebrow text-[9.5px]">DugoutData ranks higher</div>
              <div className="text-[12px] text-ink-50 font-semibold">Recruit targets · proven across bodies</div>
            </div>
          </div>
          <div className="space-y-1.5">
            {ddHigh.map(t => (
              <div key={t.name} className="flex items-center justify-between py-1.5 px-2 bg-ink-700/60 rounded">
                <div className="min-w-0">
                  <div className="text-[12px] font-semibold text-ink-50 truncate">{t.name}</div>
                  <div className="text-[10px] text-ink-300 tabnum">{t.region} · {t.dd.body} #{t.dd.bodyRank}</div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-2">
                  <span className="text-[10.5px] tabnum text-win-500 font-bold">DD #{t.dd.rank}</span>
                  <Icon name="ArrowRight" size={10} className="text-ink-400"/>
                  <span className="text-[10.5px] tabnum text-ink-200">NCS #{t.ncsRank}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ---- RECRUITMENT CRM VIEW -------------------------------------------
function CRMView({ tier }) {
  return (
    <div className="space-y-5 tier-fade">
      <ViewHeader
        kicker="Recruitment CRM"
        title="Coach Outreach · Pipeline · Activity"
        sub={tier.scope + ' · ' + tier.sub}
        right={<button className="px-3 py-1.5 text-[11.5px] font-semibold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5"><Icon name="UserPlus" size={12} strokeWidth={2.4}/> Add Contact</button>}
      />
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        <div className="xl:col-span-7"><PipelinePanel tier={tier} /></div>
        <div className="xl:col-span-5">
          <div className="bg-ink-700 border border-ink-500 rounded p-4 h-full">
            <SectionTitle kicker="This Week" title="Outreach Activity" accent="sky" />
            <div className="space-y-2.5">
              {[
                { icon:'Send',  tone:'sky',     text:'Email blast to 124 GA 10U coaches', sub:'Summit Showdown 10U · 18% open · 4 replies' },
                { icon:'Phone', tone:'crimson', text:'Called Carla Estrada (Pensacola Pirates)', sub:'Verbal interest — sending packet today' },
                { icon:'Check', tone:'win',     text:'Deposit confirmed — Mike Donovan',       sub:'Atlanta Lightning · Summit + Finale' },
                { icon:'Mail',  tone:'sky',     text:'Followed up on 9 stale leads',           sub:'30+ day no-touch coaches re-engaged' },
                { icon:'Users', tone:'win',     text:'3 new referrals from Magnolia coaches',  sub:'Tagged for Mid-Summer outreach' },
              ].map((a, i) => (
                <div key={i} className="flex items-start gap-3 py-1.5">
                  <div className={`w-7 h-7 rounded bg-ink-600 border border-ink-500 flex items-center justify-center shrink-0 text-${a.tone === 'crimson' ? 'crimson-400' : a.tone === 'sky' ? 'sky2-400' : 'win-500'}`}>
                    <Icon name={a.icon} size={12} strokeWidth={2.2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] text-ink-50 font-semibold truncate">{a.text}</div>
                    <div className="text-[10.5px] text-ink-300 truncate">{a.sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <TierGuard tier={tier}>
        <ContactsTable contacts={tier.contacts} />
      </TierGuard>
    </div>
  );
}

function ContactsTable({ contacts }) {
  if (!contacts) return null;
  const stageTones = {
    lead: { tone:'ink',     label:'LEAD' },
    cont: { tone:'sky',     label:'CONTACTED' },
    qual: { tone:'sky',     label:'INTERESTED' },
    prop: { tone:'warn',    label:'DEPOSIT' },
    won:  { tone:'win',     label:'CONFIRMED' },
  };
  return (
    <div className="bg-ink-700 border border-ink-500 rounded overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-500 flex items-center justify-between">
        <SectionTitle kicker="Coach Contacts" title={`${contacts.length} Active Records`} accent="crimson" />
        <div className="flex items-center gap-2">
          <button className="px-2.5 py-1 text-[11px] font-semibold text-ink-100 bg-ink-600 border border-ink-500 hover:border-ink-400 rounded">All</button>
          <button className="px-2.5 py-1 text-[11px] font-semibold text-ink-300 hover:text-ink-100">Hot</button>
          <button className="px-2.5 py-1 text-[11px] font-semibold text-ink-300 hover:text-ink-100">Stale (30d+)</button>
        </div>
      </div>
      <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-ink-800 border-b border-ink-500">
        <div className="col-span-3 label-eyebrow text-[9.5px]">Coach · Team</div>
        <div className="col-span-2 label-eyebrow text-[9.5px]">Location</div>
        <div className="col-span-2 label-eyebrow text-[9.5px]">Stage</div>
        <div className="col-span-4 label-eyebrow text-[9.5px]">Notes</div>
        <div className="col-span-1 label-eyebrow text-[9.5px] text-right">Last</div>
      </div>
      {contacts.map((c, i) => {
        const st = stageTones[c.stage];
        return (
          <div key={c.id} className={`grid grid-cols-12 gap-2 px-5 py-2.5 items-center hover:bg-ink-600/40 transition-colors ${i < contacts.length - 1 ? 'border-b border-ink-500/40' : ''}`}>
            <div className="col-span-3 min-w-0">
              <div className="text-[13px] font-semibold text-ink-50 truncate">{c.name}</div>
              <div className="text-[10.5px] text-ink-300 truncate">{c.team}</div>
            </div>
            <div className="col-span-2 text-[11.5px] text-ink-200 truncate">{c.loc}</div>
            <div className="col-span-2"><Pill tone={st.tone}>{st.label}</Pill></div>
            <div className="col-span-4 text-[11.5px] text-ink-200 truncate">{c.notes}</div>
            <div className="col-span-1 text-right text-[10.5px] tabnum text-ink-300">{c.lastTouch}</div>
          </div>
        );
      })}
    </div>
  );
}

// ---- PREDICTIVE INSIGHTS VIEW ---------------------------------------
function InsightsView({ tier }) {
  const risks = (tier.tournaments || []).filter(t => t.status === 'critical' || t.status === 'warn');
  return (
    <div className="space-y-5 tier-fade">
      <ViewHeader
        kicker="Predictive Insights"
        title="AI Forecasting · Risk Modeling · Recommendations"
        sub={tier.scope + ' · NCS Forecast v4.2.1'}
        right={<Pill tone="crimson" icon="Sparkles">Live AI</Pill>}
      />

      <InsightsBriefing insights={tier.insights} tier={tier} />

      <TierGuard tier={tier}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          <div className="xl:col-span-7">
            <div className="bg-ink-700 border border-ink-500 rounded p-5">
              <SectionTitle kicker="Risk Matrix" title="At-Risk Tournaments — Modeled Fill Probability" accent="warn" />
              {risks.length === 0 ? (
                <div className="text-[12px] text-ink-300">No tournaments currently flagged.</div>
              ) : (
                <div className="space-y-3">
                  {risks.map(t => {
                    const fill = (t.filled / t.capacity) * 100;
                    const prob = Math.max(8, Math.min(92, Math.round(fill * 0.9 + (60 - t.daysOut) * 0.3)));
                    return (
                      <div key={t.id} className="border border-ink-500 rounded p-3">
                        <div className="flex items-center justify-between mb-2 gap-3">
                          <div className="min-w-0">
                            <div className="font-display font-bold text-[13.5px] text-ink-50 truncate">{t.name}</div>
                            <div className="text-[10.5px] text-ink-300 tabnum">{t.city} · {t.dates} · {t.daysOut}d out</div>
                          </div>
                          <Pill tone={t.status === 'critical' ? 'crimson' : 'warn'}>{t.status === 'critical' ? 'CRITICAL' : 'WATCH'}</Pill>
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-center">
                          <div>
                            <div className="scorenum text-[18px] text-ink-50 tabnum leading-none">{fill.toFixed(0)}%</div>
                            <div className="label-eyebrow text-[9px] mt-1">Current Fill</div>
                          </div>
                          <div>
                            <div className={`scorenum text-[18px] tabnum leading-none ${prob >= 60 ? 'text-win-500' : prob >= 35 ? 'text-warn-500' : 'text-crimson-400'}`}>{prob}%</div>
                            <div className="label-eyebrow text-[9px] mt-1">P(Natural Fill)</div>
                          </div>
                          <div>
                            <div className="scorenum text-[18px] text-crimson-400 tabnum leading-none">${Math.round((t.capacity - t.filled) * 2.4)}K</div>
                            <div className="label-eyebrow text-[9px] mt-1">Revenue at Risk</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="xl:col-span-5">
            <div className="bg-ink-700 border border-ink-500 rounded p-5 h-full">
              <SectionTitle kicker="Forecast" title="Season Endgame Projection" accent="sky" />
              <div className="space-y-3">
                <ForecastRow label="Season Revenue (Spring)" base="$612K booked"   forecast="$728K final"     band="±$48K" tone="win" />
                <ForecastRow label="Avg Fill Rate"           base="78% today"      forecast="84% final"       band="±5 pt" tone="win" />
                <ForecastRow label="Margin (Spring)"         base="$164K projected" forecast="$192K final"    band="±$24K" tone="win" />
                <ForecastRow label="Tournaments at <60% Fill"base="3 today"        forecast="1 final"          band="model: 78% conf." tone="warn" />
                <ForecastRow label="Fall Season Pre-Reg"     base="0 today"        forecast="180 by Aug 1"     band="early bird launch Jun 15" tone="sky" />
              </div>
              <div className="mt-4 pt-3 border-t border-ink-500 text-[10.5px] text-ink-300">
                Model: NCS Forecast v4.2 · Trained on 412 tournament-seasons · 92% confidence
              </div>
            </div>
          </div>
        </div>
      </TierGuard>
    </div>
  );
}

function ForecastRow({ label, base, forecast, band, tone }) {
  const toneClass = tone === 'win' ? 'text-win-500' : tone === 'warn' ? 'text-warn-500' : 'text-sky2-400';
  return (
    <div className="border-l-2 border-ink-500 pl-3">
      <div className="label-eyebrow text-[9.5px]">{label}</div>
      <div className="flex items-baseline gap-2 mt-1">
        <span className="text-[12px] tabnum text-ink-300">{base}</span>
        <Icon name="ArrowRight" size={11} className="text-ink-400" />
        <span className={`text-[13px] font-bold tabnum ${toneClass}`}>{forecast}</span>
      </div>
      <div className="text-[10.5px] text-ink-300 tabnum mt-0.5">{band}</div>
    </div>
  );
}

// ---- SCHEDULE VIEW --------------------------------------------------
function ScheduleView({ tier }) {
  return (
    <div className="space-y-5 tier-fade">
      <ViewHeader
        kicker="Schedule"
        title="Season Calendar · Upcoming Operations"
        sub={tier.scope + ' · today is May 19, 2026'}
        right={<button className="px-3 py-1.5 text-[11.5px] font-semibold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5"><Icon name="Plus" size={12} strokeWidth={2.4}/> Add Event</button>}
      />

      <TierGuard tier={tier}>
        <SeasonCalendarStrip tournaments={tier.tournaments} />
        <ScheduleList items={tier.schedule} />
      </TierGuard>
    </div>
  );
}

function SeasonCalendarStrip({ tournaments }) {
  if (!tournaments) return null;
  const months = ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];
  // Group tournaments by start month (from dates string)
  const byMonth = {};
  tournaments.forEach(t => {
    const mo = t.dates.split(' ')[0];
    if (!byMonth[mo]) byMonth[mo] = [];
    byMonth[mo].push(t);
  });
  const statusBg = {
    closed:   'bg-sky2-900 border-sky2-500/40 text-sky2-400',
    healthy:  'bg-win-900 border-win-500/40 text-win-500',
    warn:     'bg-warn-900 border-warn-500/40 text-warn-500',
    critical: 'bg-crimson-900 border-crimson-500/40 text-crimson-400',
  };
  return (
    <div className="bg-ink-700 border border-ink-500 rounded p-5">
      <SectionTitle kicker="Season Calendar" title="Spring 2026 · Feb–Jul" accent="crimson" />
      <div className="grid grid-cols-6 gap-3">
        {months.map(m => (
          <div key={m} className="bg-ink-800 border border-ink-500 rounded p-3 min-h-[160px]">
            <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-ink-500">
              <span className="font-display font-bold text-[13px] text-ink-50">{m}</span>
              <span className="text-[10px] tabnum text-ink-300">{(byMonth[m] || []).length} {byMonth[m]?.length === 1 ? 'event' : 'events'}</span>
            </div>
            <div className="space-y-2">
              {(byMonth[m] || []).map(t => (
                <div key={t.id} className={`px-2 py-1.5 rounded border ${statusBg[t.status]}`}>
                  <div className="text-[11px] font-semibold text-ink-50 truncate">{t.name}</div>
                  <div className="text-[10px] tabnum opacity-80 truncate">{t.dates.split(' ').slice(1).join(' ')} · {t.filled}/{t.capacity}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ScheduleList({ items }) {
  if (!items) return null;
  const kindTones = {
    EVENT:'crimson', CAMP:'sky', CRM:'win', MTG:'warn', OPS:'ink', GATE:'sky',
  };
  return (
    <div className="bg-ink-700 border border-ink-500 rounded overflow-hidden">
      <div className="px-5 py-3 border-b border-ink-500"><SectionTitle kicker="Operational Timeline" title="Next 60 Days · Key Dates & Events" accent="sky" /></div>
      <div>
        {items.map((day, i) => (
          <div key={i} className={`px-5 py-3 ${i < items.length - 1 ? 'border-b border-ink-500/40' : ''}`}>
            <div className="flex items-baseline gap-3 mb-2">
              <span className="font-display font-bold text-[14px] text-ink-50 tabnum">{day.date}</span>
              <span className={`label-eyebrow text-[9.5px] ${day.label === 'TODAY' ? 'text-crimson-400' : day.label === 'EVENT' ? 'text-crimson-400' : 'text-ink-300'}`}>{day.label}</span>
            </div>
            <div className="space-y-1.5 pl-3 border-l border-ink-500">
              {day.items.map((it, j) => (
                <div key={j} className="flex items-center gap-3">
                  <span className="text-[10.5px] tabnum text-ink-300 w-12 shrink-0">{it.time}</span>
                  <span className={`px-1.5 py-0.5 rounded text-[9.5px] font-bold tracking-wider ${kindTones[it.kind] === 'crimson' ? 'bg-crimson-500 text-white' : kindTones[it.kind] === 'sky' ? 'bg-sky2-500 text-white' : kindTones[it.kind] === 'win' ? 'bg-win-500 text-ink-900' : kindTones[it.kind] === 'warn' ? 'bg-warn-500 text-ink-900' : 'bg-ink-500 text-ink-50'}`}>{it.kind}</span>
                  <span className="text-[12px] text-ink-100 flex-1">{it.text}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ---- VENUES VIEW ----------------------------------------------------
function VenuesView({ tier }) {
  return (
    <div className="space-y-5 tier-fade">
      <ViewHeader
        kicker="Venues"
        title="Venue Partners · Utilization · Costs"
        sub={tier.scope + (tier.venues ? ` · ${tier.venues.length} venues this season` : '')}
        right={<button className="px-3 py-1.5 text-[11.5px] font-semibold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5"><Icon name="Plus" size={12} strokeWidth={2.4}/> Add Venue</button>}
      />

      <TierGuard tier={tier}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {tier.venues.map(v => <VenueCard key={v.id} venue={v} />)}
        </div>
      </TierGuard>
    </div>
  );
}

function VenueCard({ venue: v }) {
  const statusTones = {
    preferred: { tone:'win',     label:'PREFERRED' },
    active:    { tone:'sky',     label:'ACTIVE' },
    risk:      { tone:'crimson', label:'AT RISK' },
  };
  const st = statusTones[v.status] || statusTones.active;
  return (
    <div className="bg-ink-700 border border-ink-500 rounded p-4 hover:border-crimson-500/40 transition-all">
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <Pill tone={st.tone}>{st.label}</Pill>
        <span className="text-[10.5px] text-ink-300 tabnum">{v.events} {v.events === 1 ? 'event' : 'events'} · {v.fields} fields</span>
      </div>
      <div className="mb-3">
        <div className="font-display font-bold text-[14px] text-ink-50 truncate">{v.name}</div>
        <div className="text-[11px] tabnum text-ink-200 mt-0.5 flex items-center gap-1.5">
          <Icon name="MapPin" size={10} className="text-ink-300" />
          {v.city}
        </div>
      </div>
      <div className="mb-3 pt-3 border-t border-ink-500/60">
        <div className="flex items-baseline justify-between mb-1">
          <span className="label-eyebrow text-[9.5px]">Utilization</span>
          <span className="scorenum text-[16px] tabnum text-ink-50">{v.utilization}%</span>
        </div>
        <Bar value={v.utilization} tone={v.utilization >= 80 ? 'win' : v.utilization >= 50 ? 'sky' : 'warn'} height={5} />
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10.5px] mb-3">
        <div>
          <div className="label-eyebrow text-[9px]">Rate</div>
          <div className="text-ink-100 tabnum">{v.contractRate}</div>
        </div>
        <div>
          <div className="label-eyebrow text-[9px]">Next</div>
          <div className="text-ink-100 tabnum">{v.nextDate}</div>
        </div>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {v.amenities.map((a, i) => (
          <span key={i} className="px-1.5 py-0.5 bg-ink-600 border border-ink-500 rounded text-[9.5px] tabnum text-ink-200">{a}</span>
        ))}
      </div>
      <div className="text-[10.5px] text-ink-300 truncate pt-2 border-t border-ink-500/60">
        <Icon name="User" size={10} className="inline mr-1" />{v.contact}
      </div>
    </div>
  );
}

// ---- REPORTS VIEW ---------------------------------------------------
function ReportsView({ tier }) {
  return (
    <div className="space-y-5 tier-fade">
      <ViewHeader
        kicker="Reports"
        title="Standard Reports · Automated Exports"
        sub={tier.scope}
        right={<button className="px-3 py-1.5 text-[11.5px] font-semibold text-white bg-crimson-500 hover:bg-crimson-600 rounded flex items-center gap-1.5"><Icon name="Plus" size={12} strokeWidth={2.4}/> Build Report</button>}
      />

      <TierGuard tier={tier}>
        <div className="bg-ink-700 border border-ink-500 rounded overflow-hidden">
          <div className="grid grid-cols-12 gap-2 px-5 py-2.5 bg-ink-800 border-b border-ink-500">
            <div className="col-span-4 label-eyebrow text-[9.5px]">Report</div>
            <div className="col-span-2 label-eyebrow text-[9.5px]">Type</div>
            <div className="col-span-2 label-eyebrow text-[9.5px]">Recipients</div>
            <div className="col-span-2 label-eyebrow text-[9.5px]">Schedule</div>
            <div className="col-span-1 label-eyebrow text-[9.5px] text-right">Last Run</div>
            <div className="col-span-1 label-eyebrow text-[9.5px] text-right">Action</div>
          </div>
          {tier.reports.map((r, i) => (
            <div key={r.id} className={`grid grid-cols-12 gap-2 px-5 py-2.5 items-center hover:bg-ink-600/40 transition-colors ${i < tier.reports.length - 1 ? 'border-b border-ink-500/40' : ''}`}>
              <div className="col-span-4 min-w-0">
                <div className="text-[13px] font-semibold text-ink-50 truncate">{r.name}</div>
                <div className="text-[10.5px] tabnum text-ink-300">{r.format} · automated</div>
              </div>
              <div className="col-span-2"><Pill tone="sky">{r.type.toUpperCase()}</Pill></div>
              <div className="col-span-2 text-[11.5px] text-ink-200 truncate">{r.recipients}</div>
              <div className="col-span-2 text-[11.5px] text-ink-200 tabnum">{r.auto}</div>
              <div className="col-span-1 text-right text-[11px] tabnum text-ink-300">{r.lastRun}</div>
              <div className="col-span-1 flex justify-end">
                <button className="px-2 py-1 text-[10.5px] font-semibold text-ink-50 bg-ink-600 border border-ink-500 hover:border-ink-400 rounded flex items-center gap-1">
                  <Icon name="Download" size={11} /> Run
                </button>
              </div>
            </div>
          ))}
        </div>
      </TierGuard>
    </div>
  );
}

// ---- SETTINGS VIEW --------------------------------------------------
function SettingsView({ tier }) {
  return (
    <div className="space-y-5 tier-fade">
      <ViewHeader
        kicker="Settings"
        title="Organization · Integrations · Team · Notifications"
        sub={tier.scope}
        right={<Pill tone="win" icon="Check">All systems healthy</Pill>}
      />

      <TierGuard tier={tier}>
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
          {/* Profile */}
          <div className="xl:col-span-6">
            <div className="bg-ink-700 border border-ink-500 rounded p-5 h-full">
              <SectionTitle kicker="Organization" title="Profile & Billing" accent="crimson" />
              <div className="space-y-2.5">
                <SettingRow label="Organization" value={tier.settings.profile.org} />
                <SettingRow label="Tax ID"       value={tier.settings.profile.tax} />
                <SettingRow label="Address"      value={tier.settings.profile.address} />
                <SettingRow label="Phone"        value={tier.settings.profile.phone} />
                <SettingRow label="Plan"         value={<span className="text-crimson-400 font-bold">{tier.settings.profile.plan}</span>} />
              </div>
              <div className="mt-4 pt-3 border-t border-ink-500 flex items-center justify-between">
                <span className="text-[10.5px] text-ink-300">Next billing: Jun 1, 2026 · $400</span>
                <button className="text-[11.5px] font-semibold text-crimson-400 hover:text-crimson-500">Manage plan →</button>
              </div>
            </div>
          </div>

          {/* Team members */}
          <div className="xl:col-span-6">
            <div className="bg-ink-700 border border-ink-500 rounded p-5 h-full">
              <SectionTitle kicker="Team" title="Members & Access" accent="sky" right={<button className="text-[11.5px] font-semibold text-crimson-400">+ Invite</button>}/>
              <div className="space-y-2">
                {tier.settings.team.map((m, i) => (
                  <div key={i} className="flex items-center gap-3 px-3 py-2 bg-ink-800 border border-ink-500 rounded">
                    <div className="w-8 h-8 rounded bg-gradient-to-br from-crimson-500 to-crimson-600 flex items-center justify-center font-display font-black text-white text-[11px]">{m.initials}</div>
                    <div className="flex-1 min-w-0">
                      <div className="text-[12.5px] font-semibold text-ink-50 truncate">{m.name}</div>
                      <div className="text-[10.5px] text-ink-300 truncate">{m.role} · {m.email}</div>
                    </div>
                    <Pill tone={m.status === 'active' ? 'win' : 'warn'}>{m.status.toUpperCase()}</Pill>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Integrations */}
          <div className="xl:col-span-7">
            <div className="bg-ink-700 border border-ink-500 rounded p-5 h-full">
              <SectionTitle kicker="Integrations" title="Connected Apps" accent="win" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {tier.settings.integrations.map((it, i) => {
                  const ok = it.status === 'connected';
                  return (
                    <div key={i} className="flex items-center gap-3 px-3 py-2.5 bg-ink-800 border border-ink-500 rounded">
                      <div className={`w-9 h-9 rounded border flex items-center justify-center ${ok ? 'bg-win-900 border-win-500/40 text-win-500' : 'bg-warn-900 border-warn-500/40 text-warn-500'}`}>
                        <Icon name={it.icon} size={14} strokeWidth={2.2} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-[12.5px] font-semibold text-ink-50 truncate">{it.name}</div>
                        <div className="text-[10.5px] tabnum text-ink-300 truncate">{it.last}</div>
                      </div>
                      <button className={`px-2 py-1 text-[10.5px] font-semibold rounded ${ok ? 'bg-ink-600 border border-ink-500 text-ink-100 hover:border-ink-400' : 'bg-crimson-500 text-white hover:bg-crimson-600'}`}>
                        {ok ? 'Manage' : 'Reauth'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Notifications */}
          <div className="xl:col-span-5">
            <div className="bg-ink-700 border border-ink-500 rounded p-5 h-full">
              <SectionTitle kicker="Notifications" title="Alert Routing" accent="warn" />
              <div className="grid grid-cols-12 gap-2 px-2 py-1.5 border-b border-ink-500">
                <div className="col-span-7 label-eyebrow text-[9px]">Alert</div>
                <div className="col-span-2 label-eyebrow text-[9px] text-center">Email</div>
                <div className="col-span-1 label-eyebrow text-[9px] text-center">SMS</div>
                <div className="col-span-2 label-eyebrow text-[9px] text-center">Slack</div>
              </div>
              {tier.settings.notifications.map((n, i) => (
                <div key={n.id} className={`grid grid-cols-12 gap-2 px-2 py-2 items-center ${i < tier.settings.notifications.length - 1 ? 'border-b border-ink-500/40' : ''}`}>
                  <div className="col-span-7 text-[11.5px] text-ink-100">{n.label}</div>
                  <div className="col-span-2 flex justify-center"><Icon name={n.email ? 'CheckCircle2' : 'Circle'} size={13} className={n.email ? 'text-win-500' : 'text-ink-400'} /></div>
                  <div className="col-span-1 flex justify-center"><Icon name={n.sms ? 'CheckCircle2' : 'Circle'} size={13} className={n.sms ? 'text-win-500' : 'text-ink-400'} /></div>
                  <div className="col-span-2 flex justify-center"><Icon name={n.slack ? 'CheckCircle2' : 'Circle'} size={13} className={n.slack ? 'text-win-500' : 'text-ink-400'} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </TierGuard>
    </div>
  );
}

function SettingRow({ label, value }) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5 border-b border-ink-500/40 last:border-0">
      <span className="label-eyebrow text-[9.5px] shrink-0">{label}</span>
      <span className="text-[12px] text-ink-100 tabnum text-right truncate">{value}</span>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-8 pt-5 pb-2 border-t border-ink-500 flex items-center justify-between text-[10.5px] text-ink-300">
      <div className="flex items-center gap-4">
        <span className="tabnum">NCS Command v4.2.1</span>
        <span>·</span>
        <span>Data refreshed 04:12 ET</span>
        <span>·</span>
        <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-win-500"></span> All systems operational</span>
      </div>
      <div className="flex items-center gap-4">
        <a href="#" className="hover:text-ink-100">Documentation</a>
        <a href="#" className="hover:text-ink-100">API</a>
        <a href="#" className="hover:text-ink-100">Support</a>
      </div>
    </footer>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
