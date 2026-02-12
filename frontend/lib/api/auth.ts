import { API_BASE_URL } from "./api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CLIENT" | "VIP_CLIENT";
    createdAt: string;
  };
}

export interface RegisterResponse {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CLIENT" | "VIP_CLIENT";
    createdAt: string;
  };
}

export interface UserProfile {
  message: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: "ADMIN" | "CLIENT" | "VIP_CLIENT";
    createdAt: string;
  };
}

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  const data = await response.json();

  if (typeof window !== "undefined") {
    console.log("[auth.login] response", {
      status: response.status,
      ok: response.ok,
      data,
    });
  }

  if (!response.ok) {
    throw new Error(data.message || "Falha ao fazer login");
  }

  return data;
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const text: string = await response.text();
  let parsed: string | { message: string } | null = null;
  try {
    parsed = text ? JSON.parse(text) : null;
  } catch (error) {
    console.error(error);
    parsed = text;
  }

  if (typeof window !== "undefined") {
    console.log("[auth.register] response", {
      status: response.status,
      ok: response.ok,
      text,
      parsed,
    });
  }

  if (!response.ok) {
    const message: string =
      parsed && typeof parsed === "object" && parsed.message
        ? parsed.message
        : text || "Falha ao criar conta";
    throw new Error(message);
  }

  return parsed as RegisterResponse;
}

export async function getProfile(token: string): Promise<UserProfile> {
  const response = await fetch(`${API_BASE_URL}/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Falha ao obter perfil");
  }

  return response.json();
}

// Funções auxiliares para gerenciar o token
export function saveToken(token?: string | null): void {
  if (typeof window === "undefined") return;

  if (!token) {
    localStorage.removeItem("auth_token");
    return;
  }

  localStorage.setItem("auth_token", token);
}

export function getToken(): string | null {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token");
  }
  return null;
}

export function removeToken(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem("auth_token");
  }
}

export function isAuthenticated(): boolean {
  return !!getToken();
}
