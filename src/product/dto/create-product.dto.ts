import {
  IsString,
  MinLength,
  IsNumber,
  Min,
  Max,
  IsMongoId,
  IsOptional,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  description: string;

  @IsNumber()
  @Min(0)
  @Max(5)
  rate: number;

  @IsNumber()
  price: number;

  @IsNumber()
  stock: number;

  @IsMongoId()
  category: string;
  @IsMongoId()
  @IsOptional()
  user?: string;
  imgUrl?: string;
  public_id?: string;
}
