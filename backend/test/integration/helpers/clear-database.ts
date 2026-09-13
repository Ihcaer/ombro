import { PrismaClient } from '@generated/prisma-client';
import { Logger } from '@nestjs/common';

export async function clearDatabase(prisma: PrismaClient, logger: Logger): Promise<void> {
  try {
    const tables: Array<{ full_name: string }> = await prisma.$queryRaw`
      SELECT '"' || schemaname || '"."' || tablename || '"' as full_name
      FROM pg_tables 
      WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
      AND tablename != '_prisma_migrations';
    `;

    if (tables.length === 0) return;

    const tableNames = tables.map((t) => t.full_name).join(', ');

    await prisma.$executeRawUnsafe(`TRUNCATE TABLE ${tableNames} RESTART IDENTITY CASCADE;`);
  } catch (error) {
    const cause = error instanceof Error ? error.message : String(error);
    logger.error(`Error while cleaning the database. Reason: ${cause}`);
  }
}
