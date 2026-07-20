import { plainToInstance } from "class-transformer";
import { AppointmentResponseDTO } from "../dto/appointment-response.dto";
import { Appointment } from "../entities/appointment.entity";

export class AppointmentMapper {
    
     toResponse(Appointment: Appointment) : AppointmentResponseDTO{
             return plainToInstance(AppointmentResponseDTO, Appointment, {
                excludeExtraneousValues: true,
            });
        }
    
        toResponseList(Appointments: Appointment[]): AppointmentResponseDTO[] {
            return plainToInstance(AppointmentResponseDTO, Appointments, {
                excludeExtraneousValues: true,
            });
        }
}