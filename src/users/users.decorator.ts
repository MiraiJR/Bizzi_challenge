import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// tạo @idUser để lấy idUser từ request
export const idUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();

    return request.idUser;
  },
);
