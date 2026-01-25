import { Test, TestingModule } from '@nestjs/testing';
import { AuthTokenService } from './auth-token.service';
import { JwtService } from '@nestjs/jwt';
import { HashService } from '@shared/hash/hash.service';
import { TokenExpirationContext } from '../../factories/token-expiration.factory';
import { AccessJwtPayload, RefreshJwtPayload } from '../../types/jwt.types';
import securityConfig from '@core/config/envs/security.config';
import { createSecurityConfigMock } from '@mocks/config/security.config.mock';

describe('AuthTokenService', () => {
  let service: AuthTokenService;
  let jwtService: jest.Mocked<JwtService>;
  // let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthTokenService,
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
        { provide: securityConfig.KEY, useValue: createSecurityConfigMock() },
        { provide: HashService, useValue: { hash: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthTokenService>(AuthTokenService);
    jwtService = module.get(JwtService);
    // hashService = module.get(HashService);
  });

  describe('.generateTokens()', () => {
    let methodPayload: {
      accessJwtPayload: AccessJwtPayload;
      refreshJwtPayload: RefreshJwtPayload;
      tokensExpiration: TokenExpirationContext;
    };
    let jwtTokens: { accessToken: string; refreshToken: string };

    beforeEach(() => {
      methodPayload = {
        accessJwtPayload: {
          id: 1,
          privileges: 1,
          verification: 'VERIFIED',
          isActivated: true,
        },
        refreshJwtPayload: { id: 1 },
        tokensExpiration: {
          now: new Date('2025-12-29T16:00:00Z'),
          accessExpiresAt: new Date('2025-12-29T17:00:00Z'),
          refreshExpiresAt: new Date('2025-12-30T00:00:00Z'),
          accessExpiresInSec: 900,
          refreshExpiresInSec: 86400,
        },
      };
      jwtTokens = {
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      };
    });

    it('should generate tokens successfully', async () => {
      const tokens = { ...jwtTokens };

      jwtService.signAsync
        .mockResolvedValueOnce(tokens.accessToken)
        .mockResolvedValueOnce(tokens.refreshToken);

      await expect(
        service.generateTokens(
          methodPayload.accessJwtPayload,
          methodPayload.refreshJwtPayload,
          methodPayload.tokensExpiration,
        ),
      ).resolves.toEqual(jwtTokens);
    });
  });
});
