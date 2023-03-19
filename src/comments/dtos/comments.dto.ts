/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class CommentDTO {
  @Field((type) => Number)
  id: number;

  @Field((type) => Number)
  idPost: number;

  @Field((type) => Number)
  idUser: number;

  @Field((type) => String)
  content: string;

  @Field((type) => Date)
  createdAt: Date;

  @Field((type) => Date)
  updatedAt: Date;
}
