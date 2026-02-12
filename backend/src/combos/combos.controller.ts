import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from "@nestjs/swagger";
import { Roles } from "@/auth/decorators/roles.decorator";
import { Role } from "@/auth/enums/role.enum";
import { JwtAuthGuard } from "@/auth/guards/jwtAuth.guard";
import { RolesGuard } from "@/auth/guards/roles.guard";
import { CombosService } from "./combos.service";
import { CreateComboDto } from "./dto/createCombo.dto";
import {
  CreateComboSwaggerDto,
  UpdateComboSwaggerDto,
} from "./dto/comboSwagger.dto";
import { UpdateComboDto } from "./dto/updateCombo.dto";

@ApiTags("combos")
@Controller("combos")
export class CombosController {
  constructor(private readonly combosService: CombosService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @ApiBody({ type: CreateComboSwaggerDto })
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Criar um novo combo" })
  @ApiResponse({
    status: 200,
    description: "Combo criado com sucesso",
  })
  create(@Body() createComboDto: CreateComboDto) {
    return this.combosService.create(createComboDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar todos os combos" })
  @ApiResponse({
    status: 200,
    description: "Lista de combos recuperada com sucesso",
  })
  findAll() {
    return this.combosService.findAll();
  }

  @Get(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Buscar combo por ID " })
  @ApiParam({
    name: "id",
    description: "ID do combo",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({
    status: 200,
    description: "Combo encontrado com sucesso",
  })
  @ApiResponse({ status: 404, description: "Combo não encontrado" })
  findOne(@Param("id") id: string) {
    return this.combosService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Atualizar combo" })
  @ApiParam({
    name: "id",
    description: "ID do combo",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiBody({ type: UpdateComboSwaggerDto })
  @ApiResponse({
    status: 200,
    description: "Combo atualizado com sucesso",
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Acesso negado - Apenas ADMIN" })
  @ApiResponse({ status: 404, description: "Combo não encontrado" })
  @ApiResponse({
    status: 409,
    description: "Combo com este nome já existe",
  })
  update(@Param("id") id: string, @Body() updateComboDto: UpdateComboDto) {
    return this.combosService.update(id, updateComboDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Remover combo" })
  @ApiParam({
    name: "id",
    description: "ID do combo",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({
    status: 200,
    description: "Combo removido com sucesso",
  })
  @ApiResponse({
    status: 400,
    description: "Combo possui produtos associados",
  })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Acesso negado - Apenas ADMIN" })
  @ApiResponse({ status: 404, description: "Combo não encontrado" })
  remove(@Param("id") id: string) {
    return this.combosService.remove(id);
  }
}
