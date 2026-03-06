import { TestBed } from '@angular/core/testing';
import { WeekSetup } from './week-setup';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('WeekSetup', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekSetup],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  afterEach(() => { TestBed.resetTestingModule(); });

  it('should create', () => {
    const fixture = TestBed.createComponent(WeekSetup);
    expect(fixture.componentInstance).toBeTruthy();
  });
});