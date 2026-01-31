import request from 'supertest';
import {
  ConfirmAdminRequestDto,
  CreateAdminRequestDto,
  LoginRequestDto,
  LoginResponseDto,
} from '@core/auth/dto';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';
import { AdminAccountActivationTemplate } from '@shared/email/templates/auth/admin-account-activation.template';
import { HashService } from '@shared/hash/hash.service';
import { compare, hash } from 'bcrypt';
import { clearDatabase, mailpitConfig, TestContext, waitForEmail } from './helpers';

describe('Auth Module', () => {
  jest.setTimeout(25000);
  let ctx: TestContext;
  const modulePrefix = '/auth';
  let adminRegistrationService: AdminRegistrationService;
  let hashService: HashService;

  beforeAll(async () => {
    ctx = await TestContext.init();
    adminRegistrationService = ctx.app.get(AdminRegistrationService);
    hashService = ctx.app.get(HashService);
  });

  beforeEach(async () => {
    await clearDatabase(ctx.prisma);
    jest.restoreAllMocks();
  });

  afterAll(async () => {
    await ctx.cleanup();
  });

  describe('Admin activation flow', () => {
    it('should allow user to log in after email confirmation', async () => {
      const newAdminData: Readonly<CreateAdminRequestDto> = {
        displayName: 'display name',
        handleName: 'handle',
        email: 'test@email.com',
        privileges: 1,
      };

      const newAdmin = await adminRegistrationService.createAdminAccount(newAdminData);

      const mail = await waitForEmail({
        recipient: newAdminData.email,
        subject: 'Potwierdź rejestrację',
      });

      const mailRes = await fetch(`${mailpitConfig.mailpitApi}/message/${mail.ID}`);
      const { HTML } = (await mailRes.json()) as { HTML: string };

      const tokenRegex = new RegExp(
        `(?<=${AdminAccountActivationTemplate.REGISTRATION_SLUG + '/'})[a-zA-Z0-9_-]+`,
      );
      const tokenMatch = HTML.match(tokenRegex);
      if (!tokenMatch) throw new Error('Test failed: No token found in registration link');

      const token = tokenMatch[0];

      const confirmAccountFormRes = await request(ctx.app.getHttpServer())
        .get(modulePrefix + '/confirm-account-form/' + token)
        .expect(200);

      const newPassword = 'testPassword';
      const filledFields: ConfirmAdminRequestDto = { password: newPassword };
      const loginCredentials: LoginRequestDto = {
        identifier: newAdminData.handleName!,
        password: newPassword,
      };

      jest
        .spyOn(hashService, 'hashBcrypt')
        .mockImplementation(
          async (password: string, saltRounds: number = HashService.DEFAULT_SALT_ROUNDS) =>
            await hash(password, saltRounds),
        );
      jest
        .spyOn(hashService, 'compareBcrypt')
        .mockImplementation(
          async (comparedValue: string, originalValue: string) =>
            await compare(comparedValue, originalValue),
        );

      await request(ctx.app.getHttpServer())
        .patch(modulePrefix + '/confirm-admin')
        .set('Authorization', `Bearer ${token}`)
        .send(filledFields)
        .expect(204);

      const loginRes = await request(ctx.app.getHttpServer())
        .post(modulePrefix + '/login')
        .send(loginCredentials)
        .expect(201);

      const loginResCookies = loginRes.get('Set-Cookie');
      const loginResBody = loginRes.body as LoginResponseDto;

      const { displayName, handleName, privileges } = newAdminData;
      const loginExpectedBody: Partial<LoginResponseDto> = {
        adminData: {
          id: 1,
          displayName,
          handleName: handleName!,
          privileges,
          avatarId: null,
          verification: 'VERIFIED',
          isActivated: true,
        },
      };

      expect(newAdmin).toBeDefined();
      expect(token).toBeDefined();
      expect(confirmAccountFormRes.body).toEqual(['password']);
      expect(loginResCookies).toBeDefined();
      expect(loginResCookies!.some((cookie) => cookie.includes('refresh_token'))).toBe(true);
      expect(loginResBody.adminData).toEqual(loginExpectedBody.adminData);
    });
  });
});
