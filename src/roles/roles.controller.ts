import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Delete,
    Param,
} from '@nestjs/common'
import { RolesService } from './roles.service'
import { RolesDto } from './dto/roles.dto'

@Controller('roles')
export class RolesController {
    constructor(private readonly rolesService: RolesService) {}

    @Get('/all') // GET /roles/all
    getAllRoles() {
        return this.rolesService.getAllRoles()
    }

    @Post('/new') // POST /roles/new
    createRole(@Body() dto: RolesDto) {
        return this.rolesService.createRole(dto)
    }

    @Patch('/update') // PATCH /roles/update
    editRole(@Body() dto: RolesDto) {
        return this.rolesService.editRole(dto)
    }

    @Delete('/:id') // DELETE /roles/:id
    deleteRole(@Param('id') id: string) {
        return this.rolesService.deleteRole(id)
    }
}
