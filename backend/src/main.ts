import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Client } from 'pg';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { existsSync, mkdirSync } from 'fs';

async function ensureDatabaseExists() {
  if (process.env.DATABASE_URL || process.env.NODE_ENV === 'production') {
    return;
  }
  const dbName = process.env.DB_NAME || 'tanomafi';
  const user = process.env.DB_USERNAME || 'postgres';
  const password = process.env.DB_PASSWORD || 'hackermode';
  const host = process.env.DB_HOST || 'localhost';
  const port = Number(process.env.DB_PORT) || 5432;

  const client = new Client({
    user,
    password,
    host,
    port,
    database: 'postgres',
  });

  try {
    await client.connect();
    const res = await client.query(`SELECT 1 FROM pg_database WHERE datname = '${dbName}'`);
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${dbName}"`);
      console.log(`✅ Base de données PostgreSQL "${dbName}" créée avec succès !`);
    } else {
      console.log(`✅ Base de données PostgreSQL "${dbName}" déjà existante.`);
    }
  } catch (err) {
    console.warn(`⚠️ Warning vérification PostgreSQL DB: ${err.message}`);
  } finally {
    await client.end().catch(() => {});
  }
}

async function bootstrap() {
  await ensureDatabaseExists();

  const uploadsDir = join(process.cwd(), 'uploads');
  if (!existsSync(uploadsDir)) {
    mkdirSync(uploadsDir, { recursive: true });
  }

  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  
  // Serve static uploaded files at http://localhost:3001/uploads/...
  app.useStaticAssets(uploadsDir, {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const port = process.env.PORT || 3001;
  await app.listen(port);
  console.log(`🚀 TANOMAFI NestJS Backend running at http://localhost:${port}`);
  console.log(`📁 Local uploads served at http://localhost:${port}/uploads/`);
}

bootstrap();
