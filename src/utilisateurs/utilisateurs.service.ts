import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { UtilisateursDto } from './dto/utilisateurs.dto'

@Injectable()
export class UtilisateursService {
    constructor(private prisma: PrismaService) {}

    async getAllUtilisateurs() {
        return this.prisma.utilisateur.findMany({})
    }

    async getUtilisateurById(id_utilisateur: string) {
        return this.prisma.utilisateur.findUnique({
            where: {
                id_utilisateur,
            },
            select: {
                nom: true,
                roleId: true,
            },
        })
    }

    async editUtilisateur(dto: UtilisateursDto) {
        return this.prisma.utilisateur.update({
            where: {
                id_utilisateur: dto.id_utilisateur,
            },
            data: {
                nom: dto.nom,
                email: dto.email,
                mot_de_passe: dto.mot_de_passe,
                roleId: dto.roleId,
                rgpd: dto.rgpd,
                token: dto.token,
                isActive: dto.isActive,
            },
        })
    }

    async deleteUtilisateur(id_utilisateur: string) {
        return this.prisma.$transaction(async (tx) => {
            // 1. Récupérer toutes les œuvres de l'utilisateur
            const oeuvres = await tx.oeuvre.findMany({
                where: { id_utilisateur },
                select: { id_oeuvre: true },
            })

            for (const { id_oeuvre } of oeuvres) {
                // Supprimer likes, signalements, catégories, collections associées
                await tx.likes.deleteMany({ where: { id_oeuvre } })
                await tx.signalement.deleteMany({ where: { id_oeuvre } })
                await tx.oeuvres_Collections.deleteMany({
                    where: { id_oeuvre },
                })
                await tx.oeuvres_Categories.deleteMany({ where: { id_oeuvre } })

                // Supprimer l'œuvre
                await tx.oeuvre.delete({ where: { id_oeuvre } })
            }

            // 2. Supprimer les collections de l'utilisateur
            const collections = await tx.collection.findMany({
                where: { id_utilisateur },
                select: { id_collection: true },
            })

            for (const { id_collection } of collections) {
                // Supprimer les liens avec œuvres si tu en as
                await tx.oeuvres_Collections.deleteMany({
                    where: { id_collection },
                })

                // Supprimer la collection
                await tx.collection.delete({ where: { id_collection } })
            }

            // 3. Supprimer l'utilisateur
            return tx.utilisateur.delete({
                where: { id_utilisateur },
            })
        })
    }
}
