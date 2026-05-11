import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL } from '../tokens/api-url.token';
import { LoginRequest, LoginResponse } from './dto/login.dto';
import { Observable } from 'rxjs';
import { AUTH_ENDPOINTS, AUTH_ROUTE_PREFIX } from './auth.constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseApi: string = inject(API_URL);

  private readonly fullApiUrl: string = this.baseApi + AUTH_ROUTE_PREFIX;

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.fullApiUrl}${AUTH_ENDPOINTS.LOGIN}`, credentials);
  }

  refreshToken(): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      `${this.fullApiUrl}${AUTH_ENDPOINTS.REFRESH_TOKEN}`,
      undefined,
      {
        withCredentials: true,
      },
    );
  }
}
