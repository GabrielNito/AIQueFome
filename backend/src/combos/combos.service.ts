import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateComboDto, createComboSchema } from "./dto/createCombo.dto";
import { UpdateComboDto, updateComboSchema } from "./dto/updateCombo.dto";

@Injectable()
export class CombosService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createComboDto: CreateComboDto) {
    const result = createComboSchema.safeParse(createComboDto);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new BadRequestException({ message: "Dados inválidos", errors });
    }

    const { items, categoryId, name, price, originalPrice } = result.data;

    if (originalPrice && price >= originalPrice) {
      throw new BadRequestException(
        "O preço do combo deve ser menor que o preço original total",
      );
    }

    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) throw new NotFoundException("Categoria não encontrada");
    }

    const existingCombo = await this.prisma.combo.findFirst({
      where: { name: { equals: name, mode: "insensitive" } },
    });
    if (existingCombo)
      throw new ConflictException("Já existe um combo com este nome");

    const productIds = items.map((item) => item.productId);
    const existingProductsCount = await this.prisma.product.count({
      where: { id: { in: productIds } },
    });

    if (existingProductsCount !== productIds.length) {
      throw new BadRequestException(
        "Um ou mais produtos informados não existem",
      );
    }

    const combo = await this.prisma.combo.create({
      data: {
        name: result.data.name,
        description: result.data.description,
        price: result.data.price,
        originalPrice: result.data.originalPrice,
        categoryId: result.data.categoryId,
        imageUrl: result.data.imageUrl,
        isAvailable: result.data.isAvailable ?? true,
        isFeatured: result.data.isFeatured ?? false,
        tags: result.data.tags ?? [],
        activeFrom: result.data.activeFrom,
        activeUntil: result.data.activeUntil,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        },
      },
      include: {
        category: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      message: "Combo criado com sucesso",
      combo,
    };
  }

  async findAll() {
    const combos = await this.prisma.combo.findMany();

    return {
      message: "Combos recuperados com sucesso",
      data: combos,
    };
  }

  async findOne(id: string) {
    const combo = await this.prisma.combo.findUnique({
      where: { id },
      include: {
        category: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!combo) {
      throw new NotFoundException("Combo não encontrado");
    }

    return {
      message: "Combo recuperado com sucesso",
      combo,
    };
  }

  async update(id: string, updateComboDto: UpdateComboDto) {
    const existingCombo = await this.prisma.combo.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!existingCombo) {
      throw new NotFoundException("Combo não encontrado");
    }

    const result = updateComboSchema.safeParse(updateComboDto);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new BadRequestException({
        message: "Dados inválidos para a atualização do combo",
        errors,
      });
    }

    const { items, categoryId, name, price, originalPrice } = result.data;

    // Check if price is valid when both price and originalPrice are provided
    if (originalPrice && price && price >= originalPrice) {
      throw new BadRequestException(
        "O preço do combo deve ser menor que o preço original total",
      );
    }

    // Validate category if provided
    if (categoryId) {
      const category = await this.prisma.category.findUnique({
        where: { id: categoryId },
      });
      if (!category) throw new NotFoundException("Categoria não encontrada");
    }

    // Check if name already exists (if being updated) - case insensitive but excluding current combo
    if (name && name !== existingCombo.name) {
      const duplicateCombo = await this.prisma.combo.findFirst({
        where: {
          name: { equals: name, mode: "insensitive" },
          id: { not: id },
        },
      });
      if (duplicateCombo)
        throw new ConflictException("Já existe um combo com este nome");
    }

    // Validate products if items are being updated
    if (items && items.length > 0) {
      const productIds = items.map((item) => item.productId);
      const existingProductsCount = await this.prisma.product.count({
        where: { id: { in: productIds } },
      });

      if (existingProductsCount !== productIds.length) {
        throw new BadRequestException(
          "Um ou mais produtos informados não existem",
        );
      }

      // Delete old combo items
      await this.prisma.comboItem.deleteMany({
        where: { comboId: id },
      });
    }

    // Prepare update data
    const updateData: any = {};

    if (name !== undefined) updateData.name = name;
    if (result.data.description !== undefined)
      updateData.description = result.data.description;
    if (price !== undefined) updateData.price = price;
    if (originalPrice !== undefined) updateData.originalPrice = originalPrice;
    if (categoryId !== undefined) updateData.categoryId = categoryId;
    if (result.data.imageUrl !== undefined)
      updateData.imageUrl = result.data.imageUrl;
    if (result.data.isAvailable !== undefined)
      updateData.isAvailable = result.data.isAvailable;
    if (result.data.isFeatured !== undefined)
      updateData.isFeatured = result.data.isFeatured;
    if (result.data.tags !== undefined) updateData.tags = result.data.tags;
    if (result.data.activeFrom !== undefined)
      updateData.activeFrom = result.data.activeFrom;
    if (result.data.activeUntil !== undefined)
      updateData.activeUntil = result.data.activeUntil;

    // Update combo with new items if provided
    if (items && items.length > 0) {
      updateData.items = {
        create: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };
    }

    const combo = await this.prisma.combo.update({
      where: { id },
      data: updateData,
      include: {
        category: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return {
      message: "Combo atualizado com sucesso",
      combo,
    };
  }

  async remove(id: string) {
    const combo = await this.prisma.combo.findUnique({
      where: { id },
      include: { items: true },
    });

    if (!combo) {
      throw new NotFoundException("Combo não encontrado");
    }

    // Delete associated ComboItems first
    if (combo.items.length > 0) {
      await this.prisma.comboItem.deleteMany({
        where: { comboId: id },
      });
    }

    await this.prisma.combo.delete({
      where: { id },
    });

    return {
      message: "Combo removido com sucesso",
    };
  }
}
