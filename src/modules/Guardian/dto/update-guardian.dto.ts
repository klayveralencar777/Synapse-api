import { IsEmail, IsOptional, IsString, MaxLength } from "class-validator";
export class UpdateGuardianDTO {
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
        phone ?: string;
    
}