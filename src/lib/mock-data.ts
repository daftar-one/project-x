import type { ProjectWithStats, SceneWithActual, SceneBudgetLine, Bill, Wallet, Vendor } from './types';

// ─── IDs ──────────────────────────────────────────────────────────────────────

export const PROJECT_IDS = { D1: 'dhurandhar-1', D2: 'dhurandhar-2' };

const D1 = PROJECT_IDS.D1;
const D2 = PROJECT_IDS.D2;

const S = {
  d1_01: 'd1-sc-01', d1_02: 'd1-sc-02', d1_03: 'd1-sc-03', d1_04: 'd1-sc-04',
  d1_05: 'd1-sc-05', d1_06: 'd1-sc-06', d1_07: 'd1-sc-07', d1_08: 'd1-sc-08',
  d2_01: 'd2-sc-01', d2_02: 'd2-sc-02', d2_03: 'd2-sc-03',
  d2_04: 'd2-sc-04', d2_05: 'd2-sc-05', d2_06: 'd2-sc-06',
};

const V = {
  actionCrew:    'v-action-crew',
  vfxPrime:      'v-vfx-prime',
  cineGear:      'v-cine-gear',
  blastFx:       'v-blast-fx',
  dreamProps:    'v-dream-props',
  mumbaiLoc:     'v-mumbai-loc',
  skyShot:       'v-sky-shot',
  filmMovers:    'v-film-movers',
  styleGlam:     'v-style-glam',
  castingCraft:  'v-casting-craft',
  desertMotors:  'v-desert-motors',
  coastalLoc:    'v-coastal-loc',
  oceanProps:    'v-ocean-props',
  aquaFilm:      'v-aqua-film',
  indRailways:   'v-ind-railways',
  blueOcean:     'v-blue-ocean',
  medFilm:       'v-med-film',
};

const VN: Record<string, string> = {
  [V.actionCrew]:   'Action Crew India',
  [V.vfxPrime]:     'Prime VFX Studios',
  [V.cineGear]:     'Cine Gear Mumbai',
  [V.blastFx]:      'Blast Effects India',
  [V.dreamProps]:   'Dream Props Studio',
  [V.mumbaiLoc]:    'Mumbai Location Services',
  [V.skyShot]:      'SkyShot Films',
  [V.filmMovers]:   'Film Movers Pvt Ltd',
  [V.styleGlam]:    'Style & Glam Co.',
  [V.castingCraft]: 'Casting Craft Mumbai',
  [V.desertMotors]: 'Desert Motors Dubai',
  [V.coastalLoc]:   'Coastal Locations India',
  [V.oceanProps]:   'Ocean Props & Gear',
  [V.aquaFilm]:     'AquaFilm India',
  [V.indRailways]:  'Indian Railways Coordination',
  [V.blueOcean]:    'Blue Ocean Events',
  [V.medFilm]:      'Medfilm Safety',
};

const now = '2025-04-01T00:00:00Z';

// ─── Projects ────────────────────────────────────────────────────────────────

export const MOCK_PROJECTS: ProjectWithStats[] = [
  {
    id: D1,
    production_house_id: 'ph-1',
    name: 'Dhurandhar 1',
    director: 'Rohit Shetty',
    genre: 'Action',
    status: 'Closed',
    pending: 330_000_000,   // ₹33 Cr — so 33 Cr − 15 Cr available = 18 Cr shortfall
    total_budget: 1_800_000_000,   // ₹180 Cr
    working_budget: 1_800_000_000,
    cover: null,
    created_at: now,
    spent: 2_200_000_000,          // ₹220 Cr
    committed: 500_000_000,
    allocated: 1_650_000_000,
    scene_count: 8,
    wrapped_scenes: 8,
    over_scenes: 1,
    over_budget: 400_000_000,      // 220 − 180 = 40 Cr over
    wallet_balance: 0,
  },
  {
    id: D2,
    production_house_id: 'ph-1',
    name: 'Bhoot Bangla',
    director: 'Rohit Shetty',
    genre: 'Action',
    status: 'Live',
    pending: 150_000_000,
    total_budget: 2_200_000_000,   // ₹220 Cr
    working_budget: 2_200_000_000,
    cover: null,
    created_at: now,
    spent: 2_350_000_000,          // ₹235 Cr — over budget
    committed: 800_000_000,
    allocated: 1_070_000_000,
    scene_count: 6,
    wrapped_scenes: 2,
    over_scenes: 1,
    over_budget: 150_000_000,
    wallet_balance: 500_000_000,
  },
];

