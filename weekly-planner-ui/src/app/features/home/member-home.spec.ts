import { TestBed } from "@angular/core/testing";
import { MemberHome } from "./member-home";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("MemberHome", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberHome],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = TestBed.createComponent(MemberHome);
    expect(fixture.componentInstance).toBeTruthy();
  });
});