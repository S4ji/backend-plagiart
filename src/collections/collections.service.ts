import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { CollectionsDto } from './dto'

@Injectable()
export class CollectionsService {
    constructor(private prisma: PrismaService) {}

    async getAllCollections() {
        const collections = await this.prisma.collection.findMany()

        const collectionsWithImages = await Promise.all(
            collections.map(async (collection) => {
                const oeuvreLinks =
                    await this.prisma.oeuvres_Collections.findMany({
                        where: { id_collection: collection.id_collection },
                        select: { id_oeuvre: true },
                    })

                const oeuvreIds = oeuvreLinks.map((link) => link.id_oeuvre)

                const oeuvres = await this.prisma.oeuvre.findMany({
                    where: { id_oeuvre: { in: oeuvreIds } },
                    orderBy: { created_at: 'desc' },
                    take: 3,
                    select: { image: true },
                })

                const images = oeuvres.map((o) => o.image).filter(Boolean)

                return {
                    ...collection,
                    image: images,
                }
            })
        )

        return collectionsWithImages
    }

    async getRandomCollections() {
        const collections = await this.prisma.collection.findMany({
            orderBy: { created_at: 'desc' },
            take: 10,
        })

        const collectionsWithImages = await Promise.all(
            collections.map(async (collection) => {
                const oeuvreLinks =
                    await this.prisma.oeuvres_Collections.findMany({
                        where: { id_collection: collection.id_collection },
                        select: { id_oeuvre: true },
                    })

                const oeuvreIds = oeuvreLinks.map((link) => link.id_oeuvre)

                const oeuvres = await this.prisma.oeuvre.findMany({
                    where: { id_oeuvre: { in: oeuvreIds } },
                    orderBy: { created_at: 'desc' },
                    take: 3,
                    select: { image: true },
                })

                const images = oeuvres.map((o) => o.image).filter(Boolean)

                return {
                    ...collection,
                    image: images,
                }
            })
        )

        return collectionsWithImages
    }

    async createCollection(collectionsDto: CollectionsDto) {
        return this.prisma.collection.create({
            data: {
                nom: collectionsDto.nom,
                description: collectionsDto.description,
                id_utilisateur: collectionsDto.id_utilisateur,
            },
        })
    }

    async getCollectionsByOeuvreId(id_oeuvre: number, page = 1, pageSize = 6) {
        const links = await this.prisma.oeuvres_Collections.findMany({
            where: { id_oeuvre },
            select: { id_collection: true },
            skip: (page - 1) * pageSize,
            take: pageSize,
        })

        const collectionIds = links.map((link) => link.id_collection)

        const totalCollections = await this.prisma.oeuvres_Collections.count({
            where: { id_oeuvre },
        })

        const collections = await this.prisma.collection.findMany({
            where: { id_collection: { in: collectionIds } },
            orderBy: { created_at: 'desc' },
        })

        const collectionsWithImages = await Promise.all(
            collections.map(async (collection) => {
                const oeuvreLinks =
                    await this.prisma.oeuvres_Collections.findMany({
                        where: { id_collection: collection.id_collection },
                        select: { id_oeuvre: true },
                    })

                const oeuvreIds = oeuvreLinks.map((link) => link.id_oeuvre)

                const oeuvres = await this.prisma.oeuvre.findMany({
                    where: { id_oeuvre: { in: oeuvreIds } },
                    orderBy: { created_at: 'desc' },
                    take: 3,
                    select: { image: true },
                })

                const images = oeuvres.map((o) => o.image).filter(Boolean)

                return {
                    ...collection,
                    image: images,
                }
            })
        )

        return {
            total: totalCollections,
            page,
            pageSize,
            collections: collectionsWithImages,
        }
    }

