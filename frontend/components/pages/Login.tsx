"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { LoginForm } from "@/components/auth/LoginForm";
import { Metadata } from "next";
import { Item, ItemContent, ItemMedia, ItemTitle } from "../ui/item";

export const metadata: Metadata = {
  title: "Login",
};

function LoginContent() {
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-4">
        {registered === "true" && (
          <Item variant="outline" className="shadow-sm">
            <ItemMedia>
              <CheckCircle2 className="size-5" />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>
                Conta criada com sucesso. Faça login para continuar
              </ItemTitle>
            </ItemContent>
          </Item>
        )}
        <LoginForm />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
          <LoginForm />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
