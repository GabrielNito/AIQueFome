import type { CreateProductDto } from "@/lib/schemas/productsSchema";
import { CategoriesResponse } from "./categories";
import { API_BASE_URL } from "./api";

export interface Product {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  categoryId?: string | null;
  imageUrl?: string | null;
  isAvailable: boolean;
  ingredients?: string[];
  serving?: number | null;
  tags: string[];
  nutritionalInfo?: Record<string, string> | null;
  createdAt: string;
  updatedAt: string;
  category?: {
    id: string;
    name: string;
    description?: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface ProductsResponse {
  message: string;
  data: Product[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ProductFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  isAvailable?: boolean;
  onSale?: boolean;
  search?: string;
  tags?: string;
}

export async function getProducts(
  filters: ProductFilters = {}
): Promise<ProductsResponse> {
  const params = new URLSearchParams();

  if (filters.page) params.append("page", filters.page.toString());
  if (filters.limit) params.append("limit", filters.limit.toString());
  if (filters.categoryId) params.append("categoryId", filters.categoryId);
  if (filters.isAvailable !== undefined)
    params.append("isAvailable", filters.isAvailable.toString());
  if (filters.onSale !== undefined)
    params.append("onSale", filters.onSale.toString());
  if (filters.search) params.append("search", filters.search);
  if (filters.tags) params.append("tags", filters.tags);

  const response = await fetch(`${API_BASE_URL}/products?${params.toString()}`);

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}

export async function getProduct(id: string): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`);

  if (!response.ok) {
    throw new Error("Failed to fetch product");
  }

  const data = await response.json();
  return data.product || data.data;
}

export async function getCategories(): Promise<CategoriesResponse> {
  const response = await fetch(`${API_BASE_URL}/categories`);

  if (!response.ok) {
    throw new Error("Failed to fetch categories");
  }

  return response.json();
}

export async function createProduct(
  data: CreateProductDto,
  token: string
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create product");
  }

  const result = await response.json();
  return result.product || result.data;
}

export async function updateProduct(
  id: string,
  data: Partial<CreateProductDto>,
  token: string
): Promise<Product> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update product");
  }

  const result = await response.json();
  return result.product || result.data;
}

export async function deleteProduct(id: string, token: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete product");
  }
}
