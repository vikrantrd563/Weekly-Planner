import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { UserSessionService } from '../../core/services/user-session.service';

@Component({
  selector: 'app-lead-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  template: `
    <div class="page-container" style="max-width:700px; margin:40px auto;">
      <mat-card style="padding:32px;">
        <h2>👋 Welcome, {{ session.currentUser?.name }}</h2>
        <p style="color:#aaa;">You are the Team Lead</p>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-top:24px;">

          <mat-card style="padding:20px; cursor:pointer;" (click)="go('/team')">
            <h3>👥 Manage Team</h3>
            <p style="color:#aaa; font-size:14px;">Add, edit, or deactivate team members</p>
          </mat-card>

          <mat-card style="padding:20px; cursor:pointer;" (click)="go('/backlog')">
            <h3>📋 Manage Backlog</h3>
            <p style="color:#aaa; font-size:14px;">Add and manage backlog items</p>
          </mat-card>

          <mat-card style="padding:20px; cursor:pointer;" (click)="go('/week/setup')">
            <h3>📅 Set Up Week</h3>
            <p style="color:#aaa; font-size:14px;">Create a new planning week</p>
          </mat-card>

          <mat-card style="padding:20px; cursor:pointer;" (click)="go('/week/review')">
            <h3>🔍 Review & Freeze</h3>
            <p style="color:#aaa; font-size:14px;">Review plans and freeze the week</p>
          </mat-card>

          <mat-card style="padding:20px; cursor:pointer;" (click)="go('/week/dashboard')">
            <h3>📊 Team Dashboard</h3>
            <p style="color:#aaa; font-size:14px;">View team progress and KPIs</p>
          </mat-card>

        </div>
      </mat-card>
    </div>
  `
})
export class LeadHome implements OnInit {
  session = inject(UserSessionService);
  private router = inject(Router);

  ngOnInit(): void {
    if (!this.session.currentUser) this.router.navigate(['/']);
  }

  go(path: string): void {
    this.router.navigate([path]);
  }
}