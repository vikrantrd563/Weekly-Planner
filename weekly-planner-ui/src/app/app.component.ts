import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AsyncPipe } from '@angular/common';
import { UserSessionService } from './core/services/user-session.service';

@Component({
  selector: 'app-root',
  standalone: true,
 imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
  ],
  template: `
    <mat-toolbar color="primary"
      style="position:sticky;top:0;z-index:100;">

      <span>📋 Weekly Plan Tracker</span>

      <span class="spacer"></span>

      @if (session.currentUser) {
        <span style="margin-right:12px;font-size:14px;">
          {{ session.currentUser.name }}
        </span>

        <button mat-button (click)="switchUser()">
          🔄 Switch
        </button>
      }

      <button mat-icon-button (click)="goHome()">
        <mat-icon>home</mat-icon>
      </button>

    </mat-toolbar>

    <router-outlet />
  `,
  styles: [`
    .spacer { flex: 1 1 auto; }
  `]
})
export class AppComponent {

  session = inject(UserSessionService);
  private router = inject(Router);

  switchUser(): void {
    this.session.clearUser();
    this.router.navigate(['/']);
  }

  goHome(): void {
    if (this.session.isLead)
      this.router.navigate(['/lead-home']);
    else if (this.session.currentMemberId)
      this.router.navigate([
        '/member-home',
        this.session.currentMemberId
      ]);
    else
      this.router.navigate(['/']);
  }
}