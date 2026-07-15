import { Expose } from "class-transformer";
import { UserStatus, UserType } from "../../User/enums/user.enum";

export class VeterinarianResponseDTO {
    @Expose()
    id!: number;

    @Expose()
    name!: string;

    @Expose()
    email!: string;

    @Expose()
    cpf!: string;

    @Expose()
    cnpj !: string;

    @Expose()
    crmv !: string;

    @Expose()
    address !: string;

    @Expose()
    type !: UserType;

    @Expose()
    createdAt!: Date;

    @Expose()
    updatedAt!: Date;

    @Expose()
    status!: UserStatus;
}