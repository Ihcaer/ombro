import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthWrapperComponent } from './auth-wrapper.component';
import { AuthStore, AuthStoreInstance } from '@ombro/admin-panel/app/core/auth/store';
import { signal } from '@angular/core';
import { COMMON_TESTING_PROVIDERS } from '@ombro/admin-panel/app/shared/testing/common-testing-providers';
import { Mocked } from 'vitest';
import { getTranslocoTestingModule } from '@ombro/admin-panel/app/shared/testing/transloco-testing-module';

describe('AuthWrapperComponent', () => {
  let component: AuthWrapperComponent;
  let fixture: ComponentFixture<AuthWrapperComponent>;
  let authStore: Mocked<AuthStoreInstance>;
  let mockLastResponseErrorSignal = signal(undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthWrapperComponent, getTranslocoTestingModule()],
      providers: [
        ...COMMON_TESTING_PROVIDERS,
        { provide: AuthStore, useValue: { lastResponseError: mockLastResponseErrorSignal } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthWrapperComponent);
    component = fixture.componentInstance;

    authStore = TestBed.inject(AuthStore) as Mocked<AuthStoreInstance>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
