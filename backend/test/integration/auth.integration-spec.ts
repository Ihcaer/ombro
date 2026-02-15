import request from 'supertest';
import {
  ConfirmAdminRequestDto,
  CreateAdminRequestDto,
  LoginRequestDto,
  LoginResponseDto,
  ResetPasswordRequestDto,
} from '@core/auth/dto';
import { AdminRegistrationService } from '@core/auth/services/admin-registration/admin-registration.service';
import { AdminAccountActivationTemplate } from '@shared/email/templates/auth/admin-account-activation.template';
import { TestContext } from './helpers';
import { AuthAdmin } from '@generated/prisma-client';
import { AUTH_ROUTE_PREFIX } from '@core/auth/auth.constants';
import { AdminPasswordResetTemplate } from '@shared/email/templates/auth/admin-password-reset.template';
import { ForgotPasswordRequestDto } from '@core/auth/dto/forgot-password-request.dto';

describe('Auth Module', () => {
  jest.setTimeout(25000);
  let ctx: TestContext;
  const modulePrefix = '/' + AUTH_ROUTE_PREFIX;
  let adminRegistrationService: AdminRegistrationService;

  beforeAll(async () => {
    ctx = new TestContext();
    await ctx.init();
    adminRegistrationService = ctx.app.get(AdminRegistrationService);
  });

  afterEach(async () => {
    await ctx.clearDatabase();
  });

  afterAll(async () => {
    await ctx.close();
  });

  describe('Admin activation flow', () => {
    it('should allow admin to log in after email confirmation', async () => {
      const newAdminData: Readonly<CreateAdminRequestDto> = {
        displayName: 'display name',
        handleName: 'handle',
        email: 'test@email.com',
        privileges: 1,
      };

      const newAdmin = await adminRegistrationService.createAdminAccount(newAdminData);

      const mail = await ctx.email.waitForEmail({
        recipient: newAdminData.email,
        subject: 'Potwierdź rejestrację',
      });

      const { HTML } = await ctx.email.getEmailContent(mail.ID);

      const tokenRegex = new RegExp(
        `(?<=${AdminAccountActivationTemplate.REGISTRATION_SLUG + '/'})[a-zA-Z0-9_-]+`,
      );
      const tokenMatch = HTML.match(tokenRegex);
      if (!tokenMatch) throw new Error('Test failed: No token found in registration email');

      const token = tokenMatch[0];

      const confirmAccountFormRes = await request(ctx.app.getHttpServer())
        .get(modulePrefix + '/register' + '/confirm-account-form/' + token)
        .expect(200);

      const newPassword = 'correct-horse-battery-staple-2026';
      const confirmAccountBody: ConfirmAdminRequestDto = {
        oneTimeToken: token,
        password: newPassword,
      };
      const loginCredentials: LoginRequestDto = {
        identifier: newAdminData.handleName!,
        password: newPassword,
      };

      await request(ctx.app.getHttpServer())
        .patch(modulePrefix + '/register' + '/confirm-admin')
        .send(confirmAccountBody)
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

      const adminSavedPassword = await ctx.prisma.authAdmin.findUnique({
        where: { handleName: newAdminData.handleName },
        select: { password: true },
      });

      const isHashedPasswordIsValid: boolean = adminSavedPassword!.password!.startsWith('$2b$');

      expect(newAdmin).toBeDefined();
      expect(token).toBeDefined();
      expect(confirmAccountFormRes.body).toEqual(['password']);
      expect(loginResCookies).toBeDefined();
      expect(loginResCookies!.some((cookie) => cookie.includes('refresh_token'))).toBe(true);
      expect(loginResBody.adminData).toEqual(loginExpectedBody.adminData);
      expect(adminSavedPassword!.password).not.toBe(newPassword);
      expect(isHashedPasswordIsValid).toBe(true);
    });
  });

  describe('Privilege protection verification', () => {
    it.each([
      { privilegeValue: 1, expected: 201, desc: 'correct privileges' },
      { privilegeValue: 0, expected: 403, desc: 'wrong privileges' },
      { privilegeValue: 3, expected: 201, desc: 'another correct privileges' },
    ])('should return $expected for scenario: $desc', async ({ privilegeValue, expected }) => {
      const admin: Partial<AuthAdmin> = {
        handleName: 'handle',
        password: 'password',
        privileges: privilegeValue,
      };
      const loginCredentials: LoginRequestDto = {
        identifier: admin.handleName!,
        password: admin.password!,
      };
      const newAdmin: CreateAdminRequestDto = {
        displayName: 'new-display-name',
        email: 'new-test@email.com',
        privileges: 1,
      };

      await ctx.adminFactory.create(admin);

      const loginRes = await request(ctx.app.getHttpServer())
        .post(modulePrefix + '/login')
        .send(loginCredentials)
        .expect(201);
      const accessToken = (loginRes.body as LoginResponseDto).jwt;

      await request(ctx.app.getHttpServer())
        .post(modulePrefix + '/register' + '/create-admin')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(newAdmin)
        .expect(expected);
    });
  });

  describe('password reset flow', () => {
    it('should allow admin to reset password', async () => {
      const adminEmail = 'reset-password-test@example.com';
      const newPassword = 'correct-horse-battery-staple-2026';

      await ctx.adminFactory.create({ email: adminEmail });

      const forgotPasswordDto: ForgotPasswordRequestDto = { email: adminEmail };
      await request(ctx.app.getHttpServer())
        .post(modulePrefix + '/recovery' + '/forgot')
        .send(forgotPasswordDto)
        .expect(202);

      const passwordResetEmail = await ctx.email.waitForEmail({
        recipient: adminEmail,
        subject: 'Resetowanie hasła w Skema Admin Panel',
      });

      const { HTML } = await ctx.email.getEmailContent(passwordResetEmail.ID);

      const tokenRegex = new RegExp(
        `(?<=${AdminPasswordResetTemplate.PASSWORD_RESET_SLUG + '/'})[a-zA-Z0-9_-]+`,
      );
      const tokenMatch = HTML.match(tokenRegex);
      if (!tokenMatch) throw new Error('Test failed: No token found in password reset email');
      const token = tokenMatch[0];

      const passwordResetDto: ResetPasswordRequestDto = { token, password: newPassword };

      await request(ctx.app.getHttpServer())
        .post(modulePrefix + '/recovery' + '/reset')
        .send(passwordResetDto)
        .expect(204);
    });
  });
});
