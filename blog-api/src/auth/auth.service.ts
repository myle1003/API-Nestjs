import { ForbiddenException, Injectable, Req } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AuthDTO } from "./dto";
import * as argon from "argon2";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {
    constructor(
        private prismaService: PrismaService,
        private jwtService: JwtService,
        private configService: ConfigService
    ) {

    }
    async register(authDTO: AuthDTO) {
        try {
            const hashedPassword = await argon.hash(authDTO.password)
            const user = await this.prismaService.user.create({
                data: {
                    email: authDTO.email,
                    hashedPassword: hashedPassword,
                    firstName: '',
                    lastName: ''
                },
                select: {
                    id: true,
                    email: true,
                    createdAt: true,
                }
            })
            return {
                message: user
            }
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ForbiddenException(error.message)

            }
            return error
        }
    }

    async login(authDTO: AuthDTO) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: authDTO.email
            }

        })
        if (!user) {
            throw new ForbiddenException('User not found')
        }
        const passwordMatched = await argon.verify(
            user.hashedPassword,
            authDTO.password
        )
        if (!passwordMatched) {
            throw new ForbiddenException('Invalid password')
        }
        delete (user.hashedPassword)
        return await this.signJwtToken(user.id, user.email, user.hashedPassword)
    }
    async signJwtToken(userId: number, email: string, password: string)
        : Promise<{ accessToken: string }> {
        const payload = {
            sub: userId,
            email
        }
        const accessToken = await this.jwtService.signAsync(payload, {
            expiresIn: '10m',
            secret: this.configService.get('JWT_SECRET')
        })
        return {
            accessToken: accessToken
        }
    }
}
