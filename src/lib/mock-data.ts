import type { ProjectWithStats, SceneWithActual, SceneBudgetLine, Bill, Wallet, Vendor } from './types';
import type { WalletCredit } from '@/components/shared/transaction-history';

// ─── IDs ──────────────────────────────────────────────────────────────────────

export const PROJECT_IDS = { D1: 'tvf-pitchers', D2: 'permanent-roommates' };

// Scene IDs whose budgets are pre-locked (but not yet wrapped)
export const MOCK_LOCKED_SCENE_IDS: ReadonlySet<string> = new Set(['d2-sc-01']);

const D1 = PROJECT_IDS.D1;
const D2 = PROJECT_IDS.D2;

const S = {
  d1_01: 'd1-sc-01', d1_02: 'd1-sc-02',
  d2_01: 'd2-sc-01', d2_02: 'd2-sc-02',
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
  pacificFx:     'v-pacific-fx',
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
  [V.pacificFx]:    'Pacific FX Inc.',
};

const now = '2026-05-15T00:00:00Z';

// ─── Projects ────────────────────────────────────────────────────────────────

export const MOCK_PROJECTS: ProjectWithStats[] = [
  {
    id: D1,
    production_house_id: 'ph-1',
    name: 'TVF Pitchers',
    director: 'Rohit Shetty',
    genre: 'Drama',
    status: 'Live',
    currency: 'INR',
    pending: 15_000_000,       // b-d1-01-3 Pending only (SC-02 all Paid)
    total_budget: 248_000_000, // SC-01 (40M) + SC-02 (208M)
    working_budget: 248_000_000,
    cover: null,
    created_at: now,
    spent: 187_000_000,        // SC-01 (12M) + SC-02 (175M all paid)
    committed: 0,
    allocated: 187_000_000,
    scene_count: 2,
    wrapped_scenes: 1,         // Only SC-02 is Wrapped
    over_scenes: 1,            // SC-01 is over budget
    over_budget: 5_000_000,
    wallet_balance: 61_000_000,
  },
  {
    id: D2,
    production_house_id: 'ph-1',
    name: 'Permanent Roommates',
    director: 'Rohit Shetty',
    genre: 'Romantic Comedy',
    status: 'Live',
    currency: 'INR',
    pending: 77_000_000,        // SC-01 (25M+20M) + SC-02 (20M+12M) Pending bills
    total_budget: 270_000_000,  // SC-01 (160M) + SC-02 (110M) scene budgets
    working_budget: 230_000_000,
    cover: null,
    created_at: now,
    spent: 92_000_000,          // Only SC-01 fully spent (Wrapped); SC-02 is Live
    committed: 69_500_000,      // Approved bills (SC-01: 32M, SC-02: 37.5M)
    allocated: 143_500_000,
    scene_count: 2,
    wrapped_scenes: 1,          // Only SC-01 is Wrapped
    over_scenes: 0,
    over_budget: 0,
    wallet_balance: 126_500_000,
  },
];

// ─── Scenes ──────────────────────────────────────────────────────────────────

const D1_SCENES: SceneWithActual[] = [
  { id: S.d1_01, project_id: D1, num: 'SC-01', name: 'The Resignation Pact', location: 'Mumbai', scene_type: 'Exterior · Day',  budget: 40_000_000,  status: 'Live',    created_at: now, actual: 12_000_000  },
  { id: S.d1_02, project_id: D1, num: 'SC-02', name: 'Investor Meeting Gone Wrong',  location: 'Mumbai', scene_type: 'Exterior · Night', budget: 208_000_000, status: 'Wrapped', created_at: now, actual: 123_000_000 },
];

