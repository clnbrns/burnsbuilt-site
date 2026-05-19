// ============================================================
//  NCS COMMAND — mock data layer
//  Three tiers (national / regional / to) each define:
//    - context  (label + scope)
//    - kpis     (4 hero metrics)
//    - pnl      (12-month series)
//    - velocity (registration velocity sparkline + bars)
//    - gaps     (registration gaps action queue)
//    - teams    (top teams leaderboard)
//    - pipeline (recruitment CRM stages)
//    - marketing(channel attribution)
//    - insights (AI executive briefing themes)
//    - ticker   (live event ticker chips)
// ============================================================

const TIERS = {
  national: {
    id: 'national',
    label: 'National',
    scope: 'NCS · United States',
    sub: 'Aggregate of 8 regions · 412 active tournaments',
    operator: { name: 'Marcus Whitfield', role: 'VP, National Operations', initials: 'MW' },
    kpis: [
      { id: 'gmv',  label: 'Gross Revenue (YTD)',     value: '$48.2M', delta: '+18.4%', dir: 'up',   sub: 'vs $40.7M FY25 · $11.6M margin', icon: 'DollarSign', accent: 'crimson' },
      { id: 'reg',  label: 'Teams Registered',        value: '34,812', delta: '+9.2%',  dir: 'up',   sub: '94.1% of 37,000 capacity · 412 events', icon: 'Users',      accent: 'sky' },
      { id: 'roi',  label: 'Marketing ROAS',          value: '6.4x',   delta: '+0.8x',  dir: 'up',   sub: '$1.41M ad spend · 9,114 attributed regs', icon: 'TrendingUp', accent: 'win' },
      { id: 'lead', label: 'Active Recruit Leads',    value: '1,284',  delta: '−3.1%',  dir: 'down', sub: '38% returning · 21 days avg cycle',       icon: 'Target',     accent: 'warn' },
    ],
    pnl: [
      // 12 months — revenue, costs, margin
      { m: 'Jun', rev: 2.8, cost: 2.1 },
      { m: 'Jul', rev: 5.6, cost: 3.9 },
      { m: 'Aug', rev: 6.2, cost: 4.3 },
      { m: 'Sep', rev: 3.4, cost: 2.5 },
      { m: 'Oct', rev: 4.1, cost: 2.9 },
      { m: 'Nov', rev: 3.0, cost: 2.2 },
      { m: 'Dec', rev: 2.2, cost: 1.7 },
      { m: 'Jan', rev: 1.9, cost: 1.4 },
      { m: 'Feb', rev: 2.4, cost: 1.7 },
      { m: 'Mar', rev: 4.0, cost: 2.8 },
      { m: 'Apr', rev: 6.1, cost: 4.2 },
      { m: 'May', rev: 6.5, cost: 4.4 },
    ],
    velocity: {
      headline: '1,842 regs / 7d',
      delta: '+22% vs prior wk',
      bars: [42, 58, 71, 64, 92, 121, 156, 142, 188, 174, 212, 248, 224, 268, 302, 286, 318, 354, 372, 391, 408, 438, 462, 488, 512, 528, 546, 581],
    },
    gaps: [
      { id:'g1', tourn:'Summit Showdown — Atlanta',    div:'11U BASEBALL',  need:2,  filled:14, total:16, when:'Jun 14',  region:'SE',  risk:'high' },
      { id:'g2', tourn:'Coastal Classic — Tampa',      div:'12U SOFTBALL',  need:4,  filled:8,  total:12, when:'Jun 21',  region:'SE',  risk:'high' },
      { id:'g3', tourn:'Mountain Cup — Denver',        div:'14U BASEBALL',  need:1,  filled:23, total:24, when:'Jun 28',  region:'MW',  risk:'med'  },
      { id:'g4', tourn:'Heartland Open — Kansas City', div:'10U SOFTBALL',  need:3,  filled:13, total:16, when:'Jul 05',  region:'MW',  risk:'med'  },
      { id:'g5', tourn:'Pacific Slam — San Diego',     div:'13U BASEBALL',  need:2,  filled:14, total:16, when:'Jul 12',  region:'W',   risk:'low'  },
    ],
    teams: [
      { rank:1,  name:'Texas Heat Elite',      region:'SW', record:'48-6',  rating:2184, returning:true,  div:'14U' },
      { rank:2,  name:'Carolina Thunder',      region:'SE', record:'44-8',  rating:2152, returning:true,  div:'13U' },
      { rank:3,  name:'Chicago Iron',          region:'MW', record:'42-9',  rating:2128, returning:false, div:'14U' },
      { rank:4,  name:'SoCal Riptide',         region:'W',  record:'40-11', rating:2104, returning:true,  div:'12U' },
      { rank:5,  name:'Atlanta Lightning',     region:'SE', record:'39-12', rating:2087, returning:true,  div:'11U' },
      { rank:6,  name:'Phoenix Suns Premier',  region:'SW', record:'38-11', rating:2061, returning:true,  div:'13U' },
      { rank:7,  name:'Boston Brawlers',       region:'NE', record:'37-14', rating:2044, returning:false, div:'12U' },
      { rank:8,  name:'Seattle Surge',         region:'NW', record:'36-13', rating:2028, returning:true,  div:'14U' },
    ],
    pipeline: {
      stages: [
        { id:'lead',  label:'Leads',         count:1284, value:'$0',    color:'ink' },
        { id:'cont',  label:'Contacted',     count:642,  value:'$1.2M', color:'sky' },
        { id:'qual',  label:'Qualified',     count:318,  value:'$890K', color:'sky' },
        { id:'prop',  label:'Proposal',      count:147,  value:'$612K', color:'warn' },
        { id:'won',   label:'Registered',    count:402,  value:'$2.4M', color:'win' },
      ]
    },
    marketing: [
      { ch:'Paid Social',   spend:412000, regs:3284, cpa:125, roas:7.2, color:'crimson' },
      { ch:'Email Nurture', spend:48000,  regs:2916, cpa:16,  roas:18.4, color:'win' },
      { ch:'Google Search', spend:528000, regs:1948, cpa:271, roas:4.6, color:'sky' },
      { ch:'Influencer',    spend:184000, regs:612,  cpa:301, roas:3.1, color:'warn' },
      { ch:'Direct/Organic',spend:0,      regs:354,  cpa:0,   roas:0,    color:'ink', organic:true },
    ],
    insights: [
      { tone:'opportunity', icon:'Sparkles',  title:'Southeast is overheating — capacity unlock recommended',
        body:'SE region tracking +34% YoY with 7/12 June tournaments above 95% fill. Adding 2 satellite events in Tampa & Charlotte could unlock $1.8M in Q3.' },
      { tone:'risk',        icon:'CloudRain', title:'Weather risk: Hurricane Beryl track threatens 3 events',
        body:'Forecast models give 41% probability of impact to Coastal Classic (Jun 21), Gulf Slam (Jun 28), and Tampa Showdown (Jul 5). Pre-emptive rain-date comms drafted.' },
      { tone:'win',         icon:'TrendingUp',title:'Returning team retention hit 78% — a 5yr high',
        body:'Loyalty program redesign in Feb is paying off. 11U & 12U brackets showing strongest stickiness. National retention now leading industry benchmark by 11 pts.' },
    ],
    ticker: [
      { tag:'LIVE',  text:'Summit Showdown Atlanta — Round 3 in progress' },
      { tag:'REG',   text:'1,842 new registrations this week (+22%)' },
      { tag:'ALERT', text:'12U Softball Tampa needs 4 teams by 06/14' },
      { tag:'WIN',   text:'Texas Heat Elite clinches SW Regional title' },
      { tag:'P&L',   text:'May gross revenue $6.5M — 8% above forecast' },
    ],
  },

  regional: {
    id: 'regional',
    label: 'Regional',
    scope: 'Southeast Region',
    sub: '8 states · 64 tournaments · 4,812 active teams',
    operator: { name: 'Dana Reyes', role: 'Regional Director, SE', initials: 'DR' },
    kpis: [
      { id: 'gmv',  label: 'Regional Revenue (YTD)', value: '$8.9M',  delta: '+24.1%', dir: 'up',   sub: 'vs $7.1M FY25 · $2.3M margin',     icon: 'DollarSign', accent: 'crimson' },
      { id: 'reg',  label: 'Teams Registered',       value: '6,184',  delta: '+12.8%', dir: 'up',   sub: '91% of 6,800 capacity · 64 events', icon: 'Users',     accent: 'sky' },
      { id: 'roi',  label: 'Regional ROAS',          value: '7.1x',   delta: '+1.2x',  dir: 'up',   sub: '$284K ad spend · 2,016 regs',       icon: 'TrendingUp',accent: 'win' },
      { id: 'lead', label: 'Recruit Leads',          value: '312',    delta: '+8.4%',  dir: 'up',   sub: '42% returning · 18 days avg cycle', icon: 'Target',    accent: 'warn' },
    ],
    pnl: [
      { m: 'Jun', rev: 0.62, cost: 0.45 },
      { m: 'Jul', rev: 1.10, cost: 0.78 },
      { m: 'Aug', rev: 1.24, cost: 0.86 },
      { m: 'Sep', rev: 0.71, cost: 0.52 },
      { m: 'Oct', rev: 0.84, cost: 0.59 },
      { m: 'Nov', rev: 0.58, cost: 0.42 },
      { m: 'Dec', rev: 0.41, cost: 0.31 },
      { m: 'Jan', rev: 0.36, cost: 0.27 },
      { m: 'Feb', rev: 0.48, cost: 0.34 },
      { m: 'Mar', rev: 0.81, cost: 0.56 },
      { m: 'Apr', rev: 1.18, cost: 0.81 },
      { m: 'May', rev: 1.32, cost: 0.89 },
    ],
    velocity: {
      headline: '482 regs / 7d',
      delta: '+34% vs prior wk',
      bars: [12, 18, 22, 28, 24, 38, 44, 41, 52, 48, 64, 71, 68, 82, 91, 88, 102, 118, 128, 134, 142, 156, 168, 182, 196, 218, 234, 248],
    },
    gaps: [
      { id:'g1', tourn:'Summit Showdown — Atlanta',     div:'11U BASEBALL',  need:2, filled:14, total:16, when:'Jun 14', region:'SE', risk:'high' },
      { id:'g2', tourn:'Coastal Classic — Tampa',       div:'12U SOFTBALL',  need:4, filled:8,  total:12, when:'Jun 21', region:'SE', risk:'high' },
      { id:'g3', tourn:'Carolina Bash — Charlotte',     div:'13U BASEBALL',  need:1, filled:15, total:16, when:'Jun 28', region:'SE', risk:'med'  },
      { id:'g4', tourn:'Gulf Coast Slam — Pensacola',   div:'10U BASEBALL',  div_n:0, need:3, filled:5,  total:8,  when:'Jul 05', region:'SE', risk:'high' },
      { id:'g5', tourn:'Smoky Mtn Open — Knoxville',    div:'14U SOFTBALL',  need:2, filled:14, total:16, when:'Jul 12', region:'SE', risk:'med'  },
    ],
    teams: [
      { rank:1, name:'Carolina Thunder',     region:'NC', record:'44-8',  rating:2152, returning:true,  div:'13U' },
      { rank:2, name:'Atlanta Lightning',    region:'GA', record:'39-12', rating:2087, returning:true,  div:'11U' },
      { rank:3, name:'Tampa Riptide',        region:'FL', record:'38-13', rating:2071, returning:true,  div:'12U' },
      { rank:4, name:'Charleston Storm',     region:'SC', record:'36-14', rating:2044, returning:false, div:'14U' },
      { rank:5, name:'Nashville Crush',      region:'TN', record:'35-14', rating:2031, returning:true,  div:'13U' },
      { rank:6, name:'Miami Heatwave',       region:'FL', record:'34-15', rating:2018, returning:true,  div:'12U' },
      { rank:7, name:'Birmingham Bandits',   region:'AL', record:'33-16', rating:1998, returning:false, div:'11U' },
      { rank:8, name:'Jacksonville Jaguars', region:'FL', record:'32-17', rating:1984, returning:true,  div:'14U' },
    ],
    pipeline: {
      stages: [
        { id:'lead', label:'Leads',     count:312, value:'$0',    color:'ink'  },
        { id:'cont', label:'Contacted', count:184, value:'$340K', color:'sky'  },
        { id:'qual', label:'Qualified', count:96,  value:'$248K', color:'sky'  },
        { id:'prop', label:'Proposal',  count:42,  value:'$168K', color:'warn' },
        { id:'won',  label:'Registered',count:118, value:'$612K', color:'win'  },
      ]
    },
    marketing: [
      { ch:'Paid Social',    spend:84000, regs:712,  cpa:118, roas:7.8,  color:'crimson' },
      { ch:'Email Nurture',  spend:9200,  regs:618,  cpa:15,  roas:19.1, color:'win' },
      { ch:'Google Search',  spend:118000,regs:486,  cpa:243, roas:5.1,  color:'sky' },
      { ch:'Influencer',     spend:42000, regs:148,  cpa:284, roas:3.4,  color:'warn' },
      { ch:'Direct/Organic', spend:0,     regs:84,   cpa:0,   roas:0,    color:'ink', organic:true },
    ],
    insights: [
      { tone:'opportunity', icon:'Sparkles',  title:'Tampa & Charlotte primed for capacity expansion',
        body:'7 of 12 SE June events tracking >95% fill. Coastal Classic waitlist of 18 teams suggests demand for a parallel 12U bracket on Jun 21–22.' },
      { tone:'risk',        icon:'CloudRain', title:'Hurricane Beryl: 41% impact probability on Coastal Classic',
        body:'NOAA models tracking landfall window Jun 19–22. Pensacola Gulf Slam also in risk cone. Recommend pre-staging refund automation and Jul 19 rain-date.' },
      { tone:'win',         icon:'TrendingUp',title:'Carolinas retention jumped to 84% — best in region',
        body:'12U–14U returning teams up 11 pts QoQ. The "Loyalty Discount Tier 2" pilot is the strongest driver — recommend rolling regionwide for FY27.' },
    ],
    ticker: [
      { tag:'LIVE',  text:'Carolina Bash Charlotte — Bracket play 4:30pm' },
      { tag:'REG',   text:'SE region: 482 new regs this week (+34%)' },
      { tag:'ALERT', text:'Gulf Coast Slam needs 3 teams by 07/05' },
      { tag:'WIN',   text:'Carolina Thunder advances to nationals' },
      { tag:'WX',    text:'Hurricane Beryl tracking — refund flow staged' },
    ],
  },

  to: {
    id: 'to',
    label: 'Tournament Organizer',
    scope: 'Summit Showdown — Atlanta',
    sub: 'Jun 14–16, 2026 · Lakepoint Sports · Coordinator view',
    operator: { name: 'Jordan Vega', role: 'TO · Summit Showdown', initials: 'JV' },
    kpis: [
      { id: 'gmv',  label: 'Event Gross Revenue', value: '$248K', delta: '+14.2%', dir: 'up',   sub: 'vs $217K last year · $61K margin',  icon: 'DollarSign', accent: 'crimson' },
      { id: 'reg',  label: 'Teams Registered',    value: '86 / 96', delta: '+8 wks', dir: 'up', sub: '89% fill · 4 brackets · 10 open',    icon: 'Users',     accent: 'sky' },
      { id: 'roi',  label: 'Campaign ROAS',       value: '5.8x',  delta: '+0.4x',  dir: 'up',   sub: '$8,400 spend · 124 regs attributed',icon: 'TrendingUp',accent: 'win' },
      { id: 'lead', label: 'Active Outreach',     value: '42',    delta: '+18',    dir: 'up',   sub: '12 hot · 18 warm · 12 cold',         icon: 'Target',    accent: 'warn' },
    ],
    pnl: [
      // weeks-out instead of months
      { m: '-12w', rev: 0.014, cost: 0.008 },
      { m: '-11w', rev: 0.022, cost: 0.011 },
      { m: '-10w', rev: 0.028, cost: 0.014 },
      { m:  '-9w', rev: 0.034, cost: 0.018 },
      { m:  '-8w', rev: 0.041, cost: 0.022 },
      { m:  '-7w', rev: 0.048, cost: 0.026 },
      { m:  '-6w', rev: 0.062, cost: 0.034 },
      { m:  '-5w', rev: 0.078, cost: 0.042 },
      { m:  '-4w', rev: 0.094, cost: 0.051 },
      { m:  '-3w', rev: 0.118, cost: 0.062 },
      { m:  '-2w', rev: 0.158, cost: 0.082 },
      { m:  '-1w', rev: 0.248, cost: 0.187 },
    ],
    velocity: {
      headline: '14 regs / 7d',
      delta: '+8 vs prior wk',
      bars: [0,0,1,0,1,2,1,3,2,4,3,5,4,6,5,7,6,8,9,11,12,10,14,16,18,21,24,28],
    },
    gaps: [
      { id:'g1', tourn:'Summit Showdown — Bracket A', div:'11U BASEBALL',  need:2, filled:14, total:16, when:'Jun 14', region:'GA', risk:'high' },
      { id:'g2', tourn:'Summit Showdown — Bracket B', div:'12U BASEBALL',  need:0, filled:16, total:16, when:'Jun 14', region:'GA', risk:'low'  },
      { id:'g3', tourn:'Summit Showdown — Bracket C', div:'13U BASEBALL',  need:3, filled:13, total:16, when:'Jun 14', region:'GA', risk:'high' },
      { id:'g4', tourn:'Summit Showdown — Bracket D', div:'14U BASEBALL',  need:5, filled:11, total:16, when:'Jun 14', region:'GA', risk:'high' },
      { id:'g5', tourn:'Summit Showdown — Showcase',  div:'15U SHOWCASE',  need:0, filled:16, total:16, when:'Jun 16', region:'GA', risk:'low'  },
    ],
    teams: [
      { rank:1, name:'Atlanta Lightning 11U',  region:'GA', record:'24-3',  rating:2087, returning:true,  div:'11U' },
      { rank:2, name:'GA Hot Corner Elite',    region:'GA', record:'22-5',  rating:2034, returning:true,  div:'12U' },
      { rank:3, name:'Cobb Crushers',          region:'GA', record:'21-6',  rating:2018, returning:true,  div:'11U' },
      { rank:4, name:'Marietta Mavericks',     region:'GA', record:'20-7',  rating:1998, returning:false, div:'13U' },
      { rank:5, name:'Roswell Renegades',      region:'GA', record:'19-8',  rating:1984, returning:true,  div:'14U' },
      { rank:6, name:'Macon Storm',            region:'GA', record:'18-9',  rating:1968, returning:false, div:'13U' },
      { rank:7, name:'Savannah Pirates',       region:'GA', record:'17-10', rating:1948, returning:true,  div:'12U' },
      { rank:8, name:'Augusta Anvils',         region:'GA', record:'17-11', rating:1932, returning:false, div:'14U' },
    ],
    pipeline: {
      stages: [
        { id:'lead', label:'Targeted',  count:42, value:'$0',    color:'ink'  },
        { id:'cont', label:'Contacted', count:31, value:'$58K',  color:'sky'  },
        { id:'qual', label:'Interested',count:18, value:'$34K',  color:'sky'  },
        { id:'prop', label:'Deposit',   count:8,  value:'$15K',  color:'warn' },
        { id:'won',  label:'Confirmed', count:86, value:'$248K', color:'win'  },
      ]
    },
    marketing: [
      { ch:'Local FB Campaign',  spend:2400, regs:38, cpa:63,  roas:8.2,  color:'crimson' },
      { ch:'Coach Email Blast',  spend:200,  regs:34, cpa:6,   roas:21.4, color:'win' },
      { ch:'Travel-Ball Google', spend:3800, regs:28, cpa:136, roas:4.8,  color:'sky' },
      { ch:'GA Coach Network',   spend:2000, regs:18, cpa:111, roas:3.6,  color:'warn' },
      { ch:'Direct/Word-of-Mouth',spend:0,   regs:8,  cpa:0,   roas:0,    color:'ink', organic:true },
    ],
    insights: [
      { tone:'risk',        icon:'AlertTriangle', title:'14U Bracket D will not fill at current velocity',
        body:'Need 5 teams in 21 days. Modeled probability of natural fill: 18%. Launching Atlanta-radius coach email blast + 7-day FB ad burst recommended now.' },
      { tone:'opportunity', icon:'Sparkles',      title:'11U has waitlist energy — open a B-bracket',
        body:'14 registered + 6 on waitlist + 4 hot leads. Splitting into A/B brackets would unlock ~$24K and balance Saturday field utilization.' },
      { tone:'win',         icon:'CheckCircle2',  title:'Bracket B & Showcase already SOLD OUT',
        body:'12U & 15U brackets locked 9 weeks out — record for this venue. Strong signal for early-bird discount pricing on Aug Summit follow-on event.' },
    ],
    ticker: [
      { tag:'LIVE',  text:'Summit Showdown — 9 days out · 86/96 teams' },
      { tag:'REG',   text:'14 new regs this week · +8 vs prior' },
      { tag:'ALERT', text:'14U Bracket D needs 5 teams urgently' },
      { tag:'WIN',   text:'12U Bracket B SOLD OUT' },
      { tag:'OPS',   text:'Field & umpire schedule locked — 14 staff confirmed' },
    ],
  },
};

// Nav items shared across tiers
const NAV = [
  { id:'overview',  label:'Command Overview', icon:'LayoutDashboard' },
  { id:'finance',   label:'Financial BI',     icon:'DollarSign' },
  { id:'registration', label:'Registration',  icon:'ClipboardList' },
  { id:'marketing', label:'Marketing Engine', icon:'Megaphone' },
  { id:'teams',     label:'Teams & Talent',   icon:'Trophy' },
  { id:'crm',       label:'Recruitment CRM',  icon:'UserPlus' },
  { id:'insights',  label:'Predictive Insights', icon:'Sparkles' },
];

window.__NCS = { TIERS, NAV };
