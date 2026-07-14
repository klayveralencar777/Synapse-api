import { IsEmail, IsString, MaxLength, MinLength, minLength } from "class-validator";

export class CreateUserDTO {
    @IsString()
    name!: string;

    @IsEmail()
    email!: string;

    @IsString()
    @MinLength(6)
    password!: string;


    @IsString()
    @MaxLength(11)
    cpf!: string;
}