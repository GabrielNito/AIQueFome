import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UpdateUserDto, updateUserSchema } from "./dto/updateUser.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      orderBy: {
        name: "asc",
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: "Usuários recuperadas com sucesso",
      data: users,
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    return {
      message: "Usuário recuperado com sucesso",
      user,
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!existingUser) {
      throw new NotFoundException("Usuário não encontrado");
    }

    const result = updateUserSchema.safeParse(updateUserDto);

    if (!result.success) {
      const errors = result.error.errors.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      }));
      throw new BadRequestException({
        message: "Dados inválidos para a atualização do usuário",
        errors,
      });
    }

    const updateData: any = { ...result.data };

    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      updateData.password = hashedPassword;
    }

    if (updateData.email && updateData.email !== existingUser.email) {
      const userWithSameEmail = await this.prisma.user.findUnique({
        where: {
          email: updateData.email,
        },
      });

      if (userWithSameEmail) {
        throw new ConflictException("Já existe outro usuário com este email");
      }
    }

    const user = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      message: "Usuário atualizado com sucesso",
      user,
    };
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException("Usuário não encontrado");
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return {
      message: "Usuário removido com sucesso",
    };
  }
}
