import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseGuards,
} from '@nestjs/common'
import { UtilisateursService } from './utilisateurs.service'
import { UtilisateursDto } from './dto/utilisateurs.dto'
import { AdminGuard } from 'src/auth/guards'

@Controller('utilisateurs')
export class UtilisateursController {
    constructor(private readonly utilisateursService: UtilisateursService) {}

    @Get()
    async getAllUtilisateurs() {
        return this.utilisateursService.getAllUtilisateurs()
    }
    @Get(':id')
    async getUtilisateurById(@Param('id') id: string) {
        return this.utilisateursService.getUtilisateurById(id)
    }

    @Put()
    async editUtilisateur(@Body() dto: UtilisateursDto) {
        return this.utilisateursService.editUtilisateur(dto)
    }
    @UseGuards(AdminGuard)
    @Delete(':id')
    async deleteUtilisateur(@Param('id') id: string) {
        return this.utilisateursService.deleteUtilisateur(id)
    }
}
