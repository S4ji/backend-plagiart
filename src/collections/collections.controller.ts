import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    Param,
    Query,
    ParseIntPipe,
} from '@nestjs/common'
import { CollectionsService } from './collections.service' // Adjust path as needed
import { CollectionsDto } from './dto'

@Controller('collections')
export class CollectionsController {
    constructor(private readonly collectionsService: CollectionsService) {}

    @Get('/all')
    getAllCollections() {
        return this.collectionsService.getAllCollections()
    }

    @Get('/random')
    getRandomCollections() {
        return this.collectionsService.getRandomCollections()
    }

    @Get('user/:id')
    getByUser(@Param('id') id: string) {
        return this.collectionsService.getCollectionsByUser(id)
    }

    @Get('/:id')
    getCollectionById(@Param('id', ParseIntPipe) id: number) {
        return this.collectionsService.getCollectionById(id)
    }

    @Get('/by-oeuvre/:id')
    getCollectionsByOeuvre(
        @Param('id', ParseIntPipe) id_oeuvre: number,
        @Query('page') page = '1',
        @Query('pageSize') pageSize = '6'
    ) {
        const pageNum = parseInt(page, 10) || 1
        const pageSizeNum = parseInt(pageSize, 10) || 6
        return this.collectionsService.getCollectionsByOeuvreId(
            id_oeuvre,
            pageNum,
            pageSizeNum
        )
    }

    @Post('/new')
    createCollection(@Body() dto: CollectionsDto) {
        return this.collectionsService.createCollection(dto)
    }

    @Patch('/update')
    editCollection(@Body() dto: CollectionsDto) {
        return this.collectionsService.editCollection(dto)
    }

    @Delete('/:id')
    deleteCollection(@Param('id', ParseIntPipe) id_collection: number) {
        return this.collectionsService.deleteCollection(id_collection)
    }

    @Post('/add')
    async addOeuvreToCollection(
        @Body('id_oeuvre', ParseIntPipe) id_oeuvre: number,
        @Body('id_collection', ParseIntPipe) id_collection: number
    ) {
        return this.collectionsService.addOeuvreToCollection(
            id_oeuvre,
            id_collection
        )
    }
}
