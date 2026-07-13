import { AdminPrivileges } from '@core/auth/enums/admin-privileges';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { AuthAdmin } from '@generated/prisma-client';
import { PrismaClientKnownRequestError } from '@generated/prisma-client/runtime/client';
import { Logger } from '@nestjs/common';
import { HashService } from '@shared/hash/hash.service';
import { CommandRunner, InquirerService, Option, SubCommand } from 'nest-commander';
import { validateEmail } from '../functions/validate-email';

type SeedAdminCommandOptions = { email: string; password: string };
type AdminCreationData = Omit<
  AuthAdmin,
  'id' | 'avatarFileId' | 'lastLogged' | 'createdAt' | 'updatedAt'
>;

@SubCommand({
  name: 'admin',
  description: 'Adds the first admin (user) to the database',
})
export class SeedAdminSubCommand extends CommandRunner {
  private readonly logger = new Logger(SeedAdminSubCommand.name);

  constructor(
    private readonly prismaService: PrismaService,
    private readonly hashService: HashService,
    private readonly inquirer: InquirerService,
  ) {
    super();
  }

  async run(passedParams: string[], options?: SeedAdminCommandOptions): Promise<void> {
    let { email, password } = options || {};

    email = typeof email === 'string' && validateEmail(email) ? email : undefined;

    if (!email || !password) {
      const answers = await this.inquirer.ask<SeedAdminCommandOptions>(
        'admin-credentials-questions',
        { email, password },
      );

      email = answers.email;
      password = answers.password;
    }

    try {
      const adminTable = this.prismaService.authAdmin;

      this.logger.verbose('Checking admin (user) presence in the database...');
      const count = await adminTable.count();
      if (count > 0) {
        this.logger.warn('The database already contains admins (users). Skipping.');
        return;
      }

      this.logger.verbose(`Creating an administrator account for: ${email}...`);
      const hashedPassword = await this.hashService.hashBcrypt(password);
      const adminData: AdminCreationData = {
        email: email,
        password: hashedPassword,
        displayName: 'Owner',
        handleName: 'owner',
        privileges: AdminPrivileges.OWNER,
        verification: 'VERIFIED',
        isActivated: true,
      };
      await adminTable.create({ data: adminData });
      this.logger.verbose('Admin (user) has been successfully added.');
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        this.handlePrismaError(error);
      } else {
        this.logger.error(error);
      }
      process.exit(1);
    }
  }

  @Option({
    flags: '-e, --email <email>',
    description: 'Email address of the first admin (user)',
  })
  parseEmail(val: string): string {
    return val;
  }

  @Option({
    flags: '-p, --password <password>',
    description: 'Password of the first admin (user)',
  })
  parsePassword(val: string): string {
    return val;
  }

  private handlePrismaError(error: PrismaClientKnownRequestError): void {
    switch (error.code) {
      case 'P1001':
        this.logger.error('Database connection error');
        break;
      case 'P2002':
        this.logger.error('An admin (user) with this email address already exists.');
        break;
      default:
        this.logger.error(error);
    }
  }
}
