import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { PrismaService } from '../../prisma/prisma.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
    constructor(
        config: ConfigService,
        private prisma: PrismaService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
        })
    }

    async validate(payload: { sub: string; email: string }) {
        const user = this.prisma.utilisateur.findUnique({
            where: {
                id_utilisateur: payload.sub,
            },
            select: {
                id_utilisateur: true,
                email: true,
            },
        })
        if (!user) {
            throw new UnauthorizedException()
        }

        return user
    }
}
