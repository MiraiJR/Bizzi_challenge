import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './users.entity';
import { Repository } from 'typeorm';
import { UserInterface } from './users.interface';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // tìm kiếm user theo username
  async findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  // tìm kiếm user bằng id
  async findUserById(id: number): Promise<User> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  // tạo tài khoản
  async create(user: UserInterface): Promise<User> {
    const new_user: User = this.userRepository.create(user);

    return this.userRepository.save(new_user);
  }
}
