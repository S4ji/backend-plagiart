import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { OeuvresDto } from './dto'

@Injectable()
export class OeuvresService {
    constructor(private prisma: PrismaService) {}

    async getAllOeuvres() {
        return this.prisma.oeuvre.findMany({})
    }

    async getSuggestedOeuvresByCategory(id_oeuvre: number, limit = 10) {
        const oeuvre = await this.prisma.oeuvre.findUnique({
            where: { id_oeuvre },
            include: {
                categories: {
                    include: {
                        categorie: true,
                    },
                },
            },
        })

        if (!oeuvre) {
            throw new Error('Œuvre non trouvée')
        }

        const categoryIds = oeuvre.categories.map((cat) => cat.id_categorie)

        if (categoryIds.length === 0) {
            return []
        }

        let suggestedOeuvres = await this.prisma.oeuvre.findMany({
            where: {
                categories: {
                    some: {
                        id_categorie: {
                            in: categoryIds,
                        },
                    },
                },
                NOT: {
                    id_oeuvre: id_oeuvre,
                },
            },
            take: limit,
            orderBy: {
                created_at: 'desc',
            },
            include: {
                categories: {
                    include: {
                        categorie: true,
                    },
                },
            },
        })

        // 👇 Changement minimal : dédupliquer sans renommer
        const unique = new Map<number, (typeof suggestedOeuvres)[0]>()
        for (const o of suggestedOeuvres) {
            if (!unique.has(o.id_oeuvre)) unique.set(o.id_oeuvre, o)
        }
        suggestedOeuvres = Array.from(unique.values())

        return suggestedOeuvres
    }

    async getOeuvreBySearch(searchTerm: string, page = 1, limit = 10) {
        const skip = (page - 1) * limit

        const normalize = (str: string) =>
            str
                .normalize('NFD')
                .replace(/[\u0300-\u036f]/g, '')
                .toLowerCase()

        const keywords = normalize(searchTerm)
            .split(/\s+/)
            .filter((word) => word.length > 0)

        const whereConditions = keywords.map((word) => ({
            OR: [
                {
                    titre: {
                        contains: word,
                    },
                },
                {
                    description: {
                        contains: word,
                    },
                },
                {
                    categories: {
                        some: {
                            categorie: {
                                nom: {
                                    contains: word,
                                },
                            },
                        },
                    },
                },
            ],
        }))

        const results = await this.prisma.oeuvre.findMany({
            where: {
                AND: whereConditions,
            },
            orderBy: {
                created_at: 'desc',
            },
            skip,
            take: limit,
        })

        return results
    }

    async getRandomOeuvres() {
        return this.prisma.oeuvre.findMany({
            orderBy: {
                created_at: 'desc',
            },
            take: 12,
        })
    }

    async getOeuvreById(id_oeuvre: number) {
        return this.prisma.oeuvre.findUnique({
            where: {
                id_oeuvre,
            },
            include: {
                categories: {
                    include: {
                        categorie: true,
                    },
                },
                artiste: {
                    select: {
                        nom: true,
                    },
                },
            },
        })
    }

    async getOeuvresByUser(userId: string) {
        return this.prisma.oeuvre.findMany({
            where: {
                id_utilisateur: userId,
            },
            orderBy: {
                created_at: 'desc',
            },
            include: {
                categories: {
                    include: {
                        categorie: true,
                    },
                },
            },
        })
    }

    async removeOeuvreFromCollection(id_oeuvre: number, id_collection: number) {
        return this.prisma.oeuvres_Collections.delete({
            where: {
                id_oeuvre_id_collection: {
                    id_oeuvre,
                    id_collection,
                },
            },
        })
    }

