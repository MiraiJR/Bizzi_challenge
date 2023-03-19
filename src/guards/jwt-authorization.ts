/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';

// guard này chủ yếu check user đã đăng nhập chưa -> nếu rồi thì lấy userid từ request
@Injectable()
export class JwtAuthorizationd implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // lấy jwt token từ header authorization
    const authHeader = request.header('Authorization');
    const jwtToken = authHeader && authHeader.split(' ')[1];

    try {
      // trong payload sẽ là một object có 2 fields là id + username
      const payload = await this.jwtService.verify(jwtToken, {
        secret: process.env.JWT_SECRET_ACCESSTOKEN,
      });

      const curUser = await this.userService.findUserById(payload.id);

      if (curUser) {
        request.idUser = payload.id;
      }

      return curUser ? true : false;
    } catch (error) {
      // trường hợp jwt token hết hạn
      return false;
    }
  }
}
