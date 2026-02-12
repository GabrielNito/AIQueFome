import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBearerAuth,
  ApiBody,
} from "@nestjs/swagger";
import { UsersService } from "./users.service";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/auth/enums/role.enum";
import { JwtAuthGuard } from "@/auth/guards/jwtAuth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { UpdateUserSwaggerDto } from "./dto/userSwagger.dto";

@ApiTags("users")
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar todos os usuários" })
  @ApiResponse({
    status: 200,
    description: "Lista de usuários recuperada com sucesso",
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Buscar usuário por ID " })
  @ApiParam({
    name: "id",
    description: "ID do usuário",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({
    status: 200,
    description: "Usuário encontrada com sucesso",
  })
  @ApiResponse({ status: 404, description: "Usuário não encontrada" })
  findOne(@Param("id") id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Atualizar usuário" })
  @ApiParam({
    name: "id",
    description: "ID do usuário",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiBody({ type: UpdateUserSwaggerDto })
  @ApiResponse({
    status: 200,
    description: "Usuário atualizada com sucesso",
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Acesso negado - Apenas ADMIN" })
  @ApiResponse({ status: 404, description: "Usuário não encontrada" })
  @ApiResponse({
    status: 409,
    description: "Usuário com este nome já existe",
  })
  update(@Param("id") id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Remover usuário" })
  @ApiParam({
    name: "id",
    description: "ID do usuário",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({
    status: 200,
    description: "Usuário removida com sucesso",
  })
  @ApiResponse({
    status: 400,
    description: "Usuário possui produtos associados",
  })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Acesso negado - Apenas ADMIN" })
  @ApiResponse({ status: 404, description: "Usuário não encontrada" })
  remove(@Param("id") id: string) {
    return this.usersService.remove(id);
  }
}
