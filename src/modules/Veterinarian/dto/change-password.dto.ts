import { IsString, MinLength } from "class-validator";

export class ChangeVeterinarianPasswordDTO {
    @IsString()
    @MinLength(6)
    password!: string;

    @IsString()
    @MinLength(6)
    newPassword!: string;
}