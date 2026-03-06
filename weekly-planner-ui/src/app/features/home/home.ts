import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserSessionService } from '../../core/services/user-session.service';
import { TeamMemberService } from '../../core/services/team-member.service';
import { TeamMember } from '../../core/models';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="min-height:100vh;display:flex;flex-direction:column;
                align-items:center;justify-content:center;padding:24px">
      <div style="max-width:640px;width:100%">

        <div style="text-align:center;margin-bottom:40px">
          <h1 style="font-size:32px;font-weight:700;margin:0 0 8px 0">
            What do you want to do?
          </h1>
          <p style="color:#94a3b8;margin:0;font-size:15px">
            Click your name to get started
          </p>
        </div>

        @if (loading) {
          <p style="text-align:center;color:#94a3b8">Loading team...</p>
        } @else if (members.length === 0) {
          <div style="text-align:center;background:#1e2433;border:1px solid #2e3a4e;
                      border-radius:12px;padding:32px;color:#94a3b8">
            No team members found.
            <br><br>
            <p style="color:#94a3b8;margin:0">Redirecting to setup...</p>
          </div>
        } @else {
          <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:16px">
            @for (member of members; track member.id) {
              <div (click)="select(member)"
                style="background:#1e2433;border:1px solid #2e3a4e;border-radius:12px;
                       padding:24px 20px;text-align:center;cursor:pointer;"
                onmouseenter="this.style.borderColor='#3b82f6';this.style.transform='translateY(-2px)';this.style.transition='all 0.15s'"
                onmouseleave="this.style.borderColor='#2e3a4e';this.style.transform='translateY(0)'">
                <div style="font-size:32px;margin-bottom:10px">
                  {{ member.isLead ? '⭐' : '👤' }}
                </div>
                <div style="font-weight:600;font-size:15px;margin-bottom:10px">
                  {{ member.name }}
                </div>
                @if (member.isLead) {
                  <span style="background:#d97706;color:#fff;font-size:11px;
                               font-weight:700;padding:3px 10px;border-radius:4px">
                    Team Lead
                  </span>
                } @else {
                  <span style="background:#0d9488;color:#fff;font-size:11px;
                               font-weight:700;padding:3px 10px;border-radius:4px">
                    Team Member
                  </span>
                }
              </div>
            }
          </div>
        }

      </div>
    </div>
  `
})
export class Home implements OnInit {
  private router = inject(Router);
  private session = inject(UserSessionService);
  private teamService = inject(TeamMemberService);

  members: TeamMember[] = [];
  loading = true;

  ngOnInit() {
    this.teamService.getAll().subscribe({
      next: (members) => {
        this.members = members.filter(m => m.isActive);
        this.loading = false;
        if (this.members.length === 0) {
          this.router.navigate(['/team']);
        }
      },
      error: () => {
        this.loading = false;
        this.router.navigate(['/team']);
      }
    });
  }

  select(member: TeamMember) {
    this.session.setUser(member);
    if (member.isLead) this.router.navigate(['/lead-home']);
    else this.router.navigate(['/member-home', member.id]);
  }
}