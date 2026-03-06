import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PlanningService } from '../../core/services/planning.service';
import { UserSessionService } from '../../core/services/user-session.service';
import { PlanningWeek } from '../../core/models';

@Component({
  selector: 'app-review-freeze',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './review-freeze.html',
  styleUrl: './review-freeze.scss'
})
export class ReviewFreeze implements OnInit {

  private planningService = inject(PlanningService);
  private session = inject(UserSessionService);
  protected router = inject(Router);
  private snackBar = inject(MatSnackBar);

  week: PlanningWeek | null = null;
  loading = true;
  freezing = false;

  get allHave30Hours(): boolean {
    return !!this.week && this.week.members.every(m => m.totalCommitted === 30);
  }

  get canFreeze(): boolean {
    return this.allHave30Hours;
  }

  get clientTotal(): number {
    return this.week?.members.reduce((s, m) => s + m.clientFocusedBudget, 0) ?? 0;
  }

  get techTotal(): number {
    return this.week?.members.reduce((s, m) => s + m.techDebtBudget, 0) ?? 0;
  }

  get rndTotal(): number {
    return this.week?.members.reduce((s, m) => s + m.rndBudget, 0) ?? 0;
  }

  get rndPct(): number {
    return this.week?.rndPct ?? 0;
  }

  ngOnInit(): void {
    if (!this.session.isLead) {
      this.router.navigate(['/']);
      return;
    }

    this.planningService.getActive().subscribe({
      next: (week) => {
        this.week = week;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('No active planning week found', 'Close', { duration: 3000 });
        this.loading = false;
        this.router.navigate(['/lead-home']);
      }
    });
  }

  freeze(): void {
    if (!this.week) return;
    this.freezing = true;
    this.planningService.freeze(this.week.id).subscribe({
      next: () => {
        this.snackBar.open('Week frozen! Planning is locked.', 'Close', { duration: 3000 });
        this.router.navigate(['/lead-home']);
      },
      error: (e: any) => {
        this.snackBar.open(e.error?.message || 'Failed to freeze week', 'Close', { duration: 4000 });
        this.freezing = false;
      }
    });
  }

  cancel(): void {
    if (!this.week) return;
    if (!confirm('Cancel this planning week? All work items will be deleted.')) return;
    this.planningService.cancel(this.week.id).subscribe({
      next: () => {
        this.snackBar.open('Week cancelled', 'Close', { duration: 3000 });
        this.router.navigate(['/lead-home']);
      },
      error: (e: any) => {
        this.snackBar.open(e.error?.message || 'Failed to cancel', 'Close', { duration: 3000 });
      }
    });
  }
}