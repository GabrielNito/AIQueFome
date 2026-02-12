import { Copy } from "lucide-react";
import Image from "next/image";

export default function TicketStatusPayment() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <span className="font-medium">Aguardando Pagamento</span>
        <span className="font-normal text-muted-foreground max-w-[33ch] linehear">
          Seu pedido está pendente de confirmação de pagamento.
        </span>
      </div>

      <div className="w-full flex gap-2">
        <Image
          src="/qrcode.png"
          alt="QR Code"
          className="object-cover"
          width={80}
          height={80}
        />

        <div className="w-full flex flex-col gap-1">
          <span className="pl-3 font-medium">Pix Copia e Cola</span>

          <div className="md:max-w-60 max-w-50 px-3 py-2 border rounded-xl flex gap-2 items-center">
            <span className="w-full truncate">
              00020126580014br.gov.bcb.pix0136123e4567-e12b-12d1-a456-426655440000
              5204000053039865802BR5913Fulano de
              Tal6008BRASILIA62070503***63041D3D
            </span>

            <Copy className="w-5! h-5!" />
          </div>
        </div>
      </div>
    </div>
  );
}
