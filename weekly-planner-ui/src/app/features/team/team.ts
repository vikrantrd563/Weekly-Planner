import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TeamMemberService } from '../../core/services/team-member.service';
import { TeamMember } from '../../core/models';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width:640px;margin:0 auto;padding:48px 24px 100px">

      <!-- HEADER -->
      <div style="text-align:center;margin-bottom:32px">
        <div style="font-size:2.5rem;margin-bottom:12px">👋</div>
        <h1 style="margin:0 0 8px 0;font-size:1.6rem;font-weight:700">
          Welcome! Let's set up your team.
        </h1>
        <p style="margin:0;color:#94a3b8;font-size:0.95rem">
          Add the people on your team. Pick one person as the Team Lead.
        </p>
      </div>

      <!-- ADD FORM -->
      <div style="background:#1e2433;border:1px solid #2e3a4e;border-radius:12px;
                  padding:20px;margin-bottom:16px">
        <div style="display:flex;gap:10px">
          <input type="text" placeholder="Type a name here" [(ngModel)]="newName"
            (keyup.enter)="add()"
            style="flex:1;background:#0f172a;color:#f1f5f9;border:1px solid #2e3a4e;
                   padding:10px 14px;border-radius:8px;font-size:14px;outline:none"/>
          <button (click)="add()"
            style="background:#3b82f6;color:#fff;border:none;padding:10px 20px;
                   border-radius:8px;font-size:14px;font-weight:600;cursor:pointer;
                   white-space:nowrap">
            Add This Person
          </button>
        </div>
      </div>

      <!-- MEMBERS LIST -->
      <div style="background:#1e2433;border:1px solid #2e3a4e;border-radius:12px;
                  overflow:hidden;margin-bottom:24px">

        @if (members.length === 0) {
          <div style="padding:24px;text-align:center;color:#94a3b8;font-size:0.9rem">
            No team members added yet.
          </div>
        } @else {
          @for (member of members; track member.id) {
            <div style="display:flex;justify-content:space-between;align-items:center;
                        padding:14px 16px;border-bottom:1px solid #2e3a4e">

              <div style="display:flex;align-items:center;gap:10px">
                <span style="font-weight:600;font-size:0.95rem">{{ member.name }}</span>
                @if (member.isLead) {
                  <span class="badge-lead">Team Lead</span>
                }
                @if (!member.isActive) {
                  <span style="background:#374151;color:#94a3b8;font-size:11px;
                               padding:2px 8px;border-radius:4px">Inactive</span>
                }
              </div>

              <div style="display:flex;gap:8px">
                @if (!member.isLead) {
                  <button (click)="setLead(member.id)"
                    style="background:none;border:1px solid #2e3a4e;color:#94a3b8;
                           padding:5px 12px;border-radius:6px;cursor:pointer;font-size:12px">
                    Make Lead
                  </button>
                }
                <button (click)="toggle(member.id)"
                  [style.background]="member.isActive ? '#dc2626' : '#16a34a'"
                  style="border:none;color:#fff;padding:5px 12px;border-radius:6px;
                         cursor:pointer;font-size:12px">
                  {{ member.isActive ? 'Deactivate' : 'Reactivate' }}
                </button>
              </div>

            </div>
          }
        }
      </div>

      <!-- DONE BUTTON -->
      @if (members.length > 0) {
        <div style="text-align:center">
          <button (click)="done()"
            style="background:#0ea5e9;color:white;border:none;padding:14px 40px;
                   border-radius:10px;font-size:1rem;font-weight:700;cursor:pointer">
            Done — Go to Home Screen
          </button>
        </div>
      }

    </div>
  `
})
export class Team implements OnInit {
  private service = inject(TeamMemberService);
  protected router = inject(Router);
  members: TeamMember[] = [];
  newName = '';

  ngOnInit() { this.load(); }

  load() {
    this.service.getAll().subscribe(res => { this.members = res; });
  }

  add() {
    if (!this.newName.trim()) return;
    this.service.create(this.newName).subscribe(() => {
      this.newName = '';
      this.load();
    });
  }

  setLead(id: string) { this.service.setLead(id).subscribe(() => this.load()); }
  toggle(id: string) { this.service.toggleActive(id).subscribe(() => this.load()); }

  done() {
    const lead = this.members.find(m => m.isLead);
    if (lead) this.router.navigate(['/lead-home']);
    else this.router.navigate(['/']);
  }
}