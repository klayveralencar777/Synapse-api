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
import { UserStatus } from "./enums/user.enum";




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
        await this.ensureIsEmailAvailable(dto.email);
        await  this.ensureIsCpfAvailable(dto.cpf);
        const newUser = this.repository.create({
                ...dto, 
                password: await this.encryptPassword(dto.password),
            })
            
        const savedUser = await this.repository.save(newUser);
        return this.toResponse(savedUser);
        }


    async update(userId: number, dto: UpdateUserDTO): Promise<UserResponseDTO> {
        const user = await this.findEntityById(userId);
        if(dto.email ) {
            await this.ensureIsEmailAvailable(dto.email, userId);
        }
        if(dto.cpf) {
            await this.ensureIsCpfAvailable(dto.cpf, userId);
        }
        this.repository.merge(user, dto); 
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
        await this.findEntityById(id);
        await this.repository.delete(id);

    }
    async deleteMyAccount(userId: number) : Promise<User> {
        const user = await this.findEntityById(userId);
        user.status = UserStatus.INACTIVE;
        return await this.repository.save(user);    
    }

    private async findEntityById(id: number) : Promise<User> {
        const entity = await this.repository.findOne({ where: { id}});
        if(!entity) {
            throw new NotFoundException('entidade não encontrada');
        }
        return entity;
    }

    private async encryptPassword(password: string) : Promise<string> {
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

    private async ensureIsEmailAvailable(email: string, id?: number) : Promise<void>{
        const user = await this.repository.findOne({ where: { email}});

        if(user && user.id !== id) {
            throw new ConflictException('email já cadastrado');
        }

    }

    private async ensureIsCpfAvailable(cpf: string, id?: number) : Promise<void> {
        const user = await this.repository.findOne({ where: {  cpf }});

        if(user && user.id !== id) {
            throw new ConflictException('cpf já cadastrado');
        }
    }
    





}