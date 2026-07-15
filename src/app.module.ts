import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/User/user.module';
import { AuthModule } from './modules/Auth/auth.module';
import { VeterinarianModule } from './modules/Veterinarian/veterinarian.module';
import { GuardianModule } from './modules/Guardian/guardian.module';

@Module({
  imports: [
    ConfigModule.forRoot(),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false,
    }), UserModule, AuthModule, VeterinarianModule, GuardianModule
  ]
 
})
export class AppModule {}
