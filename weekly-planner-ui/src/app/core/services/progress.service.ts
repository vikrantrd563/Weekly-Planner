import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { UpdateProgressRequest, ProgressEntry, TeamDashboard, CategorySummary, MemberSummary } from '../models';

@Injectable({ providedIn: 'root' })
export class ProgressService {
  private api = inject(ApiService);
  private base = '/Progress';

  updateProgress(request: UpdateProgressRequest): Observable<any> {
    return this.api.post<any>(this.base, request);
  }

  getWorkItemHistory(workItemId: string): Observable<ProgressEntry[]> {
    return this.api.get<ProgressEntry[]>(`${this.base}/work-item/${workItemId}/history`);
  }

  getMemberProgress(weekId: string, memberId: string): Observable<any[]> {
    return this.api.get<any[]>(`${this.base}/week/${weekId}/member/${memberId}`);
  }

  getDashboard(weekId: string): Observable<TeamDashboard> {
    return this.api.get<TeamDashboard>(`${this.base}/dashboard/${weekId}`);
  }

  getCategorySummary(weekId: string, categoryId: number): Observable<CategorySummary> {
    return this.api.get<CategorySummary>(`${this.base}/dashboard/${weekId}/category/${categoryId}`);
  }

  getMemberSummary(weekId: string, memberId: string): Observable<MemberSummary> {
    return this.api.get<MemberSummary>(`${this.base}/dashboard/${weekId}/member/${memberId}`);
  }
}