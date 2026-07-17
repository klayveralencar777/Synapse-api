import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateVeterinarianDTO {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    @MaxLength(11)
    cpf?: string;

    @IsOptional()
    @IsString()
    crmv ?: string;

    @IsOptional()
    @IsString()
    @MaxLength(14)
    cnpj ?: string;

    @IsOptional()
    @IsString()
    address ?: string;

}