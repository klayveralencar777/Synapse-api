import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';
import { GuardianModule } from '../Guardian/guardian.module';
import { VeterinarianModule } from '../Veterinarian/veterinarian.module';

import { UserModule } from '../User/user.module';

@Module({
	imports: [TypeOrmModule.forFeature([Appointment]),
        GuardianModule,
        VeterinarianModule,
        UserModule,
    
        ],
    
    controllers: [AppointmentController],
    providers: [AppointmentService, UserTypeGuard],
    exports: [AppointmentService],
})
export class AppointmentModule {}
