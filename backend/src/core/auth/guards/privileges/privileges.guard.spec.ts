import { Reflector } from '@nestjs/core';
import { PrivilegesGuard } from './privileges.guard';
import { Test, TestingModule } from '@nestjs/testing';
import { AdminPrivileges } from '@core/auth/enums/admin-privileges';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { AuthVerification } from '@generated/prisma-client';
import { createMockContext } from './privileges.guard.mock';

describe('PrivilegesGuard', () => {
  let guard: PrivilegesGuard;
  let reflector: jest.Mocked<Reflector>;

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrivilegesGuard,
        { provide: Reflector, useValue: { getAllAndOverride: jest.fn() } },
      ],
    }).compile();

    guard = module.get<PrivilegesGuard>(PrivilegesGuard);
    reflector = module.get(Reflector);
  });

  it.each([
    {
      requiredPrivileges: [AdminPrivileges.ADMINS_MANAGE],
      requestPayload: {
        user: {
          id: 1,
          privileges: AdminPrivileges.ADMINS_MANAGE,
          verification: AuthVerification.VERIFIED,
          isActivated: true,
        },
      },
      expected: true,
      desc: 'correct privileges',
    },
    {
      requiredPrivileges: [AdminPrivileges.FILE_MANAGE],
      requestPayload: {
        user: {
          id: 1,
          privileges: AdminPrivileges.ADMINS_MANAGE,
          verification: AuthVerification.VERIFIED,
          isActivated: true,
        },
      },
      expected: 'ForbiddenException',
      desc: 'wrong privileges',
    },
  ])(
    'should return $expected for scenario: $desc',
    ({ requiredPrivileges, requestPayload, expected }) => {
      reflector.getAllAndOverride.mockReturnValue([...requiredPrivileges]);
      const mockContext: ExecutionContext = createMockContext(requestPayload);
      if (expected === 'ForbiddenException') {
        expect(() => guard.canActivate(mockContext)).toThrow(ForbiddenException);
      } else {
        expect(guard.canActivate(mockContext)).toBe(expected);
      }
    },
  );
});
