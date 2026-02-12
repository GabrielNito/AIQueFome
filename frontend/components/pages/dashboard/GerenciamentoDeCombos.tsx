"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { deleteCombo, fetchCombosSet, type Combo } from "@/lib/api/combos";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Plus,
  MoreVertical,
  Pencil,
  Trash2,
  Calendar,
  EyeOff,
  CheckCircle2,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";
import { getToken } from "@/lib/api/auth";
import Image from "next/image";

export default function GerenciamentoDeCombos() {
  const router = useRouter();
  const [combos, setCombos] = useState<Combo[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const token = getToken();
      await fetchCombosSet(setCombos, token);
    } catch {
      toast.error("Falha ao carregar dados dos combos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleDelete(id: string) {
    try {
      const token = getToken();
      await deleteCombo(id, token);
      toast.success("Combo deletado");
      loadData();
    } catch {
      toast.error("Erro ao deletar");
    }
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);

  // Updated to use semantic utility classes for transparency/borders
  const getValidityStatus = (from?: string | null, until?: string | null) => {
    if (!from || !until)
      return {
        label: "Permanente",
        class: "bg-primary/10 text-primary border-primary/20",
      };
    const now = new Date();
    const end = new Date(until);
    if (now > end)
      return {
        label: "Expirado",
        class: "bg-destructive/10 text-destructive border-destructive/20",
      };
    return {
      label: "Vigente",
      class:
        "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
    };
  };

  return (
    <div className="p-6 space-y-8 min-h-screen bg-background text-foreground">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Combos</h1>
          <p className="text-muted-foreground">
            Gerencie suas ofertas e promoções ativas.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/gerenciamento-de-combos/novo")}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Combo
        </Button>
      </div>

      {/* Grid Display */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-72 w-full bg-muted animate-pulse rounded-xl"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {combos.map((combo) => {
            const validity = getValidityStatus(
              combo.activeFrom,
              combo.activeUntil,
            );

            return (
              <Card
                key={combo.id}
                className="group overflow-hidden border-border bg-card hover:ring-1 hover:ring-ring transition-all duration-300 flex flex-col"
              >
                {/* Image Header */}
                <div className="relative h-44 w-full bg-muted overflow-hidden border-b">
                  {combo.imageUrl ? (
                    <Image
                      src={combo.imageUrl}
                      alt={combo.name}
                      fill={true}
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground/40">
                      <ImageOff size={40} strokeWidth={1} />
                    </div>
                  )}

                  {/* Floating Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {combo.isFeatured && (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm">
                        DESTAQUE
                      </Badge>
                    )}
                    <Badge
                      variant="outline"
                      className={`${validity.class} backdrop-blur-md bg-background/50`}
                    >
                      {validity.label}
                    </Badge>
                  </div>

                  {/* Options Menu */}
                  <div className="absolute top-3 right-3">
                    <ComboActions
                      combo={combo}
                      onEdit={(id) =>
                        router.push(
                          `/dashboard/gerenciamento-de-combos/${id}/edit`,
                        )
                      }
                      onDelete={handleDelete}
                    />
                  </div>
                </div>

                <CardContent className="p-4 grow">
                  <h3 className="font-bold text-lg leading-tight mb-2 line-clamp-1">
                    {combo.name}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-10">
                    {combo.description || "Sem descrição disponível."}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {combo.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-secondary text-secondary-foreground border border-border"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="p-4 pt-0 flex items-center justify-between">
                  <div className="flex flex-col">
                    {combo.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">
                        {formatPrice(combo.originalPrice)}
                      </span>
                    )}
                    <span className="text-xl font-black text-primary">
                      {formatPrice(combo.price)}
                    </span>
                  </div>

                  <div className="flex flex-col items-end gap-1">
                    {combo.isAvailable ? (
                      <div className="flex items-center text-[11px] font-medium text-green-600 dark:text-green-400">
                        <CheckCircle2 className="w-3 h-3 mr-1" /> No Menu
                      </div>
                    ) : (
                      <div className="flex items-center text-[11px] font-medium text-muted-foreground">
                        <EyeOff className="w-3 h-3 mr-1" /> Oculto
                      </div>
                    )}
                    {combo.activeUntil && (
                      <div className="flex items-center text-[10px] text-muted-foreground">
                        <Calendar className="w-3 h-3 mr-1" />
                        {new Date(combo.activeUntil).toLocaleDateString(
                          "pt-BR",
                        )}
                      </div>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ComboActions({
  combo,
  onEdit,
  onDelete,
}: {
  combo: Combo;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="h-8 w-8 rounded-full shadow-md bg-background/80 hover:bg-background backdrop-blur-sm"
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => onEdit(combo.id)}>
          <Pencil className="mr-2 h-4 w-4" /> Editar
        </DropdownMenuItem>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <button className="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-destructive/10 text-destructive w-full">
              <Trash2 className="mr-2 h-4 w-4" /> Deletar
            </button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Excluir combo?</AlertDialogTitle>
              <AlertDialogDescription>
                Essa ação removerá permanentemente o item do catálogo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => onDelete(combo.id)}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Confirmar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
