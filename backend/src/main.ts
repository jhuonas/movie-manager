import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  const config = new DocumentBuilder()
    .setTitle('Movie Manager API')
    .setDescription(`API for managing movies, actors, and ratings`)
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('movies', 'Operations related to movies')
    .addTag('actors', 'Operations related to actors')
    .addTag('ratings', 'Operations related to movie ratings')
    .addTag('seeds', 'Database seeding operations')
    .addServer('http://localhost:3001', 'Development server')
    .addServer('https://api.moviemanager.com', 'Production server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'list',
      filter: true,
      showRequestDuration: true,
      syntaxHighlight: {
        activate: true,
        theme: 'monokai'
      }
    },
    customSiteTitle: 'Movie Manager API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
      .swagger-ui .info .title { color: #3b4151; font-size: 36px; }
      .swagger-ui .info .description { font-size: 14px; line-height: 1.5; }
    `
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
