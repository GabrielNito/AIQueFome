import GerenciamentoDeProdutos from "@/components/pages/dashboard/GerenciamentoDeProdutos";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciamento de Produtos",
};

export default function ProductsManagementPage() {
  return <GerenciamentoDeProdutos />;
}
