import { Expose } from "class-transformer";
import { UserStatus, UserType } from "../../User/enums/user.enum";

export class GuardianResponseDTO {

        @Expose()
        id!: number;
    
        @Expose()
        name!: string;
    
        @Expose()
        email!: string;
    
        @Expose()
        cpf!: string;   

        @Expose()
        phone!: string; 
    
        @Expose()
        createdAt!: Date;
    
        @Expose()
        updatedAt!: Date;
    
        @Expose()
        status!: UserStatus;

        @Expose()
        userType !: UserType;

}