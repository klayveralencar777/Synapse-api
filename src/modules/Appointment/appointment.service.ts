import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Not, Repository } from "typeorm";
import { Appointment } from "./entities/appointment.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateAppointmentDTO } from "./dto/create-appointment.dto";
import { AppointmentResponseDTO } from "./dto/appointment-response.dto";
import { GuardianService } from "../Guardian/guardian.service";
import { VeterinarianService } from "../Veterinarian/veterinarian.service";
import { plainToInstance } from "class-transformer";
import { UserService } from "../User/user.service";
import { UserType } from "../User/enums/user.enum";
import { AppointmentStatus } from "./enums/appointment.enum";


@Injectable()
export class AppointmentService {
    constructor(
        @InjectRepository(Appointment)
        private readonly repository: Repository<Appointment>,
        private readonly guardianService: GuardianService,
        private readonly veterinarianService: VeterinarianService,
        private readonly userService: UserService,
    ) { }

    async findAll(): Promise<AppointmentResponseDTO[]> {
        const appointments = await this.repository.find();
        return this.toResponseList(appointments);
    }

    async findById(id: number): Promise<AppointmentResponseDTO> {
        const appointment = await this.findEntityById(id);
        return this.toResponse(appointment);
    }

    async findMyAppointments(userId: number): Promise<AppointmentResponseDTO[]> {
        const user = await this.userService.findById(userId);
        if (user.userType === UserType.GUARDIAN) {
            const guardianAppointments = await this.guardianAppointments(user.id);
            return this.toResponseList(guardianAppointments);
        }
        if (user.userType === UserType.VETERINARIAN) {
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

    async confirmAppointment(userId: number, appointmentId: number): Promise<void> {
        const appointment = await this.findAppointmentOfEntityById(userId, appointmentId);
        appointment.status = AppointmentStatus.CONFIRMED;
        await this.repository.save(appointment);
        
    }


    async cancelMyAppointment(userId: number, appointmentId: number): Promise<void> {
        const appointment = await this.findAppointmentOfEntityById(userId, appointmentId);
        appointment.status = AppointmentStatus.CANCELLED;
        await this.repository.save(appointment);
    }


    private async findEntityById(id: number): Promise<Appointment> {
        const appointment = await this.repository.findOne({ where: { id } });
        if (!appointment) throw new NotFoundException('consulta nao encontrada');
        return appointment;
    }

    private async findAppointmentOfEntityById(userId: number, appointmentId: number): Promise<Appointment> {
        const user = await this.userService.findById(userId);
        const where =
             user.userType === UserType.GUARDIAN
                ? {
                    id: appointmentId,
                    guardian: { id: userId },
                }
                : user.userType === UserType.VETERINARIAN
                    ? {
                        id: appointmentId,
                        veterinarian: { id: userId },
                    }
                    : null;

            if (!where) {
                throw new BadRequestException(
                    'Tipo de usuário inválido',
                );
            }

            const appointment = await this.repository.findOne({
                where,
            });

            if (!appointment) {
                throw new NotFoundException(
                    'Consulta não encontrada',
                );
            }

            return appointment;
    }

    private async guardianAppointments(userId: number): Promise<Appointment[]> {
        const appointments = await this.repository.find({
            where: {
                guardian: { id: userId }
            }
        });
        return appointments;
    }

    private async veterinarianAppointments(userId: number): Promise<Appointment[]> {
        const appointments = await this.repository.find({
            where: {
                veterinarian: { id: userId }
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
