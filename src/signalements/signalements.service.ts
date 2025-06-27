import { Injectable } from '@nestjs/common'
import { PrismaService } from 'src/prisma/prisma.service'
import { SignalementsDto } from './dto'

@Injectable()
export class SignalementService {
    constructor(private prisma: PrismaService) {}

    async getAllSignalements() {
        return this.prisma.signalement.findMany({})
    }

    async createSignalement(dto: SignalementsDto) {
        return this.prisma.signalement.create({
            data: {
                raison: dto.raison,
                id_utilisateur: dto.id_utilisateur,
                id_oeuvre: dto.id_oeuvre,
                date_signalement: dto.date_signalement ?? new Date(),
                statut: dto.statut ?? 'EN_ATTENTE',
            },
        })
    }

    async getSignalementById(id_signalement: number) {
        return this.prisma.signalement.findUnique({
            where: { id_signalement },
        })
    }

    async editSignalement(dto: SignalementsDto) {
        return this.prisma.signalement.update({
            where: {
                id_signalement: dto.id_signalement,
            },
            data: {
                raison: dto.raison,
                id_utilisateur: dto.id_utilisateur,
                id_oeuvre: dto.id_oeuvre,
                date_signalement: dto.date_signalement,
                statut: dto.statut,
            },
        })
    }

    async deleteSignalement(id_signalement: number) {
        return this.prisma.signalement.delete({
            where: {
                id_signalement,
            },
        })
    }
}
