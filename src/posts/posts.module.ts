import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import PostsController from './posts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { CommentsModule } from '../comments/comments.module';
import { CloudinaryModule } from '../cloudinary/cloudinary.module';
import { User } from '../users/users.entity';
import { Comment } from '../comments/comments.entity';
import { PostsResolver } from './posts.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Post]),
    JwtModule,
    UsersModule,
    CommentsModule,
    CloudinaryModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsResolver],
  exports: [PostsService],
})
export class PostsModule {}
