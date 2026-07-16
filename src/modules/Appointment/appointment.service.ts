import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Appointment } from "./entities/appointment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAppointmentDTO } from "./dto/create-appointment.dto";
import { AppointmentResponseDTO } from "./dto/appointment-response.dto";
import { GuardianService } from "../Guardian/guardian.service";
import { VeterinarianService } from "../Veterinarian/veterinarian.service";
import { plainToInstance } from "class-transformer";


@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)
        private readonly repository: Repository<Appointment>,
        private readonly guardianService: GuardianService,
        private readonly veterinarianService: VeterinarianService,
    ) { }

    async findAll(): Promise<AppointmentResponseDTO[]> {
        const appointments = await this.repository.find();
        return this.toResponseList(appointments);
    }

    async save(
        userId: number,
        dto: CreateAppointmentDTO,
    ): Promise<AppointmentResponseDTO> {
        const guardian = await this.guardianService.findEntityById(userId);
        const veterinarian = await this.veterinarianService.findEntityById(dto.veterinarianId);
        const appointment = this.repository.create({
            ...dto,
            guardian,
            veterinarian,
        });
        const newAppointment = await this.repository.save(appointment);
        return this.toResponse(newAppointment);

    }

    private toResponse(appointment: Appointment): AppointmentResponseDTO {
        return plainToInstance(AppointmentResponseDTO, appointment, {
            excludeExtraneousValues: true,
        });
    }

    private toResponseList(appointment: Appointment[]): AppointmentResponseDTO[] {
        return plainToInstance(AppointmentResponseDTO, appointment, {
            excludeExtraneousValues: true,
        });
    }
}
