import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { InscriptionDto } from './dto'
import { JwtGuard } from './guards'
import { Utilisateur } from 'prisma'
import { GetUser } from './decorator'
import { ConnexionDto } from './dto/connexion.dto'

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post('inscription')
    inscription(@Body() dto: InscriptionDto) {
        return this.authService.inscription(dto)
    }

    @Post('connexion')
    connexion(@Body() dto: ConnexionDto) {
        return this.authService.connexion(dto)
    }
}
