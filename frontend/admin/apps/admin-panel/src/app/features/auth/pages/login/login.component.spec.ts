import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { COMMON_TESTING_PROVIDERS } from '@ombro/admin-panel/app/shared/testing/common-testing-providers';
import { AuthStore, AuthStoreInstance } from '@ombro/admin-panel/app/core/auth/store';
import { Mocked } from 'vitest';
import { signal } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authStore: Mocked<AuthStoreInstance>;

  const mockAuthStore = {
    lastResponseError: signal(null),
    isAdminLoggedIn: vi.fn(),
    login: vi.fn(),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        ...COMMON_TESTING_PROVIDERS,
        {
          provide: AuthStore,
          useValue: mockAuthStore,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authStore = TestBed.inject(AuthStore) as Mocked<AuthStoreInstance>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
