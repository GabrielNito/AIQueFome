import GerenciamentoDeCombos from "@/components/pages/dashboard/GerenciamentoDeCombos";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gerenciamento de Combos",
};

export default function Page() {
  return <GerenciamentoDeCombos />;
}
