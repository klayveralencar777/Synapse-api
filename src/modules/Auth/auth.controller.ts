import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginRequestDTO } from "./dto/login-request.dto";

@Controller('auth')
export class AuthController{
    constructor( private readonly service: AuthService) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    login(@Body() dto: LoginRequestDTO) {
        return this.service.login(dto);
    }
    
}