// ─── Scenes ──────────────────────────────────────────────────────────────────

const D1_SCENES: SceneWithActual[] = [
  { id: S.d1_01, project_id: D1, num: 'SC-01', name: 'Gateway of India Chase',   location: 'Mumbai', scene_type: 'Exterior · Day',   budget: 150_000_000, status: 'Wrapped',     created_at: now, actual: 85_500_000  },
  { id: S.d1_02, project_id: D1, num: 'SC-02', name: 'Mumbai Port Explosion',    location: 'Mumbai', scene_type: 'Exterior · Night',  budget: 220_000_000, status: 'Wrapped',     created_at: now, actual: 123_000_000 },
  { id: S.d1_03, project_id: D1, num: 'SC-03', name: 'Warehouse Confrontation',  location: 'Mumbai', scene_type: 'Interior · Night',  budget: 80_000_000,  status: 'In Progress', created_at: now, actual: 25_000_000  },
  { id: S.d1_04, project_id: D1, num: 'SC-04', name: 'Dubai Desert Race',         location: 'Dubai',  scene_type: 'Exterior · Day',   budget: 250_000_000, status: 'Wrapped',     created_at: now, actual: 103_000_000 },
  { id: S.d1_05, project_id: D1, num: 'SC-05', name: "Villain's Lair",            location: 'Mumbai', scene_type: 'Interior · Night',  budget: 200_000_000, status: 'In Progress', created_at: now, actual: 0           },
  { id: S.d1_06, project_id: D1, num: 'SC-06', name: 'Hospital Rescue',           location: 'Mumbai', scene_type: 'Interior · Day',   budget: 60_000_000,  status: 'Scheduled',   created_at: now, actual: 0           },
  { id: S.d1_07, project_id: D1, num: 'SC-07', name: 'Final Showdown',            location: 'Mumbai', scene_type: 'Exterior · Night',  budget: 350_000_000, status: 'Scheduled',   created_at: now, actual: 0           },
  { id: S.d1_08, project_id: D1, num: 'SC-08', name: 'Emotional Flashback',       location: 'Mumbai', scene_type: 'Interior · Day',   budget: 40_000_000,  status: 'Draft',       created_at: now, actual: 0           },
];

const D2_SCENES: SceneWithActual[] = [
  { id: S.d2_01, project_id: D2, num: 'SC-01', name: 'Goa Beach Heist',          location: 'Goa',       scene_type: 'Exterior · Day',   budget: 180_000_000, status: 'Wrapped',     created_at: now, actual: 92_000_000  },
  { id: S.d2_02, project_id: D2, num: 'SC-02', name: 'Police HQ Infiltration',   location: 'Mumbai',    scene_type: 'Interior · Night',  budget: 120_000_000, status: 'Wrapped',     created_at: now, actual: 51_500_000  },
  { id: S.d2_03, project_id: D2, num: 'SC-03', name: 'Train Pursuit',            location: 'Rajasthan', scene_type: 'Exterior · Day',   budget: 300_000_000, status: 'In Progress', created_at: now, actual: 45_000_000  },
  { id: S.d2_04, project_id: D2, num: 'SC-04', name: 'Underground Fight Club',   location: 'Mumbai',    scene_type: 'Interior · Night',  budget: 150_000_000, status: 'In Progress', created_at: now, actual: 35_000_000  },
  { id: S.d2_05, project_id: D2, num: 'SC-05', name: 'Climax Bridge Battle',     location: 'Mumbai',    scene_type: 'Exterior · Night',  budget: 400_000_000, status: 'Scheduled',   created_at: now, actual: 0           },
  { id: S.d2_06, project_id: D2, num: 'SC-06', name: 'Epilogue – Team Meeting',  location: 'Mumbai',    scene_type: 'Interior · Day',   budget: 50_000_000,  status: 'Draft',       created_at: now, actual: 0           },
];

export const MOCK_SCENES: Record<string, SceneWithActual[]> = {
  [D1]: D1_SCENES,
  [D2]: D2_SCENES,
};

