import { IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  description: string;

  imgUrl?: string;

  public_id?: string;
}
