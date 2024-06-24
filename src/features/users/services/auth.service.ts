import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Startup } from "../startups/entities/startup";
import { Repository } from "typeorm";
import { Investor } from "../investors/entities/investor";
import { LoginUserDto } from "../dtos/login-user-dto";
import { UsersService } from "./users.service";
import * as bcrypt from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(private readonly usersService: UsersService,
                private readonly jwtService: JwtService) {
    }

    async login(loginUserDto: LoginUserDto) {
        let user = await this.usersService.findByEmail(loginUserDto.email);
        if (user && await bcrypt.compare(loginUserDto.password, user.password)) {
            const payload = { id: user.id, email: user.email };
            console.log(payload)
            return {
                accessToken: await this.jwtService.signAsync(payload),
            };
        }
        throw new UnauthorizedException();
    }

}
