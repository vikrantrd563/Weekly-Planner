import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastWeeks } from './past-weeks';

describe('PastWeeks', () => {
  let component: PastWeeks;
  let fixture: ComponentFixture<PastWeeks>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PastWeeks]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastWeeks);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
