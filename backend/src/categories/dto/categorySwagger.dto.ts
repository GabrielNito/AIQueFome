import { ApiProperty } from "@nestjs/swagger";

export class CreateCategorySwaggerDto {
  @ApiProperty({
    description: "Nome da categoria",
    example: "Hambúrgueres",
    minLength: 1,
    maxLength: 50,
  })
  name: string;

  @ApiProperty({
    description: "Descrição da categoria",
    example: "Hambúrgueres artesanais e gourmet",
    required: false,
    maxLength: 200,
  })
  description?: string;
}

export class UpdateCategorySwaggerDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;
}
