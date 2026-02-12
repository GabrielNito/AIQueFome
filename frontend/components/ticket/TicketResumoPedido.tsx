interface TicketResumoPedidoItem {
  quantidade: string;
  nome: string;
  valor: string;
}

function TicketResumoPedidoItem({
  quantidade,
  nome,
  valor,
}: TicketResumoPedidoItem) {
  return (
    <div className="flex justify-between">
      <div className="flex gap-2 items-center font-semibold">
        <span className="font-light w-5">{quantidade}</span>
        <h1 className="w-full font-normal text-md truncate">{nome}</h1>
      </div>

      <span className="text-end w-20">{valor}</span>
    </div>
  );
}

export default function TicketResumoPedido() {
  return (
    <div
      className="bg-card flex flex-col md:gap-6 gap-2 border-y-2 border-dashed lg:px-12 px-6 py-6 select-none"
      style={{
        mask: "radial-gradient(15px at 15px 15px, transparent 95%, black) -15px -15px",
      }}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <TicketResumoPedidoItem
            quantidade="1x"
            nome="Hambúrger Artesanal"
            valor="R$ 25,90"
          />
          <TicketResumoPedidoItem quantidade="2x" nome="Naná" valor="R$ 7,80" />
        </div>

        <span className="w-full h-0.5 bg-border" />

        <div className="flex flex-col gap-1">
          <div className="flex justify-between items-center">
            <span className="font-normal">Descontos</span>
            <span className="text-green-600">R$ 6,00</span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-normal">Frete</span>
            <span className="text-green-600">Grátis</span>
          </div>

          <span className="w-full h-0.5 bg-border" />

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Valor Total</span>
            <span className="text-lg font-semibold">R$ 27,70</span>
          </div>
        </div>
      </div>
    </div>
  );
}
