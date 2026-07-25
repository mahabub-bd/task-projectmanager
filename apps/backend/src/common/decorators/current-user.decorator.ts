import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  organization_id: string;
  department_id: string | null;
  user_roles: any[];
}

export const CurrentUser = createParamDecorator(
  (data: keyof UserInfo | undefined, ctx: ExecutionContext): UserInfo | any => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserInfo;

    if (!user) {
      return null;
    }

    return data ? user[data] : user;
  },
);
