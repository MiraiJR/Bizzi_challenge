import {
  Body,
  Controller,
  HttpStatus,
  Post,
  Res,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from './dtos/auth.dto';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  async login(
    @Body(new ValidationPipe()) data: AuthDTO,
    @Res() response: Response,
  ) {
    try {
      const res = await this.authService.login({ ...data });

      if (res.success) {
        return response.status(HttpStatus.OK).json({
          ...res,
          statusCode: 200,
        });
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          ...res,
          statusCode: 400,
        });
      }
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        success: false,
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }

  @Post('/register')
  async register(
    @Body(new ValidationPipe()) data: AuthDTO,
    @Res() response: Response,
  ) {
    try {
      const res = await this.authService.register({ ...data });

      if (res.success) {
        return response.status(HttpStatus.OK).json({
          ...res,
          statusCode: 200,
        });
      } else {
        return response.status(HttpStatus.BAD_REQUEST).json({
          ...res,
          statusCode: 400,
        });
      }
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        success: false,
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }
}
