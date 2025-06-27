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
} from '@nestjs/common'
import { SignalementService } from './signalements.service'
import { SignalementsDto } from './dto'

@Controller('signalements')
export class SignalementController {
    constructor(private readonly signalementService: SignalementService) {}

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

    @Patch('update')
    async editSignalement(@Body() dto: SignalementsDto) {
        return this.signalementService.editSignalement(dto)
    }

    @Delete(':id')
    async deleteSignalement(@Param('id', ParseIntPipe) id: number) {
        return this.signalementService.deleteSignalement(id)
    }
}
