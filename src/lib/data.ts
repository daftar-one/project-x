import { fmt, fmtShort } from './format';

export const productionHouse = {
  id: 'ph1',
  name: 'Starlight Films Pvt. Ltd.',
  logo: 'SF',
};

export const projects = [
  {
    id: 'p1',
    name: 'Mumbai Nights',
    genre: 'Crime Thriller',
    director: 'Rahul Mehta',
    start: 'Jan 14, 2026',
    end: 'Apr 22, 2026',
    cover: '01',
    status: 'Live',
    totalBudget: 85000000,
    workingBudget: 76500000,
    safetyBudget: 8500000,
    spent: 58200000,
    committed: 12400000,
    sceneCount: 24,
    wrappedScenes: 9,
    overScenes: 4,
  },
  {
    id: 'p2',
    name: 'Ghar Ki Yaad',
    genre: 'Drama',
    director: 'Priya Iyer',
    start: 'Mar 01, 2026',
    end: 'Jun 30, 2026',
    cover: '02',
    status: 'Live',
    totalBudget: 32000000,
    workingBudget: 28800000,
    safetyBudget: 3200000,
    spent: 8600000,
    committed: 5200000,
    sceneCount: 18,
    wrappedScenes: 3,
    overScenes: 0,
  },
  {
    id: 'p3',
    name: 'Ek Aur Mausam',
    genre: 'Romance',
    director: 'Ananya Bose',
    start: 'Nov 10, 2025',
    end: 'Jan 28, 2026',
    cover: '03',
    status: 'Wrapped',
    totalBudget: 22000000,
    workingBudget: 19800000,
    safetyBudget: 2200000,
    spent: 21400000,
    committed: 0,
    sceneCount: 14,
    wrappedScenes: 14,
    overScenes: 2,
  },
  {
    id: 'p4',
    name: 'Code Red',
    genre: 'Action',
    director: 'Vikram Singh',
    start: 'May 01, 2026',
    end: 'Sep 15, 2026',
    cover: '04',
    status: 'Live',
    totalBudget: 120000000,
    workingBudget: 108000000,
    safetyBudget: 12000000,
    spent: 0,
    committed: 0,
    sceneCount: 32,
    wrappedScenes: 0,
    overScenes: 0,
  },
  {
    id: 'p5',
    name: 'Talaash-E-Dil',
    genre: 'Mystery',
    director: 'Sameer Nair',
    start: 'Sep 01, 2025',
    end: 'Dec 15, 2025',
    cover: '05',
    status: 'Wrapped',
    totalBudget: 45000000,
    workingBudget: 40500000,
    safetyBudget: 4500000,
    spent: 44100000,
    committed: 0,
    sceneCount: 22,
    wrappedScenes: 22,
    overScenes: 3,
  },
];

