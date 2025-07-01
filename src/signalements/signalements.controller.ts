import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    Param,
    ParseIntPipe,
    NotFoundException,
    UseGuards,
} from '@nestjs/common'
import { SignalementService } from './signalements.service'
import { SignalementsDto } from './dto'
import { AdminGuard } from 'src/auth/guards'

@Controller('signalements')
export class SignalementController {
    constructor(private readonly signalementService: SignalementService) {}

    @UseGuards(AdminGuard)
    @Get()
    async getAllSignalements() {
        return this.signalementService.getAllSignalements()
    }

    @Get(':id')
    async getSignalementById(@Param('id', ParseIntPipe) id: number) {
        const signalement = await this.signalementService.getSignalementById(id)
        if (!signalement) {
            throw new NotFoundException(
                `Aucun signalement trouvé pour l'id ${id}`
            )
        }
        return signalement
    }

    @Post('new')
    async createSignalement(@Body() dto: SignalementsDto) {
        return this.signalementService.createSignalement(dto)
    }
    @UseGuards(AdminGuard)
    @Patch('update')
    async editSignalement(@Body() dto: SignalementsDto) {
        return this.signalementService.editSignalement(dto)
    }
    @UseGuards(AdminGuard)
    @Delete(':id')
    async deleteSignalement(@Param('id', ParseIntPipe) id: number) {
        return this.signalementService.deleteSignalement(id)
    }
}
