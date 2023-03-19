/* eslint-disable @typescript-eslint/no-unused-vars */
import { Args, Query, Resolver } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { PostDTO } from './dtos/posts.dto';
import { ValidationPipe } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Resolver('posts')
@ApiTags('graphql')
export class PostsResolver {
  constructor(private postService: PostsService) {}
  @Query((returns) => PostDTO)
  async getOne(@Args('id', new ValidationPipe()) id: number): Promise<PostDTO> {
    return this.postService.getOne(id);
  }

  // lấy tất cả các post
  @Query((returns) => [PostDTO])
  async getAll(): Promise<PostDTO[]> {
    return this.postService.getAll();
  }
}
