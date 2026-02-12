import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Get,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { AuthService } from "./auth.service";
import { LoginDto, loginSchema } from "./dto/login.dto";
import { RegisterDto, registerSchema } from "./dto/register.dto";
import { JwtAuthGuard } from "./guards/jwtAuth.guard";
import { CurrentUser } from "./decorators/currentUser.decorator";
import { LoginSwaggerDto } from "./dto/loginSwagger.dto";
import { RegisterSwaggerDto } from "./dto/registerSwagger.dto";
import { AuthResponseDto, RegisterResponseDto } from "./dto/authResponse.dto";

@ApiTags("auth")
@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Registrar novo usuário" })
  @ApiBody({ type: RegisterSwaggerDto })
  @ApiResponse({
    status: 201,
    description: "Usuário criado com sucesso",
    type: RegisterResponseDto,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 409, description: "E-mail já cadastrado" })
  async register(@Body() registerDto: RegisterDto) {
    const result = registerSchema.safeParse(registerDto);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new BadRequestException({
        message: "Dados inválidos",
        errors,
      });
    }

    return this.authService.register(result.data);
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Fazer login" })
  @ApiBody({ type: LoginSwaggerDto })
  @ApiResponse({
    status: 200,
    description: "Login realizado com sucesso",
    type: AuthResponseDto,
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "E-mail ou senha inválidos" })
  async login(@Body() loginDto: LoginDto) {
    const result = loginSchema.safeParse(loginDto);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new BadRequestException({
        message: "Dados inválidos",
        errors,
      });
    }

    return this.authService.login(result.data);
  }

  @Get("me")
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Obter perfil do usuário autenticado" })
  @ApiResponse({
    status: 200,
    description: "Perfil recuperado com sucesso",
    schema: {
      type: "object",
      properties: {
        message: { type: "string", example: "Perfil recuperado com sucesso" },
        user: {
          type: "object",
          properties: {
            id: { type: "string", example: "507f1f77bcf86cd799439011" },
            email: { type: "string", example: "usuario@example.com" },
            name: { type: "string", example: "João Silva" },
            role: {
              type: "string",
              example: "CLIENT",
              enum: ["ADMIN", "CLIENT", "VIP_CLIENT"],
            },
            createdAt: { type: "string", example: "2024-01-01T00:00:00.000Z" },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  async getProfile(@CurrentUser() user: any) {
    return {
      message: "Perfil recuperado com sucesso",
      user,
    };
  }
}
