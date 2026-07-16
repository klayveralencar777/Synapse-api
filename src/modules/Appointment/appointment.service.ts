import { BadRequestException, Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Appointment } from "./entities/appointment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAppointmentDTO } from "./dto/create-appointment.dto";
import { AppointmentResponseDTO } from "./dto/appointment-response.dto";
import { GuardianService } from "../Guardian/guardian.service";
import { VeterinarianService } from "../Veterinarian/veterinarian.service";
import { plainToInstance } from "class-transformer";
import { UserService } from "../User/user.service";
import { UserType } from "../User/enums/user.enum";


@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)
        private readonly repository: Repository<Appointment>,
        private readonly guardianService: GuardianService,
        private readonly veterinarianService: VeterinarianService,
        private readonly userService : UserService,
    ) { }

    async findAll(): Promise<AppointmentResponseDTO[]> {
        const appointments = await this.repository.find();
        return this.toResponseList(appointments);
    }

    async findMyAppointments(userId: number) : Promise<AppointmentResponseDTO[]>{
        const user = await this.userService.findById(userId);
        if(user.userType === UserType.GUARDIAN) {
            const guardianAppointments = await this.guardianAppointments(user.id);
            return this.toResponseList(guardianAppointments);
        }
        if(user.userType === UserType.VETERINARIAN) {
            const veterinarianAppointments = await this.veterinarianAppointments(user.id);
            return this.toResponseList(veterinarianAppointments);
        }
        throw new BadRequestException('tipo de usuário inválido');
    }


    async save(userId: number, dto: CreateAppointmentDTO): Promise<AppointmentResponseDTO> {
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


    private async guardianAppointments(userId: number) : Promise<Appointment[]> {
        const appointments = await this.repository.find({
            where: {
                guardian: {id : userId}
            }
        });
        return appointments;
    }

     private async veterinarianAppointments(userId: number) : Promise<Appointment[]> {
        const appointments = await this.repository.find({
            where: {
               veterinarian: {id : userId}
            }
        });
        return appointments;
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
