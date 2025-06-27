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
import { LikesService } from './likes.service'
import { LikesDto } from './dto'

@Controller('likes')
export class LikesController {
    constructor(private readonly likesService: LikesService) {}

    @Get('/all')
    getAllLikes() {
        return this.likesService.getAllLikes()
    }

    @Post('/new')
    createLike(@Body() dto: LikesDto) {
        return this.likesService.createLike(dto)
    }

    @Patch('/update')
    editLike(@Body() dto: LikesDto) {
        return this.likesService.editLike(dto)
    }

    @Delete('/:id')
    deleteLike(@Param('id', ParseIntPipe) id_like: number) {
        return this.likesService.deleteLike(id_like)
    }
}
