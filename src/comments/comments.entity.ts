/* eslint-disable prettier/prettier */
import { Post } from '../posts/posts.entity';
import { User } from '../users/users.entity';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity("comment")
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @ManyToOne(() => Post, (post) => post.id)
  @JoinColumn({ name: 'idPost' })
  idPost: number;

  @Column()
  @ManyToOne(() => User, (user) => user.id)
  @JoinColumn({ name: 'idUser' })
  idUser: number;

  @Column()
  content: string;

  @Column({ type: 'timestamp', default: () => 'now()' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'now()' })
  updatedAt: Date;
}
