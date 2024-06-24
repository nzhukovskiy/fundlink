import { User } from "../../user/user";
import { Column, Entity } from "typeorm";

@Entity()
export class Startup extends User {
    @Column()
    title: string;

    @Column()
    description: string;

    @Column({type: "decimal"})
    fundingGoal: number;
}
