import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanMyWork } from './plan-my-work';

describe('PlanMyWork', () => {
  let component: PlanMyWork;
  let fixture: ComponentFixture<PlanMyWork>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanMyWork]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlanMyWork);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
