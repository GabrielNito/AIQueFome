"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getProducts,
  getCategories,
  deleteProduct,
  type Product,
  type ProductFilters,
} from "@/lib/api/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MoreHorizontal,
  Plus,
  Search,
  Filter,
  Pencil,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/lib/api/categories";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
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
import Image from "next/image";

export default function GerenciamentoDeProdutos() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  const [filters, setFilters] = useState<ProductFilters>({
    page: 1,
    limit: 10,
    search: "",
    categoryId: "",
    isAvailable: undefined,
    onSale: undefined,
    tags: "",
  });

  const [searchInput, setSearchInput] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const cleanFilters: ProductFilters = {
        ...filters,
        categoryId: filters.categoryId || undefined,
        search: filters.search || undefined,
        tags: filters.tags || undefined,
      };

      const response = await getProducts(cleanFilters);
      setProducts(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error(error);
      toast.error("Falha ao carregar produtos");
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  async function handleDelete(id: string) {
    try {
      const token = localStorage.getItem("auth_token") || "";
      await deleteProduct(id, token);
      toast.success("Produto deletado com sucesso");
      fetchProducts();
    } catch (error) {
      console.error(error);
      toast.error("Falha ao deletar produto");
    }
  }

  function handleApplyFilters() {
    setFilters({
      ...filters,
      page: 1,
      search: searchInput,
      tags: tagsInput,
    });
  }

  function handleClearFilters() {
    setSearchInput("");
    setTagsInput("");
    setFilters({
      page: 1,
      limit: 10,
      search: "",
      categoryId: "",
      isAvailable: undefined,
      onSale: undefined,
      tags: "",
    });
  }

  function formatPrice(price: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Produtos</h1>
          <p className="text-muted-foreground">
            Gerencie os produtos do seu sistema
          </p>
        </div>
        <Button
          onClick={() =>
            router.push("/dashboard/gerenciamento-de-produtos/novo")
          }
        >
          <Plus className="mr-2 h-4 w-4" />
          Novo Produto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros
          </CardTitle>
          <CardDescription>Refine sua busca de produtos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="search"
                  placeholder="Nome do produto..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-8"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select
                value={filters.categoryId}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    categoryId: value === "all" ? "" : value,
                    page: 1,
                  })
                }
              >
                <SelectTrigger className="w-full" id="category">
                  <SelectValue placeholder="Todas as categorias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas as categorias</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isAvailable">Disponibilidade</Label>
              <Select
                value={
                  filters.isAvailable === undefined
                    ? "all"
                    : filters.isAvailable.toString()
                }
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    isAvailable: value === "all" ? undefined : value === "true",
                    page: 1,
                  })
                }
              >
                <SelectTrigger className="w-full" id="isAvailable">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Disponível</SelectItem>
                  <SelectItem value="false">Indisponível</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="onSale">Em Promoção</Label>
              <Select
                value={
                  filters.onSale === undefined
                    ? "all"
                    : filters.onSale.toString()
                }
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    onSale: value === "all" ? undefined : value === "true",
                    page: 1,
                  })
                }
              >
                <SelectTrigger className="w-full" id="onSale">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="true">Sim</SelectItem>
                  <SelectItem value="false">Não</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                placeholder="doce,vegetariano"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="limit">Itens por página</Label>
              <Select
                value={filters.limit?.toString()}
                onValueChange={(value) =>
                  setFilters({
                    ...filters,
                    limit: Number.parseInt(value),
                    page: 1,
                  })
                }
              >
                <SelectTrigger className="w-full" id="limit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleApplyFilters}>
              <Search className="mr-2 h-4 w-4" />
              Aplicar Filtros
            </Button>
            <Button variant="outline" onClick={handleClearFilters}>
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Produtos</CardTitle>
          <CardDescription>
            {pagination.total} produto{pagination.total !== 1 ? "s" : ""}{" "}
            encontrado{pagination.total !== 1 ? "s" : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Carregando...</div>
          ) : products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum produto encontrado
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagem</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Categoria</TableHead>
                      <TableHead>Preço</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Tags</TableHead>
                      <TableHead className="w-20 border-l text-center">
                        Ações
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="w-12">
                          {product.imageUrl ? (
                            <Image
                              src={product.imageUrl || "/placeholder.svg"}
                              alt={product.name}
                              width={48}
                              height={48}
                              className="rounded object-cover"
                            />
                          ) : (
                            <div className="h-16 w-16 rounded bg-muted flex items-center justify-center text-muted-foreground text-xs">
                              Sem imagem
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="font-medium">
                          {product.name}
                        </TableCell>
                        <TableCell>{product.category?.name || "—"}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            {product.salePrice ? (
                              <>
                                <span className="line-through text-muted-foreground text-sm">
                                  {formatPrice(product.price)}
                                </span>
                                <span className="text-green-600 font-semibold">
                                  {formatPrice(product.salePrice)}
                                </span>
                              </>
                            ) : (
                              <span>{formatPrice(product.price)}</span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <Badge
                              variant={
                                product.isAvailable ? "default" : "secondary"
                              }
                            >
                              {product.isAvailable
                                ? "Disponível"
                                : "Indisponível"}
                            </Badge>
                            {product.salePrice && (
                              <Badge variant="destructive">Promoção</Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {product.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="outline">
                                {tag}
                              </Badge>
                            ))}
                            {product.tags.length > 2 && (
                              <Badge variant="outline">
                                +{product.tags.length - 2}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="border-l text-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="h-8 w-8 p-0">
                                <span className="sr-only">Abrir menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Ações</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() =>
                                  router.push(
                                    `/dashboard/gerenciamento-de-produtos/${product.id}/edit`
                                  )
                                }
                              >
                                <Pencil className="mr-2 h-4 w-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />

                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    className="w-full justify-start px-2! text-destructive"
                                  >
                                    <Trash2 className="mr-2 h-4 w-4" />
                                    Deletar
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Você tem certeza?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Esta ação é irreversível. Isso vai
                                      permanentemente deletar o produto.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>
                                      Cancelar
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(product.id)}
                                      className="bg-destructive text-white"
                                    >
                                      Deletar
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between mt-4">
                <div className="min-w-28 text-sm text-muted-foreground">
                  Página {pagination.page} de {pagination.totalPages}
                </div>
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        onClick={() =>
                          setFilters({ ...filters, page: pagination.page - 1 })
                        }
                        className={
                          pagination.page === 1
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>

                    {/* First page */}
                    {pagination.page > 2 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => setFilters({ ...filters, page: 1 })}
                          className="cursor-pointer"
                        >
                          1
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis before current page */}
                    {pagination.page > 3 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Previous page */}
                    {pagination.page > 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() =>
                            setFilters({
                              ...filters,
                              page: pagination.page - 1,
                            })
                          }
                          className="cursor-pointer"
                        >
                          {pagination.page - 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Current page */}
                    <PaginationItem>
                      <PaginationLink isActive className="cursor-default">
                        {pagination.page}
                      </PaginationLink>
                    </PaginationItem>

                    {/* Next page */}
                    {pagination.page < pagination.totalPages && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() =>
                            setFilters({
                              ...filters,
                              page: pagination.page + 1,
                            })
                          }
                          className="cursor-pointer"
                        >
                          {pagination.page + 1}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    {/* Ellipsis after current page */}
                    {pagination.page < pagination.totalPages - 2 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}

                    {/* Last page */}
                    {pagination.page < pagination.totalPages - 1 && (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() =>
                            setFilters({
                              ...filters,
                              page: pagination.totalPages,
                            })
                          }
                          className="cursor-pointer"
                        >
                          {pagination.totalPages}
                        </PaginationLink>
                      </PaginationItem>
                    )}

                    <PaginationItem>
                      <PaginationNext
                        onClick={() =>
                          setFilters({ ...filters, page: pagination.page + 1 })
                        }
                        className={
                          pagination.page === pagination.totalPages
                            ? "pointer-events-none opacity-50"
                            : "cursor-pointer"
                        }
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
