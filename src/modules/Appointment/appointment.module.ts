import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointment } from './entities/appointment.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentService } from './appointment.service';
import { UserTypeGuard } from 'src/common/guards/user-type.guard';

import { GuardianService } from '../Guardian/guardian.service';
import { VeterinarianService } from '../Veterinarian/veterinarian.service';
import { Guardian } from '../Guardian/entities/guardian.entity';
import { Veterinarian } from '../Veterinarian/entities/veterinarian.entity';
import { GuardianModule } from '../Guardian/guardian.module';
import { VeterinarianModule } from '../Veterinarian/veterinarian.module';

@Module({
	imports: [TypeOrmModule.forFeature([Appointment]),
        GuardianModule,
        VeterinarianModule,
    
        ],
    
    controllers: [AppointmentController],
    providers: [AppointmentService, UserTypeGuard],
    exports: [AppointmentService],
})
export class AppointmentModule {}
