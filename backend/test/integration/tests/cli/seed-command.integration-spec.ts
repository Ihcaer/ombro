import { CommandTestFactory } from 'nest-commander-testing';
import { CliTestContext } from '../../helpers/cli-test-context';
import { HashService } from '@shared/hash/hash.service';

describe('(CLI) seed command', () => {
  let ctx: CliTestContext;

  beforeAll(async () => {
    ctx = new CliTestContext();
    await ctx.init();
  });

  afterAll(async () => {
    await ctx.close();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('admin sub-command', () => {
    it('should successfully seed a new admin', async () => {
      const testEmail = 'admin-test@example.com';
      const testPassword = 'testPassword';

      const hashService = ctx.commandInstance.get(HashService);
      const hashPasswordSpy = jest.spyOn(hashService, 'hashBcrypt');

      await CommandTestFactory.run(ctx.commandInstance, [
        'seed',
        'admin',
        '-e',
        testEmail,
        '-p',
        testPassword,
      ]);

      const adminInDb = await ctx.prisma.authAdmin.findUnique({ where: { email: testEmail } });

      expect(adminInDb).toBeTruthy();
      expect(adminInDb?.email).toBe(testEmail);
      expect(hashPasswordSpy).toHaveBeenCalledTimes(1);
    });
  });
});
