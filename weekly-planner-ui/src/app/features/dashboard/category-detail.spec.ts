import { TestBed } from "@angular/core/testing";
import { CategoryDetail } from "./category-detail";
import { provideRouter } from "@angular/router";
import { provideHttpClient } from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";

describe("CategoryDetail", () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryDetail],
      providers: [
        provideRouter([]),
        provideHttpClient(),
        provideHttpClientTesting(),
      ],
    }).compileComponents();
  });

  it("should create", () => {
    const fixture = TestBed.createComponent(CategoryDetail);
    expect(fixture.componentInstance).toBeTruthy();
  });
});