export const scenes = [
  { id: 's1',  num: 'Sc 01', name: 'Opening Chase — Marine Drive',       location: 'Marine Drive, Mumbai',    date: 'Jan 14, 2026', type: 'Exterior • Night', budget: 1200000, actual: 1180000, status: 'Wrapped' },
  { id: 's2',  num: 'Sc 02', name: 'Interrogation Room',                  location: 'Studio — Filmistan',      date: 'Jan 16, 2026', type: 'Interior • Day',   budget: 280000,  actual: 295000,  status: 'Wrapped' },
  { id: 's3',  num: 'Sc 03', name: 'Dharavi Slum Confrontation',          location: 'Dharavi, Mumbai',         date: 'Jan 19, 2026', type: 'Exterior • Day',   budget: 640000,  actual: 620000,  status: 'Wrapped' },
  { id: 's4',  num: 'Sc 04', name: 'Monsoon Rooftop',                     location: 'Bandra Rooftop',          date: 'Jan 22, 2026', type: 'Exterior • Night', budget: 420000,  actual: 410000,  status: 'Wrapped' },
  { id: 's5',  num: 'Sc 05', name: 'Malabar Hill Mansion',                location: 'Malabar Hill',            date: 'Jan 25, 2026', type: 'Interior • Day',   budget: 580000,  actual: 592000,  status: 'Wrapped' },
  { id: 's6',  num: 'Sc 06', name: 'VT Station Stakeout',                 location: 'CSMT, Mumbai',            date: 'Jan 28, 2026', type: 'Exterior • Night', budget: 750000,  actual: 748000,  status: 'Wrapped' },
  { id: 's7',  num: 'Sc 07', name: 'Crawford Market Chase Sequence',      location: 'Crawford Market, Mumbai', date: 'Feb 02, 2026', type: 'Exterior • Day',   budget: 800000,  actual: 940000,  status: 'Over Budget' },
  { id: 's8',  num: 'Sc 08', name: 'Warehouse Showdown',                  location: 'Bhiwandi Warehouse',     date: 'Feb 05, 2026', type: 'Interior • Night', budget: 920000,  actual: 905000,  status: 'Wrapped' },
  { id: 's9',  num: 'Sc 09', name: 'Airport Escape',                      location: 'Chhatrapati Shivaji Int.', date: 'Feb 09, 2026', type: 'Exterior • Day', budget: 680000,  actual: 710000,  status: 'Over Budget' },
  { id: 's10', num: 'Sc 10', name: 'Train to Pune',                       location: 'Dadar Station',           date: 'Feb 12, 2026', type: 'Exterior • Day',   budget: 460000,  actual: null,    status: 'Active' },
  { id: 's11', num: 'Sc 11', name: 'Neon Bar Confrontation',              location: 'Andheri West',            date: 'Feb 15, 2026', type: 'Interior • Night', budget: 520000,  actual: null,    status: 'Active' },
  { id: 's12', num: 'Sc 12', name: 'Hospital Scene',                      location: 'KEM Hospital Set',        date: 'Feb 18, 2026', type: 'Interior • Day',   budget: 310000,  actual: null,    status: 'Active' },
  { id: 's13', num: 'Sc 13', name: 'The Revelation — Juhu Beach',         location: 'Juhu Beach',              date: 'Feb 22, 2026', type: 'Exterior • Dawn',  budget: 890000,  actual: null,    status: 'Pending Approval' },
  { id: 's14', num: 'Sc 14', name: 'Climax — Fort District Rooftop',      location: 'Fort, Mumbai',            date: 'Feb 28, 2026', type: 'Exterior • Night', budget: 1400000, actual: null,    status: 'Draft' },
];

export const vendors = [
  { id: 'v1', name: 'Mumbai Location Services', category: 'Location',   rep: 'Dinesh Patkar',   phone: '+91 98201 12345', wo: 200000, billed: 240000, status: 'Pending Review', scenes: ['s7'] },
  { id: 'v2', name: 'Aperture Camera Rentals',  category: 'Equipment',  rep: 'Sanjay Verma',    phone: '+91 98334 56789', wo: 180000, billed: 180000, status: 'Approved',       scenes: ['s7', 's9'] },
  { id: 'v3', name: 'Chhaya Catering Co.',      category: 'Catering',   rep: 'Nalini Shah',     phone: '+91 98456 78901', wo: 80000,  billed: 82400,  status: 'Pending Review', scenes: ['s7'] },
  { id: 'v4', name: 'Swift Crew Transport',      category: 'Transport',  rep: 'Ravi Kulkarni',   phone: '+91 97234 23456', wo: 60000,  billed: null,   status: 'Pending Bill',   scenes: ['s7'] },
  { id: 'v5', name: 'Bolt Action Stunts',        category: 'Stunts/SFX', rep: 'Anup Rawat',      phone: '+91 99100 11223', wo: 220000, billed: 220000, status: 'Approved',       scenes: ['s7'] },
  { id: 'v6', name: 'Setworks Art Dept.',        category: 'Art Department', rep: 'Kavita Menon',phone: '+91 98712 34567', wo: 40000,  billed: 40000,  status: 'Approved',       scenes: ['s7'] },
  { id: 'v7', name: 'Soundline Audio',           category: 'Equipment',  rep: 'Pradeep Joshi',   phone: '+91 98567 89012', wo: 20000,  billed: null,   status: 'Pending Bill',   scenes: ['s7'] },
];

export const bills = [
  { id: 'b1', vendor: 'Mumbai Location Services', sceneId: 's7', type: 'Final',   date: 'Feb 03, 2026', wo: 200000, amount: 240000, variance: 40000,  status: 'Pending Review', file: 'location_final_inv_7392.pdf', submittedBy: 'Dinesh Patkar' },
  { id: 'b2', vendor: 'Aperture Camera Rentals',  sceneId: 's7', type: 'Final',   date: 'Feb 03, 2026', wo: 180000, amount: 180000, variance: 0,      status: 'Approved',       file: 'aperture_inv_2341.pdf',       submittedBy: 'Sanjay Verma' },
  { id: 'b3', vendor: 'Chhaya Catering Co.',      sceneId: 's7', type: 'Final',   date: 'Feb 04, 2026', wo: 80000,  amount: 82400,  variance: 2400,   status: 'Pending Review', file: 'chhaya_catering_inv_88.pdf',  submittedBy: 'Nalini Shah' },
  { id: 'b4', vendor: 'Bolt Action Stunts',       sceneId: 's7', type: 'Final',   date: 'Feb 02, 2026', wo: 220000, amount: 220000, variance: 0,      status: 'Approved',       file: 'bolt_stunts_inv_432.pdf',     submittedBy: 'Anup Rawat' },
  { id: 'b5', vendor: 'Setworks Art Dept.',       sceneId: 's7', type: 'Final',   date: 'Feb 02, 2026', wo: 40000,  amount: 40000,  variance: 0,      status: 'Paid',           file: 'setworks_inv_19.pdf',         submittedBy: 'Kavita Menon' },
];

