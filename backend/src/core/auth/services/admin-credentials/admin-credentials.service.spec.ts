/* eslint-disable @typescript-eslint/unbound-method */
import { Test, TestingModule } from '@nestjs/testing';
import { AdminCredentialsService } from './admin-credentials.service.js';
import { Mocked } from 'vitest';
import { PrismaService } from '@core/database/prisma/prisma.service.js';
import { HashService } from '@shared/hash/hash.service.js';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PASSWORD_STRENGTH_VALIDATOR } from '@core/auth/providers/password-strength.provider.js';
import { ChangePasswordRequestDto } from '@core/auth/dto/requests/change-password-request.dto.js';
import { AdminPasswordChangedEvent } from '@core/auth/events/admin-password-changed.event.js';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

const prismaServiceMock = {
  $transaction: vi.fn(),
  authAdmin: {
    findUnique: vi.fn(),
    update: vi.fn(),
  },
  authRefreshToken: { deleteMany: vi.fn() },
};
type PrismaServiceMock = typeof prismaServiceMock;

describe('AdminCredentialsService', () => {
  let service: AdminCredentialsService;
  let prismaService: PrismaServiceMock;
  let hashService: Mocked<HashService>;
  let eventEmitter: Mocked<EventEmitter2>;

  const isPasswordStrongValidator = vi.fn();

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AdminCredentialsService,
        {
          provide: PrismaService,
          useValue: prismaServiceMock,
        },
        {
          provide: HashService,
          useValue: { compareBcrypt: vi.fn(), hashBcrypt: vi.fn() },
        },
        {
          provide: EventEmitter2,
          useValue: { emit: vi.fn() },
        },
        {
          provide: PASSWORD_STRENGTH_VALIDATOR,
          useValue: isPasswordStrongValidator,
        },
      ],
    }).compile();

    service = module.get<AdminCredentialsService>(AdminCredentialsService);
    prismaService = module.get(PrismaService);
    hashService = module.get(HashService);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('changePassword()', () => {
    const adminId = 1;
    const currentPassword = 'currentPassword';
    const newPassword = 'newPassword';
    const hashedPassword = 'hashedPassword';
    const newHashedPassword = 'newHashedPassword';

    const dto: ChangePasswordRequestDto = {
      currentPassword,
      newPassword,
    };

    const admin = {
      id: adminId,
      email: 'test@example.com',
      handleName: 'testHandle',
      displayName: 'Test Admin',
      password: hashedPassword,
    };
    const adminSessionId = randomUUID();

    beforeEach(() => {
      prismaService.authAdmin.findUnique.mockResolvedValue(admin);
      hashService.compareBcrypt.mockResolvedValue(true);
      isPasswordStrongValidator.mockReturnValue(true);
      hashService.hashBcrypt.mockResolvedValue(newHashedPassword);
      prismaService.authAdmin.update.mockResolvedValue({ id: adminId });
      prismaService.authRefreshToken.deleteMany.mockResolvedValue(1);
      eventEmitter.emit.mockReturnValue(true);
    });

    it('should change the password successfully', async () => {
      await service.changePassword(dto, adminId, adminSessionId);

      expect(prismaService.authAdmin.findUnique).toHaveBeenCalledWith({
        where: { id: adminId },
        select: {
          email: true,
          handleName: true,
          displayName: true,
          password: true,
        },
      });

      expect(hashService.compareBcrypt).toHaveBeenCalledWith(currentPassword, hashedPassword);

      expect(isPasswordStrongValidator).toHaveBeenCalledWith(newPassword, [
        'test@example.com',
        'testHandle',
        'Test Admin',
      ]);

      expect(hashService.hashBcrypt).toHaveBeenCalledWith(newPassword, expect.any(Number));

      expect(prismaService.authAdmin.update).toHaveBeenCalledWith({
        where: { id: adminId },
        data: { password: newHashedPassword },
        select: { id: true },
      });

      expect(eventEmitter.emit).toHaveBeenCalledWith(
        AdminPasswordChangedEvent.EVENT_NAME,
        new AdminPasswordChangedEvent({ adminId }),
      );
    });

    it('should throw UnauthorizedException if admin does not exist', async () => {
      prismaService.authAdmin.findUnique.mockResolvedValue(null);

      await expect(service.changePassword(dto, adminId, adminSessionId)).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw BadRequestException if current password is incorrect', async () => {
      hashService.compareBcrypt.mockResolvedValue(false);

      await expect(service.changePassword(dto, adminId, adminSessionId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw BadRequestException if new password is weak', async () => {
      isPasswordStrongValidator.mockReturnValue(false);

      await expect(service.changePassword(dto, adminId, adminSessionId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
