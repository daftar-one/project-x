export type UserRole = "line_producer" | "executive_producer" | "accounts_manager" | "silent_stakeholder";
export type ProjectStatus = "Draft" | "Scheduled" | "In Progress" | "Live" | "Delayed" | "Wrapped" | "Closed";
export type SceneStatus = "Draft" | "Active" | "Scheduled" | "In Progress" | "Delayed" | "PendingApproval" | "OverBudget" | "Wrapped";
export type SceneType = "Exterior · Day" | "Exterior · Night" | "Interior · Day" | "Interior · Night" | "Exterior · Dawn" | "Interior · Dawn";
export type BillStatus = "Pending" | "Approved" | "Rejected" | "Paid";
export type BillType = "Advance" | "Partial" | "Final";
export type WorkOrderStatus = "Draft" | "Active" | "Closed";
export type OverageStatus = "Pending" | "Approved" | "Rejected";

export interface Collaborator {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole | null;
  is_onboarded: boolean;
}

export interface ProductionHouse {
  id: string;
  name: string;
  logo_url: string | null;
  created_by: string;
  created_at: string;
}

export interface Project {
  id: string;
  production_house_id: string;
  name: string;
  director: string | null;
  genre: string | null;
  status: ProjectStatus;
  total_budget: number;
  working_budget: number;
  cover: string | null;
  created_at: string;
}

export interface ProjectWithStats extends Project {
  spent: number;
  committed: number;
  allocated: number;
  scene_count: number;
  wrapped_scenes: number;
  over_scenes: number;
  pending: number;
  over_budget: number;
  wallet_balance: number;
}

export interface Scene {
  id: string;
  project_id: string;
  num: string;
  name: string;
  location: string | null;
  scene_type: SceneType | null;
  budget: number;
  status: SceneStatus;
  created_at: string;
}

export interface SceneWithActual extends Scene {
  actual: number;
}

export interface Vendor {
  id: string;
  production_house_id: string;
  name: string;
  category: string | null;
  email: string | null;
  rep_name: string | null;
  phone: string | null;
  location?: string | null;
  status: "Active" | "Invited" | "Rejected";
  created_at: string;
}

export interface WorkOrder {
  id: string;
  scene_id: string;
  vendor_id: string;
  vendor_name: string;
  amount: number;
  status: WorkOrderStatus;
  reference_number: string | null;
  vendor_token: string | null;
  created_at: string;
}

export interface Bill {
  id: string;
  project_id: string | null;
  scene_id: string;
  vendor_id: string;
  vendor_name: string;
  work_order_id: string | null;
  bill_type: BillType;
  bill_date: string | null;
  amount: number;
  status: BillStatus;
  file_url: string | null;
  submitted_by: string | null;
  rejection_reason: string | null;
  created_at: string;
}

export interface BillWithVariance extends Bill {
  work_order_amount: number | null;
  variance_pct: number | null;
}

export interface Payment {
  id: string;
  bill_id: string;
  amount: number;
  paid_on: string;
  utr_number: string | null;
  created_at: string;
}

export interface TeamMember {
  id: string;
  project_id: string;
  user_id: string;
  role: string;
  status: "pending" | "accepted";
  user_email: string;
  user_full_name: string | null;
  joined_at: string;
}

export interface AuditTrail {
  id: string;
  scene_id: string;
  action_type: string;
  performed_by: string;
  description: string;
  icon: string | null;
  created_at: string;
}

export interface OverageRequest {
  id: string;
  project_id: string;
  scene_id: string;
  scene_name: string;
  requested_amount: number;
  reason: string | null;
  status: OverageStatus;
  requested_by: string;
  approved_by: string | null;
  created_at: string;
}

export interface SceneSpendItem {
  name: string;
  budget: number;
  actual: number;
}

export interface AnalyticsData {
  scene_spend: SceneSpendItem[];
}

export interface ExpenseTimeline {
  periods: string[];
  planned: number[];
  actual: number[];
}

export type WalletTransactionType = "credit" | "debit";

export interface WalletTransaction {
  id: string;
  wallet_id: string;
  type: WalletTransactionType;
  amount: number;
  description: string | null;
  vendor_name: string | null;
  reference_id: string | null;
  created_at: string;
}

export interface Wallet {
  id: string;
  balance: number;
  production_house_id: string | null;
  project_id: string | null;
  scene_id: string | null;
  transactions: WalletTransaction[];
}

export interface SceneBudgetLine {
  id: string;
  scene_id: string;
  reason: string;
  allocated_amount: number;
  vendor_id: string | null;
  vendor_name: string | null;
  advance_amount: number;
  bill_date: string | null;
  created_at: string;
}
