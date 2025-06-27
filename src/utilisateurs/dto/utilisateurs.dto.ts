import {
    IsEmail,
    IsEnum,
    IsBoolean,
    IsOptional,
    IsString,
    IsDate,
    MinLength,
    MaxLength,
    IsUUID,
} from 'class-validator'
import { Type } from 'class-transformer'
import { Role } from '@prisma/client'

export class UtilisateursDto {
    @IsOptional()
    @IsUUID()
    id_utilisateur?: string

    @MinLength(3)
    @MaxLength(100)
    @IsString()
    nom: string

    @MaxLength(255)
    @IsEmail()
    email: string

    @MinLength(8)
    @IsString()
    mot_de_passe: string

    @IsString()
    roleId: string

    @IsDate()
    @Type(() => Date)
    rgpd: Date

    @IsString()
    @MaxLength(100)
    token: string

    @IsBoolean()
    isActive: boolean
}
