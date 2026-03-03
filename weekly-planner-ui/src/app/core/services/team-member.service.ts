import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { TeamMember } from '../models';

@Injectable({ providedIn: 'root' })
export class TeamMemberService {
  private api = inject(ApiService);

  private base = '/TeamMembers';   // ✅ FIXED

  getAll(): Observable<TeamMember[]> {
    return this.api.get<TeamMember[]>(this.base);
  }

  getById(id: string): Observable<TeamMember> {
    return this.api.get<TeamMember>(`${this.base}/${id}`);
  }

  create(name: string, isLead = false): Observable<TeamMember> {
    return this.api.post<TeamMember>(this.base, { name, isLead });
  }

  update(id: string, changes: Partial<TeamMember>): Observable<TeamMember> {
    return this.api.put<TeamMember>(`${this.base}/${id}`, changes);
  }

  setLead(id: string): Observable<void> {
    return this.api.patch<void>(`${this.base}/${id}/lead`);
  }

  toggleActive(id: string): Observable<void> {
    return this.api.patch<void>(`${this.base}/${id}/toggle-active`);
  }
}