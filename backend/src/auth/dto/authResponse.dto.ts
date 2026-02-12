import { ApiProperty } from "@nestjs/swagger";

class UserResponseDto {
  @ApiProperty({ example: "507f1f77bcf86cd799439011" })
  id: string;

  @ApiProperty({ example: "usuario@example.com" })
  email: string;

  @ApiProperty({ example: "João Silva", required: false })
  name?: string;

  @ApiProperty({
    example: "CLIENT",
    enum: ["ADMIN", "CLIENT", "VIP_CLIENT"],
    description: "Role do usuário",
  })
  role: string;

  @ApiProperty({ example: "2024-01-01T00:00:00.000Z" })
  createdAt: Date;
}

export class AuthResponseDto {
  @ApiProperty({ example: "Login realizado com sucesso" })
  message: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "Token JWT para autenticação",
  })
  access_token: string;
}

export class RegisterResponseDto {
  @ApiProperty({ example: "Usuário criado com sucesso" })
  message: string;

  @ApiProperty({ type: UserResponseDto })
  user: UserResponseDto;

  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "Token JWT para autenticação",
  })
  access_token: string;
}
