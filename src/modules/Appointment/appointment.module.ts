import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';
import { GuardianModule } from '../Guardian/guardian.module';
import { VeterinarianModule } from '../Veterinarian/veterinarian.module';

import { UserModule } from '../User/user.module';
import { AppointmentMapper } from './mapper/appointment.mapper';

@Module({
	imports: [TypeOrmModule.forFeature([Appointment]),
       forwardRef(() => GuardianModule),
        forwardRef(() => VeterinarianModule),
        UserModule,
    
        ],
    
    controllers: [AppointmentController],
    providers: [AppointmentService, UserTypeGuard, AppointmentMapper],
    exports: [AppointmentService],
})
export class AppointmentModule {}
