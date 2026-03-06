import { TestBed } from '@angular/core/testing';
import { Team } from './team';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Team', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Team],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  afterEach(() => { TestBed.resetTestingModule(); });

  it('should create', () => {
    const fixture = TestBed.createComponent(Team);
    expect(fixture.componentInstance).toBeTruthy();
  });
});