import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join, resolve } from 'node:path';
import { existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { REFRESH_TOKEN_COOKIE_NAME } from '@core/auth/auth.constants';

async function generateSwaggerSpec() {
  const app = await NestFactory.create(AppModule, { logger: false });

  const config = new DocumentBuilder()
    .setTitle('API documentation')
    .setDescription('REST API documentation for the application.')
    .setVersion('0.1')
    .addBearerAuth()
    .addCookieAuth(
      REFRESH_TOKEN_COOKIE_NAME,
      {
        type: 'apiKey',
        in: 'cookie',
        name: REFRESH_TOKEN_COOKIE_NAME,
        description: 'Cookie with refresh token',
      },
      REFRESH_TOKEN_COOKIE_NAME,
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);

  const outputDir = resolve(process.cwd(), '..', 'contracts');
  const outputPath = join(outputDir, 'swagger.json');

  if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

  writeFileSync(outputPath, JSON.stringify(document, null, 2), 'utf8');

  console.log('OpenAPI specification generated successfully:', outputPath);

  await app.close();
  process.exit();
}

generateSwaggerSpec().catch((err) => {
  console.error('Error generating OpenAPI spec:', err);
  process.exit(1);
});
