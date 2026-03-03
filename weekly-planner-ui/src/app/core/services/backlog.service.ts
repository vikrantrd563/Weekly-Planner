import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { BacklogItem } from '../models';

@Injectable({ providedIn: 'root' })
export class BacklogService {
  private api = inject(ApiService);
  private base = '/BacklogItems';

  getAll(status?: string): Observable<BacklogItem[]> {
    const params = status ? { status } : undefined;
    return this.api.get<BacklogItem[]>(this.base, params);
  }

  getById(id: string): Observable<BacklogItem> {
    return this.api.get<BacklogItem>(`${this.base}/${id}`);
  }

  create(request: any): Observable<BacklogItem> {
    return this.api.post<BacklogItem>(this.base, request);
  }

  archive(id: string): Observable<void> {
    return this.api.patch<void>(`${this.base}/${id}/archive`);
  }
}