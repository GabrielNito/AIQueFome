import NovoProduto from "@/components/dashboard/gerenciamento-de-produtos/NovoProduto";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novo Produto",
};

export default function NewProductPage() {
  return <NovoProduto />;
}
