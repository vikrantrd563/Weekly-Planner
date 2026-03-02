import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BacklogItem, CreateBacklogItemRequest, UpdateBacklogItemRequest } from '../models';

@Injectable({ providedIn: 'root' })
export class BacklogService {
  private api = inject(ApiService);

  getAll(status?: string): Observable<BacklogItem[]> {
    const params = status ? { status } : undefined;
    return this.api.get<BacklogItem[]>('/backlog-items', params);
  }

  getById(id: string): Observable<BacklogItem> {
    return this.api.get<BacklogItem>(`/backlog-items/${id}`);
  }

  create(request: CreateBacklogItemRequest): Observable<BacklogItem> {
    return this.api.post<BacklogItem>('/backlog-items', request);
  }

  update(id: string, request: UpdateBacklogItemRequest): Observable<BacklogItem> {
    return this.api.put<BacklogItem>(`/backlog-items/${id}`, request);
  }

  archive(id: string): Observable<void> {
    return this.api.patch<void>(`/backlog-items/${id}/archive`);
  }

  seed(): Observable<{ message: string }> {
    return this.api.post<{ message: string }>('/backlog-items/seed', {});
  }
}