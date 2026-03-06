import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserSessionService } from '../../core/services/user-session.service';
import { PlanningService } from '../../core/services/planning.service';

@Component({
  selector: 'app-member-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width:720px;margin:0 auto;padding:32px 24px;">

      <h2 style="font-size:26px;font-weight:700;margin:0 0 4px 0;">What do you want to do?</h2>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:28px;">
        <span style="color:#94a3b8;font-size:15px;">Hi, {{ session.currentUser?.name }}!</span>
        <span style="background:#0d9488;color:#fff;font-size:11px;font-weight:700;padding:2px 8px;border-radius:4px;">Team Member</span>
      </div>

      @if (activeWeekStatus) {
        <div style="background:#1e3a5f;border:1px solid #2563eb;border-radius:8px;padding:12px 16px;margin-bottom:24px;color:#93c5fd;font-size:14px;">
          Active week — Status: <strong>{{ activeWeekStatus }}</strong>
        </div>
      } @else {
        <div style="background:#1e2433;border:1px solid #2e3a4e;border-radius:8px;padding:12px 16px;margin-bottom:24px;color:#94a3b8;font-size:14px;">
          There's no active plan for you right now. Check back on Tuesday or ask your Team Lead.
        </div>
      }

      <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">

        <div class="action-card" (click)="go('/week/plan/' + memberId)">
          <div style="font-size:20px;margin-bottom:6px;">📝</div>
          <div style="font-weight:600;font-size:15px;">Plan My Work</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Pick backlog items and commit your 30 hours.</div>
        </div>

        <div class="action-card" (click)="go('/progress/' + memberId)">
          <div style="font-size:20px;margin-bottom:6px;">✏️</div>
          <div style="font-weight:600;font-size:15px;">Update My Progress</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Report hours and status on your tasks.</div>
        </div>

        <div class="action-card" (click)="goToDashboard()">
          <div style="font-size:20px;margin-bottom:6px;">📊</div>
          <div style="font-weight:600;font-size:15px;">See Team Progress</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">See how the team is doing overall.</div>
        </div>

        <div class="action-card" (click)="go('/backlog')">
          <div style="font-size:20px;margin-bottom:6px;">📋</div>
          <div style="font-weight:600;font-size:15px;">View Backlog</div>
          <div style="color:#94a3b8;font-size:13px;margin-top:4px;">Browse all backlog items.</div>
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
export class MemberHome implements OnInit {
  session = inject(UserSessionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private planningService = inject(PlanningService);
  memberId = '';
  activeWeekStatus = '';

  ngOnInit() {
    if (!this.session.currentUser) { this.router.navigate(['/']); return; }
    this.memberId = this.route.snapshot.paramMap.get('id') ?? '';
    this.planningService.getActive().subscribe({
      next: (week: any) => this.activeWeekStatus = week.status,
      error: () => this.activeWeekStatus = ''
    });
  }

  go(path: string) { this.router.navigate([path]); }

  goToDashboard() {
    this.planningService.getActive().subscribe({
      next: (week: any) => this.router.navigate(['/dashboard', week.id]),
      error: () => this.router.navigate(['/past-weeks'])
    });
  }
}