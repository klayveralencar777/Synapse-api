import 'dotenv/config';
import { DataSource } from 'typeorm';
import { User } from '../modules/User/entities/user.entity';
import { Veterinarian } from '../modules/Veterinarian/entities/veterinarian.entity';
import { Patient } from '../modules/Patient/entities/patient.entity';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Veterinarian, Patient],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
});

export default AppDataSource;