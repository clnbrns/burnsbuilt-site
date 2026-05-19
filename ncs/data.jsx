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
    scope: 'Spring 2026 Season',
    sub: 'Feb–Jul · 11 tournaments · Vega Sports Group',
    operator: { name: 'Jordan Vega', role: 'Tournament Organizer', initials: 'JV' },
    kpis: [
      { id: 'gmv',  label: 'Season Revenue (Spring)', value: '$612K', delta: '+18.4%', dir: 'up', sub: 'vs $517K Spring 25 · $164K margin', icon: 'DollarSign', accent: 'crimson' },
      { id: 'reg',  label: 'Avg Fill Rate',           value: '78%',   delta: '+6 pts', dir: 'up', sub: '412 / 528 teams · 4 events closed',  icon: 'Users',      accent: 'sky' },
      { id: 'roi',  label: 'Tournaments at Risk',     value: '3',     delta: '+1',     dir: 'up', sub: '<60% filled · <30 days to gate',     icon: 'AlertTriangle', accent: 'warn' },
      { id: 'lead', label: 'Next Event',              value: '12d',   delta: 'Jun 14', dir: 'flat', sub: 'Summit Showdown · 64% filled',     icon: 'Calendar',   accent: 'win' },
    ],
    pnl: [
      // Spring 2026 season — by month (Feb–Jul) + early Fall preview
      { m: 'Feb', rev: 0.042, cost: 0.028 },
      { m: 'Mar', rev: 0.082, cost: 0.058 },
      { m: 'Apr', rev: 0.118, cost: 0.078 },
      { m: 'May', rev: 0.148, cost: 0.094 },
      { m: 'Jun', rev: 0.142, cost: 0.092 },
      { m: 'Jul', rev: 0.080, cost: 0.053 },
    ],
    velocity: {
      headline: '38 regs / 7d',
      delta: '+11 vs prior wk',
      bars: [4,8,6,11,9,14,12,18,16,22,19,24,28,32,29,34,38,41,44,38,46,52,48,54,58,61,57,64],
    },
    tournaments: [
      // CLOSED (already happened)
      { id:'t1', name:'Spring Opener',         city:'Marietta, GA',  dates:'Feb 21–23', daysOut:-87, status:'closed', filled:48, capacity:48, revenue:'$112K',
        ageGroups:[
          { age:'9U',  filled:8,  cap:8  }, { age:'10U', filled:12, cap:12 },
          { age:'11U', filled:12, cap:12 }, { age:'12U', filled:8,  cap:8  },
          { age:'13U', filled:8,  cap:8  },
        ] },
      { id:'t2', name:'Magnolia Classic',      city:'Augusta, GA',   dates:'Mar 14–16', daysOut:-66, status:'closed', filled:52, capacity:56, revenue:'$128K',
        ageGroups:[
          { age:'10U', filled:12, cap:12 }, { age:'11U', filled:14, cap:16 },
          { age:'12U', filled:12, cap:12 }, { age:'13U', filled:8,  cap:8  },
          { age:'14U', filled:6,  cap:8  },
        ] },
      { id:'t3', name:'Carolina Coast Cup',    city:'Charleston, SC',dates:'Apr 11–13', daysOut:-38, status:'closed', filled:56, capacity:64, revenue:'$142K',
        ageGroups:[
          { age:'9U',  filled:6,  cap:8  }, { age:'10U', filled:12, cap:12 },
          { age:'11U', filled:14, cap:16 }, { age:'12U', filled:10, cap:12 },
          { age:'13U', filled:8,  cap:8  }, { age:'14U', filled:6,  cap:8  },
        ] },
      { id:'t4', name:'Smoky Mtn Showdown',    city:'Knoxville, TN', dates:'May 2–4',   daysOut:-17, status:'closed', filled:60, capacity:64, revenue:'$148K',
        ageGroups:[
          { age:'10U', filled:12, cap:12 }, { age:'11U', filled:14, cap:16 },
          { age:'12U', filled:12, cap:12 }, { age:'13U', filled:12, cap:12 },
          { age:'14U', filled:10, cap:12 },
        ] },
      // UPCOMING — current focus
      { id:'t5', name:'Lakepoint May Madness', city:'Cartersville, GA',dates:'May 30–Jun 1', daysOut:11, status:'healthy', filled:46, capacity:56, revenue:'$118K projected',
        ageGroups:[
          { age:'10U', filled:12, cap:12, status:'full' },
          { age:'11U', filled:13, cap:16, status:'healthy' },
          { age:'12U', filled:12, cap:12, status:'full' },
          { age:'13U', filled:6,  cap:8,  status:'healthy' },
          { age:'14U', filled:3,  cap:8,  status:'warn' },
        ] },
      { id:'t6', name:'Summit Showdown',       city:'Atlanta, GA',   dates:'Jun 14–16', daysOut:26, status:'critical', filled:42, capacity:96, revenue:'$108K projected',
        ageGroups:[
          { age:'10U', filled:6,  cap:16, status:'critical' },
          { age:'11U', filled:10, cap:16, status:'warn' },
          { age:'12U', filled:14, cap:24, status:'warn' },
          { age:'13U', filled:8,  cap:24, status:'critical' },
          { age:'14U', filled:4,  cap:16, status:'critical' },
        ] },
      { id:'t7', name:'Beach Bash',            city:'Myrtle Beach, SC',dates:'Jun 27–29', daysOut:39, status:'warn', filled:34, capacity:56, revenue:'$84K projected',
        ageGroups:[
          { age:'10U', filled:8,  cap:12, status:'warn' },
          { age:'11U', filled:10, cap:16, status:'warn' },
          { age:'12U', filled:8,  cap:12, status:'warn' },
          { age:'13U', filled:4,  cap:8,  status:'critical' },
          { age:'14U', filled:4,  cap:8,  status:'critical' },
        ] },
      { id:'t8', name:'Independence Invitational', city:'Nashville, TN', dates:'Jul 3–5', daysOut:45, status:'healthy', filled:52, capacity:64, revenue:'$132K projected',
        ageGroups:[
          { age:'10U', filled:12, cap:12, status:'full' },
          { age:'11U', filled:14, cap:16, status:'healthy' },
          { age:'12U', filled:10, cap:12, status:'healthy' },
          { age:'13U', filled:8,  cap:12, status:'warn' },
          { age:'14U', filled:8,  cap:12, status:'warn' },
        ] },
      { id:'t9', name:'Gulf Coast Slam',       city:'Pensacola, FL', dates:'Jul 11–13', daysOut:53, status:'critical', filled:18, capacity:48, revenue:'$44K projected',
        ageGroups:[
          { age:'10U', filled:4,  cap:8,  status:'critical' },
          { age:'11U', filled:6,  cap:12, status:'warn' },
          { age:'12U', filled:4,  cap:12, status:'critical' },
          { age:'13U', filled:2,  cap:8,  status:'critical' },
          { age:'14U', filled:2,  cap:8,  status:'critical' },
        ] },
      { id:'t10', name:'Magnolia Mid-Summer',  city:'Birmingham, AL',dates:'Jul 18–20', daysOut:60, status:'warn', filled:30, capacity:56, revenue:'$72K projected',
        ageGroups:[
          { age:'10U', filled:8,  cap:12, status:'warn' },
          { age:'11U', filled:8,  cap:16, status:'warn' },
          { age:'12U', filled:6,  cap:12, status:'warn' },
          { age:'13U', filled:4,  cap:8,  status:'critical' },
          { age:'14U', filled:4,  cap:8,  status:'critical' },
        ] },
      { id:'t11', name:'Spring Finale',        city:'Atlanta, GA',   dates:'Jul 25–27', daysOut:67, status:'healthy', filled:24, capacity:72, revenue:'$58K projected',
        ageGroups:[
          { age:'10U', filled:6,  cap:12, status:'warn' },
          { age:'11U', filled:6,  cap:16, status:'warn' },
          { age:'12U', filled:6,  cap:16, status:'warn' },
          { age:'13U', filled:4,  cap:12, status:'warn' },
          { age:'14U', filled:2,  cap:16, status:'critical' },
        ] },
    ],
    gaps: [
      // Legacy bracket-level (kept for compat with Action Center fallback)
      { id:'g1', tourn:'Summit Showdown — Atlanta', div:'10U BASEBALL', need:10, filled:6,  total:16, when:'Jun 14', region:'GA', risk:'high' },
      { id:'g2', tourn:'Gulf Coast Slam — Pensacola',div:'13U BASEBALL', need:6,  filled:2,  total:8,  when:'Jul 11', region:'FL', risk:'high' },
      { id:'g3', tourn:'Beach Bash — Myrtle Beach', div:'14U BASEBALL', need:4,  filled:4,  total:8,  when:'Jun 27', region:'SC', risk:'high' },
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
        { id:'lead', label:'Targeted',  count:284, value:'$0',    color:'ink'  },
        { id:'cont', label:'Contacted', count:186, value:'$418K', color:'sky'  },
        { id:'qual', label:'Interested',count:112, value:'$268K', color:'sky'  },
        { id:'prop', label:'Deposit',   count:54,  value:'$132K', color:'warn' },
        { id:'won',  label:'Confirmed', count:412, value:'$612K', color:'win'  },
      ]
    },
    marketing: [
      { ch:'Local FB Campaigns',   spend:14800,regs:182, cpa:81,  roas:7.4,  color:'crimson' },
      { ch:'Coach Email Blast',    spend:1200, regs:148, cpa:8,   roas:18.6, color:'win' },
      { ch:'Travel-Ball Google',   spend:22400,regs:112, cpa:200, roas:4.2,  color:'sky' },
      { ch:'Regional Coach Network',spend:9800,regs:78,  cpa:126, roas:3.4,  color:'warn' },
      { ch:'Direct/Word-of-Mouth', spend:0,    regs:42,  cpa:0,   roas:0,    color:'ink', organic:true },
    ],
    insights: [
      { tone:'risk',        icon:'AlertTriangle', title:'Summit Showdown 10U bracket needs 10 teams in 26 days',
        body:'10U is at 38% fill (6/16) — modeled natural-fill probability: 22%. Recommend Atlanta-radius coach email blast + $1,800 FB targeting for travel-ball parents this week.' },
      { tone:'risk',        icon:'AlertTriangle', title:'Gulf Coast Slam tracking 38% under Spring-25 pace',
        body:'18/48 teams confirmed at -53 days out. Last year was at 32/48 same day. Pensacola venue cost is fixed — every empty slot is direct margin loss. Consider repositioning as 10U/11U-only and cutting 13U/14U brackets.' },
      { tone:'opportunity', icon:'Sparkles',      title:'May Madness 12U + Independence 10U are sold out 11d / 45d early',
        body:'Demand at these venues exceeds capacity. Adding a parallel 12U bracket at May Madness (1 extra field for Sat) unlocks ~$28K. Independence already has a 6-team waitlist for 10U.' },
      { tone:'win',         icon:'TrendingUp',    title:'Spring 26 pacing +18% YoY across 4 closed events',
        body:'Spring Opener, Magnolia, Coast Cup, and Smoky Mtn all beat their FY25 revenue. Returning team % up to 64% (vs 51% Spring 25). Loyalty discount tier worth scaling for Fall.' },
    ],
    ticker: [
      { tag:'LIVE',  text:'Spring 26 Season · Week 19 of 22 · 412/528 teams confirmed' },
      { tag:'REG',   text:'38 new regs this week · +11 vs prior wk' },
      { tag:'ALERT', text:'Summit Showdown 10U needs 10 teams · 26 days out' },
      { tag:'ALERT', text:'Gulf Coast Slam pacing 38% behind FY25 — 53d out' },
      { tag:'WIN',   text:'May Madness 12U + Independence 10U SOLD OUT' },
      { tag:'OPS',   text:'4 Spring events closed · +18% YoY revenue · Fall regs open Aug 1' },
    ],

    // ===== TO-tier extended data (for Financial BI, Venues, Schedule, etc.) =====
    finance: {
      revenueMix: [
        { src:'Registration Fees',  amt:438000, pct:71.6, color:'crimson' },
        { src:'Gate & Spectator',   amt: 84000, pct:13.7, color:'sky'     },
        { src:'Concessions',        amt: 42000, pct: 6.9, color:'warn'    },
        { src:'Sponsorships',       amt: 36000, pct: 5.9, color:'win'     },
        { src:'Merch & Apparel',    amt: 12000, pct: 1.9, color:'ink'     },
      ],
      costMix: [
        { src:'Venue Rental',       amt:148000, pct:33.0, color:'crimson' },
        { src:'Umpires & Officials',amt: 92000, pct:20.5, color:'sky'     },
        { src:'Awards & Trophies',  amt: 38000, pct: 8.5, color:'warn'    },
        { src:'Marketing & Ads',    amt: 48200, pct:10.7, color:'win'     },
        { src:'Insurance & Permits',amt: 28000, pct: 6.2, color:'ink'     },
        { src:'Staff & Coordinators',amt:62000, pct:13.8, color:'crimson' },
        { src:'Equipment & Misc',   amt: 32800, pct: 7.3, color:'ink'     },
      ],
      // Per-tournament P&L
      perEvent: [
        { id:'t1', name:'Spring Opener',         rev:112, cost:71, marginPct:36.6, trend:'up'   },
        { id:'t2', name:'Magnolia Classic',      rev:128, cost:84, marginPct:34.4, trend:'up'   },
        { id:'t3', name:'Carolina Coast Cup',    rev:142, cost:96, marginPct:32.4, trend:'flat' },
        { id:'t4', name:'Smoky Mtn Showdown',    rev:148, cost:98, marginPct:33.8, trend:'up'   },
        { id:'t5', name:'Lakepoint May Madness', rev:118, cost:78, marginPct:33.9, trend:'up',   projected:true },
        { id:'t6', name:'Summit Showdown',       rev:108, cost: 92, marginPct:14.8, trend:'down', projected:true },
        { id:'t7', name:'Beach Bash',            rev: 84, cost: 64, marginPct:23.8, trend:'down', projected:true },
        { id:'t8', name:'Independence Invit.',   rev:132, cost: 84, marginPct:36.4, trend:'up',   projected:true },
        { id:'t9', name:'Gulf Coast Slam',       rev: 44, cost: 58, marginPct:-31.8,trend:'down', projected:true },
        { id:'t10',name:'Magnolia Mid-Summer',   rev: 72, cost: 56, marginPct:22.2, trend:'flat', projected:true },
        { id:'t11',name:'Spring Finale',         rev: 58, cost: 68, marginPct:-17.2,trend:'down', projected:true },
      ],
    },

    venues: [
      { id:'v1', name:'Lakepoint Sports',       city:'Cartersville, GA', fields:8, contractRate:'$18K/event',  events:3, status:'preferred', utilization:88,
        nextDate:'May 30',  contact:'Karen Wilkes · ops@lakepoint.com', amenities:['8 fields','Lights','Concessions','Streaming'] },
      { id:'v2', name:'East Cobb Baseball Complex', city:'Marietta, GA', fields:6, contractRate:'$14K/event',  events:2, status:'preferred', utilization:74,
        nextDate:'Jul 25',  contact:'Tom Buchanan · book@eastcobb.com',  amenities:['6 fields','Concessions'] },
      { id:'v3', name:'USCAA Riverside',        city:'Augusta, GA',      fields:5, contractRate:'$11K/event',  events:1, status:'active',    utilization:62,
        nextDate:'Closed · Mar 14', contact:'Rita Holloway · rita@uscaa.org', amenities:['5 fields','Indoor cages'] },
      { id:'v4', name:'Sportsplex Charleston',  city:'Charleston, SC',   fields:6, contractRate:'$13K/event',  events:1, status:'active',    utilization:58,
        nextDate:'Closed · Apr 11', contact:'Devin Park · devin@scsplex.com', amenities:['6 fields','Lights'] },
      { id:'v5', name:'Pensacola Bayfront',     city:'Pensacola, FL',    fields:4, contractRate:'$16K fixed',  events:1, status:'risk',      utilization:38,
        nextDate:'Jul 11',  contact:'Marcy Hall · mhall@pcolaba.com',    amenities:['4 fields','Beach proximity'] },
      { id:'v6', name:'Knoxville Catholic Sportsfields', city:'Knoxville, TN', fields:5, contractRate:'$12K/event', events:1, status:'active', utilization:94,
        nextDate:'Closed · May 2', contact:'Sister Anne Beauford · ann@knoxcs.edu', amenities:['5 fields','Indoor batting'] },
      { id:'v7', name:'Myrtle Beach Athletic Park', city:'Myrtle Beach, SC', fields:5, contractRate:'$12.5K/event', events:1, status:'active', utilization:61,
        nextDate:'Jun 27',  contact:'Roger Inman · rinman@mbap.org',      amenities:['5 fields','Vacation venue'] },
    ],

    schedule: [
      // Upcoming season days (May 19 = today)
      { date:'May 19', label:'TODAY',          items:[
        { time:'09:00', kind:'CRM',     text:'Coach outreach blast — Summit Showdown 10U/13U' },
        { time:'14:00', kind:'MTG',     text:'Lakepoint logistics call · Karen Wilkes' },
      ]},
      { date:'May 21', label:'WED',            items:[
        { time:'10:00', kind:'CAMP',    text:'FB ad burst launches · Summit Showdown $1,800/wk' },
        { time:'15:00', kind:'OPS',     text:'May Madness umpire confirmations close' },
      ]},
      { date:'May 23', label:'FRI',            items:[
        { time:'12:00', kind:'GATE',    text:'Early-bird discount expires — Beach Bash' },
      ]},
      { date:'May 30', label:'EVENT',          items:[
        { time:'07:00', kind:'EVENT',   text:'Lakepoint May Madness — Day 1 · 8 fields · 46 teams' },
      ]},
      { date:'Jun 14', label:'EVENT',          items:[
        { time:'07:00', kind:'EVENT',   text:'Summit Showdown — Day 1 · East Cobb · 42 teams (targeting 64+)' },
      ]},
      { date:'Jun 27', label:'EVENT',          items:[
        { time:'07:00', kind:'EVENT',   text:'Beach Bash — Day 1 · Myrtle Beach · 34 teams' },
      ]},
      { date:'Jul 3',  label:'EVENT',          items:[
        { time:'07:00', kind:'EVENT',   text:'Independence Invitational — Day 1 · 52 teams confirmed' },
      ]},
      { date:'Jul 11', label:'EVENT',          items:[
        { time:'07:00', kind:'EVENT',   text:'Gulf Coast Slam — Day 1 · Pensacola · 18 teams (pacing 38% behind)' },
      ]},
    ],

    campaigns: [
      { id:'c1', name:'Summit Showdown — 10U Rescue',    event:'Summit Showdown',     channel:'Facebook + Email', status:'active', budget:1800, spent:840,  regs:4, target:'travel-ball parents · GA 75mi', ends:'Jun 7'   },
      { id:'c2', name:'Gulf Coast Slam — Reposition',    event:'Gulf Coast Slam',     channel:'Google + Coach Net', status:'active', budget:2400, spent:380,  regs:2, target:'10U/11U · FL/AL · panhandle', ends:'Jul 4'   },
      { id:'c3', name:'Beach Bash — 13U/14U Push',       event:'Beach Bash',          channel:'Coach Email Blast', status:'active', budget:600,  spent:240,  regs:6, target:'returning teams from Coast Cup', ends:'Jun 20' },
      { id:'c4', name:'Magnolia Mid-Summer Awareness',   event:'Magnolia Mid-Summer', channel:'Facebook',          status:'queued', budget:1200, spent:0,    regs:0, target:'AL/MS/GA travel teams', ends:'Jul 11'  },
      { id:'c5', name:'Spring Finale Early-Bird',        event:'Spring Finale',       channel:'Email + Google',    status:'queued', budget:1500, spent:0,    regs:0, target:'returning teams + 14U recruit', ends:'Jul 18'  },
      { id:'c6', name:'Magnolia Classic — Wrap-up',      event:'Magnolia Classic',    channel:'Email',             status:'closed', budget:400,  spent:380,  regs:18,target:'thank-you + Fall pre-reg', ends:'Mar 22'  },
    ],

    contacts: [
      { id:'k1', name:'Mike Donovan',     team:'Atlanta Lightning 11U',  loc:'Marietta, GA',  stage:'won',   lastTouch:'2d ago',  notes:'Confirmed Summit + Spring Finale · pays deposit Fri' },
      { id:'k2', name:'Sarah Chen',       team:'Cobb Crushers 10U',      loc:'Smyrna, GA',    stage:'prop',  lastTouch:'5d ago',  notes:'Wants 10U bracket guarantee before deposit · Summit' },
      { id:'k3', name:'James Whitfield',  team:'GA Hot Corner Elite 12U',loc:'Atlanta, GA',   stage:'qual',  lastTouch:'1w ago',  notes:'Comparing Summit vs Atlanta Heat · price-sensitive' },
      { id:'k4', name:'Carla Estrada',    team:'Pensacola Pirates 11U',  loc:'Pensacola, FL', stage:'qual',  lastTouch:'3d ago',  notes:'Local team — Gulf Coast Slam · waiting on coach buy-in' },
      { id:'k5', name:'Trey Boudreaux',   team:'Mobile Bombers 12U',     loc:'Mobile, AL',    stage:'cont',  lastTouch:'2d ago',  notes:'Cold outreach — interested in Gulf Coast' },
      { id:'k6', name:'Lisa Park',        team:'Tallahassee Tide 10U',   loc:'Tallahassee, FL', stage:'cont',lastTouch:'4d ago',  notes:'Sent Gulf Coast packet · no reply yet' },
      { id:'k7', name:'Marc Robison',     team:'Charlotte Outlaws 13U',  loc:'Charlotte, NC', stage:'prop',  lastTouch:'1d ago',  notes:'Verbal yes for Beach Bash · invoice pending' },
      { id:'k8', name:'Tony Patrelli',    team:'Charleston Storm 14U',   loc:'Charleston, SC',stage:'cont',  lastTouch:'6d ago',  notes:'Beach Bash · price discussion · counter-offered $50 off' },
      { id:'k9', name:'Brendan O\'Hare',  team:'Augusta Anvils 14U',     loc:'Augusta, GA',   stage:'qual',  lastTouch:'2d ago',  notes:'Wants Independence + Spring Finale bundle' },
      { id:'k10',name:'Demetria Hayes',   team:'Macon Storm 13U',        loc:'Macon, GA',     stage:'qual',  lastTouch:'1w ago',  notes:'Returning Magnolia team · interested in Mid-Summer' },
      { id:'k11',name:'Coach Hutchinson', team:'Nashville Crush 12U',    loc:'Nashville, TN', stage:'prop',  lastTouch:'3d ago',  notes:'Independence deposit on Friday · ref by Hayes' },
      { id:'k12',name:'Aaron Walsh',      team:'Marietta Mavericks 13U', loc:'Marietta, GA',  stage:'lead',  lastTouch:'never',   notes:'New from Atlanta Heat split · target Summit 13U' },
    ],

    // Teams grouped by age — each team has revenue to TO, NCS rank, DugoutData cross-body rank
    // dd.body shows where the team is strongest across sanctioning bodies
    // dd.rank is the composite cross-body rank
    teamsByAge: {
      '9U': [
        { name:'Atlanta Lightning 9U',     region:'GA', record:'18-3',  revenue:4800, events:3, returning:true,  ncsRank:1, ncsRating:1842, dd:{ rank:2,  body:'PG',     bodyRank:3 } },
        { name:'Cobb Crushers 9U',         region:'GA', record:'17-4',  revenue:4200, events:3, returning:true,  ncsRank:2, ncsRating:1818, dd:{ rank:1,  body:'USSSA',  bodyRank:1 } },
        { name:'Carolina Riptide 9U',      region:'NC', record:'16-5',  revenue:3200, events:2, returning:true,  ncsRank:3, ncsRating:1788, dd:{ rank:4,  body:'PG',     bodyRank:5 } },
        { name:'Birmingham Bandits 9U',    region:'AL', record:'15-6',  revenue:3200, events:2, returning:false, ncsRank:4, ncsRating:1762, dd:{ rank:6,  body:'USSSA',  bodyRank:4 } },
        { name:'Tallahassee Tide 9U',      region:'FL', record:'15-7',  revenue:1600, events:1, returning:true,  ncsRank:5, ncsRating:1748, dd:{ rank:3,  body:'AAU',    bodyRank:2 } },
        { name:'Marietta Mavericks 9U',    region:'GA', record:'14-7',  revenue:3200, events:2, returning:false, ncsRank:6, ncsRating:1722, dd:{ rank:8,  body:'PG',     bodyRank:9 } },
        { name:'Charleston Storm 9U',      region:'SC', record:'14-8',  revenue:1600, events:1, returning:true,  ncsRank:7, ncsRating:1698, dd:{ rank:5,  body:'USSSA',  bodyRank:3 } },
        { name:'Knoxville Knights 9U',     region:'TN', record:'13-9',  revenue:1600, events:1, returning:false, ncsRank:8, ncsRating:1672, dd:{ rank:11, body:'AAU',    bodyRank:8 } },
      ],
      '10U': [
        { name:'Atlanta Lightning 10U',    region:'GA', record:'24-3',  revenue:7200, events:4, returning:true,  ncsRank:1, ncsRating:2087, dd:{ rank:1,  body:'PG',     bodyRank:1 } },
        { name:'Cobb Crushers 10U',        region:'GA', record:'21-6',  revenue:6400, events:4, returning:true,  ncsRank:2, ncsRating:2018, dd:{ rank:3,  body:'USSSA',  bodyRank:2 } },
        { name:'GA Hot Corner Elite 10U',  region:'GA', record:'20-7',  revenue:6400, events:4, returning:true,  ncsRank:3, ncsRating:2002, dd:{ rank:2,  body:'PG',     bodyRank:2 } },
        { name:'Charlotte Outlaws 10U',    region:'NC', record:'19-8',  revenue:4800, events:3, returning:true,  ncsRank:4, ncsRating:1978, dd:{ rank:4,  body:'PG',     bodyRank:4 } },
        { name:'Nashville Crush 10U',      region:'TN', record:'18-9',  revenue:4800, events:3, returning:true,  ncsRank:5, ncsRating:1956, dd:{ rank:7,  body:'USSSA',  bodyRank:5 } },
        { name:'Pensacola Pirates 10U',    region:'FL', record:'17-10', revenue:3200, events:2, returning:false, ncsRank:6, ncsRating:1928, dd:{ rank:5,  body:'AAU',    bodyRank:3 } },
        { name:'Tallahassee Tide 10U',     region:'FL', record:'17-11', revenue:1600, events:1, returning:true,  ncsRank:7, ncsRating:1902, dd:{ rank:9,  body:'USSSA',  bodyRank:6 } },
        { name:'Mobile Bombers 10U',       region:'AL', record:'16-11', revenue:1600, events:1, returning:false, ncsRank:8, ncsRating:1884, dd:{ rank:12, body:'PG',     bodyRank:11 } },
        { name:'Macon Storm 10U',          region:'GA', record:'15-12', revenue:3200, events:2, returning:true,  ncsRank:9, ncsRating:1856, dd:{ rank:14, body:'AAU',    bodyRank:9 } },
        { name:'Birmingham Bandits 10U',   region:'AL', record:'14-13', revenue:1600, events:1, returning:true,  ncsRank:10,ncsRating:1832, dd:{ rank:8,  body:'USSSA',  bodyRank:6 } },
      ],
      '11U': [
        { name:'Atlanta Lightning 11U',    region:'GA', record:'24-3',  revenue:7200, events:4, returning:true,  ncsRank:1, ncsRating:2087, dd:{ rank:1,  body:'PG',     bodyRank:1 } },
        { name:'Cobb Crushers 11U',        region:'GA', record:'21-6',  revenue:6400, events:4, returning:true,  ncsRank:2, ncsRating:2018, dd:{ rank:3,  body:'USSSA',  bodyRank:2 } },
        { name:'Charlotte Outlaws 11U',    region:'NC', record:'20-7',  revenue:4800, events:3, returning:true,  ncsRank:3, ncsRating:1994, dd:{ rank:2,  body:'PG',     bodyRank:2 } },
        { name:'GA Hot Corner Elite 11U',  region:'GA', record:'19-8',  revenue:6400, events:4, returning:true,  ncsRank:4, ncsRating:1968, dd:{ rank:5,  body:'PG',     bodyRank:6 } },
        { name:'Nashville Crush 11U',      region:'TN', record:'18-9',  revenue:3200, events:2, returning:false, ncsRank:5, ncsRating:1944, dd:{ rank:4,  body:'USSSA',  bodyRank:3 } },
        { name:'Charleston Storm 11U',     region:'SC', record:'17-10', revenue:3200, events:2, returning:true,  ncsRank:6, ncsRating:1922, dd:{ rank:6,  body:'AAU',    bodyRank:4 } },
        { name:'Pensacola Pirates 11U',    region:'FL', record:'16-11', revenue:1600, events:1, returning:false, ncsRank:7, ncsRating:1898, dd:{ rank:8,  body:'PG',     bodyRank:8 } },
        { name:'Augusta Anvils 11U',       region:'GA', record:'15-12', revenue:3200, events:2, returning:true,  ncsRank:8, ncsRating:1874, dd:{ rank:11, body:'USSSA',  bodyRank:7 } },
        { name:'Mobile Bombers 11U',       region:'AL', record:'14-13', revenue:1600, events:1, returning:false, ncsRank:9, ncsRating:1856, dd:{ rank:7,  body:'AAU',    bodyRank:5 } },
        { name:'Macon Storm 11U',          region:'GA', record:'13-14', revenue:3200, events:2, returning:true,  ncsRank:10,ncsRating:1828, dd:{ rank:13, body:'PG',     bodyRank:12 } },
      ],
      '12U': [
        { name:'GA Hot Corner Elite 12U',  region:'GA', record:'22-5',  revenue:7200, events:4, returning:true,  ncsRank:1, ncsRating:2034, dd:{ rank:1,  body:'PG',     bodyRank:1 } },
        { name:'Atlanta Lightning 12U',    region:'GA', record:'21-6',  revenue:6400, events:4, returning:true,  ncsRank:2, ncsRating:2012, dd:{ rank:3,  body:'USSSA',  bodyRank:2 } },
        { name:'Savannah Pirates 12U',     region:'GA', record:'19-8',  revenue:4800, events:3, returning:true,  ncsRank:3, ncsRating:1986, dd:{ rank:2,  body:'PG',     bodyRank:2 } },
        { name:'Nashville Crush 12U',      region:'TN', record:'18-9',  revenue:4800, events:3, returning:true,  ncsRank:4, ncsRating:1962, dd:{ rank:5,  body:'USSSA',  bodyRank:4 } },
        { name:'Cobb Crushers 12U',        region:'GA', record:'17-10', revenue:6400, events:4, returning:true,  ncsRank:5, ncsRating:1938, dd:{ rank:4,  body:'PG',     bodyRank:5 } },
        { name:'Miami Heatwave 12U',       region:'FL', record:'16-11', revenue:1600, events:1, returning:false, ncsRank:6, ncsRating:1912, dd:{ rank:6,  body:'AAU',    bodyRank:3 } },
        { name:'Tampa Riptide 12U',        region:'FL', record:'15-12', revenue:1600, events:1, returning:true,  ncsRank:7, ncsRating:1888, dd:{ rank:8,  body:'PG',     bodyRank:7 } },
        { name:'Charlotte Outlaws 12U',    region:'NC', record:'14-13', revenue:3200, events:2, returning:true,  ncsRank:8, ncsRating:1862, dd:{ rank:7,  body:'USSSA',  bodyRank:5 } },
        { name:'Charleston Storm 12U',     region:'SC', record:'13-14', revenue:3200, events:2, returning:true,  ncsRank:9, ncsRating:1838, dd:{ rank:10, body:'PG',     bodyRank:9 } },
        { name:'Marietta Mavericks 12U',   region:'GA', record:'12-15', revenue:1600, events:1, returning:false, ncsRank:10,ncsRating:1812, dd:{ rank:9,  body:'AAU',    bodyRank:6 } },
      ],
      '13U': [
        { name:'Carolina Thunder 13U',     region:'NC', record:'22-5',  revenue:6400, events:4, returning:true,  ncsRank:1, ncsRating:2152, dd:{ rank:1,  body:'PG',     bodyRank:1 } },
        { name:'Marietta Mavericks 13U',   region:'GA', record:'20-7',  revenue:4800, events:3, returning:false, ncsRank:2, ncsRating:1998, dd:{ rank:4,  body:'USSSA',  bodyRank:3 } },
        { name:'Macon Storm 13U',          region:'GA', record:'18-9',  revenue:4800, events:3, returning:false, ncsRank:3, ncsRating:1968, dd:{ rank:2,  body:'PG',     bodyRank:2 } },
        { name:'Augusta Anvils 13U',       region:'GA', record:'17-10', revenue:3200, events:2, returning:true,  ncsRank:4, ncsRating:1942, dd:{ rank:3,  body:'PG',     bodyRank:3 } },
        { name:'Nashville Crush 13U',      region:'TN', record:'16-11', revenue:3200, events:2, returning:true,  ncsRank:5, ncsRating:1918, dd:{ rank:6,  body:'USSSA',  bodyRank:4 } },
        { name:'Charlotte Outlaws 13U',    region:'NC', record:'15-12', revenue:4800, events:3, returning:true,  ncsRank:6, ncsRating:1894, dd:{ rank:5,  body:'AAU',    bodyRank:3 } },
        { name:'Charleston Storm 13U',     region:'SC', record:'14-13', revenue:1600, events:1, returning:false, ncsRank:7, ncsRating:1868, dd:{ rank:8,  body:'PG',     bodyRank:8 } },
        { name:'Phoenix Suns Premier 13U', region:'AZ', record:'13-14', revenue:1600, events:1, returning:false, ncsRank:8, ncsRating:1844, dd:{ rank:7,  body:'PG',     bodyRank:6 } },
        { name:'Cobb Crushers 13U',        region:'GA', record:'12-15', revenue:3200, events:2, returning:true,  ncsRank:9, ncsRating:1816, dd:{ rank:11, body:'USSSA',  bodyRank:8 } },
        { name:'Mobile Bombers 13U',       region:'AL', record:'11-16', revenue:1600, events:1, returning:false, ncsRank:10,ncsRating:1788, dd:{ rank:9,  body:'AAU',    bodyRank:5 } },
      ],
      '14U': [
        { name:'Roswell Renegades 14U',    region:'GA', record:'19-8',  revenue:6400, events:4, returning:true,  ncsRank:1, ncsRating:1984, dd:{ rank:2,  body:'PG',     bodyRank:2 } },
        { name:'Augusta Anvils 14U',       region:'GA', record:'17-11', revenue:3200, events:2, returning:false, ncsRank:2, ncsRating:1932, dd:{ rank:1,  body:'PG',     bodyRank:1 } },
        { name:'Charleston Storm 14U',     region:'SC', record:'16-12', revenue:3200, events:2, returning:false, ncsRank:3, ncsRating:1908, dd:{ rank:4,  body:'USSSA',  bodyRank:3 } },
        { name:'Seattle Surge 14U',        region:'WA', record:'15-13', revenue:1600, events:1, returning:true,  ncsRank:4, ncsRating:1884, dd:{ rank:3,  body:'PG',     bodyRank:3 } },
        { name:'Carolina Thunder 14U',     region:'NC', record:'14-14', revenue:3200, events:2, returning:true,  ncsRank:5, ncsRating:1862, dd:{ rank:5,  body:'USSSA',  bodyRank:4 } },
        { name:'Jacksonville Jaguars 14U', region:'FL', record:'13-15', revenue:1600, events:1, returning:true,  ncsRank:6, ncsRating:1838, dd:{ rank:6,  body:'AAU',    bodyRank:4 } },
        { name:'Nashville Crush 14U',      region:'TN', record:'12-16', revenue:1600, events:1, returning:false, ncsRank:7, ncsRating:1816, dd:{ rank:9,  body:'PG',     bodyRank:8 } },
        { name:'Atlanta Lightning 14U',    region:'GA', record:'11-17', revenue:3200, events:2, returning:true,  ncsRank:8, ncsRating:1788, dd:{ rank:7,  body:'USSSA',  bodyRank:5 } },
      ],
    },

    audience: {
      // Total reachable contacts in the TO's CRM
      coaches: { total: 1284, optIn: 1148, email: 1148, sms: 962 },
      parents: { total: 6420, optIn: 5184, email: 5184, sms: 3812 },
      // Slice counts (live filter previews)
      ageGroups: [
        { age:'9U',  coaches: 142, parents:  680 },
        { age:'10U', coaches: 268, parents: 1284 },
        { age:'11U', coaches: 284, parents: 1402 },
        { age:'12U', coaches: 246, parents: 1196 },
        { age:'13U', coaches: 198, parents:  984 },
        { age:'14U', coaches: 146, parents:  728 },
      ],
      levels: [
        { level:'Showcase / Elite',  coaches: 184, parents:  892 },
        { level:'Select / Premier',  coaches: 458, parents: 2284 },
        { level:'Travel / Rec+',     coaches: 506, parents: 2548 },
      ],
      regions: [
        { region:'GA Metro',  coaches: 412, parents: 2018 },
        { region:'AL / TN',   coaches: 244, parents: 1184 },
        { region:'FL Panhandle',coaches: 168, parents:  828 },
        { region:'SC / NC',   coaches: 286, parents: 1396 },
        { region:'Other SE',  coaches: 174, parents:  994 },
      ],
    },

    marketingTemplates: [
      { id:'tpl1', kind:'email', name:'Tournament announcement — 10U/11U',  audience:'coaches', subject:'Summit Showdown · 10U-11U brackets opening', opens:'62%', clicks:'18%', lastUsed:'2d ago' },
      { id:'tpl2', kind:'email', name:'Early-bird discount expiring',       audience:'coaches', subject:'48 hours left · $50 off Beach Bash',           opens:'58%', clicks:'24%', lastUsed:'5d ago' },
      { id:'tpl3', kind:'email', name:'Parent welcome packet',               audience:'parents', subject:'Welcome to {{tournament}} · what to expect',  opens:'74%', clicks:'12%', lastUsed:'1w ago' },
      { id:'tpl4', kind:'email', name:'Schedule + field assignments',        audience:'parents', subject:'{{tournament}} schedule + bracket draw',      opens:'81%', clicks:'34%', lastUsed:'2w ago' },
      { id:'tpl5', kind:'sms',   name:'Last-call reservation reminder',      audience:'coaches', subject:'⚾ 24h left to lock your 13U/14U slot for Summit', opens:'94%', clicks:'31%', lastUsed:'3d ago' },
      { id:'tpl6', kind:'sms',   name:'Day-of weather + gate info',          audience:'parents', subject:'Gates 7am · Field map: {{link}} · Forecast 78°', opens:'97%', clicks:'42%', lastUsed:'2w ago' },
      { id:'tpl7', kind:'social',name:'Bracket reveal post',                 audience:'public',  subject:'Drop the bracket — Summit Showdown 11U-14U',  opens:'—',   clicks:'—',   lastUsed:'1w ago' },
      { id:'tpl8', kind:'social',name:'Champion celebration carousel',       audience:'public',  subject:'Spring Opener champions — share & tag',       opens:'—',   clicks:'—',   lastUsed:'2m ago' },
    ],

    marketingSends: [
      { id:'s1', kind:'email', when:'Today 09:14', name:'Summit Showdown · 10U coach blast',     audience:'coaches · 10U · GA 75mi', recipients:268, sent:268, delivered:264, opens:'62% (164)', clicks:'18% (47)', regs:4, status:'sent' },
      { id:'s2', kind:'sms',   when:'Yesterday 17:30', name:'Gulf Coast Slam · last 14 days',    audience:'coaches · 10U-12U · FL/AL', recipients:182, sent:182, delivered:178, opens:'94% (167)', clicks:'31% (55)', regs:6, status:'sent' },
      { id:'s3', kind:'email', when:'May 17',     name:'Beach Bash · early-bird ends Friday',    audience:'parents · returning · SC/NC', recipients:984, sent:984, delivered:962, opens:'58% (558)', clicks:'24% (231)', regs:9, status:'sent' },
      { id:'s4', kind:'social',when:'May 16',     name:'May Madness bracket reveal',              audience:'IG + FB · Vega Sports', recipients:'—', sent:'1 post · 4 stories', delivered:'—', opens:'4,128 reach', clicks:'342 saves', regs:'—', status:'posted' },
      { id:'s5', kind:'email', when:'May 14',     name:'Spring Finale early-bird announcement',   audience:'coaches · 11U-14U · all', recipients:874, sent:874, delivered:868, opens:'54% (469)', clicks:'14% (122)', regs:11, status:'sent' },
      { id:'s6', kind:'sms',   when:'May 12',     name:'Smoky Mtn day-of gate info',              audience:'parents · attending', recipients:312, sent:312, delivered:310, opens:'97% (300)', clicks:'42% (131)', regs:'—', status:'sent' },
      { id:'s7', kind:'email', when:'May 10',     name:'Coach feedback survey · Q2',             audience:'coaches · all closed events', recipients:386, sent:386, delivered:382, opens:'48% (185)', clicks:'9% (35)',    regs:'—', status:'sent' },
    ],

    socialDrafts: [
      { id:'sd1', platform:'Instagram', tournament:'Summit Showdown', headline:'⚾ Bracket Drop — Summit Showdown',
        prompt:'10U–14U bracket grid · crimson + white · field outline · "Atlanta · Jun 14" stamp',
        status:'draft',  thumb:'BR', generated:'2h ago' },
      { id:'sd2', platform:'Facebook',  tournament:'Beach Bash',      headline:'48 hours · Early-bird $50 off',
        prompt:'Beach + diamond hybrid · Myrtle Beach skyline · countdown stamp',
        status:'review', thumb:'BB', generated:'5h ago' },
      { id:'sd3', platform:'TikTok',    tournament:'May Madness',     headline:'Champion celebration reel',
        prompt:'Trophy raise · slow-mo dust kick · winning team huddle · crimson banner',
        status:'draft',  thumb:'CR', generated:'1d ago' },
      { id:'sd4', platform:'Instagram', tournament:'Independence Inv.',headline:'Players to watch · 14U showcase',
        prompt:'Player headshot grid · 6 photos · "Independence Invitational · Nashville" header',
        status:'queued', thumb:'PW', generated:'2d ago' },
    ],

    reports: [
      { id:'r1', name:'Spring 2026 Season P&L',          type:'Financial',  lastRun:'2d ago',   recipients:'Owner · Accountant', format:'PDF', auto:'Monthly' },
      { id:'r2', name:'Tournament Margin Comparison',    type:'Financial',  lastRun:'5d ago',   recipients:'Owner',             format:'XLSX', auto:'On demand' },
      { id:'r3', name:'Registration Velocity by Event',  type:'Registration',lastRun:'Today',   recipients:'Owner · Marketing', format:'PDF', auto:'Weekly' },
      { id:'r4', name:'Marketing ROAS by Channel',       type:'Marketing',  lastRun:'1w ago',   recipients:'Owner · Marketing', format:'PDF', auto:'Weekly' },
      { id:'r5', name:'Coach Retention Cohort',          type:'CRM',        lastRun:'3w ago',   recipients:'Owner',             format:'CSV',  auto:'Quarterly' },
      { id:'r6', name:'Venue Utilization & Cost-per-Team',type:'Operations',lastRun:'2w ago',   recipients:'Owner',             format:'PDF', auto:'Monthly' },
      { id:'r7', name:'Returning Team Loyalty Scorecard',type:'Teams',      lastRun:'1m ago',   recipients:'Owner',             format:'PDF', auto:'Quarterly' },
      { id:'r8', name:'Year-End Tax Pack (Spring + Fall)', type:'Financial',lastRun:'last yr',  recipients:'Accountant',        format:'ZIP', auto:'Annually' },
    ],

    settings: {
      profile: { org:'Vega Sports Group', tax:'EIN 84-1029384', address:'1244 Northside Dr NW · Atlanta, GA 30318', phone:'(404) 555-0188', plan:'TO Pro · $400/mo' },
      integrations: [
        { name:'TeamSnap',    status:'connected', icon:'Link2',     last:'synced 12m ago' },
        { name:'Stripe',      status:'connected', icon:'CreditCard', last:'synced live' },
        { name:'GameChanger', status:'connected', icon:'Activity',  last:'synced 2h ago' },
        { name:'QuickBooks',  status:'connected', icon:'BookOpen',  last:'synced today' },
        { name:'Mailchimp',   status:'disconnected', icon:'Mail',   last:'reauth required' },
        { name:'Google Ads',  status:'connected', icon:'TrendingUp',last:'synced 4h ago' },
      ],
      team: [
        { name:'Jordan Vega',   role:'Owner · TO',            email:'jordan@vegasports.co',  status:'active',  initials:'JV' },
        { name:'Amelia Park',   role:'Operations Coordinator',email:'amelia@vegasports.co',  status:'active',  initials:'AP' },
        { name:'Devin Cole',    role:'Marketing Lead',        email:'devin@vegasports.co',   status:'active',  initials:'DC' },
        { name:'Hank Bishop',   role:'Field Director',        email:'hank@vegasports.co',    status:'active',  initials:'HB' },
        { name:'Rita Sanders',  role:'Accountant (external)', email:'rita@bookworks.cpa',    status:'limited', initials:'RS' },
      ],
      notifications: [
        { id:'n1', label:'Daily reg velocity digest',         email:true,  sms:false, slack:true  },
        { id:'n2', label:'Tournament at-risk alerts',         email:true,  sms:true,  slack:true  },
        { id:'n3', label:'Sold-out + waitlist notifications', email:true,  sms:false, slack:true  },
        { id:'n4', label:'Marketing campaign budget warnings',email:true,  sms:false, slack:false },
        { id:'n5', label:'Coach CRM stage changes',           email:false, sms:false, slack:true  },
        { id:'n6', label:'Weather risk on event windows',     email:true,  sms:true,  slack:false },
      ],
    },
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
