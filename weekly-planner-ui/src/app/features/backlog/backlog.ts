import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { BacklogService } from '../../core/services/backlog.service';
import { BacklogItem } from '../../core/models';

@Component({
  selector: 'app-backlog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule
  ],
  templateUrl: './backlog.html',
  styleUrls: ['./backlog.scss']
})
export class Backlog implements OnInit {

  private service = inject(BacklogService);

  items: BacklogItem[] = [];

  title = '';
  description = '';
  category = 1;

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe(res => {
      this.items = res;
    });
  }

  add(): void {
    if (!this.title.trim()) return;

    this.service.create({
      title: this.title,
      description: this.description,
      category: this.category
    }).subscribe(() => {
      this.title = '';
      this.description = '';
      this.category = 1;
      this.load();
    });
  }

  archive(id: string): void {
    this.service.archive(id).subscribe(() => this.load());
  }
}