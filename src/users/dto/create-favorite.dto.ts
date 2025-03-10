import { IsString, IsNumber, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateFavoriteDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

//   @IsNumber()
//   @IsNotEmpty()
//   price: number;

//   @IsString()
//   @IsNotEmpty()
//   status: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  category: string;
}