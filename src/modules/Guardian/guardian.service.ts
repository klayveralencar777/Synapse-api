import { Injectable, NotFoundException } from "@nestjs/common";
import { Repository } from "typeorm";
import { Guardian } from "./entities/guardian.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { GuardianResponseDTO } from "./dto/response.dto";
import { UserService } from "../User/user.service";
import { CreateGuardianDTO } from "./dto/create-guardian.dto";
import { plainToInstance } from "class-transformer";
import { UpdateGuardianDTO } from "./dto/update-guardian.dto";


@Injectable()
export class GuardianService {
    constructor( 
        @InjectRepository(Guardian)
        private readonly repository : Repository<Guardian>,
        private readonly service: UserService
    ) {}

    async findAll() : Promise<GuardianResponseDTO[]>{
        const guardians = await this.repository.find();
        return this.toResponseList(guardians);
    }

    async findById(id: number) : Promise<GuardianResponseDTO> {
        const guardian = await this.repository.findOne({
            where: { id }
        });
        if(!guardian) throw new NotFoundException('tutor não encontrado');
        return this.toResponse(guardian);    
    }

    async save(dto: CreateGuardianDTO): Promise<GuardianResponseDTO> {
        await this.service.ensureIsEmailAvailable(dto.email);
        await this.service.ensureIsCpfAvailable(dto.cpf);
        const newUser = this.repository.create({
            ...dto, 
            password: await this.service.encryptPassword(dto.password),       
        });
        return await this.repository.save(newUser);
    }

    async update(id: number, dto: UpdateGuardianDTO) : Promise<GuardianResponseDTO> {
        const guardian = await this.findEntityById(id);
        if(dto.email) await this.service.ensureIsEmailAvailable(dto.email, id);
        if(dto.cpf) await this.service.ensureIsCpfAvailable(dto.cpf, id);
        this.repository.merge(guardian, dto);
        const updatedGuardian = await this.repository.save(guardian);
        return this.toResponse(updatedGuardian);
    }

    async delete(id: number) : Promise<void> {
        await this.service.findById(id);
        await this.repository.delete(id);
    }

     private toResponse(guardian: Guardian): GuardianResponseDTO {
            return plainToInstance(GuardianResponseDTO, guardian, {
                excludeExtraneousValues: true,
            });
        }

     private toResponseList(guardians: Guardian[]): GuardianResponseDTO[] {
            return plainToInstance(GuardianResponseDTO, guardians, {
                 excludeExtraneousValues: true,
             });
            }

    private async findEntityById(id: number) : Promise<Guardian> {
        const entity = await this.repository.findOne({ where: { id }});
        if(!entity) throw new NotFoundException('entidade não encontrada');
        return entity;
    }
    
}