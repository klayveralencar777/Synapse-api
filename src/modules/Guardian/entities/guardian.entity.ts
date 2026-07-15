import { ChildEntity, Column } from "typeorm";
import { User } from "../../User/entities/user.entity";
import { UserType } from "src/modules/User/enums/user.enum";

@ChildEntity(UserType.GUARDIAN)
export class Guardian extends User {

    get userType() : UserType {
        return UserType.GUARDIAN
    }
  
    @Column()
    phone : string;
}