// ─── Budget Lines ─────────────────────────────────────────────────────────────

function line(id: string, scene_id: string, reason: string, allocated_amount: number, vendor_id: string | null, advance_amount = 0, bill_date: string | null = null): SceneBudgetLine {
  return { id, scene_id, reason, allocated_amount, vendor_id, vendor_name: vendor_id ? VN[vendor_id] ?? null : null, advance_amount, bill_date, created_at: now };
}

const BUDGET_LINES: Record<string, SceneBudgetLine[]> = {
  [S.d1_01]: [
    line('bl-d1-01-1', S.d1_01, 'Location permit & clearances',  15_000_000, null,          0, '2024-10-15'),
    line('bl-d1-01-2', S.d1_01, 'Stunt team & coordinators',     40_000_000, V.actionCrew,  0, '2024-10-20'),
  ],
  [S.d1_02]: [
    line('bl-d1-02-1', S.d1_02, 'VFX & digital effects',              80_000_000, V.vfxPrime,    20_000_000, '2024-11-01'),
    line('bl-d1-02-2', S.d1_02, 'Practical explosives & pyrotechnics', 50_000_000, V.blastFx,     15_000_000, '2024-11-05'),
    line('bl-d1-02-3', S.d1_02, 'Crane & heavy equipment',            30_000_000, V.cineGear,    0,          '2024-11-03'),
    line('bl-d1-02-4', S.d1_02, 'Port location & marine crew',        25_000_000, V.mumbaiLoc,   0,          '2024-11-02'),
    line('bl-d1-02-5', S.d1_02, 'Night shoot crew overtime',          15_000_000, null,           0,          '2024-11-07'),
    line('bl-d1-02-6', S.d1_02, 'Safety & medical team',               8_000_000, V.medFilm,     0,          '2024-11-03'),
  ],
  [S.d1_03]: [
    line('bl-d1-03-1', S.d1_03, 'Warehouse set construction',         25_000_000, V.dreamProps,  8_000_000,  '2025-02-01'),
    line('bl-d1-03-2', S.d1_03, 'Lighting & electrical equipment',    18_000_000, V.cineGear,    0,          '2025-02-05'),
    line('bl-d1-03-3', S.d1_03, 'Fight choreography team',            20_000_000, V.actionCrew,  8_000_000,  '2025-02-03'),
    line('bl-d1-03-4', S.d1_03, 'Costumes & makeup',                   8_000_000, V.styleGlam,   0,          '2025-02-04'),
  ],
  [S.d1_04]: [
    line('bl-d1-04-1', S.d1_04, 'Dubai location & permits',           40_000_000, null,           0,          '2024-12-01'),
    line('bl-d1-04-2', S.d1_04, 'Supercar rentals (15 vehicles)',     60_000_000, V.desertMotors, 20_000_000, '2024-12-05'),
    line('bl-d1-04-3', S.d1_04, 'International stunt team',           50_000_000, V.actionCrew,  15_000_000, '2024-12-03'),
    line('bl-d1-04-4', S.d1_04, 'Drone & aerial cinematography',      30_000_000, V.skyShot,     0,          '2024-12-04'),
    line('bl-d1-04-5', S.d1_04, 'International crew travel & hotels', 40_000_000, V.filmMovers,  0,          '2024-12-02'),
    line('bl-d1-04-6', S.d1_04, 'Catering & on-site logistics',       15_000_000, null,           0,          '2024-12-06'),
  ],
  [S.d1_05]: [
    line('bl-d1-05-1', S.d1_05, 'Set design & construction',          70_000_000, V.dreamProps,  25_000_000, '2025-03-01'),
    line('bl-d1-05-2', S.d1_05, 'VFX integration & pre-viz',          50_000_000, V.vfxPrime,    15_000_000, '2025-03-05'),
    line('bl-d1-05-3', S.d1_05, 'Lighting & atmosphere effects',      30_000_000, V.cineGear,    0,          '2025-03-03'),
    line('bl-d1-05-4', S.d1_05, 'Costume & art direction',            20_000_000, V.styleGlam,   0,          '2025-03-04'),
  ],
  [S.d1_06]: [
    line('bl-d1-06-1', S.d1_06, 'Hospital set dressing',              20_000_000, V.dreamProps,  0,          '2025-05-10'),
    line('bl-d1-06-2', S.d1_06, 'Medical props & equipment',          10_000_000, null,           0,          '2025-05-12'),
    line('bl-d1-06-3', S.d1_06, 'Extras & background artists',        15_000_000, V.castingCraft, 0,          '2025-05-11'),
  ],
  [S.d1_07]: [
    line('bl-d1-07-1', S.d1_07, 'VFX & CG sequences (climax)',       120_000_000, V.vfxPrime,    40_000_000, '2025-07-01'),
    line('bl-d1-07-2', S.d1_07, 'Stunt coordination & wire work',     80_000_000, V.actionCrew,  25_000_000, '2025-07-05'),
    line('bl-d1-07-3', S.d1_07, 'Pyrotechnics & fire effects',        50_000_000, V.blastFx,     15_000_000, '2025-07-03'),
    line('bl-d1-07-4', S.d1_07, 'Set construction & destruction rig', 60_000_000, V.dreamProps,  0,          '2025-07-02'),
    line('bl-d1-07-5', S.d1_07, 'Aerial filming & drone unit',        20_000_000, V.skyShot,     0,          '2025-07-04'),
  ],
  [S.d1_08]: [
    line('bl-d1-08-1', S.d1_08, 'Period costume & styling',           15_000_000, V.styleGlam,   0,          '2025-09-01'),
    line('bl-d1-08-2', S.d1_08, 'Vintage set dressing & props',       10_000_000, V.dreamProps,  0,          '2025-09-02'),
  ],
  [S.d2_01]: [
    line('bl-d2-01-1', S.d2_01, 'Goa beach location & permits',       30_000_000, V.coastalLoc,  0,          '2024-09-10'),
    line('bl-d2-01-2', S.d2_01, 'Boat & marine equipment',            40_000_000, V.oceanProps,  12_000_000, '2024-09-12'),
    line('bl-d2-01-3', S.d2_01, 'Water stunt team',                   35_000_000, V.actionCrew,  10_000_000, '2024-09-11'),
    line('bl-d2-01-4', S.d2_01, 'Underwater camera crew',             30_000_000, V.aquaFilm,    0,          '2024-09-13'),
    line('bl-d2-01-5', S.d2_01, 'Helicopter aerial shots',            25_000_000, V.skyShot,     0,          '2024-09-14'),
  ],
  [S.d2_02]: [
    line('bl-d2-02-1', S.d2_02, 'Police station set construction',    40_000_000, V.dreamProps,  12_000_000, '2024-10-05'),
    line('bl-d2-02-2', S.d2_02, 'Camera & lighting equipment',        25_000_000, V.cineGear,    0,          '2024-10-07'),
    line('bl-d2-02-3', S.d2_02, 'Stunt & action sequences',           30_000_000, V.actionCrew,  10_000_000, '2024-10-06'),
    line('bl-d2-02-4', S.d2_02, 'VFX cleanup & compositing',          15_000_000, V.vfxPrime,    0,          '2024-10-08'),
  ],
  [S.d2_03]: [
    line('bl-d2-03-1', S.d2_03, 'Train & railway location',           50_000_000, V.indRailways, 15_000_000, '2025-01-10'),
    line('bl-d2-03-2', S.d2_03, 'Action & stunt team',                70_000_000, V.actionCrew,  20_000_000, '2025-01-12'),
    line('bl-d2-03-3', S.d2_03, 'Helicopter & drone filming',         40_000_000, V.skyShot,     0,          '2025-01-11'),
    line('bl-d2-03-4', S.d2_03, 'VFX sequences (train)',              80_000_000, V.vfxPrime,    25_000_000, '2025-01-15'),
    line('bl-d2-03-5', S.d2_03, 'Transportation & crew logistics',    30_000_000, V.filmMovers,  0,          '2025-01-13'),
  ],
  [S.d2_04]: [
    line('bl-d2-04-1', S.d2_04, 'Underground set construction',       50_000_000, V.dreamProps,  15_000_000, '2025-02-20'),
    line('bl-d2-04-2', S.d2_04, 'Fight choreography team',            40_000_000, V.actionCrew,  12_000_000, '2025-02-22'),
    line('bl-d2-04-3', S.d2_04, 'Crowd extras (200 people)',          20_000_000, V.castingCraft, 0,          '2025-02-21'),
    line('bl-d2-04-4', S.d2_04, 'Atmosphere lighting & fog effects',  25_000_000, V.cineGear,    0,          '2025-02-23'),
  ],
  [S.d2_05]: [
    line('bl-d2-05-1', S.d2_05, 'Bridge location & structural permits', 30_000_000, V.mumbaiLoc,  0,          '2025-06-01'),
    line('bl-d2-05-2', S.d2_05, 'VFX & CGI (climax sequences)',      150_000_000, V.vfxPrime,    50_000_000, '2025-06-05'),
    line('bl-d2-05-3', S.d2_05, 'Explosive & practical effects',       80_000_000, V.blastFx,    25_000_000, '2025-06-03'),
    line('bl-d2-05-4', S.d2_05, 'Stunt coordination & rigging',        70_000_000, V.actionCrew,  20_000_000, '2025-06-04'),
    line('bl-d2-05-5', S.d2_05, 'Aerial cinematography unit',          30_000_000, V.skyShot,     0,          '2025-06-02'),
    line('bl-d2-05-6', S.d2_05, 'Art direction & set dressing',        20_000_000, V.dreamProps,  0,          '2025-06-01'),
  ],
  [S.d2_06]: [
    line('bl-d2-06-1', S.d2_06, 'Conference room set dressing',       10_000_000, V.dreamProps,  0,          '2025-09-10'),
    line('bl-d2-06-2', S.d2_06, 'Wardrobe & styling',                  5_000_000, V.styleGlam,   0,          '2025-09-11'),
  ],
};

