import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProgressService } from '../../core/services/progress.service';
import { PlanningService } from '../../core/services/planning.service';
import { TeamDashboard } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss'
})
export class Dashboard implements OnInit {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private progressService = inject(ProgressService);
  private planningService = inject(PlanningService);
  private snackBar = inject(MatSnackBar);

  weekId = '';
  dashboard: TeamDashboard | null = null;
  loading = true;

  ngOnInit() {
    this.weekId = this.route.snapshot.paramMap.get('weekId') ?? '';

    if (!this.weekId) {
      this.planningService.getActive().subscribe({
        next: (week: any) => {
          this.weekId = week.id;
          this.loadDashboard();
        },
        error: () => {
          this.snackBar.open('No active week found', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    } else {
      this.loadDashboard();
    }
  }

  loadDashboard() {
    this.progressService.getDashboard(this.weekId).subscribe({
      next: (data: TeamDashboard) => {
        this.dashboard = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load dashboard', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getCompletionColor(pct: number): string {
    if (pct >= 80) return '#81C784';
    if (pct >= 50) return '#FFB74D';
    return '#EF9A9A';
  }
}