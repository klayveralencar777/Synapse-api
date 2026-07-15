import { IsEmail, IsString, MaxLength, MinLength } from "class-validator";

export class CreateGuardianDTO {
    
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
        phone !: string;
        

    
}