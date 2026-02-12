import { ApiProperty, PartialType } from "@nestjs/swagger";
import { RoleEnum } from "./updateUser.dto";

export class CreateUserSwaggerDto {
  @ApiProperty({
    description: "Endereço de e-mail do usuário. Deve ser único.",
    example: "user.novo@example.com",
    format: "email",
  })
  email: string;

  @ApiProperty({
    description: "Senha do usuário (deve ser hashizada).",
    example: "SenhaForte123",
    minLength: 8,
    writeOnly: true,
  })
  password: string;

  @ApiProperty({
    description: "Nome completo ou de exibição do usuário.",
    example: "João da Silva",
    required: false,
    nullable: true,
    maxLength: 100,
  })
  name?: string | null;

  @ApiProperty({
    description: "Papel/Permissão do usuário no sistema.",
    example: RoleEnum.enum.CLIENT,
    enum: RoleEnum.options,
    default: RoleEnum.enum.CLIENT,
    required: false,
  })
  role?: "CLIENT" | "ADMIN" | "STAFF";
}

export class UpdateUserSwaggerDto extends PartialType(CreateUserSwaggerDto) {
  @ApiProperty({
    description:
      "Nova senha do usuário. O campo será hashizado ao ser fornecido.",
    example: "OutraSenha456",
    minLength: 8,
    required: false,
    writeOnly: true,
  })
  password?: string;
}

export class UserResponseSwaggerDto {
  @ApiProperty({ description: "ID único do usuário" })
  id: string;

  @ApiProperty({ description: "Endereço de e-mail do usuário" })
  email: string;

  @ApiProperty({ description: "Nome do usuário", nullable: true })
  name: string | null;

  @ApiProperty({ description: "Papel do usuário", enum: RoleEnum.options })
  role: "CLIENT" | "ADMIN" | "STAFF";

  @ApiProperty({ description: "Data de criação do registro" })
  createdAt: Date;

  @ApiProperty({ description: "Data da última atualização do registro" })
  updatedAt: Date;
}
