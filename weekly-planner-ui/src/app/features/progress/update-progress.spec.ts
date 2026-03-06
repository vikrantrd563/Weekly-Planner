import { TestBed } from "@angular/core/testing";
import { UpdateProgress } from "./update-progress";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("UpdateProgress", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpdateProgress],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = TestBed.createComponent(UpdateProgress);
    expect(fixture.componentInstance).toBeTruthy();
  });
});