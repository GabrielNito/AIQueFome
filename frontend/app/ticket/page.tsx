import Ticket from "@/components/ticket/Ticket";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pedido #1203712709123",
};

export default function Page() {
  return (
    <div className="bg-red-400 min-h-screen flex justify-center items-center select-none px-4">
      <Ticket />
    </div>
  );
}
