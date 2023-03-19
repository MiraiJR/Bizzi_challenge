/* eslint-disable prettier/prettier */
import { Controller, Get, HttpStatus, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('')
export class AppController {
  @Get()
  welcome(@Res() response: Response) {
    return response.status(HttpStatus.OK).send('Welcome!');
  }
}
