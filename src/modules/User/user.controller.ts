import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from "@nestjs/common";
import { UserService } from "./user.service";
import { ReturningResultsEntityUpdator } from "typeorm/query-builder/ReturningResultsEntityUpdator.js";
import { User } from "./user.entity";
import { CreateUserDTO } from "./dto/create-user.dto";



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
    async update(@Param('id') id: number, @Body() request: User) {
        return this.service.update(Number(id), request);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async delete(@Param('id') id: number) {
        this.service.delete(Number(id));
    }
}