// search-oeuvre.dto.ts
import { IsString } from 'class-validator'

export class SearchOeuvreDto {
    @IsString()
    q: string
}
