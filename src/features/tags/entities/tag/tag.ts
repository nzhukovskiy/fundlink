import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Startup } from "../../../users/startups/entities/startup";

@Entity()
export class Tag {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @ManyToMany(() => Startup, startup => startup.tags)
    startups: Startup[]
}
