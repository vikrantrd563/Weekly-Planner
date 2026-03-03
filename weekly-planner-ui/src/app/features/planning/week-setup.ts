import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamMemberService } from '../../core/services/team-member.service';
import { PlanningService } from '../../core/services/planning.service';
import { TeamMember } from '../../core/models';

@Component({
  selector: 'app-week-setup',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatCheckboxModule,
    MatSliderModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './week-setup.html',
  styleUrl: './week-setup.scss'
})
export class WeekSetup implements OnInit {
  private teamService = inject(TeamMemberService);
  private planningService = inject(PlanningService);
  protected router = inject(Router);
  private snackBar = inject(MatSnackBar);

  members: TeamMember[] = [];
  selectedMemberIds: string[] = [];
  planningDate = '';
  clientPct = 50;
  techPct = 30;
  rndPct = 20;
  loading = false;
  submitting = false;

  get total() { return this.clientPct + this.techPct + this.rndPct; }
  get totalValid() { return this.total === 100; }

  get nextTuesday(): string {
    const d = new Date();
    const day = d.getDay();
    const diff = (2 - day + 7) % 7 || 7;
    d.setDate(d.getDate() + diff);
    return d.toISOString().split('T')[0];
  }

  ngOnInit() {
    this.planningDate = this.nextTuesday;
    this.loading = true;
    this.teamService.getAll().subscribe({
      next: (members: TeamMember[]) => {
        this.members = members.filter(m => m.isActive);
        this.selectedMemberIds = this.members.map(m => m.id);
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load team members', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  toggleMember(id: string) {
    const idx = this.selectedMemberIds.indexOf(id);
    if (idx >= 0) this.selectedMemberIds.splice(idx, 1);
    else this.selectedMemberIds.push(id);
  }

  isMemberSelected(id: string) {
    return this.selectedMemberIds.includes(id);
  }

  isTuesday(dateStr: string): boolean {
    return new Date(dateStr).getDay() === 2;
  }

  get canSubmit(): boolean {
    return this.totalValid &&
      this.selectedMemberIds.length > 0 &&
      !!this.planningDate &&
      this.isTuesday(this.planningDate) &&
      !this.submitting;
  }

  submit() {
    if (!this.canSubmit) return;
    this.submitting = true;
    const request = {
      planningDate: new Date(this.planningDate).toISOString(),
      participatingMemberIds: this.selectedMemberIds,
      clientFocusedPct: this.clientPct,
      techDebtPct: this.techPct,
      rndPct: this.rndPct
    };
    this.planningService.create(request).subscribe({
      next: (week: any) => {
        this.planningService.open(week.id).subscribe({
          next: () => {
            this.snackBar.open('Planning week created and opened!', 'Close', { duration: 3000 });
            this.router.navigate(['/lead-home']);
          },
          error: (e: any) => {
            this.snackBar.open(e.error?.message || 'Failed to open week', 'Close', { duration: 4000 });
            this.submitting = false;
          }
        });
      },
      error: (e: any) => {
        this.snackBar.open(e.error?.message || 'Failed to create week', 'Close', { duration: 4000 });
        this.submitting = false;
      }
    });
  }
}