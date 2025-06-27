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
    IsStrongPassword,
} from 'class-validator'
import { Type } from 'class-transformer'
import { Role } from '@prisma/client'

export class ConnexionDto {
    @MinLength(5)
    @MaxLength(255)
    @IsEmail()
    email: string

    @IsStrongPassword()
    @IsString()
    mot_de_passe: string
}
