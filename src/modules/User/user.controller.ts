import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "./user.entity";
import type { CreateUserDTO } from "./dto/create-user.dto";
import { ChangePasswordDTO } from "./dto/change-password.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";



@Controller('users')
export class UserController {

    constructor(
        private readonly service: UserService
    ) {}


    @Get()
    async findAll() {
        return this.service.findAll();
        
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return await this.service.findById(Number(id));
    }

    @Post()
    async create(@Body() dto: CreateUserDTO) {
        return this.service.save(dto);
    }

    @Put(':id')
    async update(@Param('id') id: number, @Body() dto: UpdateUserDTO) {
        return this.service.update(Number(id), dto);
    }

    @Patch(':id/change-password')
    async changePassword(@Param('id') id: number, @Body() dto: ChangePasswordDTO) {
        return this.service.changePassword(Number(id), dto);
        
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: number) {
        this.service.delete(Number(id));
    }
}