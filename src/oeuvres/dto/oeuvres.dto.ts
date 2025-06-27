import { IsString, IsOptional, IsArray } from 'class-validator'

export class OeuvresDto {
    @IsOptional()
    @IsString()
    id_oeuvre?: number

    @IsString()
    titre: string

    @IsString()
    description: string

    @IsOptional()
    @IsString()
    image?: string

    @IsString()
    ai_prompt: string
    @IsString()
    id_utilisateur: string

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    categoryNames?: string[]
}
