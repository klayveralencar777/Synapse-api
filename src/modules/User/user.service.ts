import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, ConflictException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { UserStatus } from "./enums/user.enum";



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) { }

    async findById(id: number): Promise<User> {
        const user = await this.repository.findOne({ where: { id } });
        if (!user || NaN) {
            throw new NotFoundException('usuário não encontrado');
        }
        return user;

    }

    async findByEmail(email: string): Promise<User> {
        const user = await this.repository.findOne({ where: { email } });
        if (!user) {
            throw new NotFoundException('usuário não encontrado');
        }
        return user;
        
    }

     async deleteMyAccount(id: number): Promise<User> {
            const veterinarian = await this.findById(id);
            veterinarian.status = UserStatus.INACTIVE;
            return await this.repository.save(veterinarian);
        }
    


    async changePassword(userId: number, dto: ChangePasswordDTO): Promise<void> {      
        const user = await this.findById(userId);
        const isPasswordValid = await bcrypt.compare(dto.password, user.password);
        const isSamePassword = await bcrypt.compare(dto.newPassword, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException("senha atual incorreta, tente novamente");
        }
        if (isSamePassword) {
            throw new BadRequestException("a nova senha não pode ser igual a atual");
        }
        user.password = await bcrypt.hash(dto.newPassword, 10);
        await this.repository.save(user);
    }

     async encryptPassword(password: string): Promise<string> {
            return await bcrypt.hash(password, 10);
    }


      async ensureIsEmailAvailable(email: string, id?: number): Promise<void> {
            const user = await this.repository.findOne({ where: { email } });
            if (user && user.id !== id) {
                throw new ConflictException('email já cadastrado');
            }
        }
    
        async ensureIsCpfAvailable(cpf: string, id?: number): Promise<void> {
            const user = await this.repository.findOne({ where: { cpf } });
            if (user && user.id !== id) {
                throw new ConflictException('cpf já cadastrado');
            }
        }

}