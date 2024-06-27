import { User } from "../../user/user";
import { Column, Entity } from "typeorm";
import { Roles } from "../../constants/roles";

@Entity()
export class Investor extends User {
    @Column()
    name: string;

    @Column()
    surname: string;

    getRole(): Roles {
        return Roles.INVESTOR;
    }
}
