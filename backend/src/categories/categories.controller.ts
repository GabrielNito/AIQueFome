import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiParam,
} from "@nestjs/swagger";
import { CategoriesService } from "./categories.service";
import { CreateCategoryDto } from "./dto/createCategory.dto";
import { UpdateCategoryDto } from "./dto/updateCategory.dto";
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import {
  CreateCategorySwaggerDto,
  UpdateCategorySwaggerDto,
} from "./dto/categorySwagger.dto";

@ApiTags("categories")
@Controller("categories")
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Criar nova categoria" })
  @ApiBody({ type: CreateCategorySwaggerDto })
  @ApiResponse({
    status: 201,
    description: "Categoria criada com sucesso",
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Acesso negado - Apenas ADMIN" })
  @ApiResponse({
    status: 409,
    description: "Categoria com este nome já existe",
  })
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar todas as categorias" })
  @ApiResponse({
    status: 200,
    description: "Lista de categorias recuperada com sucesso",
  })
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Buscar categoria por ID (inclui produtos)" })
  @ApiParam({
    name: "id",
    description: "ID da categoria",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({
    status: 200,
    description: "Categoria encontrada com sucesso",
  })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  findOne(@Param("id") id: string) {
    return this.categoriesService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Atualizar categoria" })
  @ApiParam({
    name: "id",
    description: "ID da categoria",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiBody({ type: UpdateCategorySwaggerDto })
  @ApiResponse({
    status: 200,
    description: "Categoria atualizada com sucesso",
  })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Acesso negado - Apenas ADMIN" })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  @ApiResponse({
    status: 409,
    description: "Categoria com este nome já existe",
  })
  update(
    @Param("id") id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Remover categoria" })
  @ApiParam({
    name: "id",
    description: "ID da categoria",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({
    status: 200,
    description: "Categoria removida com sucesso",
  })
  @ApiResponse({
    status: 400,
    description: "Categoria possui produtos associados",
  })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Acesso negado - Apenas ADMIN" })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  remove(@Param("id") id: string) {
    return this.categoriesService.remove(id);
  }
}
