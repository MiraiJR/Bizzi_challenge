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
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { JwtAuthorizationd } from '../guards/jwt-authorization';
import { PostsService } from './posts.service';
import { CommentsService } from '../comments/comments.service';
import { CreatePostDTP } from './dtos/Create.dto';
import { idUser } from '../users/users.decorator';
import { Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from '../cloudinary/cloudinary.service';
import { CreateCommnetDTO } from '../comments/dtos/CreateComment.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiCreateDTO } from './dtos/ApiCreate.dto';

@ApiTags('posts')
@Controller('posts')
export default class PostsController {
  constructor(
    private postService: PostsService,
    private commentService: CommentsService,
    private cloudinaryService: CloudinaryService,
  ) {}

  // lấy tất cả các post của tất cả các người dùng trên hệ thống
  @Get()
  async getPostsOfSystem(@Res() response: Response) {
    try {
      const list_post = await this.postService.getAll();

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: true,
        message: 'Lấy tất cả post thành công!',
        result: list_post,
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

  // tìm kiếm post matched theo title hoặc body
  @Get('/search')
  async searchPost(@Query('search') search: string, @Res() response: Response) {
    try {
      const list_post = await this.postService.search(search);

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: true,
        message: 'Lấy post thành công!',
        result: {
          posts: list_post,
          totalResult: list_post.length,
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

  // lấy một post theo id
  @Get(':id')
  async getSpecificPost(
    @Param('id', new ParseIntPipe()) id: number,
    @Res() response: Response,
  ) {
    try {
      const post = await this.postService.getOne(id);
      const comment_post = await this.commentService.getCommentsOfSpecificPost(
        id,
      );

      console.log(comment_post.length);
      if (!post) {
        return response.status(HttpStatus.NOT_FOUND).json({
          statusCode: 404,
          success: false,
          message: 'Không có dữ liệu',
        });
      }

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: true,
        message: 'Lấy post thành công!',
        result: {
          posts: {
            ...post,
            totalComment: comment_post.length,
          },
          comments: comment_post,
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

  // tạo post mới cho gủi file -> file sẽ tự động được thêm thành tag img ở cuối body
  @UseGuards(JwtAuthorizationd)
  @UseInterceptors(FileInterceptor('file'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ApiCreateDTO,
  })
  @Post()
  async createANewPost(
    @Body(new ValidationPipe()) data: CreatePostDTP,
    @idUser() id_user: number,
    @Res() response: Response,
    @UploadedFile() file: Express.Multer.File,
  ) {
    try {
      const responFile = await this.cloudinaryService.uploadFileFromBuffer(
        file.buffer,
        'posts/images',
      );

      const html_image = `<img src="${responFile.secure_url}" alt="" class='post-image'>`;
      data.body = data.body + html_image;

      const new_post = await this.postService.create({
        ...data,
        idUser: id_user,
      });

      if (!new_post) {
        throw new Error('Tạo post thất bại!');
      }

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: true,
        message: 'Tạo post thành  công!',
        result: {
          posts: {
            ...new_post,
            totalComment: 0,
          },
          comments: [],
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

  // sửa thông tin một post
  @UseGuards(JwtAuthorizationd)
  @UseInterceptors(FileInterceptor('file'))
  @Put(':id')
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: ApiCreateDTO,
  })
  async modifyPost(
    @Body(new ValidationPipe()) data: CreatePostDTP,
    @Param('id', new ParseIntPipe()) id: number,
    @idUser() id_user: number,
    @UploadedFile() file: Express.Multer.File,
    @Res() response: Response,
  ) {
    try {
      // thêm ảnh vào post -> ảnh mặc định nằm ở sau cùng body
      const responFile = await this.cloudinaryService.uploadFileFromBuffer(
        file.buffer,
        'posts/images',
      );

      const html_image = `<img src="${responFile.secure_url}" alt="" class='post-image'>`;
      data.body = data.body + html_image;

      // kiểm tra người thực hiện có quyền thực hiện hay không
      const this_post = await this.postService.getOne(id);

      if (!this.postService.checkOwnerPost(this_post, id_user)) {
        return response.status(HttpStatus.FORBIDDEN).json({
          statusCode: 403,
          success: false,
          message: 'Bạn không có quyền thực hiện trên post này!',
        });
      }

      // tiến hành cập nhật
      const modify_post = await this.postService.update({
        ...data,
        id,
        idUser: id_user,
      });

      if (!modify_post) {
        throw new Error('Cập nhật post thất bại!');
      }

      // lấy comment của post vừa sửa
      const comments = await this.commentService.getCommentsOfSpecificPost(id);

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: true,
        message: 'Cập nhật post thành công!',
        result: {
          posts: {
            ...modify_post,
            totalComment: comments.length,
          },
          comments: comments,
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

  // xoá post
  // chủ post
  @ApiBearerAuth()
  @UseGuards(JwtAuthorizationd)
  @Delete(':id')
  async deletePost(
    @Param('id', new ParseIntPipe()) id: number,
    @idUser() id_user: number,
    @Res() response: Response,
  ) {
    try {
      // kiểm tra người thực hiện có quyền thực hiện hay không
      const this_post = await this.postService.getOne(id);

      if (!this.postService.checkOwnerPost(this_post, id_user)) {
        return response.status(HttpStatus.FORBIDDEN).json({
          statusCode: 403,
          success: false,
          message: 'Bạn không có quyền thực hiện trên post này!',
        });
      }

      // xóa post + comment của post đó trên db
      await this.postService.delete(id);
      await this.commentService.deleteAllCommentOfSpecificPost(id);

      return response.status(HttpStatus.OK).json({
        statusCode: 200,
        success: true,
        message: 'Xóa post thành công!',
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

  // tạo comment mới cho post
  // mọi người đã đăng nhập
  @ApiBody({ type: CreateCommnetDTO })
  @ApiBearerAuth()
  @UseGuards(JwtAuthorizationd)
  @Post(':id/comments')
  async createNewCommentForSpecificPost(
    @Body(new ValidationPipe()) data: CreateCommnetDTO,
    @Res() response: Response,
    @idUser() idUser: number,
    @Param('id', new ParseIntPipe()) idPost: number,
  ) {
    try {
      const new_comment = await this.commentService.create({
        ...data,
        idPost,
        idUser,
      });

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
}
