import { execSync } from "child_process";
import { Expose } from "class-transformer";
import { UserStatus } from "../enums/user.enum";

export class UserResponseDTO {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    email!: string;

    @Expose()
    cpf!: string;

    @Expose()
    createdAt: Date;

    @Expose()
    updatedAt: Date;

    @Expose()
    status: UserStatus;
}