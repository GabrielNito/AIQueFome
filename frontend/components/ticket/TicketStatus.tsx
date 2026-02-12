"use client";

import { useEffect, useState } from "react";
import { Progress } from "../ui/progress";
import { CookingPot, Hamburger, ScanText, SquareCheckBig } from "lucide-react";
import TicketStatusPayment from "./TicketStatus/TicketStatusPayment";
import TicketStatusPreparation from "./TicketStatus/TicketStatusPreparation";
import TicketStatusReady from "./TicketStatus/TicketStatusReady";
import TicketStatusDelivered from "./TicketStatus/TicketStatusDelivered";

interface TicketStatusProps {
  status: "payment" | "preparation" | "ready" | "delivered";
}

export default function TicketStatus({ status }: TicketStatusProps) {
  const [progressValue, setProgressValue] = useState(0);

  const statusIndex = {
    payment: 0,
    preparation: 1,
    ready: 2,
    delivered: 3,
  }[status];

  useEffect(() => {
    if (status !== "delivered") {
      const duration = 3000;
      const stepTime = duration / 100;

      const interval = setInterval(() => {
        setProgressValue((prevProgress) => {
          let nextProgress = prevProgress + 1;

          if (nextProgress > 100) {
            nextProgress = 0;
          }

          return nextProgress;
        });
      }, stepTime);

      return () => clearInterval(interval);
    } else {
      setProgressValue(100);
    }
  }, [status]);

  const getProgress = (barIndex: 0 | 1 | 2) => {
    if (barIndex < statusIndex) {
      return 100;
    }
    if (barIndex === statusIndex) {
      return progressValue;
    }
    return 0;
  };

  const getIconColor = (iconIndex: 0 | 1 | 2 | 3) => {
    return iconIndex <= statusIndex
      ? "stroke-green-500"
      : "stroke-muted-foreground";
  };

  const StatusComponent = {
    payment: TicketStatusPayment,
    preparation: TicketStatusPreparation,
    ready: TicketStatusReady,
    delivered: TicketStatusDelivered,
  }[status];

  const progress1 = getProgress(0);
  const progress2 = getProgress(1);
  const progress3 = getProgress(2);

  return (
    <div
      className="bg-card flex flex-col gap-6 border-b-2 border-dashed lg:px-12 px-6 py-6 select-none"
      style={{
        mask: "radial-gradient(15px at 15px 15px, transparent 95%, black) -15px -15px",
      }}
    >
      <div className="flex flex-col gap-4 items-center">
        <h1 className="w-full text-xl font-semibold">Status do Pedido</h1>

        <div
          className="w-[calc(100%-1rem)] grid gap-2 items-center mt-7"
          style={{
            gridTemplateColumns: "0.5rem 1fr 0.5rem 1fr 0.5rem 1fr 0.5rem",
          }}
        >
          <div className="relative">
            <ScanText
              className={`absolute w-6! h-6! -top-8 left-1/2 transform -translate-x-1/2 ${getIconColor(
                0
              )}`}
            />
            <span className="block w-2 h-2 rounded-full bg-red-500 shadow-sm" />
          </div>

          <Progress value={progress1} className="w-full shadow-sm" />

          <div className="relative">
            <CookingPot
              className={`absolute w-6! h-6! -top-8 left-1/2 transform -translate-x-1/2 ${getIconColor(
                1
              )}`}
            />
            <span className="block w-2 h-2 rounded-full bg-red-500 shadow-sm" />
          </div>

          <Progress value={progress2} className="w-full shadow-sm" />

          <div className="relative">
            <SquareCheckBig
              className={`absolute w-6! h-6! -top-8 left-1/2 transform -translate-x-1/2 ${getIconColor(
                2
              )}`}
            />
            <span className="block w-2 h-2 rounded-full bg-red-500 shadow-sm" />
          </div>

          <Progress value={progress3} className="w-full shadow-sm" />

          <div className="relative">
            <Hamburger
              className={`absolute w-6! h-6! -top-8 left-1/2 transform -translate-x-1/2 ${getIconColor(
                3
              )}`}
            />
            <span className="block w-2 h-2 rounded-full bg-red-500 shadow-sm" />
          </div>
        </div>

        <StatusComponent />
      </div>
    </div>
  );
}
