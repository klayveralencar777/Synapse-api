import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginRequestDTO } from "./dto/login-request.dto";

import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';
import { UserService } from "../User/user.service";


@Injectable()
export class AuthService {

    constructor(
        private readonly service: UserService,
        private readonly jwtService : JwtService
    
    ) {}


    async login(dto: LoginRequestDTO) {
        const user = await this.service.findByEmail(dto.email);
       
        const checkPassword = await bcrypt.compare(dto.password, user.password);

        if(!checkPassword) {
            throw new UnauthorizedException('Credenciais inválidas');
        }

        const payload = {
            sub: user.id,
            email: user.email,
            name: user.name,
        }

        return {
            access_token: await this.jwtService.signAsync(payload),
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            }

        }
    }


    }
