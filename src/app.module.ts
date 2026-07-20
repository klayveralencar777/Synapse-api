import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/User/user.module';
import { AuthModule } from './modules/Auth/auth.module';
import { VeterinarianModule } from './modules/Veterinarian/veterinarian.module';
import { GuardianModule } from './modules/Guardian/guardian.module';
import { AppointmentModule } from './modules/Appointment/appointment.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: false,
    }), UserModule, AuthModule, VeterinarianModule, GuardianModule, AppointmentModule
  ]
 
})
export class AppModule {}
