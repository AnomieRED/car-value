import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { UsersService } from '../users/users.service';
import { User } from '../entities/user.entity';

declare global {
  namespace Express {
    interface Request {
      currentUser?: User;
    }
  }
}

declare module 'express-session' {
  interface SessionData {
    userId?: number;
  }
}

@Injectable()
export class CurrentUserMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {
  }

  async use(req: Request, res: Response, next: NextFunction) {
    const { userId } = req.session || {};

    if (userId) req.currentUser = await this.usersService.findOne(userId);

    next();
  }
}