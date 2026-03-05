import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { PlanningService } from '../../core/services/planning.service';
import { PlanningWeek } from '../../core/models';

@Component({
  selector: 'app-past-weeks',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './past-weeks.html',
  styleUrl: './past-weeks.scss'
})
export class PastWeeks implements OnInit {
  protected router = inject(Router);
  private planningService = inject(PlanningService);
  private snackBar = inject(MatSnackBar);

  weeks: PlanningWeek[] = [];
  loading = true;

  ngOnInit() {
    this.planningService.getAll().subscribe({
      next: (weeks: PlanningWeek[]) => {
        this.weeks = weeks.sort((a, b) =>
          new Date(b.planningDate).getTime() - new Date(a.planningDate).getTime()
        );
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load weeks', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed': return '#81C784';
      case 'Frozen': return '#64B5F6';
      case 'Planning': return '#FFB74D';
      case 'Setup': return '#aaa';
      default: return '#aaa';
    }
  }

  viewDashboard(weekId: string) {
    this.router.navigate(['/dashboard', weekId]);
  }
}