import { TestBed } from "@angular/core/testing";
import { MemberDetail } from "./member-detail";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("MemberDetail", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberDetail],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = TestBed.createComponent(MemberDetail);
    expect(fixture.componentInstance).toBeTruthy();
  });
});