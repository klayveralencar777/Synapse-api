import { IsEmail, IsOptional, IsString, MaxLength, MinLength } from "class-validator";
import { UserType } from "src/modules/User/enums/user.enum";

export class CreateVeterinarianDTO {
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

    @IsString()
    crmv !: string;

    @IsOptional()
    @IsString()
    @MaxLength(14)
    cnpj ?: string;

    @IsString()
    address !: string;

    @IsString()
    type !: UserType;



}