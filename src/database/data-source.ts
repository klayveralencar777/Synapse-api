import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../modules/User/entities/user.entity';
import { Veterinarian } from '../modules/Veterinarian/entities/veterinarian.entity';
import { Guardian } from '../modules/Guardian/entities/guardian.entity';
import { Appointment } from '../modules/Appointment/entities/appointment.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  entities: [User, Veterinarian, Guardian, Appointment],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default AppDataSource;