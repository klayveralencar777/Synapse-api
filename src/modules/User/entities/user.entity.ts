
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserStatus } from "../enums/user.enum";


@Entity('users')
export class User{
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
    status: UserStatus
  
    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}