import { ApiProperty } from "@nestjs/swagger";

export class ComboItemSwaggerDto {
  @ApiProperty({
    description: "ID do produto a ser incluído no combo",
    example: "658af123bcf86cd799439011",
  })
  productId: string;

  @ApiProperty({
    description: "Quantidade deste produto no combo",
    example: 2,
    minimum: 1,
    default: 1,
  })
  quantity: number;
}
