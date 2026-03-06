import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProgressService } from '../../core/services/progress.service';
import { CategorySummary } from '../../core/models';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, MatSnackBarModule],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.scss'
})
export class CategoryDetail implements OnInit {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private progressService = inject(ProgressService);
  private snackBar = inject(MatSnackBar);

  weekId = '';
  categoryId = 0;
  data: CategorySummary | null = null;
  loading = true;

  ngOnInit() {
    this.weekId = this.route.snapshot.paramMap.get('weekId') ?? '';
    this.categoryId = Number(this.route.snapshot.paramMap.get('categoryId'));

    this.progressService.getCategorySummary(this.weekId, this.categoryId).subscribe({
      next: (data: CategorySummary) => {
        this.data = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load category data', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Done': return '#81C784';
      case 'Blocked': return '#EF9A9A';
      case 'InProgress': return '#64B5F6';
      default: return '#94a3b8';
    }
  }

  getCompletionColor(pct: number): string {
    if (pct >= 80) return '#81C784';
    if (pct >= 50) return '#FFB74D';
    return '#EF9A9A';
  }
}