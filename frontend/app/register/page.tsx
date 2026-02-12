import { RegisterForm } from "@/components/auth/RegisterForm";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Criar sua conta",
};

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <RegisterForm />
    </div>
  );
}
