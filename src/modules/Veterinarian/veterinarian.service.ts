import {
     Injectable, 
    ConflictException, 
    NotFoundException,  
} from "@nestjs/common";

import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Veterinarian } from "./entities/veterinarian.entity";
import { CreateVeterinarianDTO } from "./dto/create-veterinarian.dto";
import { UpdateVeterinarianDTO } from "./dto/update-veterinarian.dto";
import { VeterinarianResponseDTO } from "./dto/response.dto";
import { UserService } from "../User/user.service";
import { VeterinarianMapper } from "./mapper/veterinarian.mapper";

@Injectable()
export class VeterinarianService {
    constructor(
        @InjectRepository(Veterinarian)
        private readonly repository: Repository<Veterinarian>,
        private readonly service: UserService,
        private readonly mapper : VeterinarianMapper,
    ) {}

    async findAll(): Promise<VeterinarianResponseDTO[]> {
        const veterinarians = await this.repository.find();
        return this.mapper.toResponseList(veterinarians);
    }

    async findById(id: number): Promise<VeterinarianResponseDTO> {
        const veterinarian = await this.repository.findOne({ where: { id } });
        if (!veterinarian) {
            throw new NotFoundException('médico veterinário não encontrado');
        }
        return this.mapper.toResponse(veterinarian);
    }

    async save(dto: CreateVeterinarianDTO): Promise<VeterinarianResponseDTO> {
        await this.service.ensureIsEmailAvailable(dto.email);
        await this.service.ensureIsCpfAvailable(dto.cpf);
        if(dto.cnpj)  await this.ensureCnpjIsAvailable(dto.cnpj);
        const newVeterinarian = this.repository.create({
            ...dto,
            password: await this.service.encryptPassword(dto.password),
        });
        const savedVeterinarian = await this.repository.save(newVeterinarian);
        return this.mapper.toResponse(savedVeterinarian);
    }

    async update(veterinarianId: number, dto: UpdateVeterinarianDTO): Promise<VeterinarianResponseDTO> {
        const veterinarian = await this.findEntityById(veterinarianId);
        if (dto.email) await this.service.ensureIsEmailAvailable(dto.email, veterinarianId);    
        if (dto.cpf) await this.service.ensureIsCpfAvailable(dto.cpf, veterinarianId);  
        if(dto.cnpj) await this.ensureCnpjIsAvailable(dto.cnpj, veterinarian.id);     
        this.repository.merge(veterinarian, dto);
        const updatedVeterinarian = await this.repository.save(veterinarian);
        return this.mapper.toResponse(updatedVeterinarian);
    }

   

    async delete(id: number): Promise<void> {
        await this.service.findById(id);
        await this.repository.delete(id);
    }

     async findEntityById(id: number): Promise<Veterinarian> {
        const veterinarian = await this.repository.findOne({ where: { id } });
        if (!veterinarian) {
            throw new NotFoundException('entidade não encontrada');
        }
        return veterinarian;
    }


    private async ensureCnpjIsAvailable(cnpj : string, id?: number) : Promise<void> {
        const veterinarian = await this.repository.findOne({ where: { cnpj}});
        if(veterinarian && veterinarian.id !== id) {
            throw new ConflictException('cnpj já cadastrado');
        }
    }   
}
