import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Post } from './posts.entity';
import { Repository } from 'typeorm';
import { PostInterface } from './posts.interface';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private postRepository: Repository<Post>,
  ) {}

  // lấy tất cả các post trên hệ thống
  async getAll(): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.idUser', 'users')
      .addSelect(['users.username' as 'username'])
      .orderBy('posts.createdAt', 'DESC')
      .addOrderBy('posts.updatedAt', 'DESC')
      .getMany();
  }

  // tạo post mới
  async create(post: PostInterface): Promise<Post> {
    const new_post: Post = this.postRepository.create(post);

    return this.postRepository.save(new_post);
  }

  // sửa post
  async update(post: PostInterface): Promise<Post> {
    return this.postRepository.save({
      ...post,
      updatedAt: new Date(),
    });
  }

  // xóa một post
  async delete(id: number) {
    await this.postRepository.delete({ id });
  }

  // lấy post theo id
  async getOne(id: number): Promise<Post> {
    return this.postRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.idUser', 'users')
      .addSelect(['users.username' as 'username', 'users.id' as 'id'])
      .where('posts.id = :id', { id })
      .orderBy('posts.createdAt', 'DESC')
      .addOrderBy('posts.updatedAt', 'DESC')
      .getOne();
  }

  // lấy tất cả post của một user cụ thể -> các post được lấy ra được xếp theo ngày giảm dần
  async getPostsOfUser(idUser: number): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.idUser', 'users')
      .addSelect(['users.username' as 'username'])
      .where('posts.idUser = :idUser', { idUser })
      .orderBy('posts.createdAt', 'DESC')
      .addOrderBy('posts.updatedAt', 'DESC')
      .getMany();
  }

  // tìm kiếm post
  async search(search: string): Promise<Post[]> {
    return this.postRepository
      .createQueryBuilder('posts')
      .leftJoin('posts.idUser', 'users')
      .addSelect(['users.username' as 'username'])
      .where('posts.title like :search', { search: `%${search}%` })
      .orWhere('posts.body like :search', { search: `%${search}%` })
      .orderBy('posts.createdAt', 'DESC')
      .addOrderBy('posts.updatedAt', 'DESC')
      .getMany();
  }

  // kiểm tra idUser phải chủ của post hay không
  checkOwnerPost(post: Post, idUser: number): boolean {
    const owner_post = JSON.parse(JSON.stringify(post.idUser));
    return owner_post.id === idUser ? true : false;
  }
}
