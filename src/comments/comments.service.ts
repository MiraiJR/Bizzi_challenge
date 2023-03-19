import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Comment } from './comments.entity';
import { Repository } from 'typeorm';
import { CommentInterface } from './comments.interface';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentRepository: Repository<Comment>,
  ) {}

  // lấy tất cả comment của một post cụ thể
  async getCommentsOfSpecificPost(idPost: number): Promise<Comment[]> {
    return this.commentRepository
      .createQueryBuilder('comments')
      .leftJoin('comments.idUser', 'users')
      .addSelect(['users.username' as 'username'])
      .where('comments.idPost = :idPost', { idPost })
      .orderBy('comments.createdAt', 'DESC')
      .addOrderBy('comments.updatedAt', 'DESC')
      .getMany();
  }

  // lấy 1 comment
  async getOne(id: number): Promise<Comment> {
    return this.commentRepository.findOne({
      where: {
        id,
      },
    });
  }

  // tạo một comment vào 1 bài post
  async create(comment: CommentInterface): Promise<Comment> {
    const new_comment = this.commentRepository.create(comment);
    console.log(new_comment);

    return this.commentRepository.save(new_comment);
  }

  // xóa một comment
  delete(id: number) {
    return this.commentRepository.delete({ id });
  }

  // cập nhật comment
  async update(comment: CommentInterface) {
    return this.commentRepository.save({
      ...comment,
      updatedAt: new Date(),
    });
  }

  // xóa tất cả comment của 1 post
  async deleteAllCommentOfSpecificPost(idPost: number) {
    return this.commentRepository.delete({ idPost });
  }

  checkOwnerComment(comment: Comment, idUser: number): boolean {
    return comment.idUser === idUser ? true : false;
  }
}
