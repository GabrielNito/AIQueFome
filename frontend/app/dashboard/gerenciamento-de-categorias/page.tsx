import GerenciamentoDeCategorias from "@/components/pages/dashboard/GerenciamentoDeCategorias";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciamento de Categorias",
};

export default function Page() {
  return <GerenciamentoDeCategorias />;
}
