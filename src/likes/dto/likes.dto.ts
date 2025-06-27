import {
    IsOptional,
    IsString,
    IsNumber,
    isNumber,
    IsUUID,
    Min,
} from 'class-validator'
export class LikesDto {
    @IsNumber()
    @IsOptional()
    id_like: number

    @IsUUID()
    id_utilisateur: string

    @IsOptional()
    @IsNumber()
    id_oeuvre: number
}
