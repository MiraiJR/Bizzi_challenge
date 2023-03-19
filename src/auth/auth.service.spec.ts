import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/users.entity';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, JwtModule, TypeOrmModule.forFeature([User])],
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('AuthService - should be defined', () => {
    expect(service).toBeDefined();
  });

  // describe('login', () => {
  //   it('should login to system', async () => {
  //     const res = await service.login({
  //       username: 'haotruong123',
  //       password: '12345678',
  //     });

  //     expect(res).toBeCalled();
  //   });
  // });

  // describe('register', () => {
  //   it('should register a new account in system', async () => {
  //     const res = await service.register({
  //       username: 'test123',
  //       password: '12345678',
  //     });

  //     expect(res).toBeCalled();
  //   });
  // });

  // describe('signAccessToken', () => {
  //   it('should sign and return access token', async () => {
  //     const res = await service.signAccessToken({ id: 1 });

  //     expect(res).toBeCalled();
  //   });
  // });

  // describe('signRefreshToken', () => {
  //   it('should sign and return refresh token', async () => {
  //     const res = await service.signRefreshToken({ id: 1 });

  //     expect(res).toBeCalled();
  //   });
  // });
});
