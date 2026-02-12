export default function TicketStatusReady() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-col gap-1">
        <span className="font-medium">Pedido Pronto para Retirada</span>
        <span className="font-normal text-muted-foreground max-w-[34ch]">
          Vá até o estabelecimento para retirar seu pedido
        </span>
      </div>
      <button
        onClick={() => alert("Pedido retirado com sucesso")}
        className="w-full py-4 border-2 border-red-500 rounded-2xl text-red-500 font-semibold cursor-pointer hover:scale-105 transition-all bg-red-500/5"
      >
        Retirei meu Pedido
      </button>
    </div>
  );
}
