import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import * as bcrypt from 'bcrypt';
import { ChangePasswordDTO } from "./dto/change-password.dto";



@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) { }

    async findById(id: number): Promise<User> {
        const user = await this.repository.findOne({ where: { id } });
        if (!user) {
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

}