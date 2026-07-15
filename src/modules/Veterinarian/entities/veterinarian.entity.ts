import { ChildEntity, Column } from "typeorm";
import { User } from "../../User/entities/user.entity";
import { UserType } from "src/modules/User/enums/user.enum";

@ChildEntity(UserType.VETERINARIAN)
export class Veterinarian extends User {

     get userType() : UserType {
        return UserType.VETERINARIAN
    }
    
    @Column({ unique : true})
    crmv !: string;

    @Column({ unique: true})
    cnpj ?: string;

    @Column()
    address !: string;

}