const D2_SCENES: SceneWithActual[] = [
  { id: S.d2_01, project_id: D2, num: 'SC-01', name: 'The Marriage Ultimatum',        location: 'Goa',    scene_type: 'Exterior · Day',  budget: 160_000_000, status: 'Live',    created_at: now, actual: 92_000_000  },
  { id: S.d2_02, project_id: D2, num: 'SC-02', name: 'Tanya meets Mikesh’s Family', location: 'Mumbai', scene_type: 'Interior · Night', budget: 110_000_000, status: 'Wrapped', created_at: now, actual: 51_500_000  },
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
  // D1 SC-01: location permit removed; only stunt team remains
  [S.d1_01]: [
    line('bl-d1-01-2', S.d1_01, 'Stunt team & coordinators', 40_000_000, V.actionCrew, 0, '2026-04-20'),
  ],
  [S.d1_02]: [
    line('bl-d1-02-1', S.d1_02, 'VFX & digital effects',               80_000_000, V.vfxPrime, 20_000_000, '2026-04-01'),
    line('bl-d1-02-2', S.d1_02, 'Practical explosives & pyrotechnics', 50_000_000, V.blastFx,  15_000_000, '2026-04-05'),
    line('bl-d1-02-5', S.d1_02, 'Night shoot crew overtime',           15_000_000, null,        0,          '2026-04-07'),
  ],
  [S.d2_01]: [
    line('bl-d2-01-1', S.d2_01, 'Goa beach location & permits',  30_000_000, V.coastalLoc, 0,          '2026-04-10'),
    line('bl-d2-01-2', S.d2_01, 'Boat & marine equipment',        40_000_000, V.oceanProps, 12_000_000, '2026-04-12'),
    line('bl-d2-01-3', S.d2_01, 'Water stunt team',               35_000_000, V.actionCrew, 10_000_000, '2026-04-11'),
    line('bl-d2-01-4', S.d2_01, 'Underwater camera crew',         30_000_000, V.aquaFilm,   0,          '2026-04-13'),
    line('bl-d2-01-5', S.d2_01, 'Helicopter aerial shots',        25_000_000, V.skyShot,    0,          '2026-04-14'),
  ],
  [S.d2_02]: [
    line('bl-d2-02-1', S.d2_02, 'Police station set construction', 40_000_000, V.dreamProps, 12_000_000, '2026-04-05'),
    line('bl-d2-02-2', S.d2_02, 'Camera & lighting equipment',     25_000_000, V.cineGear,   0,          '2026-04-07'),
    line('bl-d2-02-3', S.d2_02, 'Stunt & action sequences',        30_000_000, V.actionCrew, 10_000_000, '2026-04-06'),
    line('bl-d2-02-4', S.d2_02, 'VFX cleanup & compositing',       15_000_000, null,         0,          '2026-04-08'),
    line('bl-d2-02-5', S.d2_02, 'International VFX consultation',  12_615_000, V.pacificFx,  0,          '2026-04-09'),
  ],
};

export function getMockBudgetLines(projectId: string, sceneId: string): SceneBudgetLine[] {
  return BUDGET_LINES[sceneId] ?? [];
}

// ─── Bills ────────────────────────────────────────────────────────────────────

function bill(id: string, project_id: string, scene_id: string, vendor_id: string, bill_type: 'Advance' | 'Partial' | 'Final', amount: number, status: 'Pending' | 'Approved' | 'Rejected' | 'Paid', bill_date: string, hasFile = true, currency = 'INR', exchange_rate = 1): Bill {
  return { id, project_id, scene_id, vendor_id, vendor_name: VN[vendor_id] ?? vendor_id, work_order_id: null, bill_type, bill_date, amount, currency, exchange_rate, status, file_url: hasFile ? 'bill.pdf' : null, submitted_by: null, rejection_reason: null, created_at: now };
}

