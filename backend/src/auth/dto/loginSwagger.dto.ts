import { ApiProperty } from "@nestjs/swagger";

export class LoginSwaggerDto {
  @ApiProperty({
    description: "E-mail do usuário",
    example: "usuario@example.com",
    type: String,
  })
  email: string;

  @ApiProperty({
    description: "Senha do usuário (mínimo 6 caracteres)",
    example: "senha123",
    type: String,
    minLength: 6,
  })
  password: string;
}
