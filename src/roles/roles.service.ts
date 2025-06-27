import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { RolesDto } from './dto/roles.dto'

@Injectable()
export class RolesService {
    constructor(private prisma: PrismaService) {}

    async getAllRoles() {
        return this.prisma.role.findMany()
    }

    async createRole(dto: RolesDto) {
        return this.prisma.role.create({
            data: {
                nom: dto.nom,
            },
        })
    }

    async editRole(dto: RolesDto) {
        return this.prisma.role.update({
            where: { id: dto.id },
            data: {
                nom: dto.nom,
            },
        })
    }

    async deleteRole(id: string) {
        return this.prisma.role.delete({
            where: { id },
        })
    }
}
