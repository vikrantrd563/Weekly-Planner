import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { TestBed } from '@angular/core/testing';
import { UserSessionService } from './user-session.service';
import { TeamMember } from '../models';

const mockMember: TeamMember = {
  id: 'abc-123',
  name: 'Alice',
  isLead: true,
  isActive: true,
  createdAt: '2026-01-01'
};

const makeSessionStorageMock = () => {
  const store: Record<string, string> = {};
  return {
    getItem: (k: string) => store[k] ?? null,
    setItem: (k: string, v: string) => { store[k] = v; },
    removeItem: (k: string) => { delete store[k]; },
    clear: () => { Object.keys(store).forEach(k => delete store[k]); }
  };
};

describe('UserSessionService', () => {
  let service: UserSessionService;

  beforeEach(() => {
    vi.stubGlobal('sessionStorage', makeSessionStorageMock());
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSessionService);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
    vi.unstubAllGlobals();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return null currentUser initially', () => {
    expect(service.currentUser).toBeNull();
  });

  it('should set and get currentUser', () => {
    service.setUser(mockMember);
    expect(service.currentUser?.name).toBe('Alice');
  });

  it('should return isLead true when lead user is set', () => {
    service.setUser(mockMember);
    expect(service.isLead).toBe(true);
  });

  it('should return currentMemberId', () => {
    service.setUser(mockMember);
    expect(service.currentMemberId).toBe('abc-123');
  });

  it('should clear user on clearUser()', () => {
    service.setUser(mockMember);
    service.clearUser();
    expect(service.currentUser).toBeNull();
  });

  it('should persist user to sessionStorage', () => {
    service.setUser(mockMember);
    const stored = sessionStorage.getItem('wpt_current_user');
    expect(stored).not.toBeNull();
    expect(JSON.parse(stored!).name).toBe('Alice');
  });
});