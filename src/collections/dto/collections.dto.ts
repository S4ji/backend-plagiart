import { IsOptional, IsString, IsNumber, Min, IsUUID } from 'class-validator'
export class CollectionsDto {
    @IsOptional()
    id_collection: number

    @IsString()
    nom: string

    @IsOptional()
    @IsString()
    description?: string

    @IsUUID()
    id_utilisateur: string
}
