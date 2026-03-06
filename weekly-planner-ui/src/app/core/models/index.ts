// ── Team Members ─────────────────────────────────────────────────────────────
export interface TeamMember {
  id: string;
  name: string;
  isLead: boolean;
  isActive: boolean;
  createdAt: string;
}

// ── Backlog ───────────────────────────────────────────────────────────────────
export interface BacklogItem {
  id: string;
  title: string;
  description: string;
  category: string;
  categoryId: number;
  estimatedHours: number | null;
  status: string;
  statusId: number;
  createdAt: string;
}

export interface CreateBacklogItemRequest {
  title: string;
  description: string;
  category: number;
  estimatedHours?: number;
}

export interface UpdateBacklogItemRequest {
  title?: string;
  description?: string;
  category?: number;
  estimatedHours?: number;
}

// ── Planning Week ─────────────────────────────────────────────────────────────
export interface PlanningWeek {
  id: string;
  planningDate: string;
  status: string;
  statusId: number;
  clientFocusedPct: number;
  techDebtPct: number;
  rndPct: number;
  createdAt: string;
  members: PlanningWeekMemberInfo[];
}

export interface PlanningWeekMemberInfo {
  memberId: string;
  memberName: string;
  isReady: boolean;
  clientFocusedBudget: number;
  techDebtBudget: number;
  rndBudget: number;
  totalCommitted: number;
}

export interface CreateWeekRequest {
  planningDate: string;
  participatingMemberIds: string[];
  clientFocusedPct: number;
  techDebtPct: number;
  rndPct: number;
}

// ── Work Items ────────────────────────────────────────────────────────────────
export interface WorkItem {
  id: string;
  planningWeekId: string;
  teamMemberId: string;
  memberName: string;
  backlogItemId: string;
  backlogItemTitle: string;
  category: string;
  categoryId: number;
  committedHours: number;
  completedHours: number;
  status: string;
  statusId: number;
}

export interface CreateWorkItemRequest {
  planningWeekId: string;
  teamMemberId: string;
  backlogItemId: string;
  committedHours: number;
}

// ── Progress ──────────────────────────────────────────────────────────────────
export interface UpdateProgressRequest {
  workItemId: string;
  completedHours: number;
  status: number;
  note?: string;
}

export interface ProgressEntry {
  id: string;
  workItemId: string;
  completedHours: number;
  status: string;
  note?: string;
  createdAt: string;
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
export interface TeamDashboard {
  weekId: string;
  planningDate: string;
  overallCompletionPct: number;
  totalTasksDone: number;
  totalTasksBlocked: number;
  totalTasks: number;
  overallCommittedHours: number;
  overallCompletedHours: number;
  categorySummaries: CategorySummary[];
  memberSummaries: MemberSummary[];
}

export interface TaskDetail {
  workItemId: string;
  backlogItemTitle: string;
  category: string;
  committedHours: number;
  completedHours: number;
  status: string;
}

export interface CategorySummary {
  category: string;
  categoryId: number;
  committedHours: number;
  completedHours: number;
  completionPct: number;
  taskCount: number;
  doneCount: number;
  tasks: TaskDetail[];
}

export interface MemberSummary {
  memberId: string;
  memberName: string;
  committedHours: number;
  completedHours: number;
  completionPct: number;
  tasksDone: number;
  tasksBlocked: number;
  totalTasks: number;
  tasks: TaskDetail[];
}