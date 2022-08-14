import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const PORT: number | string = process.env.PORT || 5000;

  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder().setTitle('nest-lessons').setDescription('The API description').setVersion('1.0.0').addTag('VSUA').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  await app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); // eslint-disable-line no-console
}
bootstrap();
