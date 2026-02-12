"use client";

export default function TicketBottom() {
  return (
    <div
      className="relative bg-card lg:px-12 px-6 pt-8 pb-12 shadow-2xl"
      style={{
        mask: "radial-gradient(15px at 15px top, transparent 95%, black) -15px",
      }}
    >
      <div className="absolute w-full -bottom-4 left-0 flex justify-evenly">
        {Array.from({ length: 8 }).map((_, index) => (
          <span key={index} className="block h-8 w-8 rounded-full bg-red-400" />
        ))}
      </div>

      {/* <button
        onClick={() => alert("Pedido retirado com sucesso")}
        className="w-full py-4 border-2 border-red-500 rounded-2xl text-red-500 font-semibold cursor-pointer hover:scale-105 transition-all bg-red-500/5"
      >
        Retirei meu Pedido
      </button> */}
    </div>
  );
}
