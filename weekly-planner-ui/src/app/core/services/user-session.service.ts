import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { TeamMember } from '../models';

@Injectable({ providedIn: 'root' })
export class UserSessionService {
  private readonly STORAGE_KEY = 'wpt_current_user';

  private _currentUser = new BehaviorSubject<TeamMember | null>(
    this.loadFromSession()
  );

  readonly currentUser$ = this._currentUser.asObservable();

  get currentUser(): TeamMember | null { return this._currentUser.value; }
  get isLead(): boolean { return this._currentUser.value?.isLead ?? false; }
  get currentMemberId(): string | null { return this._currentUser.value?.id ?? null; }

  setUser(member: TeamMember): void {
    this._currentUser.next(member);
    sessionStorage.setItem(this.STORAGE_KEY, JSON.stringify(member));
  }

  clearUser(): void {
    this._currentUser.next(null);
    sessionStorage.removeItem(this.STORAGE_KEY);
  }

  private loadFromSession(): TeamMember | null {
    const stored = sessionStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  }
}