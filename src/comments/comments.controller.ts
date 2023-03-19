import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CreateCommnetDTO } from './dtos/CreateComment.dto';
import { CommentsService } from './comments.service';
import { JwtAuthorizationd } from '../guards/jwt-authorization';
import { idUser } from '../users/users.decorator';
import { Response } from 'express';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';

@ApiTags('comments')
@Controller('comments')
export class CommentsController {
  constructor(private commentService: CommentsService) {}

  // taọ một comment mới cho một post
  // mọi người đã xác thực đăng nhập
  @UseGuards(JwtAuthorizationd)
  @ApiBearerAuth()
  @ApiBody({ type: CreateCommnetDTO })
  @Post()
  async createNewCommentForSpecificPost(
    @Body(new ValidationPipe()) data: CreateCommnetDTO,
    @Res() response: Response,
    @Query('idPost', new ParseIntPipe()) idPost: number,
  ) {
    try {
      const new_comment = await this.commentService.create({ ...data, idPost });

      if (!new_comment) {
        throw new Error('Hành động thất bại!');
      }

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: true,
        message: 'Comment vào bài viết thành công!',
        result: new_comment,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        success: false,
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }

  @UseGuards(JwtAuthorizationd)
  @ApiBearerAuth()
  @Delete('id')
  async deleteCommentInSpecificPost(
    @Param('id', new ParseIntPipe()) id: number,
    @idUser() id_user: number,
    @Res() response: Response,
  ) {
    try {
      const this_comment = await this.commentService.getOne(id);
      if (!this.commentService.checkOwnerComment(this_comment, id_user)) {
        return response.status(HttpStatus.FORBIDDEN).json({
          statusCode: 403,
          success: false,
          message: 'Bạn không có quyền thực hiện hành động này!',
        });
      }

      await this.commentService.delete(id);

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: true,
        message: 'Xóa comment thành công!',
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        success: false,
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }

  @UseGuards(JwtAuthorizationd)
  @ApiBearerAuth()
  @ApiBody({ type: CreateCommnetDTO })
  @Put(':id')
  async modifyCommentInSpecificPost(
    @Body(new ValidationPipe()) data: CreateCommnetDTO,
    @Param('id', new ParseIntPipe()) id: number,
    @idUser() id_user: number,
    @Res() response: Response,
  ) {
    try {
      const this_comment = await this.commentService.getOne(id);

      if (!this.commentService.checkOwnerComment(this_comment, id_user)) {
        return response.status(HttpStatus.FORBIDDEN).json({
          statusCode: 403,
          success: false,
          message: 'Bạn không có quyền thực hiện hành động này!',
        });
      }

      const modify_comment = await this.commentService.update({
        ...data,
        id,
        idPost: this_comment.idPost,
        idUser: id_user,
      });

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: true,
        message: 'Sửa comment thành công!',
        result: modify_comment,
      });
    } catch (error) {
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        statusCode: 500,
        success: false,
        message: 'INTERNAL SERVER ERROR',
        error,
      });
    }
  }

  @Get()
  async getCommentOfPost(
    @Query('idPost', new ParseIntPipe()) idPost: number,
    @Res() response: Response,
  ) {
    try {
      const list_comment = await this.commentService.getCommentsOfSpecificPost(
        idPost,
      );

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: true,
        message: 'Lấy tất cả comments thành công!',
        result: {
          totalComment: list_comment.length,
          comments: list_comment,
        },
      });
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
