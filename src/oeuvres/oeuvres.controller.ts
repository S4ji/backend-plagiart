import {
    Controller,
    Get,
    Post,
    Body,
    Put,
    Delete,
    Param,
    Query,
    ParseIntPipe,
    NotFoundException,
} from '@nestjs/common'
import { OeuvresService } from './oeuvres.service'
import { OeuvresDto, SearchOeuvreDto } from './dto'

@Controller('oeuvres')
export class OeuvresController {
    constructor(private readonly oeuvresService: OeuvresService) {}

    @Get('/all')
    getAllOeuvres() {
        return this.oeuvresService.getAllOeuvres()
    }

    @Get('/random')
    getRandomOeuvres() {
        return this.oeuvresService.getRandomOeuvres()
    }

    @Get('/user/:userId')
    getUserOeuvres(@Param('userId') userId: string) {
        return this.oeuvresService.getOeuvresByUser(userId)
    }

    @Post('search')
    async searchOeuvres(
        @Body() body: { q: string; page?: number; limit?: number }
    ) {
        const { q, page = 1, limit = 20 } = body
        return this.oeuvresService.getOeuvreBySearch(q, page, limit)
    }

    @Post('/new')
    createOeuvre(@Body() dto: OeuvresDto) {
        return this.oeuvresService.createOeuvres(dto)
    }

    @Put(':id')
    async editOeuvre(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: OeuvresDto
    ) {
        // Ajoute l'id à dto
        dto.id_oeuvre = id
        const updated = await this.oeuvresService.editOeuvres(dto)

        if (!updated) {
            throw new NotFoundException(`Oeuvre avec id ${id} non trouvée`)
        }

        return updated
    }

    @Delete('/:id_oeuvre/collections/:id_collection')
    removeOeuvreFromCollection(
        @Param('id_oeuvre', ParseIntPipe) id_oeuvre: number,
        @Param('id_collection', ParseIntPipe) id_collection: number
    ) {
        return this.oeuvresService.removeOeuvreFromCollection(
            id_oeuvre,
            id_collection
        )
    }

    @Post(':id_oeuvre/categories/:id_categorie')
    addCategoryToOeuvre(
        @Param('id_oeuvre', ParseIntPipe) id_oeuvre: number,
        @Param('id_categorie', ParseIntPipe) id_categorie: number
    ) {
        return this.oeuvresService.addCategoryToOeuvre(id_oeuvre, id_categorie)
    }

    @Delete(':id_oeuvre/categories/:id_categorie')
    removeCategoryFromOeuvre(
        @Param('id_oeuvre', ParseIntPipe) id_oeuvre: number,
        @Param('id_categorie', ParseIntPipe) id_categorie: number
    ) {
        return this.oeuvresService.removeCategoryFromOeuvre(
            id_oeuvre,
            id_categorie
        )
    }

    @Get(':id_oeuvre/categories')
    getCategoriesForOeuvre(
        @Param('id_oeuvre', ParseIntPipe) id_oeuvre: number
    ) {
        return this.oeuvresService.getCategoriesForOeuvre(id_oeuvre)
    }

    @Get(':id_oeuvre/suggestions')
    async getSuggestionsForOeuvre(
        @Param('id_oeuvre', ParseIntPipe) id_oeuvre: number,
        @Query('limit') limit?: string
    ) {
        const suggestions =
            await this.oeuvresService.getSuggestedOeuvresByCategory(
                id_oeuvre,
                limit ? parseInt(limit) : 10
            )

        if (!suggestions || suggestions.length === 0) {
            throw new NotFoundException(
                `Aucune suggestion trouvée pour l'œuvre ${id_oeuvre}`
            )
        }

        return suggestions
    }

    @Delete(':id')
    deleteOeuvre(@Param('id', ParseIntPipe) id_oeuvre: number) {
        return this.oeuvresService.deleteOeuvres(id_oeuvre)
    }

    @Get(':id')
    async getOeuvre(@Param('id', ParseIntPipe) id: number) {
        const oeuvre = await this.oeuvresService.getOeuvreById(id)
        if (!oeuvre) {
            throw new NotFoundException(`Pas d'oeuvres trouvées avec id ${id}`)
        }
        return oeuvre
    }
}
