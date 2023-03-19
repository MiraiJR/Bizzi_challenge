import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthInterface } from './auth.interface';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

const saltOrRounds = 10;

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  // đăng nhập tài khoản
  async login(auth: AuthInterface): Promise<any> {
    const curUser = await this.userService.findByUsername(auth.username);

    // trường hợp username không tồn tại
    if (!curUser) {
      return {
        success: false,
        message: 'Tài khoản hoặc mật khẩu không chính xác!',
      };
    }

    // kiểm tra mật khẩu
    const is_matched_password = await bcrypt.compare(
      auth.password,
      curUser.password,
    );

    if (!is_matched_password) {
      return {
        success: true,
        message: 'Tài khoản hoặc mật khẩu không chính xác',
      };
    }
    const payload = {
      id: curUser.id,
    };

    const at = await this.signAccessToken(payload);
    const rt = await this.signRefreshToken(payload);

    return {
      success: true,
      message: 'Đăng nhập thành công!',
      accessToken: at,
      refreshToken: rt,
    };
  }

  // đăng ký tài khoản
  async register(auth: AuthInterface): Promise<any> {
    // kiểm tra username đã tồn tại hay chưa
    const is_valid_user = await this.userService.findByUsername(auth.username);
    if (is_valid_user) {
      return {
        success: false,
        message: 'Username đã tồn tại!',
      };
    }

    if (auth.password.length < 8) {
      return {
        success: false,
        message: 'Password qúa ngắn. Password phải có ít nhất 8 ký tự!',
      };
    }

    // hash password
    auth.password = await bcrypt.hash(auth.password, saltOrRounds);

    await this.userService.create(auth);

    return {
      success: true,
      message: 'Đăng ký tài khoản thành công!',
    };
  }

  // tạo accesstoken
  async signAccessToken(payload: any): Promise<string> {
    const at: string = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRED_TIME_ACCESSTOKEN,
      secret: process.env.JWT_SECRET_ACCESSTOKEN,
    });

    return at;
  }

  // tạo refreshtoken
  async signRefreshToken(payload: any): Promise<string> {
    const rt: string = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRED_TIME_REFRESHTOKEN,
      secret: process.env.JWT_SECRET_REFRESHTOKEN,
    });

    return rt;
  }
}
