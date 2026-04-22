import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreadcrumbComponent } from './breadcrumb.component';
import { BreadcrumbService } from './breadcrumb.service';
import { signal } from '@angular/core';
import { BreadcrumbItem } from './types';
import { provideRouter } from '@angular/router';

describe('BreadcrumbComponent', () => {
  let component: BreadcrumbComponent;
  let fixture: ComponentFixture<BreadcrumbComponent>;

  const mockGetBreadcrumbSignal = signal<BreadcrumbItem[]>([]);
  const mockBreadcrumbService = {
    getBreadcrumbs: vi.fn().mockReturnValue(mockGetBreadcrumbSignal),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BreadcrumbComponent],
      providers: [
        provideRouter([]),
        {
          provide: BreadcrumbService,
          useValue: mockBreadcrumbService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(BreadcrumbComponent);
    component = fixture.componentInstance;
    // await fixture.whenStable();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
