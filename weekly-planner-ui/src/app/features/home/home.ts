import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamMemberService } from '../../core/services/team-member.service';
import { UserSessionService } from '../../core/services/user-session.service';
import { TeamMember } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatProgressSpinnerModule],
  template: `
    <div class="page-container" style="max-width:600px; margin:60px auto;">
      <mat-card style="padding:32px; text-align:center;">
        <h1 style="margin-bottom:8px;">📋 Weekly Plan Tracker</h1>
        <p style="color:#aaa; margin-bottom:32px;">Who are you?</p>

        @if (loading) {
          <mat-spinner style="margin:0 auto;"></mat-spinner>
        }

        @if (!loading && members.length === 0) {
          <p style="color:#aaa;">No team members found. Add members via the Team page.</p>
          <button mat-raised-button color="primary" (click)="goToTeam()">
            Manage Team
          </button>
        }

        <div style="display:flex; flex-direction:column; gap:12px;">
          @for (member of members; track member.id) {
            <button
              mat-raised-button
              [color]="member.isLead ? 'accent' : 'primary'"
              style="padding:16px; font-size:16px;"
              (click)="selectUser(member)">
              {{ member.name }}
              @if (member.isLead) { <span> ⭐ Lead</span> }
            </button>
          }
        </div>
      </mat-card>
    </div>
  `
})
export class Home implements OnInit {
  private teamService = inject(TeamMemberService);
  private session = inject(UserSessionService);
  private router = inject(Router);

  members: TeamMember[] = [];
  loading = true;

  ngOnInit(): void {
    this.teamService.getAll().subscribe({
      next: res => {
        this.members = res.filter(m => m.isActive);
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  selectUser(member: TeamMember): void {
    this.session.setUser(member);
    if (member.isLead) this.router.navigate(['/lead-home']);
    else this.router.navigate(['/member-home', member.id]);
  }

  goToTeam(): void {
    this.router.navigate(['/team']);
  }
}