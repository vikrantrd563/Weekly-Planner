import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProgressService } from '../../core/services/progress.service';
import { MemberSummary } from '../../core/models';

@Component({
  selector: 'app-member-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule, MatButtonModule,
    MatProgressSpinnerModule, MatSnackBarModule
  ],
  templateUrl: './member-detail.html',
  styleUrl: './member-detail.scss'
})
export class MemberDetail implements OnInit {
  private route = inject(ActivatedRoute);
  protected router = inject(Router);
  private progressService = inject(ProgressService);
  private snackBar = inject(MatSnackBar);

  weekId = '';
  memberId = '';
  data: MemberSummary | null = null;
  loading = true;

  ngOnInit() {
    this.weekId = this.route.snapshot.paramMap.get('weekId') ?? '';
    this.memberId = this.route.snapshot.paramMap.get('memberId') ?? '';

    this.progressService.getMemberSummary(this.weekId, this.memberId).subscribe({
      next: (data: MemberSummary) => {
        this.data = data;
        this.loading = false;
      },
      error: () => {
        this.snackBar.open('Failed to load member data', 'Close', { duration: 3000 });
        this.loading = false;
      }
    });
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Done': return '#81C784';
      case 'Blocked': return '#EF9A9A';
      case 'InProgress': return '#64B5F6';
      default: return '#aaa';
    }
  }

  getCompletionColor(pct: number): string {
    if (pct >= 80) return '#81C784';
    if (pct >= 50) return '#FFB74D';
    return '#EF9A9A';
  }

  getCategoryClass(category: string): string {
    switch (category) {
      case 'ClientFocused': return 'chip-client';
      case 'TechDebt': return 'chip-techdebt';
      case 'RnD': return 'chip-rnd';
      default: return '';
    }
  }
}