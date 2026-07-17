import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { GuardianService } from "./guardian.service";
import { CreateGuardianDTO } from "./dto/create-guardian.dto";
import { UpdateGuardianDTO } from "./dto/update-guardian.dto";
import { UserType } from "../User/enums/user.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { JwtAuthGuard } from "../Auth/guards/jwt-auth.guard";
import { UserTypeGuard } from "src/common/guards/user-type.guard";
import { UserTypes } from "src/common/decorators/user-type.decorator";
import { UserService } from "../User/user.service";
import { ChangePasswordDTO } from "../User/dto/change-password.dto";
import { AppointmentService } from "../Appointment/appointment.service";



interface JwtUser {
    id: number;
    name: string;
    email: string;
    type: UserType;
}


@Controller('guardians')
export class GuardianController {
    constructor(
        private readonly service: GuardianService,
        private readonly userService: UserService,
        private readonly appointment: AppointmentService,
    ) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    save(@Body() dto: CreateGuardianDTO) {
        return this.service.save(dto);
    }

    @UseGuards(JwtAuthGuard, UserTypeGuard)
    @UserTypes(UserType.GUARDIAN)
    @Patch('')
    update(@CurrentUser() user: JwtUser, @Body() dto: UpdateGuardianDTO) {
        return this.service.update(user.id, dto);
    }  

    @UseGuards(JwtAuthGuard, UserTypeGuard)
    @UserTypes(UserType.GUARDIAN)
    @Patch('change-password')
    changePassword(@CurrentUser() user: JwtUser, @Body() dto: ChangePasswordDTO) {
        return this.userService.changePassword(user.id, dto);
    }

    
    @UseGuards(JwtAuthGuard, UserTypeGuard)
    @UserTypes(UserType.GUARDIAN)
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