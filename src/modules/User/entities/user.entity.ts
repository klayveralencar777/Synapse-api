
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, TableInheritance, UpdateDateColumn } from "typeorm";
import { UserStatus, UserType } from "../enums/user.enum";


@Entity('users')
@TableInheritance({
    column: {
        type: 'varchar',
        name: 'userType',
    },
}) 
export abstract class User{

    abstract get userType(): UserType;

    @PrimaryGeneratedColumn()
    id!: number;

    @Column()
    name!: string;

    @Column({ unique: true})
    email!: string;

    @Column()
    password!: string;

    @Column({ length: 11, unique: true})
    cpf!: string;

    @Column({ 
        enum : UserStatus, 
        default: UserStatus.ACTIVE
    })
    status!: UserStatus;


    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}