"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { getCombo, updateCombo } from "@/lib/api/combos";
import { getProducts, getCategories } from "@/lib/api/products";
import {
  updateComboSchema,
  type UpdateComboDto,
} from "@/lib/schemas/combosSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/lib/api/categories";
import type { Product } from "@/lib/api/products";
import type { ComboItem } from "@/lib/api/combos";
import { getToken } from "@/lib/api/auth";

export default function EditarCombo() {
  const router = useRouter();
  const params = useParams();

  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const [productsByCategory, setProductsByCategory] = useState<
    Record<string, Product[]>
  >({});

  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<UpdateComboDto>({
    resolver: zodResolver(updateComboSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      originalPrice: 0,
      categoryId: "",
      items: [],
      imageUrl: "",
      isAvailable: true,
      isFeatured: false,
      tags: [],
      activeFrom: "",
      activeUntil: "",
    },
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const items = useWatch({ control: form.control, name: "items" }) || [];

  // Lógica de cálculo de preço original (baseado no NovoCombo)
  useEffect(() => {
    const allProducts = Object.values(productsByCategory).flat();
    const total = items.reduce((sum, item) => {
      const product = allProducts.find((p) => p.id === item.productId);
      return product ? sum + product.price * item.quantity : sum;
    }, 0);

    form.setValue("originalPrice", total);
  }, [items, productsByCategory, form]);

  const loadInitialData = useCallback(async () => {
    try {
      setLoadingData(true);
      const token = getToken();
      const [catRes, prodRes, comboData] = await Promise.all([
        getCategories(),
        getProducts({ limit: 100 }),
        getCombo(params.id as string, token),
      ]);

      const categoriesData = catRes?.data ?? [];
      const productsData = prodRes?.data ?? [];
      setCategories(categoriesData);

      const grouped = productsData.reduce<Record<string, Product[]>>(
        (acc, product) => {
          if (!product.categoryId) return acc;
          acc[product.categoryId] ||= [];
          acc[product.categoryId].push(product);
          return acc;
        },
        {},
      );
      setProductsByCategory(grouped);

      // Helper para formatar datas ISO para o input datetime-local (YYYY-MM-DDTHH:mm)
      const formatDateForInput = (dateStr?: string | null) => {
        if (!dateStr) return "";
        return new Date(dateStr).toISOString().slice(0, 16);
      };

      // Popula o formulário com os dados existentes (Similar ao EditarProduto)
      form.reset({
        name: comboData.name,
        description: comboData.description || "",
        price: comboData.price,
        originalPrice: comboData.originalPrice,
        categoryId: comboData.categoryId || "",
        imageUrl: comboData.imageUrl || "",
        isAvailable: comboData.isAvailable,
        isFeatured: comboData.isFeatured,
        tags: comboData.tags || [],
        items: comboData.items.map((i: ComboItem) => ({
          productId: i.productId,
          quantity: i.quantity,
        })),
        activeFrom: formatDateForInput(comboData.activeFrom),
        activeUntil: formatDateForInput(comboData.activeUntil),
      });

      setTags(comboData.tags || []);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados do combo");
    } finally {
      setLoadingData(false);
    }
  }, [params.id, form]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Tag Helpers
  function addTag() {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      const newTags = [...tags, tagInput.trim()];
      setTags(newTags);
      form.setValue("tags", newTags);
      setTagInput("");
    }
  }

  function removeTag(tag: string) {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    form.setValue("tags", newTags);
  }

  async function onSubmit(data: UpdateComboDto) {
    if (!data.items || data.items.length === 0) {
      toast.error("Selecione ao menos um produto para o combo");
      return;
    }

    if (!data.categoryId) {
      toast.error("Selecione uma categoria para o combo");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token") || "";

      // Build payload with proper formatting
      const payload: UpdateComboDto = {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.originalPrice !== undefined && {
          originalPrice: data.originalPrice,
        }),
        ...(data.categoryId !== undefined && { categoryId: data.categoryId }),
        ...(data.items !== undefined && { items: data.items }),
        ...(data.isAvailable !== undefined && {
          isAvailable: data.isAvailable,
        }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.tags !== undefined && {
          tags: data.tags && data.tags.length > 0 ? data.tags : [],
        }),
        ...(data.description?.trim() && { description: data.description }),
        ...(data.imageUrl?.trim() && { imageUrl: data.imageUrl }),
        ...(data.activeFrom && {
          activeFrom: new Date(data.activeFrom).toISOString(),
        }),
        ...(data.activeUntil && {
          activeUntil: new Date(data.activeUntil).toISOString(),
        }),
      };

      await updateCombo(params.id as string, payload, token);
      toast.success("Combo atualizado com sucesso!");
      router.push("/dashboard/gerenciamento-de-combos");
    } catch (error: unknown) {
      toast.error(
        error instanceof Error ? error.message : "Erro ao atualizar combo",
      );
    } finally {
      setLoading(false);
    }
  }

  if (loadingData) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <p>Carregando dados do combo...</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-3xl font-bold">Editar Combo</h1>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome do Combo</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Combo Família" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Descreva o que vem no combo..."
                        rows={3}
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Imagem (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        {...field}
                        value={field.value ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Preços e Agendamento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preço Promocional (R$)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          value={field.value}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activeFrom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Válido de</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="activeUntil"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Válido até</FormLabel>
                      <FormControl>
                        <Input
                          type="datetime-local"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria do Combo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {items.length > 0 && (
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    Preço original (soma dos itens):{" "}
                    <span className="font-medium text-foreground">
                      R$ {form.watch("originalPrice")?.toFixed(2) ?? "0.00"}
                    </span>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tags Section */}
          <Card>
            <CardHeader>
              <CardTitle>Tags</CardTitle>
              <CardDescription>
                Adicione palavras-chave para busca
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  placeholder="Digite uma tag e aperte Enter"
                />
                <Button type="button" onClick={addTag}>
                  Adicionar
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="py-1 px-2">
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Produtos do Combo</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingData ? (
                <p className="text-sm text-muted-foreground">
                  Carregando produtos...
                </p>
              ) : (
                <Tabs defaultValue={categories[0]?.id}>
                  <TabsList className="flex flex-wrap h-auto gap-2 mb-4 bg-transparent">
                    {categories.map((cat) => (
                      <TabsTrigger
                        key={cat.id}
                        value={cat.id}
                        className="border data-[state=active]:bg-primary data-[state=active]:text-white"
                      >
                        {cat.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {categories.map((cat) => (
                    <TabsContent key={cat.id} value={cat.id}>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {(productsByCategory[cat.id] || []).map((product) => {
                          const index = items.findIndex(
                            (i) => i.productId === product.id,
                          );
                          const selected = index !== -1;

                          return (
                            <div
                              key={product.id}
                              className={`border rounded-xl p-4 cursor-pointer transition ${
                                selected
                                  ? "border-primary bg-primary/5"
                                  : "hover:border-muted-foreground"
                              }`}
                              onClick={() => {
                                if (!selected) {
                                  form.setValue("items", [
                                    ...items,
                                    { productId: product.id, quantity: 1 },
                                  ]);
                                }
                              }}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium leading-tight">
                                  {product.name}
                                </h4>
                                {selected && <Badge>Ativo</Badge>}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                R$ {product.price.toFixed(2)}
                              </p>

                              {selected && (
                                <div
                                  className="mt-3 flex items-center gap-2"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Input
                                    type="number"
                                    min={1}
                                    className="h-8 w-20"
                                    value={items[index].quantity}
                                    onChange={(e) => {
                                      const updated = [...items];
                                      updated[index].quantity =
                                        parseInt(e.target.value) || 1;
                                      form.setValue("items", updated);
                                    }}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="text-destructive h-8"
                                    onClick={() =>
                                      form.setValue(
                                        "items",
                                        items.filter((_, i) => i !== index),
                                      )
                                    }
                                  >
                                    Remover
                                  </Button>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6 space-y-4">
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border p-3 rounded-lg">
                    <div>
                      <FormLabel>Disponível para Venda</FormLabel>
                      <FormDescription>
                        Ativa ou desativa o combo no cardápio
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isFeatured"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between border p-3 rounded-lg">
                    <div>
                      <FormLabel>Destaque</FormLabel>
                      <FormDescription>
                        Exibir no banner principal ou seção de promoções
                      </FormDescription>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
