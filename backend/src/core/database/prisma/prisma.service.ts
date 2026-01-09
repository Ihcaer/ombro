import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@generated/prisma-client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { ConfigType } from '@nestjs/config';
import databaseConfig from '@core/config/envs/database.config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(databaseConfig.KEY)
    private dbConfig: ConfigType<typeof databaseConfig>,
  ) {
    const dbUrl = dbConfig.url;
    const adapter = new PrismaPg({ connectionString: dbUrl });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
