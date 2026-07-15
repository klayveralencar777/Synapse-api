import { ChildEntity } from "typeorm";
import { User } from "../../User/entities/user.entity";

@ChildEntity('guardian')
export class Guardian extends User {}