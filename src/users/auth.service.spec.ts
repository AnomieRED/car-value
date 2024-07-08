import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from './users.service';
import { User } from '../entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';

describe('AuthService', () => {

  let service: AuthService;
  let fakeUsersService: Partial<UsersService>;
  let users: User[] = [];

  beforeEach(async () => {
    // Create a fake copy of the UsersService
    fakeUsersService = {
      findAll: (email) => {
        const filteredUsers = users.filter(user => user.email === email);
        return Promise.resolve(filteredUsers);
      },
      create: (email: string, password: string) => {
        const user = {
          id: users.length + 1,
          email, password,
        } as User;

        users.push(user);
        return Promise.resolve(user);
      },
    };

    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: fakeUsersService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('Can create an instance of AuthService', async () => {
    expect(service).toBeDefined();
  });

  it('Can create a new user', async () => {
    const user = await service.singUp('test@test.com', 'test@test.com');

    expect(user.password).not.toEqual('test@test.com');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  it('Throws an error if user signs up with an email that is in use', async () => {
    await expect(service.singUp('test@test.com', 'test@test.com'))
      .rejects
      .toThrow(BadRequestException);
  });

  it('Throws as errors if user signs in with an email that does not exist', async () => {
    await expect(service.singIn('testfind@test.com', 'test1@test.com'))
      .rejects
      .toThrow(NotFoundException);
  });

  it('Throws an error if an invalid password is provided', async () => {
    await service.singUp('testpass@test.com', 'testpass@test.com');

    await expect(service.singIn('testpass@test.com', 'test123@test.com'))
      .rejects
      .toThrow(BadRequestException);
  });
});