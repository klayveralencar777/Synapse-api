import { Type } from 'class-transformer';
import { IsDateString, IsInt,  IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAppointmentDTO {
    
	@IsDateString()
	scheduledAt!: Date;

	@IsString()
	@MinLength(3)
	reason!: string;


    @IsString()
    @MinLength(3)
    @MaxLength(500)
	petInformation !: string;

	@Type(() => Number)
	@IsInt()
	veterinarianId!: number;
}

    