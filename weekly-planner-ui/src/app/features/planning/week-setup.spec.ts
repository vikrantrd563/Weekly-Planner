import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WeekSetup } from './week-setup';

describe('WeekSetup', () => {
  let component: WeekSetup;
  let fixture: ComponentFixture<WeekSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeekSetup]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WeekSetup);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
