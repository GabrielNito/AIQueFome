import NovoCombo from "@/components/dashboard/gerenciamento-de-combos/NovoCombo";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Novo Combo",
};

export default function NewComboPage() {
  return <NovoCombo />;
}
