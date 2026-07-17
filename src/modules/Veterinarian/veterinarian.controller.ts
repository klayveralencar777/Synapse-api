import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { UserTypes } from "src/common/decorators/user-type.decorator";
import { UserTypeGuard } from "src/common/guards/user-type.guard";
import { JwtAuthGuard } from "../Auth/guards/jwt-auth.guard";
import { CreateVeterinarianDTO } from "./dto/create-veterinarian.dto";
import { UpdateVeterinarianDTO } from "./dto/update-veterinarian.dto";
import { VeterinarianService } from "./veterinarian.service";
import { UserType } from "../User/enums/user.enum";
import { UserService } from "../User/user.service";
import { ChangePasswordDTO } from "../User/dto/change-password.dto";
import { AppointmentService } from "../Appointment/appointment.service";

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
        private readonly userService: UserService,
        private readonly appointment: AppointmentService
    ) { }

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

    @UseGuards(JwtAuthGuard, UserTypeGuard)
    @UserTypes(UserType.VETERINARIAN)
    @Patch('')
    update(
        @CurrentUser() user: JwtUser,
        @Body() dto: UpdateVeterinarianDTO,
    ) {
        return this.service.update(user.id, dto);
    }

    @UseGuards(JwtAuthGuard, UserTypeGuard)
    @UserTypes(UserType.VETERINARIAN)
    @Patch('change-password')
    changePassword(
        @CurrentUser() user: JwtUser,
        @Body() dto: ChangePasswordDTO,
    ) {
        return this.userService.changePassword(user.id, dto);
    }

    @UseGuards(JwtAuthGuard, UserTypeGuard)
    @UserTypes(UserType.VETERINARIAN)
    @Patch('delete-my-account')
    deleteMyAccount(@CurrentUser() user: JwtUser) {
        return this.userService.deleteMyAccount(user.id);
    }


    @UseGuards(JwtAuthGuard, UserTypeGuard)
    @UserTypes(UserType.GUARDIAN)
    @Patch('cancel-my-appointment/:id')
    cancelMyAppointment(@CurrentUser() user: JwtUser, @Param('id', ParseIntPipe) appointmentId: number) {
        return this.appointment.cancelMyAppointment(user.id, appointmentId);

    }

  

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    delete(@Param('id') id: number) {
        this.service.delete(Number(id));
    }
}