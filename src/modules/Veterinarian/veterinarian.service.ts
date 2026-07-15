import { Injectable, BadRequestException, ConflictException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { plainToInstance } from "class-transformer";
import * as bcrypt from 'bcrypt';
import { Repository } from "typeorm";
import { Veterinarian } from "./entities/veterinarian.entity";
import { CreateVeterinarianDTO } from "./dto/create-veterinarian.dto";
import { UpdateVeterinarianDTO } from "./dto/update-veterinarian.dto";
import { ChangeVeterinarianPasswordDTO } from "./dto/change-password.dto";
import { ResetVeterinarianPasswordDTO } from "./dto/reset-password.dto";
import { VeterinarianResponseDTO } from "./dto/response.dto";
import { UserStatus } from "../User/enums/user.enum";

@Injectable()
export class VeterinarianService {
    constructor(
        @InjectRepository(Veterinarian)
        private readonly repository: Repository<Veterinarian>
    ) {}

    async findAll(): Promise<VeterinarianResponseDTO[]> {
        const veterinarians = await this.repository.find();
        return this.toResponseList(veterinarians);
    }

    async findById(id: number): Promise<VeterinarianResponseDTO> {
        const veterinarian = await this.repository.findOne({ where: { id } });
        if (!veterinarian) {
            throw new NotFoundException('médico veterinário não encontrado');
        }
        return this.toResponse(veterinarian);
    }

    async save(dto: CreateVeterinarianDTO): Promise<VeterinarianResponseDTO> {
        await this.ensureIsEmailAvailable(dto.email);
        await this.ensureIsCpfAvailable(dto.cpf);
        if(dto.cnpj)  await this.ensureCnpjIsAvailable(dto.cnpj);
        const newVeterinarian = this.repository.create({
            ...dto,
            password: await this.encryptPassword(dto.password),
        });
        const savedVeterinarian = await this.repository.save(newVeterinarian);
        return this.toResponse(savedVeterinarian);
    }

    async update(veterinarianId: number, dto: UpdateVeterinarianDTO): Promise<VeterinarianResponseDTO> {
        const veterinarian = await this.findEntityById(veterinarianId);
        if (dto.email) {
            await this.ensureIsEmailAvailable(dto.email, veterinarianId);
        }
        if (dto.cpf) {
            await this.ensureIsCpfAvailable(dto.cpf, veterinarianId);
        }
        if(dto.cnpj) {
            await this.ensureCnpjIsAvailable(dto.cnpj, veterinarian.id);
        }
        this.repository.merge(veterinarian, dto);
        const updatedVeterinarian = await this.repository.save(veterinarian);
        return this.toResponse(updatedVeterinarian);
    }

    async changePassword(veterinarianId: number, dto: ChangeVeterinarianPasswordDTO): Promise<void> {
        const veterinarian = await this.findEntityById(veterinarianId);
        const isPasswordValid = await bcrypt.compare(dto.password, veterinarian.password);
        const isSamePassword = await bcrypt.compare(dto.newPassword, veterinarian.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('senha atual incorreta, tente novamente');
         }
        if (isSamePassword) {
            throw new BadRequestException('a nova senha não pode ser igual a atual');
        }
        veterinarian.password = await this.encryptPassword(dto.newPassword);
        await this.repository.save(veterinarian);
    }

    async resetPassword(id: number, dto: ResetVeterinarianPasswordDTO) {}

    async delete(id: number): Promise<void> {
        await this.findEntityById(id);
        await this.repository.delete(id);
    }

    async deleteMyAccount(veterinarianId: number): Promise<Veterinarian> {
        const veterinarian = await this.findEntityById(veterinarianId);
        veterinarian.status = UserStatus.INACTIVE;
        return await this.repository.save(veterinarian);
    }

    private async findEntityById(id: number): Promise<Veterinarian> {
        const veterinarian = await this.repository.findOne({ where: { id } });
        if (!veterinarian) {
            throw new NotFoundException('entidade não encontrada');
        }
        return veterinarian;
    }

    private async encryptPassword(password: string): Promise<string> {
        return await bcrypt.hash(password, 10);
    }

    private toResponse(veterinarian: Veterinarian): VeterinarianResponseDTO {
        return plainToInstance(VeterinarianResponseDTO, veterinarian, {
            excludeExtraneousValues: true,
        });
    }

    private toResponseList(veterinarians: Veterinarian[]): VeterinarianResponseDTO[] {
        return plainToInstance(VeterinarianResponseDTO, veterinarians, {
            excludeExtraneousValues: true,
        });
    }

    private async ensureIsEmailAvailable(email: string, id?: number): Promise<void> {
        const veterinarian = await this.repository.findOne({ where: { email } });

        if (veterinarian && veterinarian.id !== id) {
            throw new ConflictException('email já cadastrado');
        }
    }

    private async ensureIsCpfAvailable(cpf: string, id?: number): Promise<void> {
        const veterinarian = await this.repository.findOne({ where: { cpf } });

        if (veterinarian && veterinarian.id !== id) {
            throw new ConflictException('cpf já cadastrado');
        }
    }

    private async ensureCnpjIsAvailable(cnpj : string, id?: number) : Promise<void> {
        const veterinarian = await this.repository.findOne({ where: { cnpj}});
        if(veterinarian && veterinarian.id !== id) {
            throw new ConflictException('cnpj já cadastrado');
        }
    }   
}