import { TestBed } from '@angular/core/testing';
import { PastWeeks } from './past-weeks';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('PastWeeks', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastWeeks],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  afterEach(() => { TestBed.resetTestingModule(); });

  it('should create', () => {
    const fixture = TestBed.createComponent(PastWeeks);
    expect(fixture.componentInstance).toBeTruthy();
  });
});