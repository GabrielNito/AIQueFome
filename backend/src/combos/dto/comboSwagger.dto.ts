import { ApiProperty } from "@nestjs/swagger";
import { ComboItemSwaggerDto } from "./comboItemSwagger.dto";

export class CreateComboSwaggerDto {
  @ApiProperty({
    description: "Nome do combo",
    example: "Combo Família Feliz",
    minLength: 3,
  })
  name: string;

  @ApiProperty({
    description: "Descrição detalhada do que vem no combo",
    example: "2 Burgers, 2 Batatas Médias e 1 Refri 2L",
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: "Preço final de venda do combo",
    example: 89.9,
    minimum: 0,
  })
  price: number;

  @ApiProperty({
    description:
      "Preço original sem o desconto do combo (para exibir 'De: R$ XX Por: R$ YY')",
    example: 110.0,
    required: false,
    minimum: 0,
  })
  originalPrice?: number;

  @ApiProperty({
    description: "ID da categoria onde o combo será listado",
    example: "507f1f77bcf86cd799439011",
    required: false,
  })
  categoryId?: string;

  @ApiProperty({
    description: "Lista de produtos que compõem o combo",
    type: [ComboItemSwaggerDto],
  })
  items: ComboItemSwaggerDto[];

  @ApiProperty({
    description: "URL da imagem promocional do combo",
    example: "https://example.com/combo-promo.jpg",
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: "Status de disponibilidade do combo",
    example: true,
    default: true,
  })
  isAvailable?: boolean;

  @ApiProperty({
    description: "Destaque o combo na página inicial",
    example: false,
    default: false,
  })
  isFeatured?: boolean;

  @ApiProperty({
    description: "Data de início da validade do combo (ISO Date)",
    example: "2025-01-01T00:00:00Z",
    required: false,
  })
  activeFrom?: Date;

  @ApiProperty({
    description: "Data de término da validade do combo (ISO Date)",
    example: "2025-02-01T23:59:59Z",
    required: false,
  })
  activeUntil?: Date;

  @ApiProperty({
    description: "Tags para facilitar a busca",
    example: ["promoção", "almoço", "família"],
    type: [String],
    default: [],
  })
  tags: string[];
}

export class UpdateComboSwaggerDto {
  @ApiProperty({
    description: "Nome do combo",
    example: "Combo Família Feliz",
    minLength: 3,
    required: false,
  })
  name?: string;

  @ApiProperty({
    description: "Descrição detalhada do que vem no combo",
    example: "2 Burgers, 2 Batatas Médias e 1 Refri 2L",
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: "Preço final de venda do combo",
    example: 89.9,
    minimum: 0,
    required: false,
  })
  price?: number;

  @ApiProperty({
    description:
      "Preço original sem o desconto do combo (para exibir 'De: R$ XX Por: R$ YY')",
    example: 110.0,
    required: false,
    minimum: 0,
  })
  originalPrice?: number;

  @ApiProperty({
    description: "ID da categoria onde o combo será listado",
    example: "507f1f77bcf86cd799439011",
    required: false,
  })
  categoryId?: string;

  @ApiProperty({
    description: "Lista de produtos que compõem o combo",
    type: [ComboItemSwaggerDto],
    required: false,
  })
  items?: ComboItemSwaggerDto[];

  @ApiProperty({
    description: "URL da imagem promocional do combo",
    example: "https://example.com/combo-promo.jpg",
    required: false,
  })
  imageUrl?: string;

  @ApiProperty({
    description: "Status de disponibilidade do combo",
    example: true,
    required: false,
  })
  isAvailable?: boolean;

  @ApiProperty({
    description: "Destaque o combo na página inicial",
    example: false,
    required: false,
  })
  isFeatured?: boolean;

  @ApiProperty({
    description: "Data de início da validade do combo (ISO Date)",
    example: "2025-01-01T00:00:00Z",
    required: false,
  })
  activeFrom?: Date;

  @ApiProperty({
    description: "Data de término da validade do combo (ISO Date)",
    example: "2025-02-01T23:59:59Z",
    required: false,
  })
  activeUntil?: Date;

  @ApiProperty({
    description: "Tags para facilitar a busca",
    example: ["promoção", "almoço", "família"],
    type: [String],
    required: false,
  })
  tags?: string[];
}
