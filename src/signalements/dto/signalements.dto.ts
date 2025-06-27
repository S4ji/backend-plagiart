import {
    IsOptional,
    IsString,
    IsNumber,
    IsEnum,
    IsDate,
    Min,
    IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'
import { StatutSignalement } from '@prisma/client'

export class SignalementsDto {
    @IsOptional()
    @IsNumber()
    @Min(1)
    id_signalement?: number // ✅ Ajoute le "?" pour TypeScript

    @IsUUID()
    id_utilisateur: string

    @IsNumber()
    @Min(1)
    id_oeuvre: number

    @IsString()
    raison: string

    @IsOptional()
    @IsDate()
    @Type(() => Date)
    date_signalement?: Date // ✅ Ajoute aussi le "?" ici

    @IsOptional()
    @IsEnum(StatutSignalement)
    statut?: StatutSignalement // ✅ idem
}
