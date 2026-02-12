import { CreateCategoryDto } from "../schemas/categoriesSchema";
import { API_BASE_URL } from "./api";

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  _count?: {
    products: number;
  };
}

export interface CategoriesResponse {
  message: string;
  data: Category[];
}

export async function fetchCategoriesSet(
  setCategory: React.Dispatch<React.SetStateAction<Category[]>>
) {
  try {
    const response = await fetch(`${API_BASE_URL}/categories`);
    const data: CategoriesResponse = await response.json();

    setCategory(data.data);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
}

export async function createCategory(
  data: CreateCategoryDto,
  token: string | null
): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create category");
  }

  const result = await response.json();
  return result.category || result.data;
}

export async function updateCategory(
  id: string,
  data: Partial<CreateCategoryDto>,
  token: string | null
): Promise<Category> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update category");
  }

  const result = await response.json();
  return result.category || result.data;
}

export async function deleteCategory(
  id: string,
  token: string | null
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete category");
  }
}
