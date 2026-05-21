import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthWrapperComponent } from './auth-wrapper.component';
import { AuthStore } from '@ombro/admin-panel/app/core/auth/store';
import { signal } from '@angular/core';
import { provideRouter } from '@angular/router';
import { COMMON_TESTING_PROVIDERS } from '@ombro/admin-panel/app/shared/testing/common-testing-providers';

describe('AuthWrapperComponent', () => {
  let component: AuthWrapperComponent;
  let fixture: ComponentFixture<AuthWrapperComponent>;
  let mockLastErrorResponseSignal = signal(undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthWrapperComponent],
      providers: [
        ...COMMON_TESTING_PROVIDERS,
        { provide: AuthStore, useValue: { lastErrorResponse: mockLastErrorResponseSignal } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
