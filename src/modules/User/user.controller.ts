import { Body, Controller, Get, Patch, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { UserTypes } from "src/common/decorators/user-type.decorator";
import { JwtAuthGuard } from "../Auth/guards/jwt-auth.guard";
import { UserTypeGuard } from "src/common/guards/user-type.guard";
import { UserType } from "./enums/user.enum";
import { CurrentUser } from "src/common/decorators/current-user.decorator";
import { ChangePasswordDTO } from "./dto/change-password.dto";


interface JwtUser {
    id: number;
    name: string;
    email: string;
    type: UserType;
}


@Controller('users')
export class UserController {
    constructor(
        private readonly service: UserService,
    ) { }


    @UseGuards(JwtAuthGuard, UserTypeGuard)
    @Patch('change-password')
    changePassword(
        @CurrentUser() user: JwtUser,
        @Body() dto: ChangePasswordDTO,
    ) {
        return this.service.changePassword(user.id, dto);
    }

    @UseGuards(JwtAuthGuard, UserTypeGuard)   
    @Patch('delete-my-account')
    deleteMyAccount(@CurrentUser() user: JwtUser) {
        return this.service.deleteMyAccount(user.id);
    }
}