export const paymentQueue = [
  { id: 'pq1', vendor: 'Mumbai Location Services', project: 'Mumbai Nights', scene: 'Sc 07', type: 'Final',   approvedOn: 'Feb 06, 2026', amount: 240000, daysSince: 5 },
  { id: 'pq2', vendor: 'Chhaya Catering Co.',      project: 'Mumbai Nights', scene: 'Sc 07', type: 'Final',   approvedOn: 'Feb 07, 2026', amount: 82400,  daysSince: 4 },
  { id: 'pq3', vendor: 'Mehta Rigging Co.',        project: 'Mumbai Nights', scene: 'Sc 05', type: 'Partial', approvedOn: 'Jan 29, 2026', amount: 95000,  daysSince: 11 },
  { id: 'pq4', vendor: 'Raj Art Direction',         project: 'Mumbai Nights', scene: 'Sc 06', type: 'Final',   approvedOn: 'Feb 01, 2026', amount: 68000,  daysSince: 8 },
];

export const paidHistory = [
  { id: 'ph1', vendor: 'Aperture Camera Rentals',  project: 'Mumbai Nights', scene: 'Sc 07', paidOn: 'Feb 04, 2026', utr: 'SBI2601P22', amount: 180000 },
  { id: 'ph2', vendor: 'Bolt Action Stunts',        project: 'Mumbai Nights', scene: 'Sc 07', paidOn: 'Feb 04, 2026', utr: 'SBI2601P23', amount: 220000 },
  { id: 'ph3', vendor: 'Setworks Art Dept.',        project: 'Mumbai Nights', scene: 'Sc 07', paidOn: 'Feb 03, 2026', utr: 'SBI2601P19', amount: 40000 },
];

export const team = [
  { id: 't1', name: 'Priya Sharma',   role: 'Line Producer',      email: 'priya@starlightfilms.in',  color: '#6366f1' },
  { id: 't2', name: 'Rahul Mehta',    role: 'Executive Producer',  email: 'rahul@starlightfilms.in',  color: '#e83e8c' },
  { id: 't3', name: 'Sonal Kapoor',   role: 'Accounts Manager',    email: 'sonal@starlightfilms.in',  color: '#10b981' },
  { id: 't4', name: 'Vikram Desai',   role: 'Silent Stakeholder',  email: 'vikram@desaigroup.com',    color: '#f59e0b' },
  { id: 't5', name: 'Anjali Singh',   role: 'Line Producer',       email: 'anjali@starlightfilms.in', color: '#3b82f6' },
];

