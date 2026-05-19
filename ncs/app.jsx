// Main app — sidebar + header + tier switching + view composition
const { useState, useEffect, useRef, useMemo, useCallback } = React;
const { TIERS, NAV } = window.__NCS;
const { Icon, Pill, SectionTitle, Delta, Bar } = window.__P;
const { PnLChart, VelocityChart, Sparkline, MarketingAttribution, Funnel } = window.__C;
const { KpiTile, RegistrationGapCard, TopTeamsTable, InsightsBriefing, LiveTicker } = window.__W;

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
    { id:'to',       label:'Tournament Organizer', desc:'Single-event coordination', icon:'Flag' },
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
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded text-left text-ink-100 hover:bg-ink-700">
            <Icon name="Calendar" size={14} strokeWidth={2} />
            <span className="text-[12.5px] font-medium">Schedule</span>
            <span className="ml-auto text-[9.5px] bg-ink-500 px-1.5 py-0.5 rounded tabnum">412</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded text-left text-ink-100 hover:bg-ink-700">
            <Icon name="MapPin" size={14} strokeWidth={2} />
            <span className="text-[12.5px] font-medium">Venues</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded text-left text-ink-100 hover:bg-ink-700">
            <Icon name="FileBarChart" size={14} strokeWidth={2} />
            <span className="text-[12.5px] font-medium">Reports</span>
          </button>
          <button className="w-full flex items-center gap-2.5 px-2 py-2 rounded text-left text-ink-100 hover:bg-ink-700">
            <Icon name="Settings2" size={14} strokeWidth={2} />
            <span className="text-[12.5px] font-medium">Settings</span>
          </button>
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
  const isEvent = tier.id === 'to';
  return (
    <div className="bg-ink-700 border border-ink-500 rounded p-5">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="h-[3px] w-7 bg-crimson-500"></span>
            <span className="label-eyebrow">{isEvent ? 'Event P&L Trend' : 'P&L Trend · 12 Months'}</span>
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

  const handleAction = useCallback((gap, action) => {
    if (action === 'campaign') {
      setToast({
        icon: 'Megaphone',
        title: `Campaign launched: ${gap.tourn}`,
        body: `Targeting ${gap.div} coaches within 75mi. Est. fill: 3–5 days. Budget $1,200 from regional pool.`,
      });
    } else {
      setToast({
        icon: 'UserPlus',
        title: `Invitations sent: ${gap.tourn}`,
        body: `12 top-rated ${gap.div} teams invited via NCS Coach Network. Avg reply rate 64%.`,
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
          <Dashboard tier={tier} onAction={handleAction} />
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
