import { IsString, IsUUID, IsOptional, Length } from 'class-validator'

export class RolesDto {
    @IsUUID()
    @IsOptional()
    id?: string

    @IsString()
    @Length(1, 64)
    nom: string
}
