import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

import { TeamMemberService } from '../../core/services/team-member.service';
import { TeamMember } from '../../core/models';

@Component({
  selector: 'app-team',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule
  ],
  templateUrl: './team.html',
  styleUrls: ['./team.scss']
})
export class Team implements OnInit {

  private service = inject(TeamMemberService);

  members: TeamMember[] = [];
  newName = '';

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.service.getAll().subscribe(res => {
      this.members = res;
    });
  }

  add(): void {
    if (!this.newName.trim()) return;

    this.service.create(this.newName).subscribe(() => {
      this.newName = '';
      this.load();
    });
  }

  setLead(id: string): void {
    this.service.setLead(id).subscribe(() => this.load());
  }

  toggle(id: string): void {
    this.service.toggleActive(id).subscribe(() => this.load());
  }
}