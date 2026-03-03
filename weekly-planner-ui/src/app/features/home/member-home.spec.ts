import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberHome } from './member-home';

describe('MemberHome', () => {
  let component: MemberHome;
  let fixture: ComponentFixture<MemberHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberHome]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MemberHome);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
