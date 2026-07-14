
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";


@Entity('users')
export class User{
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ length: 150})
    name!: string;

    @Column({ 
        unique: true,
        length: 150
    })
    email!: string;

    @Column()
    password!: string;

    @Column({unique: true})
    cpf!: string;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

}