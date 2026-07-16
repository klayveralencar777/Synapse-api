import { Type } from 'class-transformer';
import { IsDateString, IsInt, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class CreateAppointmentDTO {
    
	@IsDateString()
	scheduledAt!: string;

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

    