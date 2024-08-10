import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Session, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UpdateUserDto } from './dtos/update-user.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { Serialize } from '../interceptors/serialize.interceptor';
import { CurrentUser } from '../decorators/current-user.decorator';
import { User } from '../entities/user.entity';
import { AuthGuard } from '../guards/auth.guard';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private usersService: UsersService,
    private authService: AuthService,
  ) {
  }

  // @Get('/colors/:color')
  // setColor(@Param('color') color: string, @Session() session: any) {
  //   session.color = color;
  // }

  // @Get('/colors')
  // getColor(@Session() session: any) {
  //   return session.color;
  // }

  // @Get('/whoami')
  // whoAmI(@Session() session: any) {
  //   console.log('SESSION', session);
  //   return this.usersService.findOne(session.userId);
  // }

  @Get('/whoami')
  @UseGuards(AuthGuard)
  whoAmI(@CurrentUser() user: User) {
    return user;
  }

  @Post('/signup')
  async signUp(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.singUp(body.email, body.password);
    session.userId = user.id; // Записываем id пользователя в сессию
    return user;
  }

  @Post('/signin')
  async signIn(@Body() body: CreateUserDto, @Session() session: any) {
    const user = await this.authService.singIn(body.email, body.password);
    session.userId = user.id; // Записываем id пользователя в сессию

    return user;
  }

  @Post('/signout')
  async signOut(@Session() session: any) {
    session.userId = null; // Удаляем id пользователя из сессии
  }

  @Patch('/:id')
  update(@Param('id') id: string, @Body() body: UpdateUserDto) {
    return this.usersService.update(parseInt(id), body);
  }

  // @UseInterceptors(new SerializeInterceptor(UserDto))
  @Get('/:id')
  findById(@Param('id') id: string) {
    return this.usersService.findOne(parseInt(id));
  }

  @Get()
  findAll(@Query('email') email: string) {
    return this.usersService.findAll(email);
  }

  @Delete('/:id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(parseInt(id));
  }
}
