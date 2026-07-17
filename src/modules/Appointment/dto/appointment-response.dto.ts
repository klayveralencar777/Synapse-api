import { Expose } from 'class-transformer';
import { AppointmentStatus } from '../enums/appointment.enum';

export class AppointmentResponseDTO {
	@Expose()
	id!: number;

	@Expose()
	scheduledAt!: Date;

	@Expose()
	reason!: string;

	@Expose()
	status!: AppointmentStatus;

	@Expose()
	guardianId!: number;

	@Expose()
	veterinarianId!: number;

	@Expose()
	createdAt!: Date;

	@Expose()
	updatedAt!: Date;
}

