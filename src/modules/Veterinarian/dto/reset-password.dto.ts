import { IsEmail } from "class-validator";

export class ResetVeterinarianPasswordDTO {
    @IsEmail()
    email!: string;
}