import { TestBed } from "@angular/core/testing";
import { PlanMyWork } from "./plan-my-work";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("PlanMyWork", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlanMyWork],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = TestBed.createComponent(PlanMyWork);
    expect(fixture.componentInstance).toBeTruthy();
  });
});