import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dtos';
import { Observable } from 'rxjs';
import { AUTH_ENDPOINTS, AUTH_ROUTE_PREFIX } from './auth-api-endpoints';
import { RequestPasswordResetRequestDto, ResetPasswordRequestDto } from './dto/reset-password.dtos';
import {
  FinalizeAdminRegistrationRequestDto,
  RegistrationEligibilityRequestDto,
  RegistrationEligibilityResponseDto,
} from './dto/admin-register.dtos';
import { withApiScopeContext } from './interceptors/api-prefix/api-prefix.interceptor';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  private readonly fullApiUrl: string = '/' + AUTH_ROUTE_PREFIX;

  login(credentials: LoginRequestDto): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      `${this.fullApiUrl}/${AUTH_ENDPOINTS.LOGIN}`,
      credentials,
    );
  }

  refreshToken(): Observable<LoginResponseDto> {
    return this.http.post<LoginResponseDto>(
      `${this.fullApiUrl}/${AUTH_ENDPOINTS.REFRESH_TOKEN}`,
      undefined,
      {
        withCredentials: true,
        context: withApiScopeContext('admin'),
      },
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.fullApiUrl}/${AUTH_ENDPOINTS.LOGOUT}`, undefined, {
      withCredentials: true,
      context: withApiScopeContext('admin'),
    });
  }

  requestPasswordReset(dto: RequestPasswordResetRequestDto): Observable<void> {
    return this.http.post<void>(
      `${this.fullApiUrl}/${AUTH_ENDPOINTS.PASSWORD_RESET.REQUEST_RESET}`,
      dto,
    );
  }

  resetPassword(dto: ResetPasswordRequestDto): Observable<void> {
    return this.http.post<void>(`${this.fullApiUrl}/${AUTH_ENDPOINTS.PASSWORD_RESET.RESET}`, dto);
  }

  checkRegistrationEligibility(
    token: RegistrationEligibilityRequestDto,
  ): Observable<RegistrationEligibilityResponseDto> {
    return this.http.get<RegistrationEligibilityResponseDto>(
      `${this.fullApiUrl}/${AUTH_ENDPOINTS.REGISTRATION.CHECK_ELIGIBILITY}/${token}`,
    );
  }

  finalizeAdminRegistration(dto: FinalizeAdminRegistrationRequestDto): Observable<void> {
    return this.http.post<void>(`${this.fullApiUrl}/${AUTH_ENDPOINTS.REGISTRATION.FINALIZE}`, dto);
  }
}
