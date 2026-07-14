import { IsEmail, IsOptional, IsString, Length, MinLength } from "class-validator";

export class UpdateUserDTO {

    @IsString()
    @MinLength(3)
    @IsOptional()
    name?: string;

    @IsEmail()
    @IsOptional()
    email?: string;
   
}