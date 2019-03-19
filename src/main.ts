import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';

import {HttpExceptionFilter} from './utils';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
        exposedHeaders: ['Authorization'],
    });
    await app.listen(process.env.PORT || 2000);

    app.useGlobalFilters(new HttpExceptionFilter());
}

bootstrap();
