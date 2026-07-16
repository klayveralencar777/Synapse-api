
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { AppointmentService } from "./appointment.service";
import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { CreateAppointmentDTO } from "./dto/create-appointment.dto";
import { UserType } from "../User/enums/user.enum";
import { UserTypeGuard } from "src/common/guards/user-type.guard";
import { JwtAuthGuard } from "../Auth/guards/jwt-auth.guard";
import { UserTypes } from "src/common/decorators/user-type.decorator";


interface JwtUser {
    id: number;
    name: string;
    email: string;
    type: UserType;
}


@Controller('appointments')
export class AppointmentController {
    constructor(
        private readonly service: AppointmentService
    ) {}

    @Get()
    findAll() {
        return this.service.findAll();
    }

    @Post()
    @UseGuards(JwtAuthGuard, UserTypeGuard)
    @UserTypes(UserType.GUARDIAN)
    create(@CurrentUser() user: JwtUser, @Body() dto: CreateAppointmentDTO) {
        return this.service.save(user.id, dto);
    }
}