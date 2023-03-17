import { IsMongoId, IsOptional, IsNumber, Min } from 'class-validator';

export class CreateFacturaDto {
  @IsMongoId()
  product: string;

  @IsNumber()
  @Min(1)
  quantity: number;

  @IsMongoId()
  @IsOptional()
  user?: string;
  total?: string;
}
