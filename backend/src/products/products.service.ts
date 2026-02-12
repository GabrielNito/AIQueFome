import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateProductDto, createProductSchema } from "./dto/createProduct.dto";
import { UpdateProductDto, updateProductSchema } from "./dto/updateProduct.dto";
import { QueryProductDto } from "./dto/queryProduct.dto";

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    const result = createProductSchema.safeParse(createProductDto);

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

    if (result.data.salePrice && result.data.salePrice >= result.data.price) {
      throw new BadRequestException(
        "O preço de desconto deve ser menor que o preço normal",
      );
    }

    if (result.data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: result.data.categoryId },
      });

      if (!category) {
        throw new NotFoundException("Categoria não encontrada");
      }
    }

    const existingProduct = await this.prisma.product.findFirst({
      where: {
        name: {
          equals: result.data.name,
          mode: "insensitive",
        },
      },
    });

    if (existingProduct) {
      throw new ConflictException("Já existe um produto com este nome");
    }

    const productData: any = {
      name: result.data.name,
      description: result.data.description,
      price: result.data.price,
      salePrice: result.data.salePrice,
      categoryId: result.data.categoryId,
      imageUrl: result.data.imageUrl,
      isAvailable: result.data.isAvailable ?? true,
      ingredients: result.data.ingredients ?? [],
      serving: result.data.serving,
      tags: result.data.tags ?? [],
      nutritionalInfo: result.data.nutritionalInfo,
    };

    const product = await this.prisma.product.create({
      data: productData,
      include: {
        category: true,
      },
    });

    return {
      message: "Produto criado com sucesso",
      product,
    };
  }

  async findAll(query: QueryProductDto) {
    const { page, limit, categoryId, isAvailable, search, tags, onSale } =
      query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }

    if (isAvailable !== undefined) {
      where.isAvailable = isAvailable;
    }

    if (onSale !== undefined) {
      if (onSale) {
        where.salePrice = { not: null };
      } else {
        where.salePrice = null;
      }
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { tags: { has: search } },
      ];
    }

    if (tags && tags.length > 0) {
      where.tags = {
        hasSome: tags,
      };
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        include: {
          category: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      message: "Produtos recuperados com sucesso",
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      throw new NotFoundException("Produto não encontrado");
    }

    return {
      message: "Produto recuperado com sucesso",
      product,
    };
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const existingProduct = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!existingProduct) {
      throw new NotFoundException("Produto não encontrado");
    }

    const result = updateProductSchema.safeParse(updateProductDto);

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

    const finalPrice = result.data.price ?? existingProduct.price;
    const finalSalePrice = result.data.salePrice ?? existingProduct.salePrice;

    if (result.data.salePrice !== undefined) {
      if (
        result.data.salePrice !== null &&
        result.data.salePrice >= finalPrice
      ) {
        throw new BadRequestException(
          "O preço de desconto deve ser menor que o preço normal",
        );
      }
    }

    if (result.data.categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: result.data.categoryId },
      });

      if (!category) {
        throw new NotFoundException("Categoria não encontrada");
      }
    }

    if (result.data.name && result.data.name !== existingProduct.name) {
      const productWithSameName = await this.prisma.product.findFirst({
        where: {
          name: {
            equals: result.data.name,
            mode: "insensitive",
          },
          id: {
            not: id,
          },
        },
      });

      if (productWithSameName) {
        throw new ConflictException("Já existe outro produto com este nome");
      }
    }

    const updateData: any = { ...result.data };

    if (result.data.ingredients !== undefined) {
      updateData.ingredients = result.data.ingredients ?? [];
    }

    const product = await this.prisma.product.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
      },
    });

    return {
      message: "Produto atualizado com sucesso",
      product,
    };
  }

  async remove(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      throw new NotFoundException("Produto não encontrado");
    }

    await this.prisma.product.delete({
      where: { id },
    });

    return {
      message: "Produto removido com sucesso",
    };
  }

  //   async findByTags(tags: string[]) {
  //     const products = await this.prisma.product.findMany({
  //       where: {
  //         tags: {
  //           hasSome: tags,
  //         },
  //         isAvailable: true,
  //       },
  //       include: {
  //         category: true,
  //       },
  //       orderBy: {
  //         createdAt: "desc",
  //       },
  //     });

  //     return {
  //       message: "Produtos encontrados com sucesso",
  //       data: products,
  //     };
  //   }

  async findByCategory(categoryId: string) {
    const category = await this.prisma.category.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException("Categoria não encontrada");
    }

    const products = await this.prisma.product.findMany({
      where: {
        categoryId,
        isAvailable: true,
      },
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return {
      message: "Produtos encontrados com sucesso",
      data: products,
    };
  }
}
