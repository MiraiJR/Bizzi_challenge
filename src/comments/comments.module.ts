import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { User } from '../users/users.entity';
import { Post } from '../posts/posts.entity';
import { CommentsResolver } from './comments.resolver';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, User, Post]),
    JwtModule,
    UsersModule,
  ],
  controllers: [CommentsController],
  providers: [CommentsService, CommentsResolver],
  exports: [CommentsService],
})
export class CommentsModule {}
