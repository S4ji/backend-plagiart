import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    Param,
    ParseIntPipe,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesDto } from './dto'

@Controller('categories')
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService) {}

    @Get('/all')
    getAllCategories() {
        return this.categoriesService.getAllCategorie()
    }

    @Post('/new')
    insertCategory(@Body() dto: CategoriesDto) {
        return this.categoriesService.createCategories(dto)
    }

    @Patch('/update')
    editCategory(@Body() dto: CategoriesDto) {
        return this.categoriesService.editCategory(dto)
    }

    @Delete('/:id')
    deleteCategory(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.deleteCategory(id)
    }
}