export const auditTrail = [
  { id: 'a1',  type: 'Budget',   icon: 'lock',  who: 'Priya Sharma',  ts: 'Jan 14 · 9:02 AM',  what: 'Scene 07 budget locked at ₹8,00,000' },
  { id: 'a2',  type: 'WO',      icon: 'file',  who: 'Rahul Mehta',   ts: 'Jan 15 · 11:30 AM', what: 'Work Order raised for Mumbai Location Services · ₹2,00,000' },
  { id: 'a3',  type: 'WO',      icon: 'file',  who: 'Rahul Mehta',   ts: 'Jan 15 · 12:10 PM', what: 'Work Order raised for Aperture Camera Rentals · ₹1,80,000' },
  { id: 'a4',  type: 'WO',      icon: 'file',  who: 'Rahul Mehta',   ts: 'Jan 15 · 12:45 PM', what: 'Work Order raised for Bolt Action Stunts · ₹2,20,000' },
  { id: 'a5',  type: 'WO',      icon: 'file',  who: 'Rahul Mehta',   ts: 'Jan 16 · 10:00 AM', what: 'Work Order raised for Chhaya Catering Co. · ₹80,000' },
  { id: 'a6',  type: 'Bill',    icon: 'inbox', who: 'Vendor Portal', ts: 'Feb 02 · 6:18 PM',  what: 'Bolt Action Stunts submitted bill · ₹2,20,000 (matches WO)' },
  { id: 'a7',  type: 'Approval',icon: 'check', who: 'Rahul Mehta',   ts: 'Feb 02 · 7:40 PM',  what: 'Bolt Action Stunts bill approved · ₹2,20,000' },
  { id: 'a8',  type: 'Bill',    icon: 'inbox', who: 'Vendor Portal', ts: 'Feb 02 · 9:05 PM',  what: 'Setworks Art Dept. submitted bill · ₹40,000 (matches WO)' },
  { id: 'a9',  type: 'Bill',    icon: 'inbox', who: 'Vendor Portal', ts: 'Feb 03 · 8:22 AM',  what: 'Mumbai Location Services submitted bill · ₹2,40,000 (+₹40,000 over WO)' },
  { id: 'a10', type: 'Variance',icon: 'warn',  who: 'System',        ts: 'Feb 03 · 8:23 AM',  what: 'Scene flagged Over Budget · actual ₹9,40,000 vs budget ₹8,00,000' },
  { id: 'a11', type: 'Bill',    icon: 'inbox', who: 'Vendor Portal', ts: 'Feb 04 · 11:00 AM', what: 'Chhaya Catering Co. submitted bill · ₹82,400 (+₹2,400 over WO)' },
  { id: 'a12', type: 'Approval',icon: 'check', who: 'Rahul Mehta',   ts: 'Feb 04 · 2:30 PM',  what: 'Aperture Camera Rentals bill approved · ₹1,80,000' },
  { id: 'a13', type: 'Payment', icon: 'card',  who: 'Sonal Kapoor',  ts: 'Feb 04 · 4:00 PM',  what: 'Payment recorded for Bolt Action Stunts · ₹2,20,000 (UTR: SBI2601P23)' },
  { id: 'a14', type: 'Payment', icon: 'card',  who: 'Sonal Kapoor',  ts: 'Feb 04 · 4:05 PM',  what: 'Payment recorded for Aperture Camera Rentals · ₹1,80,000 (UTR: SBI2601P22)' },
  { id: 'a15', type: 'Approval',icon: 'check', who: 'Rahul Mehta',   ts: 'Feb 06 · 10:00 AM', what: 'Overage approved · ₹1,40,000 drawn from Safety Budget' },
  { id: 'a16', type: 'Payment', icon: 'card',  who: 'Sonal Kapoor',  ts: 'Feb 06 · 3:00 PM',  what: 'Payment recorded for Setworks Art Dept. · ₹40,000 (UTR: SBI2601P19)' },
];

export const burn = [
  { day: 'Jan 14', daily: 1200000,  cum: 1200000 },
  { day: 'Jan 16', daily: 280000,   cum: 1480000 },
  { day: 'Jan 19', daily: 640000,   cum: 2120000 },
  { day: 'Jan 22', daily: 420000,   cum: 2540000 },
  { day: 'Jan 25', daily: 580000,   cum: 3120000 },
  { day: 'Jan 28', daily: 750000,   cum: 3870000 },
  { day: 'Feb 02', daily: 1240000,  cum: 5110000 },
  { day: 'Feb 05', daily: 920000,   cum: 6030000 },
  { day: 'Feb 09', daily: 680000,   cum: 6710000 },
  { day: 'Feb 12', daily: 460000,   cum: 7170000 },
  { day: 'Feb 15', daily: 520000,   cum: 7690000 },
  { day: 'Feb 18', daily: 310000,   cum: 8000000 },
];

export const sceneSpend = scenes.slice(0, 14).map(s => ({
  name: s.num,
  budget: s.budget,
  actual: s.actual ?? s.budget * 0.72,
}));

export const sceneBudgetBreakdown = {
  rows: [
    { category: 'Location Fees & Permits', budget: 200000 },
    { category: 'Equipment & Camera Rentals', budget: 180000 },
    { category: 'Stunts & SFX', budget: 220000 },
    { category: 'Catering & Crew Meals', budget: 80000 },
    { category: 'Art Direction & Props', budget: 40000 },
    { category: 'Transport & Logistics', budget: 60000 },
    { category: 'Miscellaneous', budget: 20000 },
  ],
};

export const D = {
  productionHouse,
  projects,
  scenes,
  vendors,
  bills,
  paymentQueue,
  paidHistory,
  team,
  auditTrail,
  burn,
  sceneSpend,
  sceneBudgetBreakdown,
  fmt,
  fmtShort,
};
