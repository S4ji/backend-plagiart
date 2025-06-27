import { IsOptional, IsString, IsNumber } from 'class-validator';
export class CategoriesDto {
  @IsOptional()
  id_categorie: number;

  @IsString()
  nom: string;

  @IsOptional()
  @IsNumber()
  id_parent: number  

  @IsOptional()
  @IsString()
  path: string
}
