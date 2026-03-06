import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { UserSessionService } from './core/services/user-session.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  styles: [`
    .navbar {
      background: #0f172a;
      color: white;
      padding: 12px 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .navbar-brand { font-weight: 700; font-size: 1.1rem; }
    .navbar-actions { display: flex; gap: 10px; align-items: center; }
    .member-label { color: #94a3b8; font-size: 0.9rem; }
    .badge-lead {
      background: #f59e0b;
      color: #000;
      padding: 2px 8px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
    }
    .nav-btn {
      background: none;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 4px 12px;
      border-radius: 6px;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .nav-btn:hover { border-color: #94a3b8; color: white; }
    .bottom-toolbar {
      position: fixed;
      bottom: 14px;
      left: 0; right: 0;
      display: flex;
      justify-content: center;
      gap: 10px;
      z-index: 999;
    }
    .toolbar-btn {
      border: none;
      padding: 8px 16px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
      font-weight: 500;
    }
    .btn-download { background: #334155; color: white; }
    .btn-load     { background: #334155; color: white; cursor: pointer; }
    .btn-seed     { background: #0ea5e9; color: white; }
    .btn-reset    { background: #dc2626; color: white; }

    /* MODAL SHARED */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9999;
    }
    .modal {
      background: #1e2433;
      border: 1px solid #2e3a4e;
      border-radius: 14px;
      padding: 32px;
      width: 100%;
      max-width: 420px;
      color: #f1f5f9;
    }
    .modal h2 { margin: 0 0 8px 0; font-size: 1.2rem; font-weight: 700; }
    .modal p  { margin: 0 0 24px 0; color: #94a3b8; font-size: 0.9rem; line-height: 1.5; }

    /* RESET MODAL */
    .modal-options { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
    .modal-option {
      background: #252d3d;
      border: 1px solid #2e3a4e;
      border-radius: 10px;
      padding: 16px;
      cursor: pointer;
      text-align: left;
      color: #f1f5f9;
      transition: border-color 0.15s;
    }
    .modal-option:hover { border-color: #64748b; }
    .modal-option.danger:hover { border-color: #dc2626; }
    .modal-option .opt-title { font-weight: 600; font-size: 0.95rem; margin-bottom: 4px; }
    .modal-option .opt-desc  { font-size: 0.8rem; color: #94a3b8; }
    .modal-option .opt-icon  { font-size: 1.4rem; margin-bottom: 8px; }
    .modal-cancel {
      width: 100%;
      background: none;
      border: 1px solid #334155;
      color: #94a3b8;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      font-size: 0.875rem;
    }
    .modal-cancel:hover { border-color: #94a3b8; color: white; }

    /* LOAD MODAL */
    .file-drop {
      border: 2px dashed #334155;
      border-radius: 10px;
      padding: 24px;
      text-align: center;
      color: #94a3b8;
      margin-bottom: 20px;
      cursor: pointer;
      transition: border-color 0.2s;
    }
    .file-drop:hover { border-color: #64748b; }
    .file-drop.has-file { border-color: #0ea5e9; color: #f1f5f9; }
    .load-actions { display: flex; gap: 10px; }
    .btn-confirm {
      flex: 1;
      background: #0ea5e9;
      color: white;
      border: none;
      padding: 10px;
      border-radius: 8px;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.875rem;
    }
    .btn-confirm:disabled { opacity: 0.4; cursor: not-allowed; }
  `],
  template: `
    <div>

      <!-- NAVBAR -->
      <nav class="navbar">
        <div class="navbar-brand">Weekly Plan Tracker</div>
        <div class="navbar-actions">
          @if (session.currentUser) {
            <span class="member-label">{{ session.currentUser.name }}</span>
            @if (session.isLead) {
              <span class="badge-lead">Lead</span>
            }
          } @else {
            <span class="member-label">No member selected</span>
          }
          <button class="nav-btn" (click)="switchRole()">🔄 Switch</button>
          <button class="nav-btn" (click)="goHome()">🏠 Home</button>
          <button class="nav-btn" (click)="toggleTheme()">
            {{ darkMode ? '☀️ Light' : '🌙 Dark' }}
          </button>
        </div>
      </nav>

      <!-- ROUTER -->
      <router-outlet />

      <!-- BOTTOM TOOLBAR -->
      <div class="bottom-toolbar">
        <button class="toolbar-btn btn-download" (click)="downloadData()">
          📥 Download My Data
        </button>
        <button class="toolbar-btn btn-load" (click)="showLoadModal = true">
          📂 Load Data from File
        </button>
        <button class="toolbar-btn btn-seed" (click)="seedData()">
          🌱 Seed Sample Data
        </button>
        <button class="toolbar-btn btn-reset" (click)="showResetModal = true">
          🗑️ Reset App
        </button>
      </div>

      <!-- LOAD MODAL -->
      @if (showLoadModal) {
        <div class="modal-overlay" (click)="closeLoadModal()">
          <div class="modal" (click)="$event.stopPropagation()">
            <h2>📤 Load Data from a Backup File</h2>
            <p>Pick the backup file you saved before. This will replace all your current data.</p>

            <label class="file-drop" [class.has-file]="loadFile !== null">
              @if (loadFile) {
                <div>✅ {{ loadFile.name }}</div>
              } @else {
                <div>📁 Click to choose a backup file</div>
                <div style="font-size:0.8rem;margin-top:4px">(.json files only)</div>
              }
              <input type="file" hidden accept=".json" (change)="onFileSelected($event)">
            </label>

            @if (loadError) {
              <div style="color:#ef4444;font-size:0.85rem;margin-bottom:16px">
                ⚠️ {{ loadError }}
              </div>
            }

            @if (loadRestoring) {
              <div style="text-align:center;color:#94a3b8;margin-bottom:16px;font-size:0.9rem">
                ⏳ Restoring data...
              </div>
            }

            <div class="load-actions">
              <button class="btn-confirm"
                [disabled]="!loadFile || loadRestoring"
                (click)="restoreData()">
                Yes, Replace My Data
              </button>
              <button class="modal-cancel" style="width:auto;padding:10px 20px"
                (click)="closeLoadModal()">
                Cancel
              </button>
            </div>
          </div>
        </div>
      }

      <!-- RESET MODAL -->
      @if (showResetModal) {
        <div class="modal-overlay" (click)="showResetModal = false">
          <div class="modal" (click)="$event.stopPropagation()">
            <h2>Reset App</h2>
            <p>This will delete ALL data — team members, backlog, and planning weeks. This cannot be undone.</p>
            <div style="display:flex;gap:10px;margin-top:8px;">
              <button class="btn-confirm" (click)="resetFull()">Yes, Full Reset</button>
              <button class="modal-cancel" style="width:auto;padding:10px 20px"
                (click)="showResetModal = false">Cancel</button>
            </div>
          </div>
        </div>
      }

    </div>
  `
})
export class AppComponent {

  private router = inject(Router);
  private http = inject(HttpClient);
  protected session = inject(UserSessionService);

  darkMode = true;
  showResetModal = false;
  showLoadModal = false;
  loadFile: File | null = null;
  loadError = '';
  loadRestoring = false;

  private readonly API = 'https://weekly-planner-api-vikrant-dpczdfbhe9aphkfj.centralindia-01.azurewebsites.net';

  switchRole() {
    this.session.clearUser();
    this.router.navigate(['/']);
  }

  goHome() {
    this.router.navigate(['/']);
  }

  toggleTheme() {
    this.darkMode = !this.darkMode;
    document.body.classList.toggle('light-mode', !this.darkMode);
  }

  // ── LOAD MODAL ──────────────────────────────

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      this.loadFile = file;
      this.loadError = '';
    }
  }

  closeLoadModal() {
    this.showLoadModal = false;
    this.loadFile = null;
    this.loadError = '';
    this.loadRestoring = false;
  }

  restoreData() {
    if (!this.loadFile) return;
    this.loadRestoring = true;
    this.loadError = '';

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const raw = JSON.parse(reader.result as string);

        // Support both formats: raw array or structured backup
        const members: any[] = raw.data?.teamMembers ?? [];
        const backlog: any[] = raw.data?.backlogEntries ?? raw;

        // Step 1: Full reset
        await this.http.delete(`${this.API}/api/TeamMembers/reset-all`).toPromise();

        // Step 2: Restore team members
        for (const m of members) {
          await this.http.post(`${this.API}/api/TeamMembers`, {
            name: m.name,
            isLead: m.isLead ?? false
          }).toPromise();
        }

        // Step 3: Restore backlog items
        for (const b of backlog) {
          if (!b.title) continue;
          await this.http.post(`${this.API}/api/BacklogItems`, {
            title: b.title,
            description: b.description ?? '',
            category: b.categoryId ?? 1,
            estimatedHours: b.estimatedHours ?? null
          }).toPromise();
        }

this.closeLoadModal();
        this.session.clearUser();
        localStorage.clear();
        sessionStorage.clear();
        
        location.reload();

      } catch (e) {
        this.loadError = 'Failed to restore. Make sure this is a valid backup file.';
        this.loadRestoring = false;
      }
    };
    reader.readAsText(this.loadFile);
  }

  // ── DOWNLOAD ────────────────────────────────

  downloadData() {
    Promise.all([
      this.http.get<any[]>(`${this.API}/api/TeamMembers`).toPromise(),
      this.http.get<any[]>(`${this.API}/api/BacklogItems`).toPromise(),
      this.http.get<any[]>(`${this.API}/api/PlanningWeeks`).toPromise(),
    ]).then(([teamMembers, backlogItems, planningWeeks]) => {
      const now = new Date();
      const timestamp = now.toISOString().replace('T', '-').replace(/:/g, '').slice(0, 15);
      const backup = {
        appName: 'WeeklyPlanTracker',
        dataVersion: 1,
        exportedAt: now.toISOString(),
        data: {
          appSettings: { setupComplete: true, dataVersion: 1 },
          teamMembers: teamMembers ?? [],
          backlogEntries: backlogItems ?? [],
          planningCycles: planningWeeks ?? [],
          categoryAllocations: [],
          memberPlans: [],
          taskAssignments: [],
          progressUpdates: []
        }
      };
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `weeklyplantracker-backup-${timestamp}.json`;
      a.click();
      window.URL.revokeObjectURL(url);
    }).catch(() => alert('Failed to export. Is the API running?'));
  }

  // ── SEED ────────────────────────────────────

  seedData() {
    this.http.post(`${this.API}/api/BacklogItems/seed`, {}).subscribe({
      next: () => { alert('Sample data seeded.'); location.reload(); },
      error: () => alert('Failed to seed. Is the API running?')
    });
  }

  // ── RESET ───────────────────────────────────

  resetSessionOnly() {
    this.showResetModal = false;
    localStorage.clear();
    sessionStorage.clear();
    this.session.clearUser();
    this.router.navigate(['/team']);
  }

  resetFull() {
    this.showResetModal = false;
    Promise.all([
      this.http.delete(`${this.API}/api/TeamMembers/reset-all`).toPromise(),
      this.http.delete(`${this.API}/api/BacklogItems/reset-all`).toPromise(),
      this.http.delete(`${this.API}/api/PlanningWeeks/reset-all`).toPromise(),
    ]).then(() => {
      localStorage.clear();
      sessionStorage.clear();
      this.session.clearUser();
      location.reload();
    }).catch(() => alert('Failed to reset. Is the API running?'));
  }
}