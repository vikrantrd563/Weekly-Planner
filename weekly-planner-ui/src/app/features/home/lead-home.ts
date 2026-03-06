import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserSessionService } from '../../core/services/user-session.service';
import { PlanningService } from '../../core/services/planning.service';

@Component({
  selector: 'app-lead-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width:720px;margin:0 auto;padding:32px 24px;">

      <h2 style="font-size:26px;font-weight:700;margin:0 0 4px 0;">What do you want to do?</h2>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:28px;">
        <span style="color:#94a3b8;font-size:15px;">Hi, {{ session.currentUser?.name }}!</span>
        <span style="background:#d97706;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;">Team Lead</span>
      </div>

      @if (activeWeekStatus) {
        <div style="background:#1e3a5f;border:1px solid #2563eb;border-radius:8px;padding:12px 16px;margin-bottom:24px;color:#93c5fd;font-size:14px;">
          Active week — Status: <strong>{{ activeWeekStatus }}</strong>
        </div>
      } @else {
        <div style="background:#1e2433;border:1px solid #2e3a4e;border-radius:8px;padding:12px 16px;margin-bottom:24px;color:#94a3b8;font-size:14px;">
          No planning weeks yet. Click "Start a New Week" to begin!
        </div>
      }

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">

        <div class="action-card" (click)="go('/week/setup')">
          <div style="font-size:20px;margin-bottom:6px;">🚀</div>
          <div style="font-weight:600;font-size:15px;">Start a New Week</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Set up a new planning cycle.</div>
        </div>

        <div class="action-card" (click)="go('/week/plan/' + leadId)">
          <div style="font-size:20px;margin-bottom:6px;">📝</div>
          <div style="font-weight:600;font-size:15px;">Plan My Work</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Pick backlog items and commit hours.</div>
        </div>

        <div class="action-card" (click)="go('/week/review')">
          <div style="font-size:20px;margin-bottom:6px;">❄️</div>
          <div style="font-weight:600;font-size:15px;">Review and Freeze</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Check everyone's hours and lock the plan.</div>
        </div>

        <div class="action-card" (click)="go('/progress/' + leadId)">
          <div style="font-size:20px;margin-bottom:6px;">✏️</div>
          <div style="font-weight:600;font-size:15px;">Update My Progress</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Report hours and status on your tasks.</div>
        </div>

        <div class="action-card" (click)="goToDashboard()">
          <div style="font-size:20px;margin-bottom:6px;">📊</div>
          <div style="font-weight:600;font-size:15px;">See Team Progress</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Check how the team is doing.</div>
        </div>

        <div class="action-card" (click)="go('/backlog')">
          <div style="font-size:20px;margin-bottom:6px;">📋</div>
          <div style="font-weight:600;font-size:15px;">Manage Backlog</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Add, edit, or browse work items.</div>
        </div>

        <div class="action-card" (click)="go('/team')">
          <div style="font-size:20px;margin-bottom:6px;">👥</div>
          <div style="font-weight:600;font-size:15px;">Manage Team Members</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Add or remove team members.</div>
        </div>

        <div class="action-card" (click)="go('/past-weeks')">
          <div style="font-size:20px;margin-bottom:6px;">📅</div>
          <div style="font-weight:600;font-size:15px;">View Past Weeks</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Look at completed planning cycles.</div>
        </div>

      </div>
    </div>
  `
})
export class LeadHome implements OnInit {
  session = inject(UserSessionService);
  private router = inject(Router);
  private planningService = inject(PlanningService);
  leadId = '';
  activeWeekStatus = '';

  ngOnInit(): void {
    if (!this.session.currentUser) this.router.navigate(['/']);
    this.leadId = this.session.currentUser?.id ?? '';
    this.planningService.getActive().subscribe({
      next: (week: any) => this.activeWeekStatus = week.status,
      error: () => this.activeWeekStatus = ''
    });
  }

  go(path: string): void { this.router.navigate([path]); }

  goToDashboard(): void {
    this.planningService.getActive().subscribe({
      next: (week: any) => this.router.navigate(['/dashboard', week.id]),
      error: () => this.router.navigate(['/past-weeks'])
    });
  }
}