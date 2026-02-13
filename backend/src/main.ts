import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import { ValidationPipe } from "@nestjs/common";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { HttpExceptionFilter } from "./common/filters/httpException.filter";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors({
    origin: ["https://aiquefome.vercel.app", "http://localhost:3000"],
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle("AIQueFome API")
    .setDescription(
      "API para plataforma de comércio de alimentos com recursos de IA",
    )
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        name: "JWT",
        description: "Digite o token JWT",
        in: "header",
      },
      "JWT-auth",
    )
    .addTag("auth", "Endpoints de autenticação")
    .addTag("products", "Endpoints de produtos")
    .addTag("categories", "Endpoints de categorias")
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, "0.0.0.0");
  console.log(`🚀 Aplicação rodando em: http://localhost:${port}`);
  console.log(
    `📚 Documentação Swagger disponível em: http://localhost:${port}/api`,
  );
  console.log(
    `📥 Swagger JSON disponível em: http://localhost:${port}/api-json`,
  );
}
bootstrap();
