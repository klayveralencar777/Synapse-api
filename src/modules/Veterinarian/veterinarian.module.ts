import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {  UserTypeGuard } from 'src/common/guards/user-type.guard';
import { Veterinarian } from './entities/veterinarian.entity';
import { VeterinarianController } from './veterinarian.controller';
import { VeterinarianService } from './veterinarian.service';
import { UserService } from '../User/user.service';
import { User } from '../User/entities/user.entity';
import { UserModule } from '../User/user.module';
import { AppointmentModule } from '../Appointment/appointment.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Veterinarian]),
    UserModule, AppointmentModule
  ],
  controllers: [VeterinarianController],
  providers: [VeterinarianService, UserTypeGuard],
  exports: [VeterinarianService],
})
export class VeterinarianModule {}