import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../constants/roles";

@Entity()
export abstract class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    email: string;

    @Column({select: false})
    password: string;

    abstract getRole(): Roles;
}