const BILLS: Bill[] = [
  // D1 SC-01 — stunt team (actionCrew): 3 bills
  bill('b-d1-01-1', D1, S.d1_01, V.actionCrew, 'Partial', 129_032, 'Paid',     '2026-04-01', true, 'USD', 93),
  bill('b-d1-01-2', D1, S.d1_01, V.actionCrew, 'Partial',  8_000_000, 'Rejected', '2026-04-05'),
  bill('b-d1-01-3', D1, S.d1_01, V.actionCrew, 'Final',   15_000_000, 'Pending',  '2026-04-10'),
  // D1 SC-02 Wrapped — VFX has 2 rejected submissions before final; blastFx paid
  bill('b-d1-02-1r1', D1, S.d1_02, V.vfxPrime, 'Partial', 30_000_000, 'Rejected', '2026-04-10'),
  bill('b-d1-02-1r2', D1, S.d1_02, V.vfxPrime, 'Partial', 25_000_000, 'Rejected', '2026-04-20'),
  bill('b-d1-02-1',   D1, S.d1_02, V.vfxPrime, 'Final',   76_000_000, 'Paid',     '2026-04-25'),
  bill('b-d1-02-2',   D1, S.d1_02, V.blastFx,  'Final',   56_000_000, 'Paid',     '2026-04-26'),
  // D2 SC-01 Wrapped
  bill('b-d2-01-1', D2, S.d2_01, V.coastalLoc, 'Partial', 25_000_000, 'Pending',  '2026-04-18'),
  bill('b-d2-01-2', D2, S.d2_01, V.oceanProps,  'Final',   37_000_000, 'Paid',     '2026-04-20'),
  bill('b-d2-01-3', D2, S.d2_01, V.actionCrew,  'Final',   32_000_000, 'Approved', '2026-04-21'),
  bill('b-d2-01-4', D2, S.d2_01, V.aquaFilm,    'Final',   23_000_000, 'Paid',     '2026-04-22'),
  bill('b-d2-01-5', D2, S.d2_01, V.skyShot,     'Partial', 20_000_000, 'Pending',  '2026-04-23'),
  // D2 SC-02 Wrapped
  bill('b-d2-02-1', D2, S.d2_02, V.dreamProps,  'Final',   37_500_000, 'Approved', '2026-04-20'),
  bill('b-d2-02-2', D2, S.d2_02, V.cineGear,    'Partial', 20_000_000, 'Paid',     '2026-04-22'),
  bill('b-d2-02-3', D2, S.d2_02, V.actionCrew,  'Final',   14_000_000, 'Paid',     '2026-04-21'),
  bill('b-d2-02-4', D2, S.d2_02, V.vfxPrime,    'Partial', 12_000_000, 'Pending',  '2026-04-23'),
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
  { id: 'wt-ph-1', type: 'credit', amount: 2_000_000_000, description: 'Initial capital injection',     date: '2026-04-01T00:00:00Z' },
  { id: 'wt-ph-2', type: 'credit', amount: 1_500_000_000, description: 'Investor top-up — Series B',    date: '2026-04-15T00:00:00Z' },
  { id: 'wt-ph-3', type: 'debit',  amount:   260_000_000, description: 'TVF Pitchers — project budget', date: '2026-04-05T00:00:00Z' },
  { id: 'wt-ph-4', type: 'debit',  amount:   300_000_000, description: 'Permanent Roommates — initial budget',  date: '2026-04-20T00:00:00Z' },
]);

export const PROJECT_WALLETS: Record<string, Wallet> = {
  [D1]: wallet('w-d1', 113_000_000, { project: D1 }, [
    { id: 'wt-d1-1', type: 'credit', amount: 260_000_000, description: 'Initial budget',               date: '2026-04-05T00:00:00Z' },
    { id: 'wt-d1-2', type: 'debit',  amount:  40_000_000, description: 'SC-01 The Resignation Pact', date: '2026-04-20T00:00:00Z' },
    { id: 'wt-d1-3', type: 'debit',  amount:  95_000_000, description: 'SC-02 Investor Meeting Gone Wrong',  date: '2026-04-25T00:00:00Z' },
  ]),
  [D2]: wallet('w-d2', 126_500_000, { project: D2 }, [
    { id: 'wt-d2-1', type: 'credit', amount: 300_000_000, description: 'Initial budget',               date: '2026-04-20T00:00:00Z' },
    { id: 'wt-d2-2', type: 'debit',  amount:  92_000_000, description: 'SC-01 The Marriage Ultimatum',        date: '2026-04-10T00:00:00Z' },
    { id: 'wt-d2-3', type: 'debit',  amount:  51_500_000, description: 'SC-02 Tanya meets Mikesh’s Family', date: '2026-04-25T00:00:00Z' },
  ]),
};

