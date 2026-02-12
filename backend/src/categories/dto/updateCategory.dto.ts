import { z } from "zod";
import { createCategorySchema } from "./createCategory.dto";

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
