import { IsEmail, IsString, MinLength, minLength } from "class-validator";

export class CreateUserDTO {
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;
}