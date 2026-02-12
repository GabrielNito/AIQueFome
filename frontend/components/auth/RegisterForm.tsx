"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, CheckCircle2 } from "lucide-react";
import { register } from "@/lib/api/auth";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const validatePassword = (pwd: string) => {
    const hasMinLength = pwd.length >= 8;
    const hasUpperCase = /[A-Z]/.test(pwd);
    const hasLowerCase = /[a-z]/.test(pwd);
    const hasNumber = /\d/.test(pwd);

    return {
      hasMinLength,
      hasUpperCase,
      hasLowerCase,
      hasNumber,
      isValid: hasMinLength && hasUpperCase && hasLowerCase && hasNumber,
    };
  };

  const passwordValidation = validatePassword(password);

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !email || !password || !confirmPassword) {
      setError("Por favor, preencha todos os campos");
      return;
    }

    if (!passwordValidation.isValid) {
      setError("A senha não atende aos requisitos de segurança");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não correspondem");
      return;
    }

    setIsLoading(true);

    try {
      await register({ name, email, password });

      router.push("/login?registered=true");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro ao criar conta. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = async () => {
    setError("");
    setIsLoading(true);

    // Aqui você implementaria a lógica de registro com Google
    // Exemplo: await signIn('google', { callbackUrl: '/onboarding' })

    setTimeout(() => {
      setIsLoading(false);
      console.log("Registro com Google");
    }, 1500);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-semibold tracking-tight">
          Criar sua conta
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          Comece gratuitamente. Não é necessário cartão de crédito.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button
          variant="outline"
          type="button"
          disabled={isLoading}
          onClick={handleGoogleRegister}
          className="w-full bg-transparent"
        >
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continuar com Google
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Ou continue com e-mail
            </span>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handleEmailRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome completo</Label>
            <Input
              id="name"
              type="text"
              placeholder="João Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              required
            />
            {password && (
              <div className="space-y-1 text-xs">
                <p className="text-muted-foreground font-medium">
                  Requisitos da senha:
                </p>
                <ul className="space-y-1">
                  <li
                    className={`flex items-center gap-2 ${
                      passwordValidation.hasMinLength
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Mínimo de 8 caracteres</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      passwordValidation.hasUpperCase
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Uma letra maiúscula</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      passwordValidation.hasLowerCase
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Uma letra minúscula</span>
                  </li>
                  <li
                    className={`flex items-center gap-2 ${
                      passwordValidation.hasNumber
                        ? "text-accent"
                        : "text-muted-foreground"
                    }`}
                  >
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Um número</span>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Criar conta
          </Button>
        </form>

        <p className="text-xs text-center text-muted-foreground leading-relaxed">
          Ao criar uma conta, você concorda com nossos{" "}
          <Link
            href="/termos"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Termos de Serviço
          </Link>{" "}
          e{" "}
          <Link
            href="/privacidade"
            className="underline underline-offset-4 hover:text-foreground"
          >
            Política de Privacidade
          </Link>
        </p>
      </CardContent>
      <CardFooter>
        <p className="text-center text-sm text-muted-foreground w-full">
          Já tem uma conta?{" "}
          <Link
            href="/login"
            className="font-medium text-foreground hover:underline underline-offset-4"
          >
            Entrar
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
