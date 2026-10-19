import request, { Response } from 'supertest';
import { TestContext } from '../../../helpers/test-context.js';
import { TEAM_MODULE_ROUTE_PREFIX } from '@modules/team/team.constants.js';
import { AuditActorType, AuditVisibility, AuthAdmin } from '@generated/prisma-client/client.js';
import { PrivilegesUtils } from '@core/auth/utils/privileges.utils.js';
import { LoginRequestDto, LoginResponseDto } from '@core/auth/dto/index.js';
import { AdminProfileDataResponseDto } from '@modules/team/admin-profile/dto/admin-profile-data-response.dto.js';
import { AdminOwnProfileDataResponseDto } from '@modules/team/admin-profile/dto/admin-own-profile-data-response.dto.js';
import { AuditLogCreateManyInput } from '@generated/prisma-client/models.js';
import { AuditLogRecord } from '@modules/audit/types/audit-log.types.js';
import { Action, EntityType, Module } from '@modules/audit/audit-log-fields.enums.js';
import { AdminPrivilegesTranslated } from '@core/auth/types/admin.types.js';

const randomEnum = <T extends object>(e: T, i: number): T[keyof T] => {
  const values = Object.values(e) as T[keyof T][];
  return values[i % values.length];
};

describe('Team module - admin profile', () => {
  let ctx: TestContext;
  let actor: AuthAdmin, targetAdmin: AuthAdmin;
  let actorLoginCredentials: LoginRequestDto;

  let requestSelfAdminProfile: (accessToken: string) => Promise<Response>;
  let requestOtherAdminProfile: (
    accessToken: string,
    targetId: AuthAdmin['id'],
  ) => Promise<Response>;

  const actorPassword = 'actor-password';
  const modulePrefix = TEAM_MODULE_ROUTE_PREFIX;
  const selfProfileEndpoint = 'me';
  const adminProfileEndpointPath = (id: AuthAdmin['id'] | typeof selfProfileEndpoint) =>
    `/admin/${modulePrefix}/profile/${id}`;

  beforeAll(async () => {
    ctx = new TestContext();
    await ctx.init();
    await ctx.clearRedisQueue();

    requestSelfAdminProfile = async (accessToken) =>
      await request(ctx.app.getHttpServer())
        .get(adminProfileEndpointPath(selfProfileEndpoint))
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200);
    requestOtherAdminProfile = async (accessToken, targetId) =>
      await request(ctx.app.getHttpServer())
        .get(adminProfileEndpointPath(targetId))
        .set('Authorization', 'Bearer ' + accessToken)
        .expect(200);
  });

  beforeEach(async () => {
    actor = await ctx.adminFactory.create({
      privileges: PrivilegesUtils.arrayToBitmask(['ADMINS_MANAGE'])!,
      password: actorPassword,
    });
    targetAdmin = await ctx.adminFactory.create();

    actorLoginCredentials = { identifier: actor.handleName!, password: actorPassword };
  });

  afterEach(async () => {
    await ctx.clearDatabase();
  });

  describe('Get admin profile flow', () => {
    describe('show profile', () => {
      type Case = { scenario: 'self-profile' | 'other-profile'; desc: string };
      const cases: Case[] = [
        {
          scenario: 'other-profile',
          desc: 'view other admin',
        },
        {
          scenario: 'self-profile',
          desc: 'view self profile',
        },
      ];
      it.each(cases)('should return correct data for scenario: $desc', async ({ scenario }) => {
        let expectedProfileResBody: AdminProfileDataResponseDto | AdminOwnProfileDataResponseDto;
        let adminProfile: Response;

        const loginResBody = (await ctx.actions.loginAsAdmin(actorLoginCredentials))
          .body as LoginResponseDto;
        const actorAccessToken: LoginResponseDto['accessToken'] = loginResBody.accessToken;

        switch (scenario) {
          case 'other-profile':
            expectedProfileResBody = {
              adminProfile: {
                avatarUrl: null,
                displayName: targetAdmin.displayName,
                email: targetAdmin.email,
                handleName: targetAdmin.handleName,
                isActivated: targetAdmin.isActivated,
                lastLogged: targetAdmin.lastLogged,
                privileges: PrivilegesUtils.bitmaskToArray(targetAdmin.privileges),
                verification: targetAdmin.verification,
              },
              auditLog: [],
            };
            adminProfile = await requestOtherAdminProfile(actorAccessToken, targetAdmin.id);
            break;
          case 'self-profile': {
            const lastLogged = (await ctx.prisma.authAdmin.findUnique({
              where: { id: actor.id },
              select: { lastLogged: true },
            }))!.lastLogged;
            if (!lastLogged && lastLogged !== null) throw new Error('Lack of actor in db');
            const lastLoggedFormatted: string | null =
              lastLogged === null ? lastLogged : lastLogged.toISOString();

            expectedProfileResBody = {
              // @ts-expect-error lastLogged property is 'Date | null' type but to check http response is changed to 'string | null'
              adminProfile: { email: actor.email, lastLogged: lastLoggedFormatted },
              auditLog: [],
            };
            adminProfile = await requestSelfAdminProfile(actorAccessToken);
            break;
          }
        }

        expect(adminProfile.body).toEqual(expectedProfileResBody);
      });
    });

    describe('show audit log', () => {
      let newLogs: AuditLogCreateManyInput[];
      let logs: AuditLogRecord[];
      let filterLogs: (
        filterFn: (log: AuditLogRecord, index: number, array: AuditLogRecord[]) => boolean,
      ) => object[];
      let expectedLogs: object[];
      let actorAccessToken: string;

      beforeEach(async () => {
        newLogs = Array.from({ length: 10 }, (_, i) => ({
          actorType: randomEnum(AuditActorType, i),
          actorId: String(actor.id),
          module: randomEnum(Module, i),
          action: randomEnum(Action, i),
          entityType: randomEnum(EntityType, i),
          entityId: String(targetAdmin.id),
          visibility: randomEnum(AuditVisibility, i),
        }));
        logs = (await ctx.prisma.auditLog.createManyAndReturn({
          data: newLogs,
        })) as AuditLogRecord[];

        filterLogs = (filterFn) =>
          logs
            .filter(filterFn)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 3)
            .map((log) => ({ ...log, createdAt: new Date(log.createdAt).toISOString() }));
      });

      it('should show only logs where the recipient is either the actor or the target', async () => {
        const actorId = String(actor.id);
        expectedLogs = filterLogs(
          (log) =>
            (log.actorType === 'ADMIN' && log.actorId === actorId) ||
            (log.entityType === EntityType.ADMIN && log.entityId === actorId),
        );

        actorAccessToken = (
          (await ctx.actions.loginAsAdmin(actorLoginCredentials)).body as LoginResponseDto
        ).accessToken;
        const selfProfile = (await requestSelfAdminProfile(actorAccessToken))
          .body as unknown as AdminOwnProfileDataResponseDto;

        expect(selfProfile.auditLog).toEqual(expectedLogs);
      });

      type Case = {
        actorPrivileges: AdminPrivilegesTranslated[];

        desc: string;
      };
      const cases: Case[] = [
        { actorPrivileges: ['ADMINS_MANAGE'], desc: 'admin manager' },
        { actorPrivileges: ['SUPER_ADMIN'], desc: 'super admin' },
        { actorPrivileges: [], desc: 'no special privileges' },
      ];
      it.each(cases)(
        'should only show logs for which it has permissions: $desc',
        async ({ actorPrivileges }) => {
          const caseActorPassword = 'case-password';
          const caseActor = await ctx.adminFactory.create({
            privileges: PrivilegesUtils.arrayToBitmask(actorPrivileges)!,
            password: caseActorPassword,
          });
          const caseActorPrivileges = PrivilegesUtils.bitmaskToArray(caseActor.privileges);
          const caseTarget = targetAdmin;
          const caseTargetId = String(targetAdmin.id);

          const allowedVisibility: AuditVisibility[] = ['PUBLIC'];
          if (caseActorPrivileges.includes('SUPER_ADMIN')) {
            allowedVisibility.push(AuditVisibility.SUPER_ADMIN, AuditVisibility.MANAGER);
          } else if (caseActorPrivileges.includes('ADMINS_MANAGE')) {
            allowedVisibility.push(AuditVisibility.MANAGER);
          }
          expectedLogs = filterLogs(
            (log) =>
              ((log.actorType === 'ADMIN' && log.actorId === caseTargetId) ||
                (log.entityType === EntityType.ADMIN && log.entityId === caseTargetId)) &&
              allowedVisibility.includes(log.visibility),
          );

          actorAccessToken = (
            (
              await ctx.actions.loginAsAdmin({
                identifier: caseActor.email,
                password: caseActorPassword,
              })
            ).body as LoginResponseDto
          ).accessToken;
          const adminProfile = (await requestOtherAdminProfile(actorAccessToken, caseTarget.id))
            .body as unknown as AdminOwnProfileDataResponseDto;

          expect(adminProfile.auditLog).toEqual(expectedLogs);
        },
      );
    });
  });
});
