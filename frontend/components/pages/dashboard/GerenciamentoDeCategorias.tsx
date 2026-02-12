import { CategoriesTable } from "@/components/dashboard/gerenciamento-de-categorias/CategoriesTable";

export default function GerenciamentoDeCategorias() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground">
            Gerencie as categorias do seu sistema
          </p>
        </div>
      </div>

      <CategoriesTable />
    </div>
  );
}
