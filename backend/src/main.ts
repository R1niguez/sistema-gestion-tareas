import 'reflect-metadata';
import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  await app.get(AppService).bootstrap();
  const port = Number(process.env.PORT) || 3001;
  await app.listen(port);
  console.log(`Voltio Lab API disponible en http://localhost:${port}`);
}

bootstrap().catch((error: unknown) => {
  console.error('No se pudo iniciar la API:', error);
  process.exitCode = 1;
});