    async createOeuvres(oeuvreDto: OeuvresDto) {
        const newOeuvre = await this.prisma.oeuvre.create({
            data: {
                titre: oeuvreDto.titre,
                description: oeuvreDto.description,
                image: oeuvreDto.image,
                ai_prompt: oeuvreDto.ai_prompt,
                id_utilisateur: oeuvreDto.id_utilisateur,
            },
        })

        if (oeuvreDto.categoryNames && oeuvreDto.categoryNames.length > 0) {
            const categoryPromises = oeuvreDto.categoryNames.map(
                async (categoryName) => {
                    const formattedName = categoryName.trim().toLowerCase()
                    const capitalizedNom =
                        formattedName.charAt(0).toUpperCase() +
                        formattedName.slice(1)

                    let category = await this.prisma.categorie.findFirst({
                        where: { nom: { equals: capitalizedNom } },
                    })

                    if (!category) {
                        category = await this.prisma.categorie.create({
                            data: {
                                nom: capitalizedNom,
                                path: `/categories/${formattedName}`,
                            },
                        })
                    }

                    await this.prisma.oeuvres_Categories.create({
                        data: {
                            id_oeuvre: newOeuvre.id_oeuvre,
                            id_categorie: category.id_categorie,
                        },
                    })

                    return category
                }
            )

            await Promise.all(categoryPromises)
        }

        return this.prisma.oeuvre.findUnique({
            where: { id_oeuvre: newOeuvre.id_oeuvre },
            include: {
                categories: { include: { categorie: true } },
            },
        })
    }

    async editOeuvres(oeuvreDto: OeuvresDto) {
        const {
            id_oeuvre,
            titre,
            description,
            image,
            ai_prompt,
            id_utilisateur,
            categoryNames,
        } = oeuvreDto

        return this.prisma.$transaction(async (prisma) => {
            const updatedOeuvre = await prisma.oeuvre.update({
                where: { id_oeuvre },
                data: {
                    titre,
                    description,
                    image,
                    ai_prompt,
                    id_utilisateur,
                },
            })

            if (categoryNames && categoryNames.length > 0) {
                await prisma.oeuvres_Categories.deleteMany({
                    where: { id_oeuvre },
                })

                for (const categoryName of categoryNames) {
                    const formattedName = categoryName.trim().toLowerCase()
                    const capitalizedNom =
                        formattedName.charAt(0).toUpperCase() +
                        formattedName.slice(1)

                    let category = await prisma.categorie.findFirst({
                        where: { nom: capitalizedNom },
                    })

                    if (!category) {
                        category = await prisma.categorie.create({
                            data: {
                                nom: capitalizedNom,
                                path: `/categories/${formattedName}`,
                            },
                        })
                    }

                    await prisma.oeuvres_Categories.create({
                        data: {
                            id_oeuvre: updatedOeuvre.id_oeuvre,
                            id_categorie: category.id_categorie,
                        },
                    })
                }
            } else {
                await prisma.oeuvres_Categories.deleteMany({
                    where: { id_oeuvre },
                })
            }

            return prisma.oeuvre.findUnique({
                where: { id_oeuvre: updatedOeuvre.id_oeuvre },
                include: {
                    categories: {
                        include: {
                            categorie: true,
                        },
                    },
                },
            })
        })
    }

    async deleteOeuvres(id_oeuvre: number) {
        await this.prisma.likes.deleteMany({
            where: { id_oeuvre },
        })

        await this.prisma.signalement.deleteMany({
            where: { id_oeuvre },
        })

        await this.prisma.oeuvres_Collections.deleteMany({
            where: { id_oeuvre },
        })

        await this.prisma.oeuvres_Categories.deleteMany({
            where: { id_oeuvre },
        })

        return this.prisma.oeuvre.delete({
            where: { id_oeuvre },
        })
    }

    async addCategoryToOeuvre(id_oeuvre: number, id_categorie: number) {
        return this.prisma.oeuvres_Categories.create({
            data: {
                id_oeuvre,
                id_categorie,
            },
        })
    }

    async removeCategoryFromOeuvre(id_oeuvre: number, id_categorie: number) {
        return this.prisma.oeuvres_Categories.delete({
            where: {
                id_oeuvre_id_categorie: {
                    id_oeuvre,
                    id_categorie,
                },
            },
        })
    }

    async getCategoriesForOeuvre(id_oeuvre: number) {
        const oeuvre = await this.prisma.oeuvre.findUnique({
            where: { id_oeuvre },
            include: {
                categories: {
                    include: {
                        categorie: true,
                    },
                },
            },
        })

        return oeuvre?.categories.map((entry) => entry.categorie)
    }
}
