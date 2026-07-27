import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { apiPrefixInterceptor } from './api-prefix.interceptor';
import { environment } from '@ombro/admin-panel/environments/environment.example';

describe('apiPrefixInterceptor', () => {
  let http: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiPrefixInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);

    vi.spyOn(environment, 'api', 'get').mockReturnValue({
      domain: '',
      baseUrl: '/api/v1',
      endpoints: { public: 'public', admin: 'admin' },
    });
  });

  afterEach(() => {
    httpTesting.verify();
    vi.restoreAllMocks();
  });

  it('should add a prefix with predictable environment values', () => {
    const mockRequestPath = '/users';
    const expectedRequestPath = '/api/v1/public' + mockRequestPath;

    http.get(mockRequestPath).subscribe();

    const req = httpTesting.expectOne(expectedRequestPath);
    expect(req.request.url).toBe(expectedRequestPath);
  });

  it.each([
    { domain: 'test-domain', expectedProtocol: 'https', desc: 'custom domain' },
    { domain: 'localhost', expectedProtocol: 'http', desc: 'localhost' },
  ])(
    'should use $expectedProtocol protocol for scenario: $desc',
    ({ domain, expectedProtocol }) => {
      const mockRequestPath = 'users';
      const baseUrl = 'api/v1';
      const publicEndpoint = 'public';
      const expectedRequestPath = `${expectedProtocol}://${domain}/${baseUrl}/${publicEndpoint}/${mockRequestPath}`;

      vi.spyOn(environment, 'api', 'get').mockReturnValue({
        domain: domain,
        baseUrl: baseUrl,
        endpoints: { public: publicEndpoint, admin: 'admin' },
      });

      http.get(mockRequestPath).subscribe();
      const req = httpTesting.expectOne(expectedRequestPath);
      expect(req.request.url).toBe(expectedRequestPath);
    },
  );
});
