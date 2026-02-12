import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UseGuards,
} from "@nestjs/common";
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
  ApiQuery,
  ApiParam,
} from "@nestjs/swagger";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/createProduct.dto";
import { UpdateProductDto } from "./dto/updateProduct.dto";
import { QueryProductDto, queryProductSchema } from "./dto/queryProduct.dto";
import { JwtAuthGuard } from "../auth/guards/jwtAuth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { Roles } from "../auth/decorators/roles.decorator";
import { Role } from "../auth/enums/role.enum";
import {
  CreateProductSwaggerDto,
  UpdateProductSwaggerDto,
} from "./dto/productSwagger.dto";

@ApiTags("products")
@Controller("products")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.CREATED)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Criar novo produto" })
  @ApiBody({ type: CreateProductSwaggerDto })
  @ApiResponse({ status: 201, description: "Produto criado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Acesso negado - Apenas ADMIN" })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  @ApiResponse({ status: 409, description: "Produto com este nome já existe" })
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar produtos com filtros e paginação" })
  @ApiQuery({ name: "page", required: false, type: Number, example: 1 })
  @ApiQuery({ name: "limit", required: false, type: Number, example: 10 })
  @ApiQuery({ name: "categoryId", required: false, type: String })
  @ApiQuery({ name: "isAvailable", required: false, type: Boolean })
  @ApiQuery({ name: "search", required: false, type: String })
  @ApiQuery({
    name: "tags",
    required: false,
    type: String,
    example: "doce,vegetariano",
  })
  @ApiQuery({ name: "onSale", required: false, type: Boolean })
  @ApiResponse({
    status: 200,
    description: "Lista de produtos recuperada com sucesso",
  })
  findAll(@Query() query: QueryProductDto) {
    const result = queryProductSchema.safeParse(query);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new BadRequestException({
        message: "Parâmetros de consulta inválidos",
        errors,
      });
    }

    return this.productsService.findAll(result.data);
  }

  //   @Get("by-tags")
  //   @HttpCode(HttpStatus.OK)
  //   @ApiOperation({ summary: "Buscar produtos por tags" })
  //   @ApiQuery({
  //     name: "tags",
  //     required: true,
  //     type: String,
  //     example: "doce,vegetariano",
  //     description: "Tags separadas por vírgula",
  //   })
  //   @ApiResponse({ status: 200, description: "Produtos encontrados com sucesso" })
  //   @ApiResponse({ status: 400, description: "Parâmetro tags é obrigatório" })
  //   findByTags(@Query("tags") tags: string) {
  //     if (!tags) {
  //       throw new BadRequestException("Parâmetro "tags" é obrigatório");
  //     }

  //     const tagsArray = tags
  //       .split(",")
  //       .map((tag) => tag.trim())
  //       .filter(Boolean);
  //     return this.productsService.findByTags(tagsArray);
  //   }

  @Get("by-category/:categoryId")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Buscar produtos por categoria" })
  @ApiParam({
    name: "categoryId",
    description: "ID da categoria",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({ status: 200, description: "Produtos encontrados com sucesso" })
  @ApiResponse({ status: 404, description: "Categoria não encontrada" })
  findByCategory(@Param("categoryId") categoryId: string) {
    return this.productsService.findByCategory(categoryId);
  }

  @Get(":id")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Buscar produto por ID" })
  @ApiParam({
    name: "id",
    description: "ID do produto",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({ status: 200, description: "Produto encontrado com sucesso" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  findOne(@Param("id") id: string) {
    return this.productsService.findOne(id);
  }

  @Patch(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Atualizar produto" })
  @ApiParam({
    name: "id",
    description: "ID do produto",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiBody({ type: UpdateProductSwaggerDto })
  @ApiResponse({ status: 200, description: "Produto atualizado com sucesso" })
  @ApiResponse({ status: 400, description: "Dados inválidos" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Acesso negado - Apenas ADMIN" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  @ApiResponse({ status: 409, description: "Produto com este nome já existe" })
  update(@Param("id") id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(":id")
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth("JWT-auth")
  @ApiOperation({ summary: "Remover produto" })
  @ApiParam({
    name: "id",
    description: "ID do produto",
    example: "507f1f77bcf86cd799439011",
  })
  @ApiResponse({ status: 200, description: "Produto removido com sucesso" })
  @ApiResponse({ status: 401, description: "Não autorizado" })
  @ApiResponse({ status: 403, description: "Acesso negado - Apenas ADMIN" })
  @ApiResponse({ status: 404, description: "Produto não encontrado" })
  remove(@Param("id") id: string) {
    return this.productsService.remove(id);
  }
}
