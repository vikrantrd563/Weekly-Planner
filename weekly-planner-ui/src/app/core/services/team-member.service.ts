import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TeamMember } from '../models';

@Injectable({ providedIn: 'root' })
export class TeamMemberService {
  private api = inject(ApiService);

  getAll(): Observable<TeamMember[]> {
    return this.api.get<TeamMember[]>('/team-members');
  }

  getById(id: string): Observable<TeamMember> {
    return this.api.get<TeamMember>(`/team-members/${id}`);
  }

  create(name: string, isLead = false): Observable<TeamMember> {
    return this.api.post<TeamMember>('/team-members', { name, isLead });
  }

  update(id: string, changes: Partial<TeamMember>): Observable<TeamMember> {
    return this.api.put<TeamMember>(`/team-members/${id}`, changes);
  }

  setLead(id: string): Observable<void> {
    return this.api.patch<void>(`/team-members/${id}/lead`);
  }

  toggleActive(id: string): Observable<void> {
    return this.api.patch<void>(`/team-members/${id}/toggle-active`);
  }
}