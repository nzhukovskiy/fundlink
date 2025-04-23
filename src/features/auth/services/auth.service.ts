import { Injectable, UnauthorizedException } from "@nestjs/common";
import { LoginUserDto } from "../../users/dtos/login-user-dto";
import { UsersService } from "../../users/services/users.service";
import * as bcrypt from "bcrypt";
import { JwtTokenService } from "../../token/services/jwt-token.service";
import { ErrorCode } from "../../../constants/error-code";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
                private readonly jwtTokenService: JwtTokenService) {
    }

    async login(loginUserDto: LoginUserDto) {
        let user = await this.usersService.findByEmail(loginUserDto.email);
        if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
            delete user.password
            user["role"] = user.getRole()
            return {
                accessToken: await this.jwtTokenService.generateToken(user),
            };
        }
        throw new UnauthorizedException({
            errorCode: ErrorCode.UNAUTHORIZED,
            message: "Wrong login or password"
        });
    }

}
