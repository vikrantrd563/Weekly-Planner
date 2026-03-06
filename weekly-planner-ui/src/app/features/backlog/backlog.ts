import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BacklogService } from '../../core/services/backlog.service';
import { BacklogItem } from '../../core/models';

@Component({
  selector: 'app-backlog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width:860px;margin:0 auto;padding:32px 24px;">

      <div style="display:flex;align-items:center;gap:12px;margin-bottom:24px">
        <button (click)="router.navigate(['/lead-home'])"
          style="background:none;border:none;color:#94a3b8;cursor:pointer;font-size:14px">← Home</button>
        <h2 style="margin:0;font-size:22px;font-weight:700;">Manage Backlog</h2>
      </div>

      <!-- Edit panel -->
      @if (editingItem) {
        <div style="background:#1e2433;border:1px solid #3b82f6;border-radius:12px;padding:24px;margin-bottom:20px">
          <div style="font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:16px">
            Edit Backlog Item
          </div>

          <div style="margin-bottom:14px">
            <label style="font-size:13px;color:#94a3b8;display:block;margin-bottom:6px">Title</label>
            <input type="text" [(ngModel)]="editTitle"
              style="width:100%;background:#252d3d;color:#f1f5f9;border:1px solid #2e3a4e;padding:8px 12px;border-radius:8px;font-size:14px;box-sizing:border-box"/>
          </div>

          <div style="margin-bottom:14px">
            <label style="font-size:13px;color:#94a3b8;display:block;margin-bottom:6px">Description</label>
            <textarea [(ngModel)]="editDescription" rows="3"
              style="width:100%;background:#252d3d;color:#f1f5f9;border:1px solid #2e3a4e;padding:8px 12px;border-radius:8px;font-size:14px;box-sizing:border-box;resize:vertical"></textarea>
          </div>

          <div style="display:flex;gap:12px;margin-bottom:14px">
            <div style="flex:1">
              <label style="font-size:13px;color:#94a3b8;display:block;margin-bottom:6px">Category</label>
              <select [(ngModel)]="editCategory"
                style="width:100%;background:#252d3d;color:#f1f5f9;border:1px solid #2e3a4e;padding:8px 12px;border-radius:8px;font-size:14px">
                <option [value]="1">Client Focused</option>
                <option [value]="2">Tech Debt</option>
                <option [value]="3">R&D</option>
              </select>
            </div>

            <div style="flex:1">
              <label style="font-size:13px;color:#94a3b8;display:block;margin-bottom:6px">Estimated hours (optional)</label>
              <input type="number" [(ngModel)]="editHours"
                style="width:100%;background:#252d3d;color:#f1f5f9;border:1px solid #2e3a4e;padding:8px 12px;border-radius:8px;font-size:14px;box-sizing:border-box"/>
            </div>
          </div>

          <div style="display:flex;gap:10px">
            <button (click)="saveEdit()"
              style="background:#3b82f6;color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">
              Save This Item
            </button>

            <button (click)="cancelEdit()"
              style="background:none;border:1px solid #2e3a4e;color:#94a3b8;padding:8px 20px;border-radius:8px;font-size:14px;cursor:pointer">
              Cancel
            </button>
          </div>
        </div>
      }

      <!-- Add form -->
      @if (!editingItem) {
        <div style="background:#1e2433;border:1px solid #2e3a4e;border-radius:12px;padding:20px;margin-bottom:20px">
          <div style="font-size:13px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.05em;margin-bottom:14px">
            Add a New Backlog Item
          </div>

          <div style="display:flex;gap:10px;flex-wrap:wrap">
            <input type="text" placeholder="Title" [(ngModel)]="title"
              style="flex:1;min-width:140px;background:#252d3d;color:#f1f5f9;border:1px solid #2e3a4e;padding:8px 12px;border-radius:8px;font-size:14px"/>

            <input type="text" placeholder="Description" [(ngModel)]="description"
              style="flex:2;min-width:180px;background:#252d3d;color:#f1f5f9;border:1px solid #2e3a4e;padding:8px 12px;border-radius:8px;font-size:14px"/>

            <input type="number" placeholder="Est. hours" [(ngModel)]="estimatedHours"
              style="width:100px;background:#252d3d;color:#f1f5f9;border:1px solid #2e3a4e;padding:8px 12px;border-radius:8px;font-size:14px"/>

            <select [(ngModel)]="category"
              style="background:#252d3d;color:#f1f5f9;border:1px solid #2e3a4e;padding:8px 12px;border-radius:8px;font-size:14px">
              <option [value]="1">Client Focused</option>
              <option [value]="2">Tech Debt</option>
              <option [value]="3">R&D</option>
            </select>

            <button (click)="add()"
              style="background:#3b82f6;color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:14px;font-weight:600;cursor:pointer">
              Add Item
            </button>
          </div>
        </div>
      }

      <!-- Filter tabs -->
      <div style="display:flex;gap:8px;margin-bottom:16px">
        @for (f of filters; track f) {
          <button (click)="activeFilter=f"
            [style.background]="activeFilter===f ? '#3b82f6' : '#1e2433'"
            [style.color]="activeFilter===f ? '#fff' : '#94a3b8'"
            style="border:1px solid #2e3a4e;padding:5px 14px;border-radius:20px;cursor:pointer;font-size:13px">
            {{ f }}
          </button>
        }
      </div>

      <!-- Items list -->
      <div style="background:#1e2433;border:1px solid #2e3a4e;border-radius:12px;overflow:hidden">

        @if (filteredItems.length === 0) {
          <div style="padding:24px;color:#94a3b8;text-align:center">
            No backlog items match your filters.
          </div>
        }

        @for (item of filteredItems; track item.id) {
          <div style="display:flex;justify-content:space-between;align-items:center;padding:14px 16px;border-bottom:1px solid #2e3a4e">

            <div style="display:flex;align-items:center;gap:10px;flex:1">
              <span [class]="getCategoryClass(item.category)"
                style="padding:2px 8px;border-radius:4px;font-size:12px;white-space:nowrap">
                {{ item.category }}
              </span>

              <span style="font-weight:500">{{ item.title }}</span>

              @if (item.estimatedHours) {
                <span style="color:#94a3b8;font-size:13px">
                  {{ item.estimatedHours }}h est.
                </span>
              }
            </div>

            <div style="display:flex;gap:8px">
              <button (click)="startEdit(item)"
                style="background:none;border:1px solid #2e3a4e;color:#94a3b8;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:13px">
                View & Edit
              </button>

              <button (click)="confirmArchive(item)"
                style="background:#dc2626;border:none;color:#fff;padding:5px 12px;border-radius:6px;cursor:pointer;font-size:13px">
                Archive
              </button>
            </div>

          </div>
        }

      </div>

      <!-- Archive confirm modal -->
      @if (archiveTarget) {
        <div style="position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:200">

          <div style="background:#1e2433;border:1px solid #2e3a4e;border-radius:12px;padding:28px;max-width:400px;width:90%">

            <h3 style="margin:0 0 8px 0">
              Archive "{{ archiveTarget.title }}"?
            </h3>

            <p style="color:#94a3b8;font-size:14px;margin:0 0 20px 0">
              It will be moved to the archived list.
            </p>

            <div style="display:flex;gap:10px">

              <button (click)="doArchive()"
                style="background:#dc2626;color:#fff;border:none;padding:8px 20px;border-radius:8px;font-size:14px;cursor:pointer">
                Yes, Archive It
              </button>

              <button (click)="archiveTarget=null"
                style="background:none;border:1px solid #2e3a4e;color:#94a3b8;padding:8px 20px;border-radius:8px;font-size:14px;cursor:pointer">
                No, Go Back
              </button>

            </div>

          </div>
        </div>
      }

    </div>
  `
})
export class Backlog implements OnInit {

  private service = inject(BacklogService);
  protected router = inject(Router);

  items: BacklogItem[] = [];

  title = '';
  description = '';
  category = 1;
  estimatedHours: number | null = null;

  activeFilter = 'Available Only';
  filters = ['Available Only', 'Show All', 'Archived'];

  editingItem: BacklogItem | null = null;
  editTitle = '';
  editDescription = '';
  editCategory = 1;
  editHours: number | null = null;

  archiveTarget: BacklogItem | null = null;

  get filteredItems(): BacklogItem[] {
    if (this.activeFilter === 'Available Only')
      return this.items.filter(i => i.status === 'Available');

    if (this.activeFilter === 'Archived')
      return this.items.filter(i => i.status === 'Archived');

    return this.items;
  }

  ngOnInit() {
    this.load();
  }

  load() {
    this.service.getAll().subscribe(res => {
      this.items = res;
    });
  }

  add() {
    if (!this.title.trim()) return;

    this.service.create({
      title: this.title,
      description: this.description,
      category: this.category,
      estimatedHours: this.estimatedHours ?? undefined
    }).subscribe(() => {

      this.title = '';
      this.description = '';
      this.category = 1;
      this.estimatedHours = null;

      this.load();
    });
  }

  startEdit(item: BacklogItem) {

    this.editingItem = item;

    this.editTitle = item.title;
    this.editDescription = item.description;
    this.editCategory = item.categoryId;
    this.editHours = item.estimatedHours;

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  saveEdit() {

    if (!this.editingItem) return;

    this.service.update(this.editingItem.id, {
      title: this.editTitle,
      description: this.editDescription,
      category: this.editCategory,
      estimatedHours: this.editHours ?? undefined
    }).subscribe(() => {

      this.editingItem = null;
      this.load();
    });
  }

  cancelEdit() {
    this.editingItem = null;
  }

  confirmArchive(item: BacklogItem) {
    this.archiveTarget = item;
  }

  doArchive() {

    if (!this.archiveTarget) return;

    const id = this.archiveTarget.id;

    this.service.archive(id).subscribe({

      next: () => {

        this.archiveTarget = null;
        this.load();

      },

      error: (err) => {

        console.error('Archive failed:', err);

        const message =
          err?.error?.message ||
          'Unable to archive this backlog item.';

        alert(message);

        this.archiveTarget = null;
      }

    });

  }

  getCategoryClass(category: string): string {

    switch (category) {

      case 'ClientFocused':
        return 'chip-client';

      case 'TechDebt':
        return 'chip-techdebt';

      case 'RnD':
        return 'chip-rnd';

      default:
        return '';
    }

  }

}