import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import {
  CreateCategoryDto,
  createCategorySchema,
} from "./dto/createCategory.dto";
import {
  UpdateCategoryDto,
  updateCategorySchema,
} from "./dto/updateCategory.dto";

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createCategoryDto: CreateCategoryDto) {
    const result = createCategorySchema.safeParse(createCategoryDto);

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

    // Verificar se já existe categoria com o mesmo nome
    const existingCategory = await this.prisma.category.findFirst({
      where: {
        name: {
          equals: result.data.name,
          mode: "insensitive",
        },
      },
    });

    if (existingCategory) {
      throw new ConflictException("Já existe uma categoria com este nome");
    }

    const categoryData: any = {
      name: result.data.name,
      description: result.data.description,
    };

    const category = await this.prisma.category.create({
      data: categoryData,
    });

    return {
      message: "Categoria criada com sucesso",
      category,
    };
  }

  async findAll() {
    const categories = await this.prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return {
      message: "Categorias recuperadas com sucesso",
      data: categories,
    };
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        products: {
          where: {
            isAvailable: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException("Categoria não encontrada");
    }

    return {
      message: "Categoria recuperada com sucesso",
      category,
    };
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const existingCategory = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      throw new NotFoundException("Categoria não encontrada");
    }

    const result = updateCategorySchema.safeParse(updateCategoryDto);

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

    // Se estiver atualizando o nome, verificar se não conflita com outra categoria
    if (result.data.name && result.data.name !== existingCategory.name) {
      const categoryWithSameName = await this.prisma.category.findFirst({
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

      if (categoryWithSameName) {
        throw new ConflictException("Já existe outra categoria com este nome");
      }
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: result.data,
    });

    return {
      message: "Categoria atualizada com sucesso",
      category,
    };
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException("Categoria não encontrada");
    }

    // Verificar se há produtos associados
    if (category._count.products > 0) {
      throw new BadRequestException(
        "Não é possível remover uma categoria que possui produtos associados",
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return {
      message: "Categoria removida com sucesso",
    };
  }
}
