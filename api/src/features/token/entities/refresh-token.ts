import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Roles } from "../../users/constants/roles";

@Entity()
export class RefreshToken {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true })
    token: string;

    @Column({ type: 'enum', enum: Roles })
    userType: Roles;

    @Column()
    userId: number;

    @Column({ type: 'timestamp' })
    expiresAt: Date;

    @Column({ default: false })
    revoked: boolean;
}
