import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { PlanningService } from '../../core/services/planning.service';
import { WorkItemService } from '../../core/services/work-item.service';
import { BacklogService } from '../../core/services/backlog.service';
import { PlanningWeek, WorkItem, BacklogItem } from '../../core/models';

@Component({
  selector: 'app-plan-my-work',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatInputModule,
    MatChipsModule
  ],
  templateUrl: './plan-my-work.html',
  styleUrl: './plan-my-work.scss'
})
export class PlanMyWork implements OnInit {

  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private planningService = inject(PlanningService);
  private workItemService = inject(WorkItemService);
  private backlogService = inject(BacklogService);
  private snackBar = inject(MatSnackBar);

  memberId = '';
  week: PlanningWeek | null = null;
  myWorkItems: WorkItem[] = [];
  availableBacklog: BacklogItem[] = [];

  loading = false;
  submitting = false;

  selectedBacklogId = '';
  committedHours = 4;

  // ─────────────────────────────────────────────
  // BUDGET CALCULATIONS
  // ─────────────────────────────────────────────

  get totalCommitted(): number {
    return this.myWorkItems.reduce((s, w) => s + w.committedHours, 0);
  }

  get clientBudget(): number {
    if (!this.week) return 0;
    const m = this.week.members.find(x => x.memberId === this.memberId);
    return m?.clientFocusedBudget ?? 0;
  }

  get techBudget(): number {
    if (!this.week) return 0;
    const m = this.week.members.find(x => x.memberId === this.memberId);
    return m?.techDebtBudget ?? 0;
  }

  get rndBudget(): number {
    if (!this.week) return 0;
    const m = this.week.members.find(x => x.memberId === this.memberId);
    return m?.rndBudget ?? 0;
  }

  get clientUsed(): number {
    return this.myWorkItems
      .filter(w => w.categoryId === 1)
      .reduce((s, w) => s + w.committedHours, 0);
  }

  get techUsed(): number {
    return this.myWorkItems
      .filter(w => w.categoryId === 2)
      .reduce((s, w) => s + w.committedHours, 0);
  }

  get rndUsed(): number {
    return this.myWorkItems
      .filter(w => w.categoryId === 3)
      .reduce((s, w) => s + w.committedHours, 0);
  }

  get canMarkReady(): boolean {
    return this.totalCommitted === 30;
  }

  // ─────────────────────────────────────────────
  // LIFECYCLE
  // ─────────────────────────────────────────────

  ngOnInit(): void {
    this.memberId = this.route.snapshot.paramMap.get('memberId') ?? '';
    this.loading = true;

    this.planningService.getActive().subscribe({
      next: (week) => {
        this.week = week;
        this.loadMyItems();
        this.loadBacklog();
      },
      error: () => {
        this.snackBar.open('No active planning week found', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadMyItems(): void {
    if (!this.week) return;

    this.workItemService.getByWeekAndMember(this.week.id, this.memberId)
      .subscribe({
        next: (items) => {
          this.myWorkItems = items;
          this.loading = false;
        }
      });
  }

  loadBacklog(): void {
    this.backlogService.getAll('available').subscribe({
      next: (items) => {
        this.availableBacklog = items;
      }
    });
  }

  // ─────────────────────────────────────────────
  // ACTIONS
  // ─────────────────────────────────────────────

  addItem(): void {
    if (!this.week || !this.selectedBacklogId || this.committedHours < 1)
      return;

    this.submitting = true;

    this.workItemService.add({
      planningWeekId: this.week.id,
      teamMemberId: this.memberId,
      backlogItemId: this.selectedBacklogId,
      committedHours: this.committedHours
    }).subscribe({
      next: () => {
        this.snackBar.open('Item added!', 'Close', { duration: 2000 });
        this.selectedBacklogId = '';
        this.committedHours = 4;
        this.submitting = false;
        this.loadMyItems();
      },
      error: (e: any) => {
        this.snackBar.open(e.error?.message || 'Failed to add item', 'Close', { duration: 4000 });
        this.submitting = false;
      }
    });
  }

  removeItem(id: string): void {
    this.workItemService.remove(id).subscribe({
      next: () => {
        this.snackBar.open('Item removed', 'Close', { duration: 2000 });
        this.loadMyItems();
      },
      error: (e: any) => {
        this.snackBar.open(e.error?.message || 'Failed to remove', 'Close', { duration: 3000 });
      }
    });
  }

  markReady(): void {
    if (!this.week) return;

    this.workItemService.markReady(this.week.id, this.memberId)
      .subscribe({
        next: () => {
          this.snackBar.open('Marked as ready!', 'Close', { duration: 3000 });
          this.router.navigate(['/member-home', this.memberId]);
        },
        error: (e: any) => {
          this.snackBar.open(e.error?.message || 'Failed to mark ready', 'Close', { duration: 3000 });
        }
      });
  }

  getCategoryClass(categoryId: number): string {
    switch (categoryId) {
      case 1: return 'chip-client';
      case 2: return 'chip-techdebt';
      case 3: return 'chip-rnd';
      default: return '';
    }
  }
}