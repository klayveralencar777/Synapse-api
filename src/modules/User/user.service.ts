import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { ResetPasswordDTO } from "./dto/reset-password.dto";




@Injectable()
export class UserService {
    constructor( 
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) {}

    async findAll() : Promise<User[]>{
        return await this.repository.find();

    }


    async findById(id: number) : Promise<User> {
        const user = await this.repository.findOne({ where : { id }});
        if(!user) {
        throw new NotFoundException('usuário não encontrado');
        
        }
        return user;

    }
    
    async save(dto: CreateUserDTO) : Promise<User> {
        const user = await this.repository.findOne({ where: { email: dto.email}});
        if(user) {
            throw new ConflictException("email já cadastrado");
        }
        const hashPassword = await this.encryptPassword(dto.password);
        dto.password = hashPassword;
        return await this.repository.save(dto);
    }

    
    async update(id: number, dto: UpdateUserDTO) : Promise<User> {

        const user = await this.findById(id);
        if(dto.email) {
            const userEmail = await this.repository.findOne({ where: { email: dto.email}});

            if(userEmail && userEmail.id !== user.id) {

             throw new ConflictException("email já cadastrado");

             }

        }

        user.name = dto.name ?? user.name;
        user.email = dto.email ?? user.email;

        return this.repository.save(user);
    }

    async changePassword(id: number, dto: ChangePasswordDTO) : Promise<User> {
        const user = await this.findById(id);
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        const isSamePassword = await bcrypt.compare(user.password, dto.newPassword);


        if(!isPasswordValid) {
            throw new UnauthorizedException("senha atual incorreta, tente novamente");

        }

        if(isSamePassword) {
            throw new BadRequestException("a nova senha não pode ser igual a atual");
        }

        user.password =  await this.encryptPassword(dto.newPassword);
        return await this.repository.save(user);


    }

    async resetPassword(id: number, dto: ResetPasswordDTO){}

    
    async delete(id: number) : Promise<void> {
        await this.findById(id);
        await this.repository.delete(id);
      
    }

    private async encryptPassword(password: string) {
        const hashPassword = await bcrypt.hash(password, 10);
        return hashPassword;
    }

}