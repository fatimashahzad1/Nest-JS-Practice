import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    console.log('Request URL:', fullUrl);
    next();
  }
}