export function getMockBudgetLines(projectId: string, sceneId: string): SceneBudgetLine[] {
  return BUDGET_LINES[sceneId] ?? [];
}

// ─── Bills ────────────────────────────────────────────────────────────────────

function bill(id: string, project_id: string, scene_id: string, vendor_id: string, bill_type: 'Advance' | 'Partial' | 'Final', amount: number, status: 'Pending' | 'Approved' | 'Rejected' | 'Paid', bill_date: string, hasFile = false): Bill {
  return { id, project_id, scene_id, vendor_id, vendor_name: VN[vendor_id] ?? vendor_id, work_order_id: null, bill_type, bill_date, amount, status, file_url: hasFile ? 'bill.pdf' : null, submitted_by: null, rejection_reason: null, created_at: now };
}

const BILLS: Bill[] = [
  // D1 SC-01 — Row 2 (actionCrew): 3 bills with mixed statuses
  bill('b-d1-01-1', D1, S.d1_01, V.actionCrew, 'Partial', 12_000_000, 'Paid',     '2024-11-01', true),
  bill('b-d1-01-2', D1, S.d1_01, V.actionCrew, 'Partial',  8_000_000, 'Rejected', '2024-11-05', true),
  bill('b-d1-01-3', D1, S.d1_01, V.actionCrew, 'Final',   15_000_000, 'Pending',  '2024-11-10', true),
  // D1 SC-02 Wrapped
  bill('b-d1-02-1', D1, S.d1_02, V.vfxPrime,    'Final',   76_000_000, 'Approved',  '2024-12-05'),
  bill('b-d1-02-2', D1, S.d1_02, V.blastFx,     'Final',   47_000_000, 'Paid',      '2024-12-06'),
  // D1 SC-03 In Progress
  bill('b-d1-03-1', D1, S.d1_03, V.dreamProps,  'Advance', 15_000_000, 'Approved',  '2025-02-10'),
  bill('b-d1-03-2', D1, S.d1_03, V.actionCrew,  'Advance', 10_000_000, 'Pending',   '2025-02-12'),
  // D1 SC-04 Wrapped
  bill('b-d1-04-1', D1, S.d1_04, V.desertMotors,'Final',   57_000_000, 'Paid',      '2025-01-10'),
  bill('b-d1-04-2', D1, S.d1_04, V.actionCrew,  'Final',   46_000_000, 'Approved',  '2025-01-11'),
  // D2 SC-01 Wrapped
  bill('b-d2-01-1', D2, S.d2_01, V.oceanProps,  'Final',   37_000_000, 'Paid',      '2024-10-20'),
  bill('b-d2-01-2', D2, S.d2_01, V.actionCrew,  'Final',   32_000_000, 'Approved',  '2024-10-21'),
  bill('b-d2-01-3', D2, S.d2_01, V.skyShot,     'Final',   23_000_000, 'Paid',      '2024-10-22'),
  // D2 SC-02 Wrapped
  bill('b-d2-02-1', D2, S.d2_02, V.dreamProps,  'Final',   37_500_000, 'Approved',  '2024-11-20'),
  bill('b-d2-02-2', D2, S.d2_02, V.vfxPrime,    'Final',   14_000_000, 'Paid',      '2024-11-21'),
  // D2 SC-03 In Progress
  bill('b-d2-03-1', D2, S.d2_03, V.indRailways, 'Advance', 25_000_000, 'Approved',  '2025-01-25'),
  bill('b-d2-03-2', D2, S.d2_03, V.actionCrew,  'Advance', 20_000_000, 'Pending',   '2025-01-28'),
  // D2 SC-04 In Progress
  bill('b-d2-04-1', D2, S.d2_04, V.dreamProps,  'Advance', 20_000_000, 'Approved',  '2025-03-01'),
  bill('b-d2-04-2', D2, S.d2_04, V.actionCrew,  'Advance', 15_000_000, 'Pending',   '2025-03-03'),
];

