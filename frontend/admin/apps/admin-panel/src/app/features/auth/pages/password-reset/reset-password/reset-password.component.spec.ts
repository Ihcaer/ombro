import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResetPasswordComponent } from './reset-password.component';
import { COMMON_TESTING_PROVIDERS } from '@ombro/admin-panel/app/shared/testing/common-testing-providers';
import { AUTH_PAGE_BASE_TESTING_PROVIDERS } from '../../auth-page-base-testing-providers';
import { getTranslocoTestingModule } from '@ombro/admin-panel/app/shared/testing/transloco-testing-module';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordComponent, getTranslocoTestingModule()],
      providers: [...COMMON_TESTING_PROVIDERS, ...AUTH_PAGE_BASE_TESTING_PROVIDERS],
    }).compileComponents();

    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
