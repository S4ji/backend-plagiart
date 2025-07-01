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
            const oeuvres = await tx.oeuvre.findMany({
                where: { id_utilisateur },
                select: { id_oeuvre: true },
            })

            for (const { id_oeuvre } of oeuvres) {
                await tx.likes.deleteMany({ where: { id_oeuvre } })
                await tx.signalement.deleteMany({ where: { id_oeuvre } })
                await tx.oeuvres_Collections.deleteMany({
                    where: { id_oeuvre },
                })
                await tx.oeuvres_Categories.deleteMany({ where: { id_oeuvre } })

                await tx.oeuvre.delete({ where: { id_oeuvre } })
            }

            const collections = await tx.collection.findMany({
                where: { id_utilisateur },
                select: { id_collection: true },
            })

            for (const { id_collection } of collections) {
                await tx.oeuvres_Collections.deleteMany({
                    where: { id_collection },
                })

                await tx.collection.delete({ where: { id_collection } })
            }

            return tx.utilisateur.delete({
                where: { id_utilisateur },
            })
        })
    }
}
