import {
    IsEmail,
    MinLength,
    MaxLength,
    IsString,
    IsStrongPassword,
} from 'class-validator'
import { Type } from 'class-transformer'
import { Role } from '@prisma/client'

export class InscriptionDto {
    @MinLength(3)
    @MaxLength(100)
    @IsString()
    nom: string

    @MaxLength(255)
    @IsEmail()
    email: string

    @IsStrongPassword()
    @IsString()
    mot_de_passe: string
}
