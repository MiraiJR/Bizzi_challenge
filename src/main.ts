import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const PORT = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Social Media')
    .setDescription(
      'Đây là trang api demo cho social media. Ở đây, chủ yếu là các thao tác liên quan tới 3 model là post, comment và user',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(PORT, () => {
    console.log(`Server is listening in port ${PORT}`);
  });
}

bootstrap();