const SCENE_WALLET_BALANCES: Record<string, number> = {
  [S.d1_01]: 28_000_000,  // 40M budget − 12M actual
  [S.d1_02]: 82_000_000,  // Wrapped
  [S.d2_01]: 68_000_000,  // Wrapped
  [S.d2_02]: 58_500_000,  // Wrapped
};

// ─── Vendors ─────────────────────────────────────────────────────────────────

export const MOCK_VENDORS: Vendor[] = [
  { id: V.actionCrew,   production_house_id: 'ph-1', name: 'Action Crew India',   category: 'Cast & Talent',         email: 'hello@actioncrew.in',  rep_name: 'Rajesh Kumar',  phone: '+91 98765 43210', status: 'Invited',  created_at: now },
  { id: V.vfxPrime,     production_house_id: 'ph-1', name: 'Prime VFX Studios',   category: 'VFX & Post Production', email: 'contact@primevfx.com', rep_name: 'Ananya Singh',  phone: '+91 87654 32109', status: 'Active',   location: 'Andheri West, Mumbai', created_at: now },
  { id: V.cineGear,     production_house_id: 'ph-1', name: 'Cine Gear Mumbai',    category: 'Equipment & Machinery', email: 'info@cinegear.in',     rep_name: 'Vikram Patel',  phone: '+91 76543 21098', status: 'Active',   location: 'Bandra, Mumbai', created_at: now },
  { id: V.pacificFx,    production_house_id: 'ph-1', name: 'Pacific FX Inc.',     category: 'VFX & Post Production', email: 'hello@pacificfx.com',  rep_name: 'Jason Miller',  phone: '+1 310 555 0192', status: 'Active',   location: 'Los Angeles, USA', created_at: now },
];

export function getMockVendors(): Vendor[] {
  return MOCK_VENDORS;
}

// ─── Scene Wallet Credit History ─────────────────────────────────────────────

const SCENE_WALLET_CREDITS: Record<string, WalletCredit[]> = {
  [S.d1_01]: [
    { id: 'wc-d1-01-1', amount: 40_000_000, createdAt: '2026-04-10T09:30:00Z', addedBy: 'Arjun Mehta' },
  ],
  [S.d1_02]: [
    { id: 'wc-d1-02-1', amount: 150_000_000, createdAt: '2026-04-11T10:00:00Z', addedBy: 'Arjun Mehta' },
    { id: 'wc-d1-02-2', amount:  70_000_000, createdAt: '2026-04-12T14:15:00Z', addedBy: 'Priya Kapoor' },
  ],
  [S.d2_01]: [
    { id: 'wc-d2-01-1', amount: 120_000_000, createdAt: '2026-04-02T11:00:00Z', addedBy: 'Arjun Mehta' },
    { id: 'wc-d2-01-2', amount:  60_000_000, createdAt: '2026-04-05T09:45:00Z', addedBy: 'Priya Kapoor' },
  ],
  [S.d2_02]: [
    { id: 'wc-d2-02-1', amount:  80_000_000, createdAt: '2026-04-06T10:30:00Z', addedBy: 'Arjun Mehta' },
    { id: 'wc-d2-02-2', amount:  40_000_000, createdAt: '2026-04-10T16:00:00Z', addedBy: 'Nisha Patel' },
  ],
};

export function getMockSceneWalletCredits(sceneId: string): WalletCredit[] {
  return SCENE_WALLET_CREDITS[sceneId] ?? [];
}

export function getMockSceneWallet(sceneId: string): Wallet {
  const allScenes = [...D1_SCENES, ...D2_SCENES];
  const scene = allScenes.find(s => s.id === sceneId);
  const balance = SCENE_WALLET_BALANCES[sceneId] ?? 0;
  return wallet(`w-scene-${sceneId}`, balance, { scene: sceneId }, [
    { id: `wt-sc-${sceneId}-1`, type: 'credit', amount: scene?.budget ?? balance, description: 'Scene budget allocation', date: '2026-04-07T00:00:00Z' },
    ...(balance < (scene?.budget ?? balance) ? [{
      id: `wt-sc-${sceneId}-2`, type: 'debit' as const, amount: (scene?.budget ?? balance) - balance, description: 'Vendor disbursements', date: '2026-05-01T00:00:00Z'
    }] : []),
  ]);
}
