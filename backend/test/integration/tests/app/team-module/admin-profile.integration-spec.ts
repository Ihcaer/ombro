import request from 'supertest';
import { TestContext } from '../../../helpers/test-context.js';
import { TEAM_MODULE_ROUTE_PREFIX } from '@modules/team/team.constants.js';
import { AuthAdmin } from '@generated/prisma-client/client.js';
import { PrivilegesUtils } from '@core/auth/utils/privileges.utils.js';
import { LoginRequestDto, LoginResponseDto } from '@core/auth/dto/index.js';
import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants.js';
import { AdminProfileDataResponseDto } from '@modules/team/admin-profile/dto/admin-profile-data-response.dto.js';

describe('Team module - admin profile', () => {
  let ctx: TestContext;
  let actor: AuthAdmin, targetAdmin: AuthAdmin;
  let actorLoginCredentials: LoginRequestDto;

  const actorPassword = 'actor-password';
  const modulePrefix = TEAM_MODULE_ROUTE_PREFIX;
  const loginEndpointPath = `/public/${AUTH_ROUTE_PREFIX}/login`;
  const adminProfileEndpointPath = (id: AuthAdmin['id'] | 'me') =>
    `/admin/${modulePrefix}/profile/${id}`;

  beforeAll(async () => {
    ctx = new TestContext();
    await ctx.init();
    await ctx.clearRedisQueue();
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
    it('should give admin profile data', async () => {
      const expectedResBody: AdminProfileDataResponseDto = {
        avatarUrl: null,
        displayName: targetAdmin.displayName,
        email: targetAdmin.email,
        handleName: targetAdmin.handleName,
        isActivated: targetAdmin.isActivated,
        lastLogged: targetAdmin.lastLogged,
        privileges: PrivilegesUtils.bitmaskToArray(targetAdmin.privileges),
        verification: targetAdmin.verification,
      };

      const loginRes = await request(ctx.app.getHttpServer())
        .patch(loginEndpointPath)
        .send(actorLoginCredentials)
        .expect(201);
      const loginResBody = loginRes.body as LoginResponseDto;

      const adminProfile = await request(ctx.app.getHttpServer())
        .get(adminProfileEndpointPath(targetAdmin.id))
        .set('Authorization', 'Bearer ' + loginResBody.accessToken)
        .expect(200);

      expect(adminProfile.body).toEqual(expectedResBody);
    });
  });
});
