import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';

import { Guardian } from './entities/guardian.entity';
import { GuardianController } from './guardian.controller';
import { GuardianService } from './guardian.service';
import { UserModule } from '../User/user.module';
import { AppointmentModule } from '../Appointment/appointment.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([Guardian]),
    UserModule, forwardRef(() => AppointmentModule)
  ],
  controllers: [GuardianController],
  providers: [GuardianService, UserTypeGuard],
  exports: [GuardianService],
})
export class GuardianModule {}