import EditarProduto from "@/components/dashboard/gerenciamento-de-produtos/EditarProduto";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Editar Produto",
};

export default function EditProductPage() {
  return <EditarProduto />;
}
