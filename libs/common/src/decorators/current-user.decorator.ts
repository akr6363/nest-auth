import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from '@auth/interfaces';

export const CurrentUser = createParamDecorator(
  (
    key: keyof JwtPayload,
    ctx: ExecutionContext,
  ): JwtPayload | Partial<JwtPayload> => {
    const req = ctx.switchToHttp().getRequest();
    return key ? req.user[key] : req.user;
  },
);
