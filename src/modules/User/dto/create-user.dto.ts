import { IsEmail, IsString, Length, MinLength } from "class-validator";

export class CreateUserDTO {
    @IsString()
    @MinLength(3)
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @Length(11, 11)
    cpf!: string;
}