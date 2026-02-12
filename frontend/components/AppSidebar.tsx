import {
  ClipboardClock,
  Home,
  PackageOpen,
  PackageSearch,
  Settings,
  SquareChevronDown,
  TicketPercent,
  User,
  User2,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
import { ModeToggle } from "./ModeToggle";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

const items = [
  {
    title: "Pedidos",
    url: "/dashboard/pedidos",
    icon: ClipboardClock,
    group: "Pedidos",
  },
  {
    title: "Configurações Gerais",
    url: "/dashboard/configuracoes",
    icon: Settings,
    group: "Configurações",
  },
  {
    title: "Gerenciamento de Categorias",
    url: "/dashboard/gerenciamento-de-categorias",
    icon: SquareChevronDown,
    group: "Gerenciamento",
  },
  {
    title: "Gerenciamento de Combos",
    url: "/dashboard/gerenciamento-de-combos",
    icon: PackageOpen,
    group: "Gerenciamento",
  },
  {
    title: "Gerenciamento de Produtos",
    url: "/dashboard/gerenciamento-de-produtos",
    icon: PackageSearch,
    group: "Gerenciamento",
  },
  //   {
  //     title: "Gerenciamento de Promoções",
  //     url: "/dashboard/gerenciamento-de-promocoes",
  //     icon: TicketPercent,
  //     group: "Gerenciamento",
  //   },
  //   {
  //     title: "Gerenciamento de Usuários",
  //     url: "/dashboard/gerenciamento-de-usuarios",
  //     icon: User2,
  //     group: "Gerenciamento",
  //   },
];

interface AppSidebarProps {
  open: boolean;
}

export function AppSidebar({ open }: AppSidebarProps) {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader>
        <div className="flex gap-2 items-center">
          <Image src="/logo.svg" alt="Logo" width={48} height={48} />
          <span
            className={cn(
              open ? "w-full" : "w-0",
              "transition-all overflow-hidden text-xl font-semibold",
            )}
          >
            AIQueFome
          </span>
        </div>
      </SidebarHeader>

      <SidebarContent className="overflow-hidden">
        {Object.entries(
          items.reduce<Record<string, typeof items>>((acc, item) => {
            acc[item.group] ??= [];
            acc[item.group].push(item);
            return acc;
          }, {}),
        ).map(([groupName, groupItems]) => (
          <SidebarGroup key={groupName}>
            <SidebarGroupLabel>{groupName}</SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu>
                {groupItems.map((item) => {
                  const isActive = pathname === item.url;

                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <a href={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter
        className={cn(
          open ? "flex-row" : "flex-col",
          "flex gap-2 items-center justify-center overflow-hidden",
        )}
      >
        <ModeToggle />

        <Button variant="outline" size="icon">
          <User />
        </Button>

        <Button variant="outline" size="icon" asChild>
          <Link href="/">
            <Home />
          </Link>
        </Button>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
