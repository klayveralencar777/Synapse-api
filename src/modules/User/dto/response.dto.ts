import { Expose } from "class-transformer";

export class UserResponseDTO {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    email!: string;
}