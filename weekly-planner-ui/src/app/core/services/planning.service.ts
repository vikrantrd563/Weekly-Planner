import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { PlanningWeek, CreateWeekRequest } from '../models';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PlanningService {
  private api = inject(ApiService);
  private base = '/PlanningWeeks';

  getAll(): Observable<PlanningWeek[]> {
    return this.api.get<PlanningWeek[]>(this.base);
  }

 getActive(): Observable<PlanningWeek> {
  return this.api.get<any>(`${this.base}/active`).pipe(
    map((week: any) => ({
      ...week,
      rndPct: week.rnDPct,
      members: week.members.map((m: any) => ({
        ...m,
        rndBudget: m.rnDBudget
      }))
    }))
  );
}

  getById(id: string): Observable<PlanningWeek> {
    return this.api.get<PlanningWeek>(`${this.base}/${id}`);
  }

  create(request: CreateWeekRequest): Observable<PlanningWeek> {
    return this.api.post<PlanningWeek>(this.base, request);
  }

  open(id: string): Observable<PlanningWeek> {
    return this.api.post<PlanningWeek>(`${this.base}/${id}/open`, {});
  }

  freeze(id: string): Observable<PlanningWeek> {
    return this.api.post<PlanningWeek>(`${this.base}/${id}/freeze`, {});
  }

  complete(id: string): Observable<PlanningWeek> {
    return this.api.post<PlanningWeek>(`${this.base}/${id}/complete`, {});
  }

  cancel(id: string): Observable<void> {
    return this.api.delete<void>(`${this.base}/${id}`);
  }
}