export function getMockSceneBills(sceneId: string): Bill[] {
  return BILLS.filter(b => b.scene_id === sceneId);
}

export function getMockBills(status?: string): Bill[] {
  if (!status) return BILLS;
  return BILLS.filter(b => b.status === status);
}

// ─── Wallets ─────────────────────────────────────────────────────────────────

function wallet(id: string, balance: number, opts: { ph?: string; project?: string; scene?: string }, txs: { id: string; type: 'credit' | 'debit'; amount: number; description: string; vendor_name?: string; date: string }[]): Wallet {
  return {
    id,
    balance,
    production_house_id: opts.ph ?? null,
    project_id: opts.project ?? null,
    scene_id: opts.scene ?? null,
    transactions: txs.map(t => ({
      id: t.id,
      wallet_id: id,
      type: t.type,
      amount: t.amount,
      description: t.description,
      vendor_name: t.vendor_name ?? null,
      reference_id: null,
      created_at: t.date,
    })),
  };
}

export const PH_WALLET = wallet('w-ph', 500_000_000, { ph: 'ph-1' }, [
  { id: 'wt-ph-1', type: 'credit', amount: 2_000_000_000, description: 'Initial capital injection',     date: '2024-08-01T00:00:00Z' },
  { id: 'wt-ph-2', type: 'credit', amount: 1_500_000_000, description: 'Investor top-up — Series B',    date: '2024-10-15T00:00:00Z' },
  { id: 'wt-ph-3', type: 'debit',  amount: 1_800_000_000, description: 'Dhurandhar 1 — project budget', date: '2024-09-01T00:00:00Z' },
  { id: 'wt-ph-4', type: 'debit',  amount: 1_200_000_000, description: 'Dhurandhar 2 — initial budget', date: '2024-10-20T00:00:00Z' },
]);