    async getCollectionById(id_collection: number, page = 1, pageSize = 6) {
        const collection = await this.prisma.collection.findUnique({
            where: { id_collection },
        })

        const oeuvreLinks = await this.prisma.oeuvres_Collections.findMany({
            where: { id_collection },
            select: { id_oeuvre: true },
        })

        const oeuvreIds = oeuvreLinks.map((link) => link.id_oeuvre)
        console.log('🎯 Oeuvre IDs in collection:', oeuvreIds)

        const oeuvres = await this.prisma.oeuvre.findMany({
            where: { id_oeuvre: { in: oeuvreIds } },
            orderBy: { created_at: 'desc' },
            select: { id_oeuvre: true, image: true, titre: true },
        })

        const images = oeuvres
            .filter((o) => o.image)
            .map((o) => ({
                src: o.image,
                alt: o.titre || '',
                id: o.id_oeuvre,
            }))

        const related = await this.prisma.oeuvres_Collections.findMany({
            where: { id_oeuvre: { in: oeuvreIds } },
            select: { id_collection: true },
        })

        const relatedCollectionIds = [
            ...new Set(
                related
                    .map((r) => r.id_collection)
                    .filter((id) => id !== id_collection)
            ),
        ]

        const relatedCollections = await this.prisma.collection.findMany({
            where: { id_collection: { in: relatedCollectionIds } },
            take: 5,
        })

        // 🧠 All categories used in the collection's œuvres
        const oeuvreCategories = await this.prisma.oeuvres_Categories.findMany({
            where: { id_oeuvre: { in: oeuvreIds } },
        })

        const categoryIds = [
            ...new Set(oeuvreCategories.map((oc) => oc.id_categorie)),
        ]
        console.log('🧩 All category IDs from collection:', categoryIds)

        let suggestions = []

        if (categoryIds.length > 0) {
            const matches = await this.prisma.oeuvres_Categories.findMany({
                where: {
                    id_categorie: { in: categoryIds },
                    oeuvre: {
                        id_oeuvre: { notIn: oeuvreIds },
                    },
                },
                skip: (page - 1) * pageSize,
                take: pageSize,
                include: {
                    oeuvre: {
                        select: {
                            id_oeuvre: true,
                            titre: true,
                            image: true,
                        },
                    },
                },
            })

            // ✅ Dédupliquer les œuvres par ID
            const seenIds = new Set()
            suggestions = matches
                .map((m) => m.oeuvre)
                .filter((o) => o?.image)
                .filter((o) => {
                    if (seenIds.has(o.id_oeuvre)) return false
                    seenIds.add(o.id_oeuvre)
                    return true
                })
                .map((o) => ({
                    id_oeuvre: o.id_oeuvre,
                    title: o.titre,
                    image: o.image,
                }))

            console.log('✅ Suggestions from all categories:', suggestions)
        } else {
            console.log('⚠️ No categories found in this collection.')
        }

        return {
            ...collection,
            images,
            suggestions,
            relatedCollections: relatedCollections.map((col) => ({
                id_collection: col.id_collection,
                title: col.nom,
                image: null,
            })),
        }
    }

    async getCollectionsByUser(id_utilisateur: string) {
        const collections = await this.prisma.collection.findMany({
            where: { id_utilisateur },
            orderBy: { created_at: 'desc' },
        })

        const collectionsWithImages = await Promise.all(
            collections.map(async (collection) => {
                const oeuvreLinks =
                    await this.prisma.oeuvres_Collections.findMany({
                        where: { id_collection: collection.id_collection },
                        select: { id_oeuvre: true },
                    })

                const oeuvreIds = oeuvreLinks.map((link) => link.id_oeuvre)

                const oeuvres = await this.prisma.oeuvre.findMany({
                    where: { id_oeuvre: { in: oeuvreIds } },
                    orderBy: { created_at: 'desc' },
                    take: 3,
                    select: { image: true },
                })

                const images = oeuvres.map((o) => o.image).filter(Boolean)

                return {
                    ...collection,
                    image: images,
                    id_utilisateur, // <-- ajout ici
                }
            })
        )

        return collectionsWithImages
    }

    async editCollection(collectionsDto: CollectionsDto) {
        return this.prisma.collection.update({
            where: {
                id_collection: collectionsDto.id_collection,
            },
            data: {
                nom: collectionsDto.nom,
                description: collectionsDto.description,
                id_utilisateur: collectionsDto.id_utilisateur,
            },
        })
    }

    async deleteCollection(id_collection: number) {
        return this.prisma.collection.delete({
            where: { id_collection },
        })
    }

    async addOeuvreToCollection(id_oeuvre: number, id_collection: number) {
        return this.prisma.oeuvres_Collections.create({
            data: {
                id_oeuvre,
                id_collection,
            },
        })
    }
}
