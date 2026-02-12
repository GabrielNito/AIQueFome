"use client";

import * as React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createColumns } from "./CreateColumns";
import { DataTable } from "./DataTable";
import { Category, fetchCategoriesSet } from "@/lib/api/categories";
import { CreateCategoryDialog } from "./CreateCategoryDialog";
import { DeleteCategoryDialog } from "./DeleteCategoryDialog";
import { EditCategoryDialog } from "./EditEquipmentDialog";

export function CategoriesTable() {
  const [categories, setCategories] = React.useState<Category[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [editingCategory, setEditingCategory] = React.useState<Category | null>(
    null
  );
  const [deletingCategory, setDeletingCategory] =
    React.useState<Category | null>(null);
  const [isCreating, setIsCreating] = React.useState(false);

  const loadCategories = React.useCallback(async () => {
    setIsLoading(true);
    await fetchCategoriesSet(setCategories);
    setIsLoading(false);
  }, []);

  React.useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const columns = React.useMemo(
    () =>
      createColumns({
        onEdit: (category) => setEditingCategory(category),
        onDelete: (category) => setDeletingCategory(category),
      }),
    []
  );

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-100 w-full" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-50" />
          <Skeleton className="h-10 w-75" />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setIsCreating(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Categoria
        </Button>
      </div>

      <DataTable columns={columns} data={categories} />

      <CreateCategoryDialog
        open={isCreating}
        onOpenChange={setIsCreating}
        onSuccess={loadCategories}
      />

      <EditCategoryDialog
        category={editingCategory}
        open={!!editingCategory}
        onOpenChange={(open) => !open && setEditingCategory(null)}
        onSuccess={loadCategories}
      />

      <DeleteCategoryDialog
        category={deletingCategory}
        open={!!deletingCategory}
        onOpenChange={(open) => !open && setDeletingCategory(null)}
        onSuccess={loadCategories}
      />
    </>
  );
}
