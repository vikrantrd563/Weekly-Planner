import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ProgressService } from '../../core/services/progress.service';
import { PlanningService } from '../../core/services/planning.service';

@Component({
  selector: 'app-update-progress',
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    MatCardModule, MatButtonModule, MatSelectModule,
    MatInputModule, MatSnackBarModule, MatProgressSpinnerModule
  ],
  templateUrl: './update-progress.html',
  styleUrl: './update-progress.scss'
})
export class UpdateProgress implements OnInit {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private progressService = inject(ProgressService);
  private planningService = inject(PlanningService);
  private snackBar = inject(MatSnackBar);

  memberId = '';
  weekId = '';
  workItems: any[] = [];
  loading = false;
  saving = false;

  statusOptions = [
    { value: 0, label: 'Not Started' },
    { value: 1, label: 'In Progress' },
    { value: 2, label: 'Done' },
    { value: 3, label: 'Blocked' }
  ];

  ngOnInit() {
    this.memberId = this.route.snapshot.paramMap.get('memberId') ?? '';
    this.loading = true;

    this.planningService.getActive().subscribe({
      next: (week: any) => {
        this.weekId = week.id;
        this.loadProgress();
      },
      error: () => {
        this.snackBar.open('No active/frozen week found', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  loadProgress() {
    this.progressService.getMemberProgress(this.weekId, this.memberId).subscribe({
      next: (items: any[]) => {
        this.workItems = items.map(i => ({
          ...i,
          editHours: i.completedHours,
          editStatus: this.statusOptions.findIndex(s => s.label === i.status)
        }));
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load work items', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  saveProgress(item: any) {
    this.saving = true;
    this.progressService.updateProgress({
      workItemId: item.workItemId,
      completedHours: item.editHours,
      status: item.editStatus,
      note: ''
    }).subscribe({
      next: (result: any) => {
        if (result.warning) {
          this.snackBar.open(result.warning, 'Close', { duration: 4000 });
        } else {
          this.snackBar.open('Progress saved!', 'Close', { duration: 2000 });
        }
        this.saving = false;
        this.loadProgress();
      },
      error: (e: any) => {
        this.snackBar.open(e.error?.message || 'Failed to save', 'Close', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  getCategoryClass(category: string): string {
    switch(category) {
      case 'ClientFocused': return 'chip-client';
      case 'TechDebt': return 'chip-techdebt';
      case 'RnD': return 'chip-rnd';
      default: return '';
    }
  }
}