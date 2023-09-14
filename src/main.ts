import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
    // app.use((req, res, next) => {
    //     res.header('Access-Control-Allow-Origin', '*');
    //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    //     res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
    //     next();
    // });
  app.enableCors({
      allowedHeaders:"*",
      origin: "*"
  });
  const port = configService.get('PORT') || 3000;
  await app.listen(port);
}
bootstrap();
