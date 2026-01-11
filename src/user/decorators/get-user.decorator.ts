import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthUser } from '../entities/user.entity';

export const GetUser = createParamDecorator(
  (data: keyof AuthUser | undefined, context: ExecutionContext) => {
    const request = context
      .switchToHttp()
      .getRequest<Request & { user: AuthUser }>();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);
