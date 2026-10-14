import { Test, TestingModule } from '@nestjs/testing';
import { AuditLogService } from './audit-log.service.js';
import { AuditLog, AuditVisibility, AuthAdmin, Prisma } from '@generated/prisma-client/client.js';
import { EntityType } from '@modules/audit/audit-log-fields.enums.js';
import { PrismaService } from '@core/database/prisma/prisma.service.js';
import { AdminPrivileges } from '@core/auth/enums/admin-privileges.js';

type AuditLogFindManyArgs = Prisma.AuditLogFindManyArgs;

const actorId: AuthAdmin['id'] = 1;
const otherTargetId: AuthAdmin['id'] = 2;
const requester = {
  make: (id: AuthAdmin['id'], privileges: AuthAdmin['privileges'] = 0) => ({
    id,
    privileges,
  }),
};

const lastCallWhere = (): Prisma.AuditLogWhereInput => {
  const call = prismaMock.auditLog.findMany.mock.calls.at(-1);
  if (!call) throw new Error('findMany was not called');
  if (!call[0]?.where) throw new Error('findMany was called without where');
  return call[0].where;
};

type FindManyMock = (args: AuditLogFindManyArgs) => Promise<AuditLog[]>;

const prismaMock = {
  auditLog: {
    findMany: vi.fn<FindManyMock>(),
  },
};

describe('AuditLogService', () => {
  let service: AuditLogService;

  const callGetLogs = (
    target: number,
    who: { id: AuthAdmin['id']; privileges: AuthAdmin['privileges'] },
    options?: { recordsNumber?: number; lastRecordId?: AuditLog['id'] },
  ) => service.getLogs(target, who, options);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuditLogService, { provide: PrismaService, useValue: prismaMock }],
    }).compile();

    service = module.get<AuditLogService>(AuditLogService);

    vi.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('where filtering', () => {
    it('does not add visibility conditions for own logs (isSelf)', async () => {
      prismaMock.auditLog.findMany.mockResolvedValue([]);

      await callGetLogs(actorId, requester.make(actorId, AdminPrivileges.ADMINS_MANAGE));

      expect(prismaMock.auditLog.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            entityType: EntityType.ADMIN,
            entityId: String(actorId),
          },
        }),
      );
    });

    it('for others logs, it requires actorId = requester OR permitted visibility', async () => {
      prismaMock.auditLog.findMany.mockResolvedValue([]);

      await callGetLogs(otherTargetId, requester.make(actorId));

      expect(lastCallWhere().OR).toEqual([
        { actorType: 'ADMIN', actorId: String(actorId) },
        { visibility: { in: [AuditVisibility.PUBLIC, AuditVisibility.ACTOR_AND_TARGET] } },
      ]);
    });
  });
});
