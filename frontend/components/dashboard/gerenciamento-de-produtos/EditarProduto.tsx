"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getProduct, updateProduct, getCategories } from "@/lib/api/products";
import {
  UpdateProductDto,
  updateProductSchema,
} from "@/lib/schemas/productsSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ArrowLeft, X } from "lucide-react";
import { toast } from "sonner";
import type { Category } from "@/lib/api/categories";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function EditarProdutoClient() {
  const router = useRouter();
  const params = useParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [fetchingProduct, setFetchingProduct] = useState(true);
  const [ingredientInput, setIngredientInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const form = useForm<UpdateProductDto>({
    resolver: zodResolver(updateProductSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      salePrice: undefined,
      categoryId: "",
      imageUrl: "",
      isAvailable: true,
      serving: undefined,
      tags: [],
      ingredients: [],
      nutritionalInfo: undefined,
    },
  });

  const fetchCategories = useCallback(async () => {
    try {
      const response = await getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  }, []);

  const fetchProduct = useCallback(async () => {
    try {
      setFetchingProduct(true);
      const product = await getProduct(params.id as string);

      form.reset({
        name: product.name,
        description: product.description || "",
        price: product.price,
        salePrice: product.salePrice || undefined,
        categoryId: product.categoryId || "",
        imageUrl: product.imageUrl || "",
        isAvailable: product.isAvailable,
        serving: product.serving || undefined,
        tags: product.tags || [],
        ingredients: product.ingredients || [],
        nutritionalInfo: product.nutritionalInfo || undefined,
      });

      setIngredients(product.ingredients || []);
      setTags(product.tags || []);
    } catch {
      toast.error("Falha ao carregar produto");
      router.back();
    } finally {
      setFetchingProduct(false);
    }
  }, [params.id, form, router]);

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, [fetchCategories, fetchProduct]);

  function addIngredient() {
    if (
      ingredientInput.trim() &&
      !ingredients.includes(ingredientInput.trim())
    ) {
      const newIngredients = [...ingredients, ingredientInput.trim()];
      setIngredients(newIngredients);
      form.setValue("ingredients", newIngredients);
      setIngredientInput("");
    }
  }

  function removeIngredient(ingredient: string) {
    const newIngredients = ingredients.filter((i) => i !== ingredient);
    setIngredients(newIngredients);
    form.setValue("ingredients", newIngredients);
  }

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

  async function onSubmit(data: UpdateProductDto) {
    try {
      setLoading(true);
      const token = localStorage.getItem("auth_token") || "";

      const formattedData: Partial<UpdateProductDto> = {
        name: data.name,
        price: data.price,
        description: data.description || undefined,
        imageUrl: data.imageUrl || undefined,
        categoryId: data.categoryId || undefined,
        salePrice: data.salePrice || undefined,
        serving: data.serving || undefined,
        isAvailable: data.isAvailable,
        ingredients: ingredients.length ? ingredients : undefined,
        tags: tags.length ? tags : undefined,
        nutritionalInfo: data.nutritionalInfo || undefined,
      };

      await updateProduct(params.id as string, formattedData, token);

      toast.success("Produto atualizado com sucesso");
      router.push("/dashboard/gerenciamento-de-produtos");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Falha ao atualizar produto";
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (fetchingProduct) {
    return (
      <div className="p-6 flex items-center justify-center min-h-screen">
        <div className="text-center">Carregando produto...</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Editar Produto</h1>
          <p className="text-muted-foreground">
            Atualize as informações do produto
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Básicas</CardTitle>
              <CardDescription>Dados essenciais do produto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input placeholder="Nome do produto" {...field} />
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
                        placeholder="Descrição do produto"
                        rows={4}
                        {...field}
                        value={field.value || ""}
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
                    <FormLabel>URL da Imagem</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="https://exemplo.com/imagem.jpg"
                        {...field}
                        value={field.value || ""}
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
              <CardTitle>Preços e Categoria</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>
                        Preço <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={value || ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(val === "" ? 0 : Number.parseFloat(val));
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="salePrice"
                  render={({ field: { value, onChange, ...field } }) => (
                    <FormItem>
                      <FormLabel>Preço Promocional</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          value={value ?? ""}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(
                              val === "" ? undefined : Number.parseFloat(val)
                            );
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Categoria</FormLabel>
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione uma categoria" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serving"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Porções</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Número de porções"
                        value={value ?? ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(
                            val === "" ? undefined : Number.parseInt(val, 10)
                          );
                        }}
                        {...field}
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
              <CardTitle>Ingredientes e Tags</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <FormLabel htmlFor="ingredient">Ingredientes</FormLabel>
                <div className="flex gap-2">
                  <Input
                    id="ingredient"
                    value={ingredientInput}
                    onChange={(e) => setIngredientInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addIngredient())
                    }
                    placeholder="Digite um ingrediente"
                  />
                  <Button type="button" onClick={addIngredient}>
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {ingredients.map((ingredient) => (
                    <Badge key={ingredient} variant="secondary">
                      {ingredient}
                      <button
                        type="button"
                        onClick={() => removeIngredient(ingredient)}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <FormLabel htmlFor="tag">Tags</FormLabel>
                <div className="flex gap-2">
                  <Input
                    id="tag"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && (e.preventDefault(), addTag())
                    }
                    placeholder="Digite uma tag"
                  />
                  <Button type="button" onClick={addTag}>
                    Adicionar
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Disponibilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="isAvailable"
                render={({ field }) => (
                  <FormItem className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <FormLabel>Produto Disponível</FormLabel>
                      <FormDescription>
                        Marque se o produto está disponível para venda
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

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Alterações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
