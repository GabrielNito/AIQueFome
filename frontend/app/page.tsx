"use client";

import { Button } from "@/components/ui/button";
import { getToken } from "@/lib/api/auth";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [token, setToken] = useState<string | null>("");

  useEffect(() => {
    const userToken: string | null = getToken();
    setToken(userToken);
  }, []);

  return (
    <div className="relative container mx-auto h-screen flex justify-center items-center">
      <span className="absolute font-extralight top-4 right-4 break-all w-40">
        Token: {token}
      </span>
      <div className="flex flex-col gap-4 justify-center items-center">
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
        <Button variant="secondary" asChild>
          <Link href="/register">Register</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
