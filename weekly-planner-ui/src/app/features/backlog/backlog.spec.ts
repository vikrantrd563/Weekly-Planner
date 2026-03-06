import { TestBed } from '@angular/core/testing';
import { Backlog } from './backlog';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('Backlog', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Backlog],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  afterEach(() => { TestBed.resetTestingModule(); });

  it('should create', () => {
    const fixture = TestBed.createComponent(Backlog);
    expect(fixture.componentInstance).toBeTruthy();
  });
});