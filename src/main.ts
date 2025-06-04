import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { ValidationPipe } from "@nestjs/common"
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger"
import { writeFileSync } from "fs"

process.env.TZ = 'UTC';
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    const config = new DocumentBuilder()
      .setTitle('Fundlink API')
      .setDescription('Fundlink API is a REST API for managing startup investments')
      .addBearerAuth()
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config, {
        extraModels: [], // Add extra models here if needed
        ignoreGlobalPrefix: false,
    });
    SwaggerModule.setup('api', app, document);

    writeFileSync('./swagger.json', JSON.stringify(document));


    await app.listen(3000);
}
bootstrap();
