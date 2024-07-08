import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { User } from '../entities/user.entity';

describe('UsersController', () => {
  let controller: UsersController;
  let fakeUsersService: Partial<UsersService>;
  let fakeAuthService: Partial<AuthService>;
  const users = [
    { id: 1, email: 'test@test.com', password: 'test@test.com' },
  ] as User[];

  beforeEach(async () => {

    fakeUsersService = {
      async findAll(email: string) {
        const filteredUsers = email ? users.filter(user => user.email === email) : users;
        return Promise.resolve(filteredUsers);
      },
      async findOne(id: number) {
        const user = users.find(user => user.id === id);
        return Promise.resolve(user);
      },
      // async update(id: number, attrs: Partial<User>) {},
      // async remove(id: number) {}
    }

    fakeAuthService = {
      // async singUp(email: string, password: string) {},
      // async singIn(email: string, password: string) {}
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        { provide: UsersService, useValue: fakeUsersService },
        { provide: AuthService, useValue: fakeAuthService },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('findAll - should return all users', async () => {
    const users = await controller.findAll('test@test.com');

    expect(users.length).toEqual(1);
    expect(users).toEqual(users);
  });

  it('findOne - should return a single user', async () => {
    const user = await controller.findById('1');

    expect(user).toEqual(users[0]);
  });
});
