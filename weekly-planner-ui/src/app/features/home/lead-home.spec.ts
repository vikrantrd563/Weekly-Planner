import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadHome } from './lead-home';

describe('LeadHome', () => {
  let component: LeadHome;
  let fixture: ComponentFixture<LeadHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LeadHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LeadHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
