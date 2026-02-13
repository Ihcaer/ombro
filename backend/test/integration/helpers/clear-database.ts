import { PrismaClient } from '@generated/prisma-client';

export async function clearDatabase(prisma: PrismaClient): Promise<void> {
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
    console.error('Error while cleaning the database:', error);
  }
}
