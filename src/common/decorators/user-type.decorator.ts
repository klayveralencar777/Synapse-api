import { SetMetadata } from '@nestjs/common';
import { UserType } from 'src/modules/User/enums/user.enum';

export const USER_TYPES_KEY = 'userTypes';

export const UserTypes = (...userTypes: UserType[]) =>
  SetMetadata(USER_TYPES_KEY, userTypes);