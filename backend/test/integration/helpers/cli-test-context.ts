import { PostgreSqlContainer, StartedPostgreSqlContainer } from '@testcontainers/postgresql';
import { execSync } from 'child_process';
import { TestingModule } from '@nestjs/testing';
import { PrismaService } from '@core/database/prisma/prisma.service';
import { CommandTestFactory } from 'nest-commander-testing';
import { CliModule } from '../../../src/cli/cli.module';

export class CliTestContext {
  prisma!: PrismaService;
  commandInstance!: TestingModule;
  private postgresContainer!: StartedPostgreSqlContainer;

  async init() {
    try {
      this.postgresContainer = await new PostgreSqlContainer('postgres:18-alpine')
        .withDatabase('testdb')
        .withUsername('testuser')
        .withPassword('testpassword')
        .start();

      process.env.POSTGRES_URL = this.postgresContainer.getConnectionUri();

      execSync('npx prisma migrate deploy', { env: { ...process.env } });

      this.commandInstance = await CommandTestFactory.createTestingCommand({
        imports: [CliModule],
      }).compile();

      this.prisma = this.commandInstance.get<PrismaService>(PrismaService);

      return this;
    } catch (error) {
      console.error('Error initializing CliTestContext:', error);
      await this.close();
      process.exit(1);
    }
  }

  async close() {
    if (this.commandInstance) await this.commandInstance.close();
    if (this.postgresContainer) await this.postgresContainer.stop();
  }
}
