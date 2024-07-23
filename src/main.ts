import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  // app.enableCors({
  //   origin: 'http://localhost:3000',
  //   credentials: true,
  // });

  const config = new DocumentBuilder()
    .setTitle('KOLAB_API_BACKEND')
    .setDescription(
      'Esta API permite autenticar usuários, criar novos usuários e gerenciar sessões, além de permitir que seja obtida a arvore hierarquica dos usuários. Ela fornece endpoints para login e registro de usuários, garantindo a segurança através de autenticação baseada em JWT e cookies.',
    )
    .setVersion('1.0')
    .addTag('')
    .addBearerAuth()
    .addCookieAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
}
bootstrap();
