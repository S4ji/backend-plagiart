import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { InscriptionDto } from './dto'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as argon from 'argon2'
import { ConnexionDto } from './dto/connexion.dto'

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private config: ConfigService,
        private jwt: JwtService
    ) {}

    async inscription(dto: InscriptionDto) {
        const hash = await argon.hash(dto.mot_de_passe)

        const userRole = await this.prisma.role.findUnique({
            where: {
                nom: 'MEMBRE',
            },
        })

        const user = await this.prisma.utilisateur.create({
            data: {
                nom: dto.nom,
                email: dto.email,
                mot_de_passe: hash,
                roleId: userRole.id,
                rgpd: new Date(),
                isActive: true,
                token: '',
            },
        })

        return this.signToken(user.id_utilisateur, userRole.nom, user.nom)
    }

    async connexion(dto: ConnexionDto) {
        const user = await this.prisma.utilisateur.findUnique({
            where: {
                email: dto.email,
                isActive: true,
            },
            include: {
                role: true,
            },
        })
        if (!user) {
            throw new BadRequestException(
                'Identifiant incorrect ou compte non actif'
            )
        }

        const isValidPassword = await argon.verify(
            user.mot_de_passe,
            dto.mot_de_passe
        )
        if (!isValidPassword) {
            throw new ForbiddenException(
                'Identifiant incorrect ou compte non actif'
            )
        }
        return this.signToken(user.id_utilisateur, user.role.nom, user.nom)
    }

    async signToken(
        userId: string,
        userRole: string,
        userName: string
    ): Promise<{ id: string; sub: string; role: string; name: string }> {
        const payload = {
            sub: userId,
        }

        const secret = this.config.get('JWT_SECRET')
        const token = await this.jwt.signAsync(payload, {
            expiresIn: '30d',
            secret: secret,
        })

        return {
            sub: token,
            id: userId,
            role: userRole,
            name: userName,
        }
    }
}
