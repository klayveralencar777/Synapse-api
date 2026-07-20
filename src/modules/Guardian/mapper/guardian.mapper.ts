import { plainToInstance } from "class-transformer";
import { GuardianResponseDTO } from "../dto/response.dto";
import { Guardian } from "../entities/guardian.entity";

export class GuardianMapper {

     toResponse(Guardian: Guardian) : GuardianResponseDTO{
             return plainToInstance(GuardianResponseDTO, Guardian, {
                excludeExtraneousValues: true,
            });
        }
    
        toResponseList(Guardians: Guardian[]): GuardianResponseDTO[] {
            return plainToInstance(GuardianResponseDTO, Guardians, {
                excludeExtraneousValues: true,
            });
        }
}