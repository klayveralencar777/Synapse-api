import { ChildEntity } from "typeorm";
import { User } from "../../User/entities/user.entity";

@ChildEntity('patient')
export class Patient extends User {}