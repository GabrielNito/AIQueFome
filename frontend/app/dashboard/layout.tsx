"use client";

import { AppSidebar } from "@/components/AppSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { useState } from "react";

const pageTitles = {
  pedidos: "Pedidos",
  configuracoes: "Configurações Gerais",
  "gerenciamento-de-categorias": "Gerenciamento de Categorias",
  "gerenciamento-de-combos": "Gerenciamento de Combos",
  "gerenciamento-de-produtos": "Gerenciamento de Produtos",
  "gerenciamento-de-promocoes": "Gerenciamento de Promoções",
  "gerenciamento-de-usuarios": "Gerenciamento de Usuários",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);
  const pathname: string = usePathname();
  const currentPage: string = pathname.split("/")[2] as PageKey;

  type PageKey = keyof typeof pageTitles;

  const title =
    currentPage in pageTitles
      ? pageTitles[currentPage as PageKey]
      : "Dashboard";

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar open={open} />
      <main className="w-full">
        <div className="px-4 py-2 flex gap-2 items-center">
          <SidebarTrigger />
          <span className="text-xl font-medium">{title}</span>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}
