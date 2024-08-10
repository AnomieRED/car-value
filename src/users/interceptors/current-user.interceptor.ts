import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { Observable } from 'rxjs';


// NOTE: При любом запросе, который проходит через этот интерсептор, в request.currentUser будет записан текущий пользователь
// Берем из сессии userId и ищем пользователя в базе данных
// Это позволяет передавать пользователя в каждый метод контроллера
// NOTE: Важно понимать, что интерсепторы работают после мидлваров и гардов, но до контроллеров
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {

  constructor(private usersService: UsersService) {
  }

  async intercept(context: ExecutionContext, next: CallHandler<any>): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    console.log('CUSTOM INTERCEPTOR', request.session);
    const { userId } = request.session || {};

    if (userId)
      request.currentUser = await this.usersService.findOne(userId);

    return next.handle();
  }
}