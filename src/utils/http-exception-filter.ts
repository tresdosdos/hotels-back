import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';

import { getEnv } from './env';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const status = exception.getStatus();

    if (getEnv() === 'dev') {
      // tslint:disable-next-line
      console.log(exception.message, exception.stack);
    }

    if (status === 500) {
      response.status(500).send({
        statusCode: status,
        timestamp: new Date().toISOString(),
        message: 'Something went wrong =(',
      });

      return;
    }

    response.status(status).send({
      statusCode: status,
      timestamp: new Date().toISOString(),
      message: exception.message,
    });
  }
}
