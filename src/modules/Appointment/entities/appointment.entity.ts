import {
	CreateDateColumn,
	Entity,
	JoinColumn,
	ManyToOne,
	Column,
	PrimaryGeneratedColumn,
	RelationId,
	UpdateDateColumn,
} from 'typeorm';
import { Guardian } from '../../Guardian/entities/guardian.entity';
import { Veterinarian } from '../../Veterinarian/entities/veterinarian.entity';
import { AppointmentStatus } from '../enums/appointment.enum';

@Entity('appointments')
export class Appointment {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ type: 'timestamp with time zone' })
	scheduledAt!: Date;

	@Column()
	reason!: string;


    @Column()
    petInformation !: string;

	@Column({
		type: 'varchar',
		enum: AppointmentStatus,
		default: AppointmentStatus.SCHEDULED,
	})
	status!: AppointmentStatus;

	@ManyToOne(() => Guardian, { nullable: false, eager: true })
	@JoinColumn({ name: 'guardianId' })
	guardian!: Guardian;

	@RelationId((appointment: Appointment) => appointment.guardian)
	guardianId!: number;

	@ManyToOne(() => Veterinarian, { nullable: false, eager: true })
	@JoinColumn({ name: 'veterinarianId' })
	veterinarian!: Veterinarian;

	@RelationId((appointment: Appointment) => appointment.veterinarian)
	veterinarianId!: number;

	@CreateDateColumn()
	createdAt!: Date;

	@UpdateDateColumn()
	updatedAt!: Date;
}
