import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bodyParser: true,
  });

  // Configure body size limits for file uploads
  app.use((req: any, res: any, next: () => void) => {
    // Increase timeout for large files
    req.setTimeout(300000); // 5 minutes timeout
    next();
  });

  // Enable CORS for file uploads
  app.enableCors({
    origin: '*', // Configure appropriately for production
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
