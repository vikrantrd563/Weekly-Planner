import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewFreeze } from './review-freeze';

describe('ReviewFreeze', () => {
  let component: ReviewFreeze;
  let fixture: ComponentFixture<ReviewFreeze>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReviewFreeze]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReviewFreeze);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
