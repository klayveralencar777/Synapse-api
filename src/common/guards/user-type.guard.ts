import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from 'src/modules/User/enums/user.enum';
import { USER_TYPES_KEY } from '../decorators/user-type.decorator';


type AuthenticatedUser = {
  id: number;
  email: string;
  userType: UserType;
};

@Injectable()
export class UserTypeGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedUserTypes =
      this.reflector.getAllAndOverride<UserType[]>(
        USER_TYPES_KEY,
        [context.getHandler(), context.getClass()],
      );

    if (!allowedUserTypes?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{
      user?: AuthenticatedUser;
    }>();

    return (
      !!request.user &&
      allowedUserTypes.includes(request.user.userType)
    );
  }
}