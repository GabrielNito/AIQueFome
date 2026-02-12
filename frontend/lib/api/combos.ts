import { CreateComboDto } from "../schemas/combosSchema";
import { API_BASE_URL } from "./api";

export interface ComboItem {
  productId: string;
  quantity: number;
}

export interface Combo {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  originalPrice?: number;
  categoryId: string;
  items: ComboItem[];
  imageUrl?: string;
  isAvailable: boolean;
  isFeatured: boolean;
  activeFrom?: string;
  activeUntil?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  _count?: {
    items: number;
  };
}

export interface CombosResponse {
  message: string;
  data: Combo[];
}

export async function fetchCombosSet(
  setCombo: React.Dispatch<React.SetStateAction<Combo[]>>,
  token: string | null,
) {
  try {
    const response = await fetch(`${API_BASE_URL}/combos`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data: CombosResponse = await response.json();

    setCombo(data.data);
  } catch (error) {
    console.error("Failed to fetch combos:", error);
  }
}

export async function createCombo(
  data: CreateComboDto,
  token: string | null,
): Promise<Combo> {
  const response = await fetch(`${API_BASE_URL}/combos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to create combo");
  }

  const result = await response.json();
  return result.combo || result.data;
}

export async function getCombo(
  id: string,
  token: string | null,
): Promise<Combo> {
  const response = await fetch(`${API_BASE_URL}/combos/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get combo");
  }

  const result = await response.json();
  return result.combo || result.data;
}

export async function updateCombo(
  id: string,
  data: Partial<CreateComboDto>,
  token: string | null,
): Promise<Combo> {
  const response = await fetch(`${API_BASE_URL}/combos/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update combo");
  }

  const result = await response.json();
  return result.combo || result.data;
}

export async function deleteCombo(
  id: string,
  token: string | null,
): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/combos/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to delete combo");
  }
}
