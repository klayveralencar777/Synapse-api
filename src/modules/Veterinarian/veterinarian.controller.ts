import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { Roles } from "src/common/decorators/roles.decorator";
import { RolesGuard } from "src/common/guards/roles.guard";
import { JwtAuthGuard } from "../Auth/guards/jwt-auth.guard";
import { ChangeVeterinarianPasswordDTO } from "./dto/change-password.dto";
import { CreateVeterinarianDTO } from "./dto/create-veterinarian.dto";
import { UpdateVeterinarianDTO } from "./dto/update-veterinarian.dto";
import { VeterinarianService } from "./veterinarian.service";
import { UserType } from "../User/enums/user.enum";

interface JwtUser {
    id: number;
    name: string;
    email: string;
    type: UserType;
}

@Controller('veterinarians')
export class VeterinarianController {
    constructor(
        private readonly service: VeterinarianService,
    ) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: string) {
        return this.service.findById(Number(id));
    }

    @Post()
    create(@Body() dto: CreateVeterinarianDTO) {
        return this.service.save(dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserType.VETERINARIAN)
    @Patch('')
    update(
        @CurrentUser() user: JwtUser,
        @Body() dto: UpdateVeterinarianDTO,
    ) {
        return this.service.update(user.id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserType.VETERINARIAN)
    @Patch('change-password')
    changePassword(
        @CurrentUser() user: JwtUser,
        @Body() dto: ChangeVeterinarianPasswordDTO,
    ) {
        return this.service.changePassword(user.id, dto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserType.VETERINARIAN)
    @Patch('/delete-my-account')
    deleteMyAccount(@CurrentUser() user: JwtUser) {
        return this.service.deleteMyAccount(user.id);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: number) {
        this.service.delete(Number(id));
    }
}