export const PROJECT_WALLETS: Record<string, Wallet> = {
  [D1]: wallet('w-d1', 150_000_000, { project: D1 }, [
    { id: 'wt-d1-1', type: 'credit', amount: 1_800_000_000, description: 'Initial budget',                      date: '2024-09-01T00:00:00Z' },
    { id: 'wt-d1-2', type: 'debit',  amount: 130_000_000,  description: 'SC-01 Gateway of India Chase',         date: '2024-10-20T00:00:00Z' },
    { id: 'wt-d1-3', type: 'debit',  amount: 208_000_000,  description: 'SC-02 Mumbai Port Explosion',          date: '2024-11-10T00:00:00Z' },
    { id: 'wt-d1-4', type: 'debit',  amount: 30_000_000,   description: 'SC-03 Warehouse Confrontation (adv)', date: '2025-02-05T00:00:00Z' },
    { id: 'wt-d1-5', type: 'debit',  amount: 235_000_000,  description: 'SC-04 Dubai Desert Race',              date: '2025-01-05T00:00:00Z' },
    { id: 'wt-d1-6', type: 'credit', amount: 3_000_000,    description: 'Dubai shoot — cost recovery',          date: '2025-01-20T00:00:00Z' },
    { id: 'wt-d1-7', type: 'debit',  amount: 100_000_000,  description: 'SC-05 Villain\'s Lair (advance)',      date: '2025-03-01T00:00:00Z' },
    { id: 'wt-d1-8', type: 'credit', amount: 200_000_000,  description: 'Emergency top-up',                     date: '2025-03-15T00:00:00Z' },
  ]),
  [D2]: wallet('w-d2', 0, { project: D2 }, [
    { id: 'wt-d2-1', type: 'credit', amount: 2_200_000_000, description: 'Initial budget',                     date: '2024-10-20T00:00:00Z' },
    { id: 'wt-d2-2', type: 'debit',  amount: 160_000_000,  description: 'SC-01 Goa Beach Heist',               date: '2024-09-20T00:00:00Z' },
    { id: 'wt-d2-3', type: 'debit',  amount: 110_000_000,  description: 'SC-02 Police HQ Infiltration',        date: '2024-10-25T00:00:00Z' },
    { id: 'wt-d2-4', type: 'debit',  amount: 60_000_000,   description: 'SC-03 Train Pursuit (advance)',       date: '2025-01-15T00:00:00Z' },
    { id: 'wt-d2-5', type: 'debit',  amount: 40_000_000,   description: 'SC-04 Underground Fight Club (adv)', date: '2025-02-25T00:00:00Z' },
    { id: 'wt-d2-6', type: 'credit', amount: 500_000_000,  description: 'Co-producer investment',              date: '2025-02-01T00:00:00Z' },
    { id: 'wt-d2-7', type: 'debit',  amount: 2_330_000_000, description: 'Remaining scene disbursements',      date: '2025-03-10T00:00:00Z' },
    { id: 'wt-d2-8', type: 'credit', amount: 300_000_000,  description: 'Over-run top-up',                    date: '2025-03-20T00:00:00Z' },
  ]),
};

