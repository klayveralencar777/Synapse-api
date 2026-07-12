import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put, Req, Request, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import  { CreateUserDTO } from "./dto/create-user.dto";
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";
import { JwtAuthGuard } from "../Auth/guards/jwt-auth.guard";
import { CurrentUser } from "src/common/decorators/current-user.decorator";

interface JwtUser {
    id: number;
    name: string;
    email: string
}

@Controller('users')
export class UserController {

    constructor(
        private readonly service: UserService
    ) {}


    @Get()
    findAll() {
        return this.service.findAll();
        
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return  this.service.findById(Number(id));
    }

    @Post()
    create(@Body() dto: CreateUserDTO) {
        return this.service.save(dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('me')
    update(
        @CurrentUser() user: JwtUser, 
        @Body() dto: UpdateUserDTO
    ) {
        return this.service.update(user.id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Patch('change-password')
    changePassword(
        @CurrentUser() user: JwtUser, 
        @Body() dto: ChangePasswordDTO
    ) {
        return this.service.changePassword(user.id, dto);
        
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: number) {
        this.service.delete(Number(id));
    }
}