import { Component, inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserSessionService } from '../../core/services/user-session.service';
import { PlanningService } from '../../core/services/planning.service';

@Component({
  selector: 'app-member-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="page-container" style="max-width:700px; margin:40px auto;">
      <mat-card style="padding:32px;">
        <h2>👋 Welcome, {{ session.currentUser?.name }}</h2>
        <p style="color:#aaa;">Team Member</p>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:24px;">

          <mat-card style="padding:20px; cursor:pointer;"
            (click)="go('/week/plan/' + memberId)">
            <h3>📝 Plan My Work</h3>
            <p style="color:#aaa; font-size:14px;">Pick backlog items and commit hours</p>
          </mat-card>

          <mat-card style="padding:20px; cursor:pointer;"
            (click)="go('/progress/' + memberId)">
            <h3>✅ Update Progress</h3>
            <p style="color:#aaa; font-size:14px;">Log hours and update task status</p>
          </mat-card>

          <mat-card style="padding:20px; cursor:pointer;" (click)="go('/backlog')">
            <h3>📋 View Backlog</h3>
            <p style="color:#aaa; font-size:14px;">Browse all backlog items</p>
          </mat-card>

          <mat-card style="padding:20px; cursor:pointer;" (click)="goToDashboard()">
            <h3>📊 Team Dashboard</h3>
            <p style="color:#aaa; font-size:14px;">View team progress</p>
          </mat-card>

          <mat-card style="padding:20px; cursor:pointer;" (click)="go('/past-weeks')">
            <h3>📁 Past Weeks</h3>
            <p style="color:#aaa; font-size:14px;">View history of completed weeks</p>
          </mat-card>

        </div>
      </mat-card>
    </div>
  `
})
export class MemberHome implements OnInit {
  session = inject(UserSessionService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private planningService = inject(PlanningService);
  memberId = '';

  ngOnInit(): void {
    if (!this.session.currentUser) {
      this.router.navigate(['/']);
      return;
    }
    this.memberId = this.route.snapshot.paramMap.get('id') ?? '';
  }

  go(path: string): void {
    this.router.navigate([path]);
  }

  goToDashboard(): void {
    this.planningService.getActive().subscribe({
      next: (week: any) => {
        this.router.navigate(['/dashboard', week.id]);
      },
      error: () => {
        this.router.navigate(['/past-weeks']);
      }
    });
  }
}