import { ApiProperty } from "@nestjs/swagger";

export class CreateProductSwaggerDto {
  @ApiProperty({
    description: "Nome do produto",
    example: "Hambúrguer Artesanal",
    minLength: 1,
    maxLength: 100,
  })
  name: string;

  @ApiProperty({
    description: "Descrição do produto",
    example: "Hambúrguer com carne artesanal, queijo, alface e tomate",
    required: false,
    maxLength: 500,
  })
  description?: string;

  @ApiProperty({
    description: "Preço do produto",
    example: 25.9,
    minimum: 0,
  })
  price: number;

  @ApiProperty({
    description: "Preço com desconto (deve ser menor que o preço normal)",
    example: 19.9,
    required: false,
    minimum: 0,
  })
  salePrice?: number;

  @ApiProperty({
    description: "ID da categoria (opcional)",
    example: "507f1f77bcf86cd799439011",
    required: false,
  })
  categoryId?: string;

  @ApiProperty({
    description: "URL da imagem do produto",
    example: "https://example.com/image.jpg",
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: "Se o produto está disponível",
    example: true,
    default: true,
    required: false,
  })
  isAvailable?: boolean;

  @ApiProperty({
    description: "Lista de ingredientes (opcional)",
    example: ["carne", "queijo", "pão", "alface", "tomate"],
    type: [String],
    required: false,
  })
  ingredients?: string[];

  @ApiProperty({
    description: "Número de pessoas que serve",
    example: 2,
    required: false,
    minimum: 1,
  })
  serving?: number;

  @ApiProperty({
    description: "Tags para busca por IA",
    example: ["artesanal", "gourmet", "carne"],
    type: [String],
    default: [],
  })
  tags: string[];

  @ApiProperty({
    description: "Informações nutricionais (opcional)",
    example: { calories: 500, protein: 30, carbs: 40 },
    required: false,
  })
  nutritionalInfo?: Record<string, any>;
}

export class UpdateProductSwaggerDto {
  @ApiProperty({ required: false })
  name?: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ required: false })
  price?: number;

  @ApiProperty({ required: false })
  salePrice?: number;

  @ApiProperty({ required: false })
  categoryId?: string;

  @ApiProperty({ required: false })
  imageUrl?: string;

  @ApiProperty({ required: false })
  isAvailable?: boolean;

  @ApiProperty({ required: false, type: [String] })
  ingredients?: string[];

  @ApiProperty({ required: false })
  serving?: number;

  @ApiProperty({ required: false, type: [String] })
  tags?: string[];

  @ApiProperty({ required: false })
  nutritionalInfo?: Record<string, any>;
}
