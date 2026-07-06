import { Repository } from "typeorm";
import { User } from "./user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDTO } from "./dto/create-user.dto";
import { UpdateUserDTO } from "./dto/update-user.dto";



@Injectable()
export class UserService {
    constructor( 
        @InjectRepository(User)
        private readonly repository: Repository<User>
    ) {}

    async findAll() : Promise<User[]>{
        return await this.repository.find();

    }

    async findById(id: number) : Promise<User> {
        const user = await this.repository.findOne({ where : { id }});
        if(!user) {
        throw new NotFoundException('usuário não encontrado');
        
        }
        return user;

    }
    
    async save(dto: CreateUserDTO) : Promise<User> {
        return await this.repository.save(dto);
    }

    async update(id: number, dto: UpdateUserDTO) : Promise<User> {
        const user = await this.findById(id);
        user.name = dto.name;
        user.email = dto.email;
        user.password = dto.password;
        return  this.repository.save(user);
    }

    async delete(id: number) : Promise<void> {
        this.findById(id);
        this.repository.delete(id);
      
    }

}