import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { WorkItem, CreateWorkItemRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class WorkItemService {
  private api = inject(ApiService);
  private base = '/WorkItems';

  getByWeekAndMember(weekId: string, memberId: string): Observable<WorkItem[]> {
    return this.api.get<WorkItem[]>(this.base, { weekId, memberId });
  }

  add(request: CreateWorkItemRequest): Observable<WorkItem> {
    return this.api.post<WorkItem>(this.base, request);
  }

  update(id: string, committedHours: number): Observable<WorkItem> {
    return this.api.put<WorkItem>(`${this.base}/${id}`, { committedHours });
  }

  remove(id: string): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`);
  }

  markReady(weekId: string, memberId: string): Observable<void> {
    return this.api.patch<void>(`${this.base}/${weekId}/member/${memberId}/ready`);
  }
}