const SCENE_WALLET_BALANCES: Record<string, number> = {
  [S.d1_01]: 5_000_000,    // Wrapped
  [S.d1_02]: 3_000_000,    // Wrapped
  [S.d1_03]: 40_000_000,   // In Progress
  [S.d1_04]: 8_000_000,    // Wrapped
  [S.d1_05]: 60_000_000,   // In Progress
  [S.d1_06]: 60_000_000,   // Scheduled
  [S.d1_07]: 350_000_000,  // Scheduled
  [S.d1_08]: 40_000_000,   // Draft
  [S.d2_01]: 2_000_000,    // Wrapped
  [S.d2_02]: 4_000_000,    // Wrapped
  [S.d2_03]: 90_000_000,   // In Progress
  [S.d2_04]: 60_000_000,   // In Progress
  [S.d2_05]: 400_000_000,  // Scheduled
  [S.d2_06]: 50_000_000,   // Draft
};

// ─── Vendors ─────────────────────────────────────────────────────────────────

export const MOCK_VENDORS: Vendor[] = [
  { id: V.actionCrew,   production_house_id: 'ph-1', name: 'Action Crew India',            category: 'Cast & Talent',          email: 'hello@actioncrew.in',          rep_name: 'Rajesh Kumar',     phone: '+91 98765 43210', status: 'Invited', created_at: now },
  { id: V.vfxPrime,     production_house_id: 'ph-1', name: 'Prime VFX Studios',             category: 'VFX & Post Production',  email: 'contact@primevfx.com',         rep_name: 'Ananya Singh',     phone: '+91 87654 32109', status: 'Active', created_at: now },
  { id: V.cineGear,     production_house_id: 'ph-1', name: 'Cine Gear Mumbai',              category: 'Equipment & Machinery',  email: 'info@cinegear.in',             rep_name: 'Vikram Patel',     phone: '+91 76543 21098', status: 'Rejected', created_at: now },
  // { id: V.blastFx,      production_house_id: 'ph-1', name: 'Blast Effects India',           category: 'VFX & Post Production',  email: null,                           rep_name: 'Ravi Sharma',      phone: '+91 65432 10987', status: 'Active', created_at: now },
  // { id: V.dreamProps,   production_house_id: 'ph-1', name: 'Dream Props Studio',            category: 'Art & Set Design',       email: 'props@dreamstudio.in',         rep_name: 'Priya Nair',       phone: '+91 54321 09876', status: 'Active', created_at: now },
  // { id: V.mumbaiLoc,    production_house_id: 'ph-1', name: 'Mumbai Location Services',      category: 'Locations',              email: 'locations@mumbaifm.in',        rep_name: 'Suresh Joshi',     phone: '+91 43210 98765', status: 'Active', created_at: now },
  // { id: V.skyShot,      production_house_id: 'ph-1', name: 'SkyShot Films',                 category: 'Equipment & Machinery',  email: 'sky@skyshotfilms.com',         rep_name: 'Karan Mehra',      phone: null,              status: 'Active', created_at: now },
  // { id: V.filmMovers,   production_house_id: 'ph-1', name: 'Film Movers Pvt Ltd',           category: 'Transportation',         email: 'ops@filmmovers.in',            rep_name: 'Deepak Gupta',     phone: '+91 32109 87654', status: 'Active', created_at: now },
  // { id: V.styleGlam,    production_house_id: 'ph-1', name: 'Style & Glam Co.',              category: 'Costume & Makeup',       email: 'glam@styleglam.in',            rep_name: 'Mira Kapoor',      phone: '+91 21098 76543', status: 'Active', created_at: now },
  // { id: V.castingCraft, production_house_id: 'ph-1', name: 'Casting Craft Mumbai',          category: 'Cast & Talent',          email: null,                           rep_name: 'Asha Verma',       phone: '+91 10987 65432', status: 'Active', created_at: now },
  // { id: V.desertMotors, production_house_id: 'ph-1', name: 'Desert Motors Dubai',           category: 'Transportation',         email: 'fleet@desertmotors.ae',        rep_name: 'Ahmed Al-Rashid',  phone: null,              status: 'Active', created_at: now },
  // { id: V.coastalLoc,   production_house_id: 'ph-1', name: 'Coastal Locations India',       category: 'Locations',              email: null,                           rep_name: 'Vijay Shetty',     phone: '+91 98765 12345', status: 'Active', created_at: now },
  // { id: V.oceanProps,   production_house_id: 'ph-1', name: 'Ocean Props & Gear',            category: 'Art & Set Design',       email: 'ocean@propsgear.in',           rep_name: 'Rohan Pereira',    phone: null,              status: 'Active', created_at: now },
  // { id: V.aquaFilm,     production_house_id: 'ph-1', name: 'AquaFilm India',                category: 'Equipment & Machinery',  email: null,                           rep_name: 'Sailesh Kumar',    phone: '+91 87654 98765', status: 'Active', created_at: now },
  // { id: V.indRailways,  production_house_id: 'ph-1', name: 'Indian Railways Coordination',  category: 'Locations',              email: 'coord@indianrailways.gov.in',  rep_name: 'Arun Iyer',        phone: '+91 11223 34455', status: 'Active', created_at: now },
  // { id: V.blueOcean,    production_house_id: 'ph-1', name: 'Blue Ocean Events',             category: 'Others',                 email: null,                           rep_name: null,               phone: null,              status: 'Active', created_at: now },
  // { id: V.medFilm,      production_house_id: 'ph-1', name: 'Medfilm Safety',                category: 'Security',               email: 'safety@medfilm.in',            rep_name: 'Dr. Samira Bose',  phone: '+91 99887 76655', status: 'Active', created_at: now },
];

export function getMockVendors(): Vendor[] {
  return MOCK_VENDORS;
}

export function getMockSceneWallet(sceneId: string): Wallet {
  const allScenes = [...D1_SCENES, ...D2_SCENES];
  const scene = allScenes.find(s => s.id === sceneId);
  const balance = SCENE_WALLET_BALANCES[sceneId] ?? 0;
  return wallet(`w-scene-${sceneId}`, balance, { scene: sceneId }, [
    { id: `wt-sc-${sceneId}-1`, type: 'credit', amount: scene?.budget ?? balance, description: 'Scene budget allocation', date: '2024-09-15T00:00:00Z' },
    ...(balance < (scene?.budget ?? balance) ? [{
      id: `wt-sc-${sceneId}-2`, type: 'debit' as const, amount: (scene?.budget ?? balance) - balance, description: 'Vendor disbursements', date: '2025-01-01T00:00:00Z'
    }] : []),
  ]);
}
