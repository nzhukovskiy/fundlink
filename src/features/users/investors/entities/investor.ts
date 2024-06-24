import { User } from "../../user/user";
import { Column, Entity } from "typeorm";

@Entity()
export class Investor extends User {
    @Column()
    name: string;

    @Column()
    surname: string;
}
