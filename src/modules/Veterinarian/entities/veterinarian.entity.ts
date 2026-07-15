import { ChildEntity, Column } from "typeorm";
import { User } from "../../User/entities/user.entity";

@ChildEntity('veterinarian')
export class Veterinarian extends User {
    
    @Column({ unique : true})
    crmv !: string;

    @Column({ unique: true})
    cnpj ?: string;

    @Column()
    address !: string;

}