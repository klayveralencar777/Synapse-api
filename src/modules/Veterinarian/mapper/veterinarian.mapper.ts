import { plainToInstance } from "class-transformer";
import { VeterinarianResponseDTO } from "../dto/response.dto";
import { Veterinarian } from "../entities/veterinarian.entity";

export class VeterinarianMapper {


    toResponse(veterinarian: Veterinarian) : VeterinarianResponseDTO{
         return plainToInstance(VeterinarianResponseDTO, veterinarian, {
            excludeExtraneousValues: true,
        });
    }

    toResponseList(veterinarians: Veterinarian[]): VeterinarianResponseDTO[] {
        return plainToInstance(VeterinarianResponseDTO, veterinarians, {
            excludeExtraneousValues: true,
        });
    }

}