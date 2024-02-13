import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParsers from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParsers());
  app.setGlobalPrefix('api');
  await app.listen(3000);
}
bootstrap();
