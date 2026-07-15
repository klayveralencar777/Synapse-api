import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';
import { UserService } from '../User/user.service';
import { User } from '../User/entities/user.entity';
import { Guardian } from './entities/guardian.entity';
import { GuardianController } from './guardian.controller';
import { GuardianService } from './guardian.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Guardian, User]),
  ],
  controllers: [GuardianController],
  providers: [UserService, GuardianService, UserTypeGuard],
  exports: [GuardianService],
})
export class GuardianModule {}