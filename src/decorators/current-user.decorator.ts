import { createParamDecorator, ExecutionContext } from '@nestjs/common'

// Этот декоратор позволяет получить текущего пользователя из request.currentUser
// Внутри контроллера можно использовать @CurrentUser() user: User
// По сути после того как запрос прошел через CurrentUserInterceptor, в request.currentUser будет записан текущий пользователь
export const CurrentUser = createParamDecorator(
  (data: never, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    console.log('CUSTOM DECORATOR', request.currentUser);
    return request.currentUser;
  }
)