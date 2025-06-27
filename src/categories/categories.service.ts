import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CategoriesDto } from './dto'

@Injectable()
export class CategoriesService {
    constructor(private prisma: PrismaService) {}

    async getAllCategorie() {
        return this.prisma.categorie.findMany({})
    }

    async createCategories(categoriesDto: CategoriesDto) {
        const formattedName = categoriesDto.nom.trim().toLowerCase()
        const capitalizedNom =
            formattedName.charAt(0).toUpperCase() + formattedName.slice(1)

        const existingCategory = await this.prisma.categorie.findFirst({
            where: {
                nom: {
                    equals: capitalizedNom,
                },
            },
        })

        if (existingCategory) {
            return existingCategory
        }

        return this.prisma.categorie.create({
            data: {
                nom: capitalizedNom,
                path: categoriesDto.path,
            },
        })
    }

    async editCategory(categoriesDto: CategoriesDto) {
        return this.prisma.categorie.update({
            where: {
                id_categorie: categoriesDto.id_categorie,
            },
            data: {
                nom: categoriesDto.nom,
            },
        })
    }

    async deleteCategory(categoryId: number) {
        return this.prisma.categorie.delete({
            where: {
                id_categorie: categoryId,
            },
        })
    }
}
