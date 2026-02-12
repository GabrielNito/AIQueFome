"use client";

import TicketHeader from "./TicketHeader";
import TicketBottom from "./TicketBottom";
import TicketStatus from "./TicketStatus";
import TicketResumoPedido from "./TicketResumoPedido";
import { useEffect, useState } from "react";

const STATUS_CYCLE: Array<"payment" | "preparation" | "ready" | "delivered"> = [
  "payment",
  "preparation",
  "ready",
  "delivered",
];

export default function Ticket() {
  const [orderStatus, setOrderStatus] = useState<
    "payment" | "preparation" | "ready" | "delivered"
  >("payment");

  useEffect(() => {
    const getNextStatus = (currentStatus: typeof orderStatus) => {
      const currentIndex = STATUS_CYCLE.indexOf(currentStatus);
      const nextIndex = (currentIndex + 1) % STATUS_CYCLE.length;
      return STATUS_CYCLE[nextIndex];
    };

    const intervalId = setInterval(() => {
      setOrderStatus((prevStatus) => getNextStatus(prevStatus));
    }, 300000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="text-card-foreground flex flex-col rounded-xl py-6">
      <TicketHeader />

      <TicketResumoPedido />

      <TicketStatus status={orderStatus} />

      <TicketBottom />
    </div>
  );
}
