import { Roles } from "../../users/constants/roles";

export class CreateRefreshTokenDto {
    userId: number;
    userType: Roles;
    token: string;
    expiresAt: Date;
}
