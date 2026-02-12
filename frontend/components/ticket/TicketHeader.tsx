import { Clock, Ticket } from "lucide-react";
import Image from "next/image";

export default function TicketHeader() {
  return (
    <div
      className="relative bg-card lg:px-12 px-6 pb-8 pt-12 shadow-2xl select-none"
      style={{
        mask: "radial-gradient(15px at 15px bottom, transparent 95%, black) -15px",
      }}
    >
      <div className="absolute w-full -top-4 left-0 flex justify-evenly">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className="block h-8 w-8 rounded-full bg-red-400" />
        ))}
      </div>

      <div className="flex gap-2 justify-center items-center pb-4">
        <Image src="/logo.svg" alt="Logo" width={48} height={48} />

        <span className="text-xl font-semibold">AI Que Fome</span>
      </div>

      <div className="grid md:grid-cols-2 md:gap-4 gap-1 border px-3 py-2 rounded-xl bg-muted/50">
        <div className="flex md:flex-col justify-between">
          <div className="flex gap-1 items-center">
            <Ticket className="max-md:hidden w-5 h-5 stroke-muted-foreground" />
            <span className="font-normal text-muted-foreground">
              Nº do pedido
            </span>
          </div>
          <p className="font-semibold">0120034399434</p>
        </div>

        <div className="flex md:flex-col justify-between">
          <div className="flex gap-1 items-center justify-end">
            <Clock className="max-md:hidden w-5 h-5 stroke-muted-foreground" />
            <span className="text-end font-normal text-muted-foreground">
              Data e Hora
            </span>
          </div>
          <p className="text-end font-semibold">19 Jun 2025・10:15</p>
        </div>
      </div>
    </div>
  );
}
