import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";
import { plainToInstance } from "class-transformer";
import { UserResponseDTO } from "./dto/response.dto";





@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) { }

    async findAll(): Promise<UserResponseDTO[]> {
        const users = await this.repository.find();
        return this.toResponseList(users);

    }


    async findById(id: number): Promise<UserResponseDTO> {
        const user = await this.repository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('usuário não encontrado');

        }
        return this.toResponse(user);

    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('usuário não encontrado');
        }
       return user;
    }

    async save(dto: CreateUserDTO): Promise<UserResponseDTO> {
        const isEmailExists = await this.repository.findOne({ where: { email: dto.email } });
        if (isEmailExists) {
            throw new ConflictException("email já cadastrado");
        }
        const isCpfExists = await this.repository.findOne({ where: {cpf: dto.cpf}});

        if(isCpfExists) {
            throw new ConflictException('cpf já cadastrado');
        }

        
        const hashPassword = await this.encryptPassword(dto.password);
        dto.password = hashPassword;
        const newUser = await this.repository.save(dto);
        return this.toResponse(newUser);
    }


    async update(userId: number, dto: UpdateUserDTO): Promise<UserResponseDTO> {

        const user = await this.findEntityById(userId);
        if (dto.email) {
            const userEmail = await this.repository.findOne({ where: { email: dto.email } });

            if (userEmail && userEmail.id !== user.id) {

                throw new ConflictException("email já cadastrado");

            }

        }

        user.name = dto.name ?? user.name;
        user.email = dto.email ?? user.email;

        const update = await this.repository.save(user);
        return this.toResponse(update);
    }

    async changePassword(userId: number, dto: ChangePasswordDTO): Promise<void> {
        const user = await this.findEntityById(userId);
        
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);


        if (!isPasswordValid) {
            throw new UnauthorizedException("senha atual incorreta, tente novamente");

        }

        if (isSamePassword) {
            throw new BadRequestException("a nova senha não pode ser igual a atual");
        }

        user.password = await this.encryptPassword(dto.newPassword);
        await this.repository.save(user);


    }

    async resetPassword(id: number, dto: ResetPasswordDTO) { }


    async delete(id: number): Promise<void> {
        await this.findById(id);
        await this.repository.delete(id);

    }

    private async findEntityById(id: number) {
        const entity = await this.repository.findOne({ where: { id}});
        if(!entity) {
            throw new NotFoundException('entidade não encontrada');
        }
        return entity;
    }

    private async encryptPassword(password: string) {
        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword;
    }


    private toResponse(user: User): UserResponseDTO {
        return plainToInstance(UserResponseDTO, user, {
            excludeExtraneousValues: true,
        });
    }

    private toResponseList(users: User[]): UserResponseDTO[] {
        return plainToInstance(UserResponseDTO, users, {
            excludeExtraneousValues: true,
        });
    }


}