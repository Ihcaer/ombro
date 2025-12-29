import { Test, TestingModule } from '@nestjs/testing';
import { AuthTokenService } from './auth-token.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HashService } from '@common/hash/hash.service';
import { AccessJwtPayload, RefreshJwtPayload } from '@auth/types/jwt.types';
import { TokenExpirationContext } from '@auth/factories/token-expiration.factory';
import { InternalServerErrorException } from '@nestjs/common';

describe('AuthTokenService', () => {
  let service: AuthTokenService;
  let jwtService: jest.Mocked<JwtService>;
  let configService: jest.Mocked<ConfigService>;
  // let hashService: jest.Mocked<HashService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthTokenService,
        { provide: JwtService, useValue: { signAsync: jest.fn() } },
        { provide: ConfigService, useValue: { get: jest.fn() } },
        { provide: HashService, useValue: { hash: jest.fn() } },
      ],
    }).compile();

    service = module.get<AuthTokenService>(AuthTokenService);
    jwtService = module.get(JwtService);
    configService = module.get(ConfigService);
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

      configService.get
        .mockReturnValueOnce('access-secret')
        .mockReturnValueOnce('refresh-secret');
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

    it('should throw if jwt secrets are undefined', async () => {
      await expect(
        service.generateTokens(
          methodPayload.accessJwtPayload,
          methodPayload.refreshJwtPayload,
          methodPayload.tokensExpiration,
        ),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
